import { getPopupMessaging } from "@/lib/popups/messaging";
import type { PopupConfig } from "@/lib/popups/types";

export function getHomepagePopupConfig(): PopupConfig {
  const messaging = getPopupMessaging("digital-marketing");
  return {
    ...messaging,
    popupId: "homepage-digital-marketing",
    audience: "service",
    pageTitle: "סוכנות שיווק דיגיטלי",
    pagePath: "/",
  };
}
