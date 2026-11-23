import { normalizePath } from "@/lib/content/paths";

export const SITE_CHECK_HE_PATH = "/בדיקת-אתר/" as const;
export const SITE_CHECK_EN_PATH = "/en/website-check/" as const;

const PATHS = new Set<string>([SITE_CHECK_HE_PATH, SITE_CHECK_EN_PATH]);

export function isSiteCheckRoutablePath(path: string): boolean {
  return PATHS.has(normalizePath(path));
}

export function siteCheckAlternatePaths(path: string): { he: string; en: string } | null {
  if (!isSiteCheckRoutablePath(path)) return null;
  return { he: SITE_CHECK_HE_PATH, en: SITE_CHECK_EN_PATH };
}

export function siteCheckSitemapPaths(locale: "he" | "en"): string[] {
  return [locale === "en" ? SITE_CHECK_EN_PATH : SITE_CHECK_HE_PATH];
}
