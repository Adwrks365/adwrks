import { NextResponse } from "next/server";

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

    const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          source: isArticleForm ? "article-sidebar" : "nextjs-migration",
        }),
      });
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, message: "לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר." },
          { status: 502 },
        );
      }
      return NextResponse.json({
        ok: true,
        message: "ההודעה נשלחה בהצלחה. נחזור אליכם בהקדם.",
      });
    }

    console.info("[contact-form] submission captured (no webhook configured)", {
      formType: isArticleForm ? "article" : "site",
      messageLength: message.length,
    });

    return NextResponse.json({
      ok: true,
      message:
        "הפרטים התקבלו (מצב פיתוח). חיבור לשירות הדיוור/CRM יוגדר לפני עלייה ל-pre-production.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר." },
      { status: 500 },
    );
  }
}
