export const HUB_PATH = "/en/digital-marketing-services/" as const;

export const HUB_HERO = {
  badge: "Digital Marketing Agency • Since 2018",
  title: "Adwrks 365 Digital Marketing Services",
  lead: "Since 2018, Adwrks 365 has helped businesses across industries build a digital presence that delivers results. We provide a full service envelope — from strategy through execution, measurement, and optimization — with a focus on quality leads, transparency, and business thinking.",
};

export const HUB_SERVICES = [
  {
    href: "/en/google-ads/",
    intent: "Need traffic now",
    title: "Google Ads",
    text: "Managed paid search campaigns that bring inquiries and sales — not clicks alone. Includes keyword research, ad copy, conversion tracking, and ongoing optimization.",
    cta: "Google Ads page",
    accent: "gads" as const,
  },
  {
    href: "/en/seo/",
    intent: "Want organic visibility",
    title: "Organic SEO",
    text: "Building a stable long-term digital asset through organic search. Work on content, site structure, user experience, and readiness for AI and semantic search.",
    cta: "SEO page",
    accent: "seo" as const,
  },
  {
    href: "/en/social-media-management/",
    intent: "Need social presence",
    title: "Social Media Management",
    text: "Strategic management of your business presence on social platforms — content, paid campaigns, brand building, and engagement that leads to inquiries.",
    cta: "Social media page",
    accent: "social" as const,
  },
  {
    href: "/en/website-building/",
    intent: "Need a business website",
    title: "Website Building",
    text: "Custom websites with a focus on user experience, speed, SEO, and connection to every marketing channel — so your site becomes a genuine lead engine.",
    cta: "Website building page",
    accent: "web" as const,
  },
  {
    href: "/en/hosting-plans/",
    intent: "Need hosting and maintenance",
    title: "Website Hosting & Maintenance",
    text: "WordPress plans, maintenance, backups, and SSL — plus modern infrastructure for non-WordPress projects when needed.",
    cta: "Hosting page",
    accent: "hosting" as const,
  },
] as const;

export const HUB_INTEGRATION = {
  label: "How the services work together",
  title: "360° digital marketing envelope",
  body: "Strong digital businesses do not rely on a single channel. Google Ads delivers fast results, SEO builds long-term presence, social strengthens the brand, a website converts traffic — and hosting keeps everything stable. We build the right combination for your goals.",
  points: [
    "Shared strategy and measurement across channels",
    "Content, website, and campaigns that work together",
    "Personal support and transparency since 2018",
  ],
};

export const HUB_PRICING = {
  label: "Pricing context",
  title: "Want to understand costs?",
  body: "Our digital marketing pricing guide helps estimate costs by service type — without commitment.",
  href: "/en/digital-marketing-pricing/",
  cta: "Digital marketing pricing",
};

export const HUB_GUIDE_PATHS = [
  "/en/paid-vs-organic-seo/",
  "/en/seo-2026-ai-answers/",
  "/en/google-ads-cost/",
  "/en/facebook-instagram-marketing/",
] as const;

export const HUB_FINAL_CTA = {
  eyebrow: "Let's talk",
  title: "360° digital marketing for your business",
  body: "We'd love to learn about your business, understand your goals, and propose the right mix of services — SEO, Google Ads, social, websites, and more.",
};
