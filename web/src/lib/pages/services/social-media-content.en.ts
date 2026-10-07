export * from "./social-media-content";

export const SOCIAL_PATH = "/en/social-media-management/" as const;

export const SOCIAL_HERO = {
  badge: "Meta Business Partner",
  title: "Social Media Management",
  lead: "Paid and organic social campaigns on Facebook, Instagram, and Meta — strategy, creative, and performance optimization for business growth.",
};

export const SOCIAL_GUIDE_PATHS = [
  "/en/facebook-instagram-marketing/",
  "/en/facebook-ads-guide/",
] as const;

export const SOCIAL_RELATED_SERVICES = [
  { href: "/en/google-ads/", title: "Google Ads", text: "Full-funnel paid acquisition." },
  { href: "/en/seo/", title: "SEO", text: "Organic discovery to complement social." },
] as const;
