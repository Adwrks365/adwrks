import type { PopupContextKey } from "@/lib/popups/types";

/** Server-side allowlist for popup context labels in lead emails. */
export const POPUP_CONTEXT_LABELS: Record<PopupContextKey, string> = {
  "google-ads": "Google Ads",
  seo: "קידום אורגני",
  "meta-ads": "Meta Ads",
  website: "בניית אתרים",
  hosting: "אחסון ותחזוקה",
  "google-maps": "גוגל מפות",
  "digital-marketing": "שיווק דיגיטלי",
  pricing: "מחירון שיווק",
  general: "ייעוץ שיווק",
};

export function isAllowedPopupContext(value: string): value is PopupContextKey {
  return Object.prototype.hasOwnProperty.call(POPUP_CONTEXT_LABELS, value);
}

export function resolvePopupContextLabel(value: string): string | null {
  if (!isAllowedPopupContext(value)) return null;
  return POPUP_CONTEXT_LABELS[value];
}
