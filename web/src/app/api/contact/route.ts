import { NextResponse } from "next/server";
import {
  isContactFormEmailConfigured,
  sendContactFormEmail,
} from "@/lib/email/send-contact-form-email";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      message?: string;
      website?: string;
      formType?: string;
      privacyConsent?: boolean | string;
      pageUrl?: string;
    };

    if (body.website?.trim()) {
      return NextResponse.json({ ok: true, message: "ההודעה נשלחה בהצלחה." });
    }

    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();
    const isArticleForm = body.formType === "article";
    const consented =
      body.privacyConsent === true ||
      body.privacyConsent === "on" ||
      body.privacyConsent === "true";

    if (!consented) {
      return NextResponse.json(
        { ok: false, message: "יש לאשר את מדיניות הפרטיות לפני השליחה." },
        { status: 400 },
      );
    }

    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, message: "יש למלא את כל השדות המסומנים." },
        { status: 400 },
      );
    }

    if (!isArticleForm && !email) {
      return NextResponse.json(
        { ok: false, message: "יש למלא את כל השדות המסומנים." },
        { status: 400 },
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, message: "כתובת האימייל אינה תקינה." },
        { status: 400 },
      );
    }

    if (!isContactFormEmailConfigured()) {
      console.warn("[contact-form] email delivery not configured");
      return NextResponse.json(
        {
          ok: false,
          message: "לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר.",
        },
        { status: 503 },
      );
    }

    const referer = request.headers.get("referer")?.trim();
    const pageUrl = (body.pageUrl || referer || "").trim() || undefined;

    const delivery = await sendContactFormEmail({
      name,
      phone,
      email: email || undefined,
      message: message || undefined,
      formType: isArticleForm ? "article" : "site",
      pageUrl,
    });

    if (!delivery.ok) {
      return NextResponse.json(
        { ok: false, message: "לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "ההודעה נשלחה בהצלחה. נחזור אליכם בהקדם.",
    });
  } catch (error) {
    console.error("[contact-form] unexpected submission error", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { ok: false, message: "לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר." },
      { status: 500 },
    );
  }
}
