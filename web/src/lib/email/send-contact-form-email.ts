import { buildLeadAttribution } from "@/lib/email/contact-form-attribution";
import { resolveFormId, resolveFormLabel } from "@/lib/email/contact-form-ids";
import { buildLeadEmail } from "@/lib/email/lead-email-template";
import { resolvePopupContextLabel } from "@/lib/popups/context-labels";
import { SITE } from "@/lib/site";

const LEAD_DESTINATION = SITE.email;

const FIELD_LIMITS = {
  name: 200,
  phone: 50,
  email: 254,
  message: 5000,
} as const;

export type ContactFormPayload = {
  formId: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  popupContext?: string;
  pageTitle?: string;
  pagePath?: string;
  pageUrl?: string;
  referer?: string;
};

function clampField(value: string, max: number): string {
  return value.trim().slice(0, max);
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

  const resolvedFormId = resolveFormId(payload.formId);
  const popupContextLabel = payload.popupContext
    ? resolvePopupContextLabel(payload.popupContext)
    : null;
  const formLabel = resolveFormLabel(
    resolvedFormId === "unknown" ? payload.formId : resolvedFormId,
    popupContextLabel ?? undefined,
  );
  const attribution = buildLeadAttribution({
    pageTitle: payload.pageTitle,
    pagePath: payload.pagePath,
    pageUrl: payload.pageUrl,
    referer: payload.referer,
  });

  const { subject, text, html } = buildLeadEmail({
    formId: resolvedFormId === "unknown" ? payload.formId : resolvedFormId,
    formLabel,
    name: clampField(payload.name, FIELD_LIMITS.name),
    phone: clampField(payload.phone, FIELD_LIMITS.phone),
    email: payload.email ? clampField(payload.email, FIELD_LIMITS.email) : undefined,
    message: payload.message ? clampField(payload.message, FIELD_LIMITS.message) : undefined,
    attribution,
    submittedAt: new Date(),
  });

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
    subject,
    text,
    html,
  };

  if (payload.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    body.reply_to = clampField(payload.email, FIELD_LIMITS.email);
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
      formId: payload.formId,
      detail: errorBody.slice(0, 200),
    });
    return { ok: false, reason: "provider-error" };
  }

  return { ok: true };
}
