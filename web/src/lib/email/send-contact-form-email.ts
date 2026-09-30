import { SITE } from "@/lib/site";

const LEAD_DESTINATION = SITE.email;

export type ContactFormPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  formType: "article" | "site";
  pageUrl?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailBody(payload: ContactFormPayload): { text: string; html: string } {
  const timestamp = new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
  const formLabel = payload.formType === "article" ? "טופס צד מאמר" : "טופס יצירת קשר";

  const rows: Array<[string, string]> = [
    ["מקור", formLabel],
    ["שם", payload.name],
    ["טלפון", payload.phone],
  ];

  if (payload.email) rows.push(["אימייל", payload.email]);
  if (payload.message) rows.push(["הודעה", payload.message]);
  if (payload.pageUrl) rows.push(["עמוד מקור", payload.pageUrl]);
  rows.push(["זמן שליחה", timestamp]);

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = rows
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
    )
    .join("");

  return { text, html };
}

export function isContactFormEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_FORM_FROM?.trim());
}

export async function sendContactFormEmail(
  payload: ContactFormPayload,
): Promise<{ ok: true } | { ok: false; reason: "missing-config" | "provider-error" }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FORM_FROM?.trim();

  if (!apiKey || !from) {
    return { ok: false, reason: "missing-config" };
  }

  const { text, html } = buildEmailBody(payload);

  const body: {
    from: string;
    to: string[];
    subject: string;
    text: string;
    html: string;
    reply_to?: string;
  } = {
    from,
    to: [LEAD_DESTINATION],
    subject: "ליד חדש מאתר Adwrks 365",
    text,
    html,
  };

  if (payload.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    body.reply_to = payload.email;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.error("[contact-form] email provider rejected submission", {
      status: response.status,
      detail: errorBody.slice(0, 200),
    });
    return { ok: false, reason: "provider-error" };
  }

  return { ok: true };
}
