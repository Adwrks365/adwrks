import { NextResponse } from "next/server";
import { resolveFormId } from "@/lib/email/contact-form-ids";
import {
  isContactFormEmailConfigured,
  sendContactFormEmail,
} from "@/lib/email/send-contact-form-email";
import { isAllowedPopupContext } from "@/lib/popups/context-labels";

const FIELD_LIMITS = {
  name: 200,
  phone: 50,
  email: 254,
  message: 5000,
  pageTitle: 300,
  pagePath: 500,
  pageUrl: 2000,
  formId: 64,
  popupContext: 32,
} as const;

function clamp(value: string | undefined, max: number): string {
  return (value || "").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      message?: string;
      website?: string;
      formId?: string;
      formType?: string;
      popupContext?: string;
      privacyConsent?: boolean | string;
      pageTitle?: string;
      pagePath?: string;
      pageUrl?: string;
    };

    if (body.website?.trim()) {
      return NextResponse.json({ ok: true, message: "ההודעה נשלחה בהצלחה." });
    }

    const formId = resolveFormId(clamp(body.formId, FIELD_LIMITS.formId), body.formType);
    const isArticleForm = formId === "article-sidebar";
    const isPopupForm = formId === "contextual-popup";
    const popupContextRaw = clamp(body.popupContext, FIELD_LIMITS.popupContext);

    if (isPopupForm && !isAllowedPopupContext(popupContextRaw)) {
      return NextResponse.json(
        { ok: false, message: "לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר." },
        { status: 400 },
      );
    }

    const name = clamp(body.name, FIELD_LIMITS.name);
    const phone = clamp(body.phone, FIELD_LIMITS.phone);
    const email = clamp(body.email, FIELD_LIMITS.email);
    const message = clamp(body.message, FIELD_LIMITS.message);
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

    if (!isArticleForm && !isPopupForm && !email) {
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

    const delivery = await sendContactFormEmail({
      formId: formId === "unknown" ? clamp(body.formId, FIELD_LIMITS.formId) || "unknown" : formId,
      name,
      phone,
      email: email || undefined,
      message: message || undefined,
      popupContext: isPopupForm ? popupContextRaw : undefined,
      pageTitle: clamp(body.pageTitle, FIELD_LIMITS.pageTitle) || undefined,
      pagePath: clamp(body.pagePath, FIELD_LIMITS.pagePath) || undefined,
      pageUrl: clamp(body.pageUrl, FIELD_LIMITS.pageUrl) || undefined,
      referer,
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
