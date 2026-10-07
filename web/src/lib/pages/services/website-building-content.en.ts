export * from "./website-building-content";

export const WEBSITE_BUILDING_PATH = "/en/website-building/" as const;

export const WEBSITE_BUILDING_HERO = {
  badge: "Websites & landing pages",
  title: "Website Building for Business",
  lead: "Conversion-focused websites and landing pages — the technical and creative foundation for SEO, ads, and growth. One service within our full digital marketing agency.",
  ctas: [
    { text: "Get a consultation", href: "/en/contact-us/", variant: "primary" as const },
    { text: "View portfolio", href: "/en/#portfolio", variant: "outline" as const },
  ],
};

export const WEBSITE_BUILDING_GUIDE_PATHS = [
  "/en/website-building-pricing/",
  "/en/website-platform-guide/",
] as const;

export const WEBSITE_BUILDING_RELATED_SERVICES = [
  { href: "/en/seo/", title: "SEO", text: "Launch with organic readiness built in." },
  { href: "/en/google-ads/", title: "Google Ads", text: "Drive traffic to new landing pages." },
  { href: "/en/hosting-plans/", title: "Hosting", text: "Managed hosting after launch." },
] as const;
