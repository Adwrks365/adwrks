/** Structured pricing data — English translation with /en/ paths. */

export type { PricingCard, PricingCardModel } from "./pricing-content";

export const PRICING_PATH = "/en/digital-marketing-pricing/" as const;

export const PRICING_HERO = {
  eyebrow: "Pricing • Digital Marketing Agency",
  /** Visible Hero H1 (Phase 5I.1B) — SEO title/meta unchanged in seo.json */
  h1: "Digital Marketing Pricing for Businesses",
  /** Popup / legacy page title reference — not used for document title */
  seoPageTitle: "Digital Marketing Pricing — Interactive Cost Calculator",
  lead: "Starting prices for advertising, SEO, social media, and website building — plus an interactive cost calculator for an initial estimate. Final pricing depends on scope, competition, and business needs.",
  primaryCta: "Get a tailored quote",
} as const;

export const PRICING_INTRO = {
  text: "Transparent, accurate digital marketing pricing tailored to your business budget. Select the services you need in the calculator below and get an instant price estimate.",
  disclaimer:
    "Prices shown are starting rates in ILS before VAT. Final pricing is determined according to your business's specific needs.",
} as const;

/** Monthly digital-marketing services — verified legacy price mapping */
export const PRICING_MARKETING_CARDS = [
  {
    id: "google-ads",
    icon: "🔍",
    title: "Google Ads (Paid Search)",
    description:
      "Full campaign management, keyword research, weekly optimization, and monthly performance reports. Ideal for businesses that want leads fast and maximum return on ad spend.",
    priceAmount: 850,
    pricePrefix: "From ",
    billingPeriod: "month",
    model: "monthly-management" as const,
    features: [
      "Keyword research",
      "Campaign management",
      "Weekly optimization",
      "Monthly performance reports",
    ],
    serviceHref: "/en/google-ads/",
    serviceCta: "Google Ads page",
    priceNote: "Monthly management fee — does not include Google ad spend",
  },
  {
    id: "social-media",
    icon: "📱",
    title: "Social Media Marketing",
    description:
      "Facebook and Instagram campaign management, creative production, advanced audience targeting, and remarketing. Great for visual products, fashion brands, and events.",
    priceAmount: 1050,
    pricePrefix: "From ",
    billingPeriod: "month",
    model: "monthly-management" as const,
    features: ["Campaign management", "Creative production", "Audience targeting", "Remarketing"],
    serviceHref: "/en/social-media-management/",
    serviceCta: "Social media page",
    priceNote: "Monthly management fee — does not include Meta ad spend",
  },
  {
    id: "google-maps",
    icon: "📍",
    title: "Google Maps Promotion",
    description:
      "Google Business Profile optimization, review management, photos and posts, and stronger local visibility. Critical for local businesses.",
    priceAmount: 400,
    pricePrefix: "From ",
    billingPeriod: "month",
    model: "monthly-management" as const,
    features: ["GBP optimization", "Review management", "Photos and posts", "Local visibility"],
    serviceHref: "/en/google-business-profile/",
    serviceCta: "Learn more",
  },
  {
    id: "seo",
    icon: "📈",
    title: "Organic SEO + AI",
    description:
      "Organic search ranking, AI-focused content, authority building, and link building. A long-term investment.",
    priceAmount: 2500,
    pricePrefix: "From ",
    billingPeriod: "month",
    model: "monthly-management" as const,
    features: ["Organic SEO", "AI-focused content", "Authority building", "Link building"],
    serviceHref: "/en/seo/",
    serviceCta: "SEO page",
  },
] as const;

/** One-time website projects — verified legacy price mapping */
export const PRICING_WEBSITE_CARDS = [
  {
    id: "landing-page",
    icon: "📝",
    title: "Landing Page",
    description:
      "Design and development of a high-converting landing page with full mobile optimization, form integration, and fast load times.",
    priceAmount: 1200,
    pricePrefix: "From ",
    model: "one-time-project" as const,
    features: ["Design and development", "Mobile optimization", "Form integration", "Fast load times"],
    serviceHref: "/en/website-building/",
    serviceCta: "Website building page",
  },
  {
    id: "one-page",
    icon: "🌐",
    title: "One-Page Website",
    description:
      "A professional single-page website with all essential information, custom design, SSL, and security.",
    priceAmount: 1800,
    pricePrefix: "From ",
    model: "one-time-project" as const,
    features: ["Professional single page", "Custom design", "SSL and security", "All essential information"],
    serviceHref: "/en/website-building/",
    serviceCta: "Website building page",
  },
  {
    id: "corporate",
    icon: "🏢",
    title: "Corporate Website (up to 5 pages)",
    description:
      "A professional corporate website with up to 5 pages, unique branding design, blog/news section, and easy content management.",
    priceAmount: 3000,
    pricePrefix: "From ",
    model: "one-time-project" as const,
    features: ["Up to 5 pages", "Branding design", "Blog/news", "Easy content management"],
    serviceHref: "/en/website-building/",
    serviceCta: "Website building page",
  },
] as const;

export const PRICING_PACKAGES_INTRO = {
  title: "Digital Marketing Packages — Full Breakdown",
  text: "At Adwrks 365 we offer a range of digital marketing services for businesses of all industries and sizes. Every package is tailored to your needs and includes personal support, performance reports, and ongoing optimization.",
  websiteSectionTitle: "Website Building & Landing Pages",
} as const;

export const PRICING_FACTORS = {
  title: "What Affects Digital Marketing Pricing?",
  intro:
    "Digital marketing pricing is not one-size-fits-all — it depends on several key parameters in your business. Understanding these factors helps you make an informed decision and choose the package that fits best:",
  items: [
    {
      title: "Competition level in your industry",
      text: "Competitive fields like law, real estate, insurance, finance, and healthcare require greater investment in authority building",
    },
    {
      title: "Current website condition",
      text: "A new site needs technical infrastructure, speed improvements, and authority (DR) built from the ground up",
    },
    {
      title: "Scope of work and goals",
      text: "How many keywords, how many services, and whether content, links, and technical work are also required",
    },
    {
      title: "Business objectives",
      text: "Whether this is a single campaign or a 360° strategy spanning multiple channels",
    },
  ],
} as const;

export const PRICING_TRANSPARENCY = {
  text: "At Adwrks 365 we believe in full transparency — no fine print and no inflated quotes. Every proposal is tailored to your business with a complete breakdown of work, timelines, and expected results.",
  checkFitHref: "/en/check-fit/",
  checkFitLabel: "Free fit assessment",
} as const;

export const PRICING_WHY_INVEST = {
  title: "Why Invest in Digital Marketing?",
  intro:
    "In the digital age, a strong online presence is not optional — it is essential. Businesses that invest in digital marketing enjoy significant advantages that directly impact the bottom line:",
  benefits: [
    { title: "Targeted exposure", text: "Reach the right audience when they are actively searching for your service" },
    { title: "Precise measurement", text: "Every shekel invested can be measured and optimized with real-time data" },
    { title: "Budget flexibility", text: "Start with a small budget and scale based on results" },
    { title: "Competitive advantage", text: "Build a strong brand and professional online presence that sets you apart" },
  ],
  roiNote:
    "According to Google data, businesses that invest in digital marketing see an average ROI of 200%–400% on their investment. The key to success is choosing the right strategy and working with experts who know how to maximize results.",
  roiCalculatorHref: "/en/roi-calculator-2026/",
  roiCalculatorLabel: "Calculate your expected ROI with our ROI calculator",
} as const;

export const PRICING_CHANNELS = {
  title: "How to Choose the Right Marketing Channel?",
  intro:
    "Choosing the right marketing channel depends on several factors: business type, target audience, budget, and goals. Here are general recommendations:",
  items: [
    {
      title: "Google Ads",
      text: "Suited for businesses with services people actively search for on Google — plumbers, lawyers, doctors, stores.",
      href: "/en/google-ads-cost/",
      linkLabel: "How much does Google advertising cost?",
    },
    {
      title: "Facebook and Instagram",
      text: "Excellent for visual products, fashion brands, restaurants, events, and anything you can \"show\"",
    },
    {
      title: "Organic SEO",
      text: "A long-term investment suited to any business that wants to build a stable digital asset.",
      href: "/en/paid-vs-organic-seo/",
      linkLabel: "Paid vs organic SEO",
    },
    {
      title: "Google Maps (GBP)",
      text: "Critical for local businesses with a physical location — restaurants, clinics, stores, garages, and service providers",
    },
  ],
} as const;

export const PRICING_TRUST = {
  badge: "Google Partner · Meta Business Partner",
  since: "Digital marketing agency since 2018",
  supporting:
    "Personal support, full transparency, and clear starting prices — so you know what to expect before we begin.",
} as const;

/** Matches seo.json FAQPage — visible FAQ must stay in parity */
export const PRICING_FAQ = [
  {
    q: "What is the main difference between organic and paid SEO?",
    a: "Paid search (PPC) delivers immediate results by paying for each click. Organic SEO (SEO) is a long-term investment that brings free traffic. The optimal approach is to start with PPC while building organic presence in parallel.",
  },
  {
    q: "How long does it take to see results from organic SEO?",
    a: "Initial results begin appearing within 2–4 months, but significant results come after 6–12 months of consistent work. SEO is a marathon, not a sprint.",
  },
  {
    q: "What affects website SEO pricing?",
    a: "Several factors: competition level in your industry, current website condition, scope of goals, and whether content, links, and technical work are also required.",
  },
  {
    q: "What is DR and how does it relate to pricing?",
    a: "DR (Domain Rating) is an Ahrefs metric measuring site authority on a 0–100 scale. A site with higher DR ranks better on Google.",
  },
  {
    q: "Is combining organic and paid really necessary?",
    a: "Not mandatory, but highly recommended. Businesses that combine both strategies see better results: PPC delivers immediate leads, while SEO builds a long-term digital asset.",
  },
] as const;

export const PRICING_RELATED_SERVICES = [
  {
    href: "/en/google-ads/",
    title: "Google Ads",
    text: "Campaign management, measurement, and ongoing optimization",
  },
  {
    href: "/en/seo/",
    title: "SEO",
    text: "Long-term organic asset with content and AI",
  },
  {
    href: "/en/social-media-management/",
    title: "Social Media Management",
    text: "Content, campaigns, and brand building",
  },
  {
    href: "/en/website-building/",
    title: "Website Building",
    text: "Websites and landing pages connected to marketing",
  },
  {
    href: "/en/hosting-plans/",
    title: "Hosting & Maintenance",
    text: "Stability, security, and ongoing maintenance",
  },
  {
    href: "/en/digital-marketing-services/",
    title: "Digital Marketing Services",
    text: "Full envelope under one roof",
  },
] as const;

export const PRICING_FINAL_CTA = {
  title: "Want an accurate, tailored quote?",
  text: "Leave your details and we will get back to you within hours with a detailed proposal — no obligation.",
  contactLabel: "Contact us now",
  whatsappLabel: "Chat with us on WhatsApp",
} as const;

export const PRICING_CALCULATOR = {
  sectionTitle: "Interactive Cost Calculator",
  sectionIntro:
    "A complementary tool for cost estimation — select services and get an instant price estimate. The pricing table above shows our verified starting prices.",
  openLabel: "Open cost calculator",
  iframeTitle: "Digital marketing pricing calculator",
  iframeSrc:
    "https://a2f55361-9e5b-4902-aac9-a41086cfeb54-krtyyh.sticklight.app/pricing-calculator",
  footerNote: "This calculator is powered by Adwrks 365 • Performance-based digital advertising",
} as const;
