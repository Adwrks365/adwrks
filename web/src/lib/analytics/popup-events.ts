import { GA4_MEASUREMENT_ID } from "@/lib/analytics";

export type PopupAnalyticsEvent = "popup_view" | "popup_close" | "popup_submit";

export type PopupEventParams = {
  popup_id: string;
  popup_context: string;
  page_path: string;
};

export function trackPopupEvent(event: PopupAnalyticsEvent, params: PopupEventParams): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, {
    send_to: GA4_MEASUREMENT_ID,
    popup_id: params.popup_id,
    popup_context: params.popup_context,
    page_path: params.page_path,
  });
}
