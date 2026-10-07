import type { Locale } from "@/i18n/routing";
import { getPopupMessaging } from "@/lib/popups/messaging";
import type { PopupConfig } from "@/lib/popups/types";

export function getHomepagePopupConfig(locale: Locale = "he"): PopupConfig {
  const messaging = getPopupMessaging("digital-marketing", locale);
  return {
    ...messaging,
    popupId: "homepage-digital-marketing",
    audience: "service",
    pageTitle: locale === "en" ? "Digital marketing agency" : "סוכנות שיווק דיגיטלי",
    pagePath: locale === "en" ? "/en/" : "/",
    locale,
  };
}
