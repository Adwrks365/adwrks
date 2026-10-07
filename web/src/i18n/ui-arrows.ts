import type { Locale } from "./routing";

/** Trailing arrow on text links (Details → / לפרטים ←). */
export function linkWithArrow(locale: Locale, label: string): string {
  return locale === "en" ? `${label} →` : `${label} ←`;
}

/** Standalone forward / back arrow glyph. */
export function forwardArrow(locale: Locale): string {
  return locale === "en" ? "→" : "←";
}

export function backArrow(locale: Locale): string {
  return locale === "en" ? "←" : "→";
}
