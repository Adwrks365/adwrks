import { normalizePath } from "@/lib/content/paths";
import type { Locale } from "./routing";

export function localePathPrefix(locale: Locale): string {
  return locale === "en" ? "/en" : "";
}

/** Build full localized path from slug segments (Next.js params). */
export function pathKeyFromLocaleSegments(
  locale: Locale,
  segments: string[] | undefined,
): string {
  const base = !segments?.length ? "/" : normalizePath(`/${segments.join("/")}`);
  if (locale === "en") {
    if (base === "/") return "/en/";
    return normalizePath(`/en${base}`);
  }
  return base;
}

export function stripEnPrefix(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === "/en/" || normalized === "/en") return "/";
  if (normalized.startsWith("/en/")) {
    return normalizePath(normalized.slice(3));
  }
  return normalized;
}

export function localeFromPath(path: string): Locale {
  const normalized = normalizePath(path);
  return normalized === "/en/" || normalized.startsWith("/en/") ? "en" : "he";
}

export function inLanguageTag(locale: Locale): string {
  return locale === "he" ? "he-IL" : "en-US";
}

export function ogLocaleTag(locale: Locale): string {
  return locale === "he" ? "he_IL" : "en_US";
}

export function numberFormatLocale(locale: Locale): string {
  return locale === "he" ? "he-IL" : "en-US";
}

export function siteDir(locale: Locale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr";
}
