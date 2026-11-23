import { normalizePath, slugSegmentsFromPath } from "@/lib/content/paths";
import type { Locale } from "@/i18n/routing";
import { getSiteCheckCopy, type SiteCheckCopy } from "./copy";
import { SITE_CHECK_EN_PATH, SITE_CHECK_HE_PATH } from "./paths";

export type SiteCheckView = {
  path: string;
  locale: Locale;
  copy: SiteCheckCopy;
};

export function getSiteCheckView(path: string, locale: Locale): SiteCheckView | null {
  const key = normalizePath(path);
  const expected = locale === "en" ? SITE_CHECK_EN_PATH : SITE_CHECK_HE_PATH;
  if (key !== expected) return null;
  return { path: expected, locale, copy: getSiteCheckCopy(locale) };
}

export function siteCheckStaticParams(): { locale: Locale; slug: string[] }[] {
  const enSegments = slugSegmentsFromPath(SITE_CHECK_EN_PATH);
  return [
    { locale: "he", slug: slugSegmentsFromPath(SITE_CHECK_HE_PATH) },
    { locale: "en", slug: enSegments[0] === "en" ? enSegments.slice(1) : enSegments },
  ];
}
