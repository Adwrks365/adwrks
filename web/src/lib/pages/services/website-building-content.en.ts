/** Structured content for /en/website-building/ — standalone English service copy. */

export const WEBSITE_BUILDING_PATH = "/en/website-building/" as const;

export const WEBSITE_BUILDING_HERO = {
  badge: "Website Building for Business • Since 2018",
  title: "Website Building for Business",
  lead:
    "Since 2018, Adwrks 365 has helped businesses build websites connected to real results. We combine modern design, user experience, high performance, and marketing thinking — so your site is not just a business card, but a genuine lead engine.",
  cues: [
    "Structure and content planning before development",
    "Design, development, and mobile",
    "SEO foundations and measurement",
  ],
} as const;

export const WEBSITE_BUILDING_OUTCOMES = {
  label: "Your website is the center of your digital activity",
  title: "What makes a business website professional and results-driven?",
  intro:
    "Your website is where every digital channel meets — SEO, Google Ads, social media, email, and more. A strong business website should be:",
  points: [
    "Fast and mobile-ready",
    "Clear for visitors and search engines",
    "Persuasive, with the right messages and calls to action",
    "Flexible for content management and future changes",
    "Connected to measurement (Analytics, forms, pixels, and more)",
  ],
  closing:
    "We build websites with these priorities in mind — not just a pretty template, but business goals first.",
} as const;

export const WEBSITE_BUILDING_PLANNING = {
  label: "Before we start building",
  title: "Planning, structure, and user experience",
  intro:
    "Before design and development, it is important to understand goals, target audience, and the path visitors should take. At this stage we focus on:",
  points: [
    "Defining site goals — inquiries, sales, service presentation, or portfolio",
    "Mapping target audience and core messages",
    "Planning site map, hierarchy, and key pages",
    "Placing calls to action on every relevant page",
  ],
  audienceLabel: "Who is this service for?",
  audience: [
    "New businesses needing a professional, branded first website",
    "Existing businesses with an outdated site ready for a full upgrade",
    "Service providers who want more inquiries from their website",
    "Online stores focused on sales and easy management",
    "Businesses starting to invest in SEO and wanting a promotion-ready site",
    "Anyone who wants a site that is easy to manage, update, and expand over time",
  ],
} as const;

export const WEBSITE_BUILDING_PROCESS = {
  label: "A structured, transparent website building process",
  title: "What does our website building process include?",
  steps: [
    {
      title: "Needs and goals discovery",
      text: "An in-depth conversation about your business, audience, services, and site goals — inquiries, sales, portfolio presentation, and more.",
    },
    {
      title: "Structure and content planning",
      text: "Building a site map, defining key pages, correct hierarchy, and call-to-action placement on every page.",
    },
    {
      title: "Design and user experience",
      text: "Modern, clean design aligned with your brand, with strong mobile and desktop user experience.",
    },
    {
      title: "Development and implementation",
      text: "Building the site on WordPress (or another suitable platform), optimized for speed and stability, connected to forms, WhatsApp, chat, external systems, and more.",
    },
    {
      title: "SEO and technical setup",
      text: "Basic meta tags, headings, URL structure, speed, and foundational schema — so the site is ready for organic SEO and paid advertising.",
    },
    {
      title: "Training and post-launch support",
      text: "Site management training, content updates, and optional ongoing marketing support — SEO, Google Ads, social media, and more.",
    },
  ],
} as const;

export const WEBSITE_BUILDING_DELIVERABLES = {
  label: "What's included",
  title: "What you get in practice",
  items: [
    {
      title: "100% transparency throughout the process",
      text: "A structured process, timeline, regular updates, and clear explanations at every stage — from discovery to launch.",
    },
    {
      title: "Built for AI and semantic search",
      text: "Structure and content that speak clearly to visitors and smart search engines, including AI Overviews.",
    },
    {
      title: "WordPress-based and easy to manage",
      text: "An open, user-friendly platform with room for future extensions — without getting locked in.",
    },
    {
      title: "Proven expertise since 2018",
      text: "Website building for businesses across industries — services, commerce, local and national — with a clear understanding of what works in Israel.",
    },
    {
      title: "Fully connected to digital marketing",
      text: "The site is built from day one to work well with SEO, Google Ads, social media, and broader marketing activity.",
    },
    {
      title: "Websites built for leads and sales",
      text: "We plan every page with a clear goal — leave details, call, purchase, or book a meeting.",
    },
  ],
} as const;

export const WEBSITE_BUILDING_FOUNDATIONS = {
  label: "More than design",
  title: "Mobile, SEO, performance, and conversions — built in from the start",
  intro:
    "A professional business website must work well on mobile, in Google, and on the path to inquiry or purchase. That is why we emphasize:",
  pillars: [
    {
      title: "Mobile",
      text: "Full mobile optimization and a smooth user experience — because most visitors arrive on their phone.",
    },
    {
      title: "SEO foundations",
      text: "Clean code structure, headings, speed, and a foundation that prepares the site for organic SEO.",
    },
    {
      title: "Performance",
      text: "Focus on load speed and stability — a strong base for user experience and marketing.",
    },
    {
      title: "Conversions",
      text: "Clear messages, forms, action buttons, and a path that leads to inquiry or action.",
    },
  ],
} as const;

/** Matches seo.json FAQPage for /en/website-building/ — visible FAQ must stay in parity. */
export const WEBSITE_BUILDING_FAQ = [
  {
    q: "What does the website building service include?",
    a: "Website building for business includes needs and goals discovery, site structure planning, design and user experience, development on a suitable platform, mobile and speed optimization, forms and measurement setup, and preparation for SEO and digital marketing.",
  },
  {
    q: "Which platform do you build on, and can we manage the site ourselves?",
    a: "In most cases we build on WordPress because it is flexible, widely used, and easy to manage. At project completion you receive full site access and content management training, so you can update text, images, and pages independently.",
  },
  {
    q: "How long does it take to build a new business website?",
    a: "Timeline depends on scope and complexity. A standard business brochure site is typically ready within three to eight weeks, including discovery, design, development, and launch — provided the client supplies materials and approvals on schedule.",
  },
  {
    q: "Will the site be optimized for organic SEO?",
    a: "Yes. From the build stage we ensure clean code structure, correct heading hierarchy, good load speed, mobile readiness, and a proper SEO foundation. After launch you can continue with a full organic SEO program to grow visibility in Google.",
  },
  {
    q: "Can the site connect to paid advertising and measurement systems?",
    a: "Absolutely. We connect the site to measurement systems such as Google Analytics, Google Tag Manager, and additional platform pixels as needed. The site is built to work well with Google Ads and social campaigns, including form, call, and conversion tracking.",
  },
  {
    q: "What is the next step after the new site goes live?",
    a: "After launch, the priority is driving quality traffic to the site. You can continue with organic SEO, Google Ads, or a combination — depending on goals and budget. We recommend a marketing plan aligned with the new site to maximize digital results.",
  },
] as const;

export const WEBSITE_BUILDING_GUIDE_PATHS = [
  "/en/website-building-pricing/",
  "/en/wordpress-website-cost/",
  "/en/website-platform-guide/",
  "/en/website-speed-test/",
] as const;

export const WEBSITE_BUILDING_RELATED_SERVICES = [
  {
    href: "/en/seo/",
    title: "Organic SEO",
    text: "Site structure and foundation that prepare the ground for organic visibility in Google.",
  },
  {
    href: "/en/hosting-plans/",
    title: "Hosting & Maintenance",
    text: "Peace of mind after launch — hosting, backups, and maintenance.",
  },
  {
    href: "/en/google-ads/",
    title: "Google Ads",
    text: "Drive traffic and conversions to your new site with targeted campaigns.",
  },
] as const;

export const WEBSITE_BUILDING_FINAL_CTA = {
  eyebrow: "Want a site that brings inquiries — not just looks good?",
  title: "A business website that brings inquiries — not just looks good",
  body:
    "Leave your details for an initial consultation on building or upgrading a business website — with no obligation. We'll understand your needs, audience, and business goals, and propose a clear direction for a site that supports marketing, builds trust, and works for you over time.",
  note: "Our consultation is based on hands-on website building experience for businesses in Israel since 2018.",
} as const;

/** Hero preview — Insytix from portfolio dataset (sortOrder 1, featured). */
export const WEBSITE_BUILDING_HERO_PROJECT_ID = "insytix" as const;
