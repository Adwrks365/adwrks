import type { LeadAttribution } from "@/lib/email/contact-form-attribution";
import { sanitizeSubjectPart } from "@/lib/email/contact-form-attribution";
import { resolveFormLabel } from "@/lib/email/contact-form-ids";

export type LeadEmailInput = {
  formId: string;
  formLabel: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  attribution: LeadAttribution;
  submittedAt: Date;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function formatIsraelDateTime(value: Date): { date: string; time: string; combined: string } {
  const dateFmt = new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = dateFmt.format(value);
  const time = timeFmt.format(value);
  return { date, time, combined: `${date} ${time}` };
}

function fieldRow(label: string, value: string, linkPrefix?: "tel" | "mailto"): string {
  const safe = escapeHtml(value);
  const content =
    linkPrefix === "tel"
      ? `<a href="tel:${escapeAttr(value.replace(/[^\d+]/g, ""))}" style="color:#0369a1;text-decoration:none;font-weight:600;">${safe}</a>`
      : linkPrefix === "mailto"
        ? `<a href="mailto:${escapeAttr(value)}" style="color:#0369a1;text-decoration:none;font-weight:600;">${safe}</a>`
        : `<span style="color:#0f172a;font-weight:600;">${safe}</span>`;

  return `
    <tr>
      <td style="padding:10px 0 10px 16px;width:120px;vertical-align:top;color:#64748b;font-size:14px;font-weight:600;white-space:nowrap;">${escapeHtml(label)}</td>
      <td style="padding:10px 16px 10px 0;vertical-align:top;font-size:15px;line-height:1.5;">${content}</td>
    </tr>`;
}

function metaRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0 8px 16px;width:120px;vertical-align:top;color:#64748b;font-size:13px;font-weight:600;">${escapeHtml(label)}</td>
      <td style="padding:8px 16px 8px 0;vertical-align:top;color:#334155;font-size:14px;line-height:1.5;">${escapeHtml(value)}</td>
    </tr>`;
}

export function buildLeadEmail(input: LeadEmailInput): { subject: string; text: string; html: string } {
  const { date, time, combined } = formatIsraelDateTime(input.submittedAt);
  const formLabel = input.formLabel || resolveFormLabel(input.formId);
  const pageName = sanitizeSubjectPart(input.attribution.pageTitle, 40);

  const subject = `ליד חדש | Adwrks 365 | ${sanitizeSubjectPart(formLabel, 36)} | ${pageName}`;

  const clientRows: Array<[string, string, "tel" | "mailto" | undefined]> = [
    ["שם", input.name, undefined],
    ["טלפון", input.phone, "tel"],
  ];
  if (input.email) clientRows.push(["אימייל", input.email, "mailto"]);
  if (input.message) clientRows.push(["הודעה", input.message, undefined]);

  const textLines = [
    "Adwrks 365 — ליד חדש מהאתר",
    formLabel,
    "",
    "פרטי הלקוח",
    ...clientRows.map(([label, value]) => `${label}: ${value}`),
    "",
    "מקור הליד",
    `טופס: ${formLabel}`,
    `עמוד: ${input.attribution.pageTitle}`,
    `נתיב: ${input.attribution.pagePath}`,
    `כתובת העמוד: ${input.attribution.canonicalUrl}`,
  ];
  if (input.attribution.submittedUrl && input.attribution.submittedUrl !== input.attribution.canonicalUrl) {
    textLines.push(`כתובת שליחה: ${input.attribution.submittedUrl}`);
  }
  textLines.push(
    "",
    "פרטי שליחה",
    `תאריך: ${date}`,
    `שעה: ${time}`,
    `סביבה: ${input.attribution.environmentLabel}`,
  );

  const clientTableRows = clientRows.map(([label, value, link]) => fieldRow(label, value, link)).join("");

  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Arial,'Helvetica Neue',Helvetica,sans-serif;direction:rtl;text-align:right;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 16px;border-bottom:1px solid #e2e8f0;background:linear-gradient(180deg,#f8fafc 0%,#ffffff 100%);">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:0.04em;color:#0284c7;text-transform:uppercase;">Adwrks 365</p>
              <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f172a;font-weight:700;">ליד חדש מהאתר</h1>
              <span style="display:inline-block;padding:8px 14px;background-color:#e0f2fe;color:#0369a1;border-radius:999px;font-size:14px;font-weight:700;line-height:1.2;">${escapeHtml(formLabel)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 8px 4px;">
              <p style="margin:16px 16px 8px;font-size:15px;font-weight:700;color:#0f172a;">פרטי הלקוח</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e2e8f0;border-radius:10px;background-color:#fafafa;">
                ${clientTableRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 8px 4px;">
              <p style="margin:16px 16px 8px;font-size:15px;font-weight:700;color:#0f172a;">מקור הליד</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #bae6fd;border-radius:10px;background-color:#f0f9ff;">
                ${metaRow("טופס", formLabel)}
                ${metaRow("עמוד", input.attribution.pageTitle)}
                ${metaRow("נתיב", input.attribution.pagePath)}
                ${metaRow("כתובת העמוד", input.attribution.canonicalUrl)}
                ${
                  input.attribution.submittedUrl &&
                  input.attribution.submittedUrl !== input.attribution.canonicalUrl
                    ? metaRow("כתובת שליחה", input.attribution.submittedUrl)
                    : ""
                }
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#64748b;">פרטי שליחה</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
                ${escapeHtml(combined)} · ${escapeHtml(input.attribution.environmentLabel)}
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">הודעה אוטומטית מאתר Adwrks 365</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text: textLines.join("\n"), html };
}
