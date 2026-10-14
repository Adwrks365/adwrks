import type { Locale } from "@/i18n/routing";
import { getPopupMessaging } from "@/lib/popups/messaging";
import type { PopupConfig } from "@/lib/popups/types";
import type { HubView, LocationView } from "./registry";

export function locationPopupConfig(view: LocationView, locale: Locale): PopupConfig {
  const base = getPopupMessaging("digital-marketing", locale);
  return {
    ...base,
    headline: view.copy.popupHeadline,
    description: view.copy.popupDescription,
    ctaLabel: view.copy.popupCta,
    popupId: `location-${view.id}`,
    audience: "service",
    pageTitle: view.copy.h1,
    pagePath: view.path,
    locale,
  };
}

export function hubPopupConfig(view: HubView, locale: Locale): PopupConfig {
  const base = getPopupMessaging("digital-marketing", locale);
  return {
    ...base,
    headline: view.copy.popupHeadline,
    description: view.copy.popupDescription,
    ctaLabel: view.copy.popupCta,
    popupId: "location-hub",
    audience: "service",
    pageTitle: view.copy.h1,
    pagePath: view.path,
    locale,
  };
}
