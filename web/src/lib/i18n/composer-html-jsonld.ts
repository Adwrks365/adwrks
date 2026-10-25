import { heComposerPath } from "@/lib/i18n/composer-path";
import type { Locale } from "@/i18n/routing";

/** Routes rendered by React composers — WP HTML may contain stale Hebrew JSON-LD. */
const COMPOSER_HE_PATHS = new Set([
  "/website-building/",
  "/שירותי-שיווק-דיגיטלי/",
  "/seo/",
  "/google-ads/",
  "/social-media-management/",
  "/hosting-plans/",
  "/מחירון-שיווק-דיגיטלי/",
  "/check-fit/",
  "/about-us/",
  "/contact-us/",
]);

export function skipHtmlJsonLdExtraction(pathKey: string, locale: Locale): boolean {
  return COMPOSER_HE_PATHS.has(heComposerPath(pathKey, locale));
}
