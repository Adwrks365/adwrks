export const HOSTING_PATH = "/en/hosting-plans/" as const;

export const HOSTING_HERO = {
  badge: "Hosting • Maintenance • Stability",
  title: "Website Hosting & Maintenance",
  lead: "Hosting and maintenance solutions for WordPress sites or modern web applications — based on your site's technology. We handle availability, security, and stability so you can focus on your business.",
  ctaLabel: "Consultation for hosting and maintenance",
};

export const HOSTING_WORDPRESS_SECTION = {
  title: "WordPress hosting and maintenance plans",
  intro: "Plans tailored for WordPress sites — with backups, SSL, ongoing maintenance, and support.",
} as const;

export const HOSTING_PLANS = [
  {
    id: "basic",
    title: "Basic — landing page / one page",
    price: "₪69",
    period: "per month",
    wasPrice: "₪89",
    audience: "Landing page or small one-page site",
    features: [
      "1 site",
      "SSD storage up to 500MB",
      "Daily backups",
      "Ongoing maintenance",
      "SSL",
      "Phone and email support",
      "Developer for changes",
    ],
  },
  {
    id: "advanced",
    title: "Advanced — large site / store",
    price: "₪250",
    period: "per month",
    audience: "Large business site, store, or multi-page project",
    features: [
      "Up to 5 domains",
      "SSD storage up to 5GB",
      "Daily backups",
      "Maintenance",
      "SSL",
      "Support",
      "Developer for changes",
    ],
  },
  {
    id: "premium",
    title: "Premium — multiple sites",
    price: "From ₪490",
    period: "per month",
    audience: "Multiple sites or parallel projects",
    features: [
      "Up to 20 domains",
      "SSD storage up to 20GB",
      "Daily backups",
      "Full maintenance",
      "SSL",
      "Support",
      "Developer",
    ],
  },
] as const;

export const HOSTING_MODERN_INFRA = {
  label: "Modern infrastructure",
  title: "Hosting and infrastructure for modern websites",
  intro:
    "Not every site works like a traditional WordPress website. Modern sites and applications are built according to project architecture — and may use infrastructure such as Next.js, Vercel, and Supabase, depending on site needs.",
  points: [
    {
      name: "Next.js",
      text: "Application architecture framework — the structure of the app and site.",
    },
    {
      name: "Vercel",
      text: "Deployment, CDN, and platform infrastructure — where the application runs and is served to users.",
    },
    {
      name: "Supabase",
      text: "Backend capabilities — database, authentication, storage, and more when the project requires it.",
    },
  ],
  pricingNote: "Pricing according to architecture and project needs",
  ctaLabel: "Consultation for site infrastructure",
} as const;

export const HOSTING_MAINTENANCE = {
  label: "Why it matters",
  title: "Why is website maintenance important?",
  intro:
    "Your website is your most important digital asset. It must stay available, updated, secure, and stable 24/7.",
  items: [
    "Security — security updates to protect against attacks",
    "Updates — current software and plugins",
    "Backups — protection in case of failure or breach",
    "Speed — performance optimization",
    "Content editing — updating relevant content",
  ],
};

export const HOSTING_WEBSITE_LINK = {
  label: "Connected to website building",
  title: "Hosting alongside website building",
  body: "If you are building a new site or upgrading an existing one, you can combine professional website building with a hosting and maintenance plan suited to project scope.",
  href: "/en/website-building/",
};

export const HOSTING_GUIDE_PATHS = [
  "/en/hosting-maintenance-cost/",
  "/en/managed-website-hosting/",
  "/en/hosting-maintenance-guide/",
] as const;

export const HOSTING_RELATED_SERVICES = [
  { href: "/en/website-building/", title: "Website Building", text: "New site or upgrade before or alongside hosting." },
] as const;

export const HOSTING_FINAL_CTA = {
  eyebrow: "Hosting consultation",
  title: "Need hosting and maintenance for your site?",
  body: "We'll match a plan to your site scope and needs — without technical headaches.",
};
