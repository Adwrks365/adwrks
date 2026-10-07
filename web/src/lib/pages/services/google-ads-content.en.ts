export const GOOGLE_ADS_PATH = "/en/google-ads/" as const;

export const GOOGLE_ADS_HERO = {
  badge: "Google Partner • Since 2018",
  title: "Google Ads for Business",
  lead: "Google Ads is the fastest way to reach customers the moment they search for your service or product. Adwrks 365 manages paid search campaigns for businesses in Israel with a focus on ROI, lead quality, and smart budget control — not clicks alone.",
};

export const GOOGLE_ADS_INTRO = {
  label: "Certified Google Partners",
  title: "What is Google Ads?",
  intro:
    "Google Ads lets businesses appear at the top of search results through paid ads. You pay per click, and campaigns are managed by keywords, audiences, locations, and data.",
  highlight: "The core advantage is full control over budget, messaging, and the pace of results.",
};

export const GOOGLE_ADS_CAMPAIGNS = {
  label: "Campaign types",
  title: "Google Ads services we manage",
  items: [
    { title: "Search", text: "Search campaigns — high-intent keywords that drive action.", icon: "search" as const },
    { title: "Display", text: "Display network campaigns — reach and remarketing.", icon: "display" as const },
    { title: "YouTube", text: "Video and targeted ads on YouTube.", icon: "youtube" as const },
    { title: "Shopping", text: "Google Shopping — for products and online stores.", icon: "shopping" as const },
    { title: "Local", text: "Local campaigns — Google Maps and Local Services.", icon: "local" as const },
    { title: "Optimization", text: "A/B testing, ROI reporting, and continuous improvement.", icon: "optimize" as const },
  ],
};

export const GOOGLE_ADS_AUDIENCE = {
  label: "Experience and strategy",
  title: "Who is Google Ads for?",
  intro:
    "Google Ads suits businesses that want fast results, budget control, and reach to audiences with high purchase intent.",
  detail:
    "It is especially relevant for local businesses, service providers, online stores, and companies looking to grow leads and sales in the short and medium term.",
};

export const GOOGLE_ADS_LIFECYCLE = {
  label: "Campaign management",
  title: "The Google Ads campaign lifecycle",
  steps: [
    { title: "Discovery & research", text: "Understanding goals, target audience, keywords, and competition." },
    { title: "Setup & measurement", text: "Building the campaign, ads, conversion tracking, and data monitoring." },
    { title: "Optimization", text: "Ongoing improvement based on performance, budget, and lead quality." },
    { title: "Reporting & transparency", text: "Clear reports on what works and what needs adjustment." },
  ],
};

export const GOOGLE_ADS_BENEFITS = {
  label: "Why Adwrks 365",
  title: "Why choose Adwrks 365 for Google Ads?",
  items: [
    { title: "ROI-driven management", text: "Focus on business outcomes — leads, calls, and sales — not clicks alone." },
    { title: "Full transparency", text: "Clear reports, data access, and explanations for every campaign change." },
    { title: "Experience since 2018", text: "Managing campaigns for businesses across industries in Israel." },
    { title: "Integrated with SEO & websites", text: "Connecting paid search, landing pages, and conversion optimization." },
  ],
};

export const GOOGLE_ADS_LANDING = {
  label: "Conversion connection",
  title: "Landing pages, websites, and measurement",
  body: "A strong Google Ads campaign needs a clear conversion destination — a landing page or website that drives action. We connect the campaign, site, and tracking to follow leads and real results.",
};

/** Google-Ads-specific FAQ — replaces incorrect homepage FAQ in seo.json */
export const GOOGLE_ADS_FAQ = [
  {
    q: "What is Google Ads?",
    a: "Google Ads lets businesses appear at the top of search results through paid ads. You pay per click, and campaigns are managed by keywords, audiences, locations, and data.",
  },
  {
    q: "Which campaign types do you manage?",
    a: "We manage Search, Display, YouTube, Google Shopping, and local campaigns, plus ongoing optimization with ROI reporting.",
  },
  {
    q: "Who is Google Ads for?",
    a: "Google Ads suits businesses that want fast results, budget control, and high-intent audiences — local businesses, service providers, online stores, and more.",
  },
  {
    q: "How do you measure results and ROI?",
    a: "We connect campaigns to conversion tracking, monitor leads, calls, and relevant actions, and provide transparent performance reports and adjustments.",
  },
  {
    q: "What is the difference between Google Ads and organic SEO?",
    a: "Google Ads delivers immediate results while the budget is active; organic SEO builds long-term presence in natural search results. Most businesses benefit from both.",
  },
  {
    q: "Do I need a landing page or website to advertise on Google?",
    a: "An effective Google Ads campaign needs a clear conversion destination — a landing page or website that drives action. We can connect the campaign, site, and tracking as part of the full digital envelope.",
  },
] as const;

export const GOOGLE_ADS_GUIDE_PATHS = [
  "/en/google-ads-cost/",
  "/en/google-ads-10-steps/",
  "/en/roi-calculator-2026/",
  "/en/google-shopping-guide/",
  "/en/remarketing-guide/",
] as const;

export const GOOGLE_ADS_RELATED_SERVICES = [
  { href: "/en/website-building/", title: "Website Building", text: "Landing pages and websites that convert paid traffic." },
  { href: "/en/seo/", title: "Organic SEO", text: "Combine immediate results with long-term visibility." },
] as const;

export const GOOGLE_ADS_MID_CTA = {
  eyebrow: "Before you start",
  title: "Want to know if Google Ads fits your business?",
  body: "We'll review the potential, budget, and right direction for paid search — with no obligation.",
};

export const GOOGLE_ADS_FINAL_CTA = {
  eyebrow: "Google Ads consultation",
  title: "Paid search focused on results",
  body: "Leave your details and we'll review the potential, budget, and right direction for paid search — with no obligation.",
};

export const GOOGLE_ADS_PARTNER_BADGE = {
  src: "https://adwrks.co.il/wp-content/uploads/gogle-artner-badge-1.png",
  alt: "Google Partner",
};

export const GOOGLE_ADS_IMAGES = {
  hero: {
    src: "https://adwrks.co.il/wp-content/uploads/1-3.png",
    alt: "Google Ads — campaign management system",
    width: 800,
    height: 600,
  },
  intro: {
    src: "https://adwrks.co.il/wp-content/uploads/1-3.png",
    alt: "Google Ads for business",
    width: 800,
    height: 600,
  },
  audience: {
    src: "https://adwrks.co.il/wp-content/uploads/google-ads-ppc.png",
    alt: "Google Ads campaign management",
    width: 800,
    height: 600,
  },
} as const;

export const GOOGLE_ADS_HERO_CAMPAIGNS = [
  { label: "Search", icon: "search" as const },
  { label: "Display", icon: "display" as const },
  { label: "YouTube", icon: "youtube" as const },
  { label: "Shopping", icon: "shopping" as const },
  { label: "Local", icon: "local" as const },
] as const;
