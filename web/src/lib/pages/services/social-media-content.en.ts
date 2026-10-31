export const SOCIAL_PATH = "/en/social-media-management/" as const;

export const SOCIAL_HERO = {
  badge: "Facebook & Instagram • Meta",
  title: "Social Media Management (Facebook & Instagram)",
  lead: "Facebook and Instagram management for businesses — content, strategy, and paid campaigns when needed. Since 2018.",
};

export const SOCIAL_META_ADS_SECTION = {
  label: "Paid advertising",
  title: "Paid Meta campaigns (Facebook & Instagram)",
} as const;

export const SOCIAL_META_ADS_OFFER = {
  priceLine: "Meta paid campaign management from ₪1,050 + VAT per month",
  scopeLine: "Monthly management fee per our pricing guide — not an unlimited package.",
  notIncluded: [
    "Meta ad spend (Facebook / Instagram) is separate from the management fee",
    "No guarantee of CPL or lead volume",
  ],
  factorsLine:
    "Price depends on campaign type, number of campaigns/audiences, creative, leads/messages, catalog, remarketing, and ongoing management scope.",
  pricingHref: "/en/digital-marketing-pricing/",
  pricingLabel: "View pricing guide",
  ctaHref: "/en/contact-us/",
  ctaLabel: "Get a tailored quote",
} as const;

export const SOCIAL_ORGANIC_NOTE =
  "Organic management (content planning and posts) is available without paid ads; scope and pricing are quoted separately.";

export const SOCIAL_HERO_IMAGE = {
  src: "https://adwrks.co.il/wp-content/uploads/8e68e316-a0b5-4c8f-92ff-77950518d1c5.webp",
  alt: "Social media management for business",
} as const;

export const SOCIAL_INTRO = {
  label: "Presence that creates connection",
  title: "Social media management for business",
  paragraphs: [
    "Social media management is much more than publishing posts. It is a strategic process designed to build consistent presence, strengthen the brand, drive genuine engagement, and motivate action.",
    "At Adwrks 365 we manage business pages with a deep understanding of target audience, algorithms, and content that speaks to people — not just looks good. Management includes content planning, graphic design, marketing copy, data analysis, and integration with paid campaigns.",
  ],
};

export const SOCIAL_CHANNELS = {
  label: "Channels and content",
  title: "Facebook and Instagram page management",
  items: [
    "Monthly content planning tailored to brand and audience",
    "Graphic design and marketing copy for posts",
    "Paid campaigns on Facebook and Instagram",
    "Performance, engagement, and conversion reports",
    "Integration with website, SEO, and Google Ads",
  ],
};

export const SOCIAL_INCLUDES = {
  label: "What's included",
  title: "What does social media management include?",
  items: [
    { title: "Strategy and content", text: "Monthly planning, schedule, visual messaging, and consistent brand voice." },
    { title: "Paid advertising", text: "Conversion-focused campaigns on Facebook, Instagram, and Meta Ads." },
    { title: "Measurement and improvement", text: "Data analysis, A/B testing, and ongoing optimization." },
    { title: "360° envelope", text: "Connecting social to the rest of your business marketing channels." },
  ],
};

/** Matches seo.json FAQPage — Q3 corrected: no comment/message response claim */
export const SOCIAL_FAQ = [
  {
    q: "What is social media management for business?",
    a: "Social media management for business is an ongoing process of content creation, page management, paid campaigns, and data analysis on platforms like Facebook and Instagram — to strengthen the brand and drive action.",
  },
  {
    q: "Which social platforms do you focus on?",
    a: "At Adwrks 365 we focus primarily on professional Facebook and Instagram management, including business pages, Stories, and paid campaigns.",
  },
  {
    q: "What does social media management at Adwrks 365 include?",
    a: "Social media management at Adwrks 365 includes content strategy, marketing and brand post copy, graphic design and creative, paid campaign management, data analysis, and performance reporting.",
  },
  {
    q: "Do we have to include paid advertising, or can we manage organically only?",
    a: "You can manage social channels organically only, but in most cases combining ongoing management with paid advertising delivers faster and stronger results.",
  },
  {
    q: "How long until we see results from social media management?",
    a: "Timelines depend on current page status, industry, and budget. Typically you can expect gradual improvement in engagement and inquiries.",
  },
  {
    q: "Who is social media management for?",
    a: "Social media management suits businesses that want to grow presence on Facebook and Instagram, project professionalism, strengthen the brand, and receive more inquiries from social channels.",
  },
  {
    q: "What is the difference between organic management and paid Meta ads?",
    a: "Organic management focuses on content and posts; paid Meta ads focus on campaigns, audiences, and media budget. Paid management starts from ₪1,050 + VAT per month (management fee only, ad spend separate).",
  },
] as const;

export const SOCIAL_GUIDE_PATHS = [
  "/en/facebook-instagram-marketing/",
  "/en/facebook-ads-guide/",
  "/en/paid-vs-organic-seo/",
] as const;

export const SOCIAL_RELATED_SERVICES = [
  { href: "/en/google-ads/", title: "Google Ads", text: "Expand paid presence beyond Meta." },
  { href: "/en/website-building/", title: "Website Building", text: "A strong conversion destination for social traffic." },
] as const;

export const SOCIAL_MID_CTA = {
  eyebrow: "Before you start",
  title: "Want to strengthen your social presence?",
  body: "We'll review the current state together, propose a strategic direction, and show how professional management can bring inquiries.",
};

export const SOCIAL_FINAL_CTA = {
  eyebrow: "Social media consultation",
  title: "Ready to strengthen your social presence?",
  body: "We'd love to review the current state, propose a strategic direction, and show how professional management can bring inquiries and results.",
};
