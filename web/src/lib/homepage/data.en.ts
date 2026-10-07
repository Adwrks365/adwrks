/** English homepage content — digital marketing agency positioning */

import { toLocalMediaUrl } from "@/lib/media/urls";

function u(filename: string): string {
  return toLocalMediaUrl(`https://adwrks.co.il/wp-content/uploads/${filename}`);
}

export const HOMEPAGE_IMAGES = {
  heroBg: u("digital-marketing-2-e1769683414846.webp"),
  heroBgAlt: "Digital marketing specialist working on a laptop — Adwrks 365 agency",
  heroPhoto: u("adwrks-marketing-solutions.webp"),
  heroPhotoAlt: "Smartphone showing satisfied clients — Adwrks 365 digital marketing",
  authorityPhoto: u("5-3.png"),
  envelopePhoto: u("7-1.png"),
  partnersOverlay: u("partners-e1769685310241.webp"),
  googlePartnerBadge:
    "https://www.gstatic.com/partners/badge/images/2025/PartnerBadgeClickable.svg",
} as const;

export type HomepageCounter = {
  target: number;
  suffix: string;
  label: string;
  ariaValue: string;
};

export const HOMEPAGE_COUNTERS: readonly HomepageCounter[] = [
  { target: 8, suffix: "+", label: "Years of experience", ariaValue: "8+" },
  { target: 500, suffix: "K+", label: "Budget managed", ariaValue: "500K+" },
  { target: 185, suffix: "+", label: "Happy clients", ariaValue: "185+" },
  { target: 6, suffix: "+", label: "Expert disciplines", ariaValue: "6+" },
] as const;

export const HOMEPAGE_SERVICE_LIST = [
  { text: "Website building & high-converting landing pages", href: "/en/website-building/" },
  { text: "Conversion-focused PPC campaigns", href: "/en/google-ads/" },
  { text: "Organic SEO & AI optimization", href: "/en/seo/" },
  { text: "Search engine marketing (SEM/SEA)" },
  { text: "Social media strategy & content", href: "/en/social-media-management/" },
  { text: "Google Maps & Business Profile promotion", href: "/en/google-maps-advertising/" },
  { text: "Marketing in Hebrew, Russian, and English" },
  { text: "Custom creative and content design" },
] as const;

export const HOMEPAGE_CAPABILITY_CHIPS = [
  { label: "SEO", href: "/en/seo/" },
  { label: "Google Ads", href: "/en/google-ads/" },
  { label: "Meta", href: "/en/social-media-management/" },
  { label: "Websites", href: "/en/website-building/" },
] as const;

export const HOMEPAGE_CURATED_GUIDE_PATHS = [
  "/en/wordpress-website-cost/",
  "/en/website-platform-guide/",
  "/en/seo-2026-ai-answers/",
] as const;

export const HOMEPAGE_HOW_WE_WORK = [
  {
    title: "Personal strategic guidance",
    description: "Strategy tailored to your business structure, competitors, and revenue goals.",
  },
  {
    title: "Authority & brand building",
    description: "Digital assets that establish you as an authority and drive stable growth.",
  },
  {
    title: "Results-driven marketing",
    description: "Continuous optimization for better leads at lower cost using AI and AIO.",
  },
  {
    title: "360° digital marketing",
    description: "Full-funnel management of SEO, PPC, and web in sync for maximum results.",
  },
] as const;

export const HOMEPAGE_PRIMARY_SERVICES = [
  {
    title: "Website Building",
    description: "Effective websites and landing pages — the foundation for all marketing.",
    href: "/en/website-building/",
    featured: true,
  },
  {
    title: "Organic SEO",
    description: "Long-term visibility in Google with AI-ready optimization.",
    href: "/en/seo/",
    featured: false,
  },
  {
    title: "Google Ads",
    description: "Conversion-focused campaigns with measurable ROI.",
    href: "/en/google-ads/",
    featured: false,
  },
  {
    title: "Social Media",
    description: "Paid and organic management on Facebook, Instagram, and Meta.",
    href: "/en/social-media-management/",
    featured: false,
  },
] as const;

export const HOMEPAGE_SECONDARY_SERVICES = [
  { label: "Google Maps ads", href: "/en/google-maps-advertising/" },
  { label: "Hosting & maintenance", href: "/en/hosting-plans/" },
  { label: "Digital marketing for business", href: "/en/digital-marketing-for-business/" },
  { label: "Pricing", href: "/en/digital-marketing-pricing/" },
] as const;

export const HOMEPAGE_VALUE_CARDS = HOMEPAGE_HOW_WE_WORK;

export const HOMEPAGE_TESTIMONIALS = [
  {
    name: "Itzik Abramov Car Detailing",
    title: "Car detailing services",
    content: "Highly recommended. Professional service and great ROI.",
    image: u("62523404_10219424136777844_3135336502720987136_n-150x150.webp"),
  },
  {
    name: "Danny Ben Atar",
    title: "Danny Computers",
    content: "The only promotion that actually works! Great team led by Sergey.",
    image: u("204687284_4055670721208389_2009856386006580434_n-150x150.webp"),
  },
] as const;

export const HOMEPAGE_RESULT_QUOTES = [
  {
    name: "Shahar Tyri",
    content:
      "Excellent professional service! Adwrks 365 does great work managing and promoting my site and social ads. Exposure grew significantly and new clients keep coming.",
  },
  {
    name: "Tal Shina",
    highlight: "Standout result",
    content: "Since advertising with them my workload increased by 350%, with fair pricing and personal support.",
  },
] as const;

export { LEGACY_HOMEPAGE_PORTFOLIO_URLS as HOMEPAGE_PORTFOLIO } from "@/lib/portfolio/projects";

export const HOMEPAGE_PLATFORM_LOGOS = [
  { src: u("googlelogo.png"), alt: "Google", group: "channel" },
  { src: u("facebook-logo.png"), alt: "Facebook", group: "channel" },
  { src: u("instagram.png"), alt: "Instagram", group: "channel" },
  { src: u("youtube-logo.png"), alt: "YouTube", group: "channel" },
  { src: u("WordPress_logo_removebg.png"), alt: "WordPress", group: "tool" },
  { src: u("canva-removebg.png"), alt: "Canva", group: "tool" },
  { src: u("chat-gpt-removebg.png"), alt: "ChatGPT", group: "tool" },
  { src: u("gemini-removebg.png"), alt: "Gemini", group: "tool" },
] as const;

export const HOMEPAGE_FAQ = [
  {
    question: "What digital marketing services do you offer?",
    answer:
      "Adwrks 365 is a full-service digital marketing agency: website building, organic SEO, AI optimization, Google Ads, social media, and integrated strategy.",
  },
  {
    question: "How can digital marketing help my business grow?",
    answer:
      "Digital marketing reaches customers when they are searching for solutions. The right mix of SEO, paid ads, and content increases exposure, leads, and sales measurably.",
  },
  {
    question: "What is the difference between SEO, PPC, and AI optimization?",
    answer:
      "SEO builds long-term visibility, PPC delivers immediate results, and AI optimization prepares your site for AI Overviews and semantic search. Together they form a resilient strategy.",
  },
  {
    question: "Who are your services for?",
    answer:
      "Businesses of all sizes — brochure sites, e-commerce, service providers, and organizations — with plans tailored to goals and budget.",
  },
  {
    question: "How long until we see results?",
    answer:
      "Paid ads can produce results within days; SEO and AI optimization typically need several months. We measure, optimize, and report transparently throughout.",
  },
  {
    question: "Do you build websites as part of the service?",
    answer:
      "Yes. We build fast, UX-focused, SEO- and AI-ready websites that support every marketing channel.",
  },
] as const;

export const HOMEPAGE_FAQ_AUTHORITY =
  "Answers based on hands-on experience in digital marketing, SEO, paid campaigns, and business growth in Israel.";

export const HOMEPAGE_AI_SEARCH = {
  title: "We prepare your business for the AI Search era",
  body: "Will your site appear in Google's answers in 2026? Join the AIO revolution with Adwrks 365.",
  ctaLabel: "Organic SEO & AIO",
  ctaHref: "/en/seo/",
} as const;

export const HOMEPAGE_VISION = {
  kicker: "AIO · SEO · PPC",
  title: "Our technology vision for 2026",
  body: "As a boutique digital strategy agency, Adwrks 365 leads in AI Optimization (AIO). We combine advanced AI tools with SEO and PPC to give clients a real competitive edge — semantic search readiness and E-E-A-T authority for 2026 search and AI engines.",
  envelope:
    "Real growth requires more than generic promotion — it requires understanding your market. We combine advanced ad tech with expertise reaching diverse audiences, including Russian- and English-speaking markets in Israel. Personal guidance plus results-driven optimization helps your brand stand out and grow profitably.",
} as const;

export const HOMEPAGE_PARTNERS = {
  body: "We are strategic growth partners — not just another agency. Since 2018 we've combined proven experience with cutting-edge AI to build dominant digital presence that converts visitors into customers.",
} as const;

export const HOMEPAGE_ABOUT = {
  label: "Certified Facebook & Google partners",
  title: "Boutique agency for digital strategy & growth",
  subtitle: "Building your digital authority in the AI era",
  lead: "Building your digital authority in the AI era",
  body: "Since 2018, Adwrks 365 has helped businesses achieve measurable digital success through smart strategy, advanced technology, and creative that converts. We focus on ROI, personal service, and long-term growth.",
} as const;

export const HOMEPAGE_MID_CTA = {
  title: "Ready to talk about your digital marketing?",
  lead: "Initial consultation with no commitment — we'll understand your goals and suggest a tailored direction.",
  primaryLabel: "Free consultation",
} as const;

export const HOMEPAGE_KNOWLEDGE_HUB = {
  label: "Knowledge hub",
  title: "Practical guides",
  allArticlesLabel: "All articles ←",
  blogHref: "/en/blog/",
} as const;

export const RECENT_POST_IMAGES: Record<string, string> = {
  "/en/website-speed-optimization-2026-pagespeed/": u("website-pagespeed-300x200.webp"),
  "/en/roi-calculator-2026/": u("Image-Jun-12-2026-10_50_18-AM-300x169.webp"),
  "/en/seo-2026-ai-answers/": u("seo-future-1-300x158.webp"),
};
