import { alternatePaths } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";

/** Map localized URL to Hebrew composer path key for shared page components. */
export function heComposerPath(pathKey: string, locale: Locale): string {
  const normalized = normalizePath(pathKey);
  if (locale === "he") return normalized;
  const pair = alternatePaths(normalized);
  return pair?.he ?? normalized;
}

export function isHomePath(pathKey: string): boolean {
  const normalized = normalizePath(pathKey);
  return normalized === "/" || normalized === "/en/";
}
