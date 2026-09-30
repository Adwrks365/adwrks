export const CONTACT_FORM_IDS = [
  "homepage-contact",
  "contact-page",
  "article-sidebar",
] as const;

export type ContactFormId = (typeof CONTACT_FORM_IDS)[number];

const FORM_LABELS: Record<ContactFormId, string> = {
  "homepage-contact": "טופס יצירת קשר – דף הבית",
  "contact-page": "טופס צור קשר",
  "article-sidebar": "טופס צדדי – מאמר",
};

const DEFAULT_FORM_LABEL = "טופס יצירת קשר";

export function isContactFormId(value: string): value is ContactFormId {
  return (CONTACT_FORM_IDS as readonly string[]).includes(value);
}

export function resolveFormLabel(formId: string): string {
  if (isContactFormId(formId)) return FORM_LABELS[formId];
  return DEFAULT_FORM_LABEL;
}

/** Article sidebar accepts legacy `formType: article` until all clients send formId. */
export function resolveFormId(raw?: string, legacyFormType?: string): ContactFormId | "unknown" {
  if (raw && isContactFormId(raw)) return raw;
  if (legacyFormType === "article") return "article-sidebar";
  return "unknown";
}
