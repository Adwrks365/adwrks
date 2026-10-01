import { GA4_MEASUREMENT_ID } from "@/lib/analytics";

export type PopupAnalyticsEvent =
  | "popup_view"
  | "popup_close"
  | "popup_submit"
  | "popup_minimized_cta_view"
  | "popup_minimized_cta_click";

export type PopupOpenMethod = "automatic" | "minimized_cta";

export type PopupEventParams = {
  popup_id: string;
  popup_context: string;
  page_path: string;
  open_method?: PopupOpenMethod;
};

export function trackPopupEvent(event: PopupAnalyticsEvent, params: PopupEventParams): void {
  if (typeof window === "undefined" || !window.gtag) return;

  const payload: Record<string, string> = {
    send_to: GA4_MEASUREMENT_ID,
    popup_id: params.popup_id,
    popup_context: params.popup_context,
    page_path: params.page_path,
  };

  if (params.open_method) {
    payload.open_method = params.open_method;
  }

  window.gtag("event", event, payload);
}
