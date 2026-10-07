import type { Locale } from "@/i18n/routing";
import { heComposerPath } from "@/lib/i18n/composer-path";
import { decodeHtmlEntities } from "@/lib/content/paths";
import { getPopupMessaging } from "@/lib/popups/messaging";
import type { PopupConfig, PopupContextKey } from "@/lib/popups/types";

/** Service pages in the production sitemap — do not add paths that are not in urls.json. */
const SERVICE_PAGE_CONTEXT: Record<string, PopupContextKey> = {
  "/google-ads/": "google-ads",
  "/seo/": "seo",
  "/website-building/": "website",
  "/social-media-management/": "meta-ads",
  "/hosting-plans/": "hosting",
  "/שירותי-שיווק-דיגיטלי/": "digital-marketing",
  "/digital-marketing/": "digital-marketing",
  "/digital-marketing/websites/": "website",
  "/digital-marketing/google/": "google-ads",
  "/digital-marketing/facebook/": "meta-ads",
  "/digital-marketing/ads/": "google-ads",
  "/digital-marketing/internet-advertisement/": "digital-marketing",
  "/digital-marketing/online-marketing/": "digital-marketing",
  "/digital-agency/": "digital-marketing",
  "/digital-marketing/seo/": "seo",
  "/מחירון-שיווק-דיגיטלי/": "pricing",
};

export const SERVICE_POPUP_PATHS = Object.keys(SERVICE_PAGE_CONTEXT);

export function isServicePopupPath(path: string): boolean {
  return path in SERVICE_PAGE_CONTEXT;
}

export function getServicePopupConfig(
  path: string,
  pageTitle: string,
  locale: Locale = "he",
): PopupConfig | null {
  const composerPath = heComposerPath(path, locale);
  const context = SERVICE_PAGE_CONTEXT[composerPath];
  if (!context) return null;

  const messaging = getPopupMessaging(context, locale);
  return {
    ...messaging,
    popupId: `service-${context}-${path.replace(/\//g, "-").replace(/^-|-$/g, "") || "home"}`,
    audience: "service",
    pageTitle: decodeHtmlEntities(pageTitle),
    pagePath: path,
    locale,
  };
}

/** Audit mapping for Phase 5D documentation. */
export function listServicePopupMappings(): Array<{
  path: string;
  context: PopupContextKey;
  headline: string;
  description: string;
  ctaLabel: string;
}> {
  return SERVICE_POPUP_PATHS.map((path) => {
    const context = SERVICE_PAGE_CONTEXT[path]!;
    const messaging = getPopupMessaging(context);
    return {
      path,
      context,
      headline: messaging.headline,
      description: messaging.description,
      ctaLabel: messaging.ctaLabel,
    };
  });
}
