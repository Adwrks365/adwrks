export * from "./google-ads-content";

export const GOOGLE_ADS_PATH = "/en/google-ads/" as const;

export const GOOGLE_ADS_HERO = {
  badge: "Google Partner • Since 2018",
  title: "Google Ads for Business",
  lead: "Google Ads is the fastest way to reach customers when they search for your offer. Adwrks 365 manages paid search campaigns in Israel with a focus on ROI, lead quality, and smart budget control.",
};

export const GOOGLE_ADS_GUIDE_PATHS = [
  "/en/google-ads-10-steps/",
  "/en/google-ads-7-strategies/",
  "/en/google-ads-cost/",
  "/en/roi-calculator-2026/",
] as const;

export const GOOGLE_ADS_RELATED_SERVICES = [
  { href: "/en/seo/", title: "Organic SEO", text: "Long-term visibility alongside paid campaigns." },
  { href: "/en/website-building/", title: "Website Building", text: "Landing pages built for conversion." },
] as const;
