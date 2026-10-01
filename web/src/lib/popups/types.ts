export type PopupAudience = "service" | "article";

export type PopupContextKey =
  | "google-ads"
  | "seo"
  | "meta-ads"
  | "website"
  | "hosting"
  | "google-maps"
  | "digital-marketing"
  | "pricing"
  | "general";

export type PopupMessaging = {
  popupContext: PopupContextKey;
  contextLabel: string;
  headline: string;
  description: string;
  ctaLabel: string;
};

export type PopupConfig = PopupMessaging & {
  popupId: string;
  audience: PopupAudience;
  pageTitle: string;
  pagePath: string;
};
