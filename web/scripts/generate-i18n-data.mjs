#!/usr/bin/env node
/**
 * Generates i18n route map + English content JSON from Hebrew WordPress export.
 * Run: node web/scripts/generate-i18n-data.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HE_DIR = path.join(ROOT, "src", "data", "content");
const EN_DIR = path.join(ROOT, "src", "data", "content-en");
const I18N_DIR = path.join(ROOT, "src", "i18n");

function normalizePath(input) {
  if (!input || input === "/") return "/";
  let p = input;
  if (p.startsWith("http")) {
    try {
      p = new URL(p).pathname;
    } catch {
      return "/";
    }
  }
  if (!p.startsWith("/")) p = `/${p}`;
  p = p
    .split("/")
    .map((s) => {
      if (!s) return s;
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    })
    .join("/");
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

function pathFromLink(link) {
  return normalizePath(link);
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(text) {
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const LEGAL_EN_TITLES = {
  "/privacy-policy/": "Privacy Policy – adwrks.co.il",
  "/terms-of-use/": "Terms of Use – adwrks.co.il",
  "/accessibility-statement/": "Accessibility Statement",
};

/** Manual EN slugs for pages with Hebrew paths */
const PAGE_EN_OVERRIDES = {
  "/": "/en/",
  "/שירותי-שיווק-דיגיטלי/": "/en/digital-marketing-services/",
  "/מחירון-שיווק-דיגיטלי/": "/en/digital-marketing-pricing/",
};

function enPathForHePath(hePath) {
  if (PAGE_EN_OVERRIDES[hePath]) return PAGE_EN_OVERRIDES[hePath];
  if (hePath === "/") return "/en/";
  return normalizePath(`/en${hePath}`);
}

/** Post translations: id -> { slug, title } */
const POST_EN = {
  21496: { slug: "website-speed-test", title: "Website Speed Test | Check Your Site for Free" },
  22727: { slug: "roi-calculator-2026", title: "ROI Calculator 2026: How to Calculate Paid Campaign Returns" },
  22368: { slug: "seo-2026-ai-answers", title: "SEO 2026: How to Appear in Google AI Overviews" },
  22310: { slug: "website-speed-optimization-2026-pagespeed", title: "Website Speed & PageSpeed Score Improvements in 2026" },
  20230: { slug: "google-reviews-not-working", title: "Google Reviews: What Changed and What Businesses Need to Know" },
  21860: { slug: "paid-vs-organic-seo", title: "Paid Search vs Organic SEO — A Comparison" },
  21161: { slug: "seo-pricing-guide", title: "How Much Does SEO Cost? Pricing Guide + Calculator" },
  21817: { slug: "future-of-seo-2025", title: "The Future of SEO: Organic Search in 2025 and Beyond" },
  21776: { slug: "digital-marketing-strategies-2025", title: "Digital Marketing Strategies for 2025 and Beyond" },
  19792: { slug: "wordpress-website-cost", title: "How Much Does a WordPress Website Cost? 2026 Pricing Guide" },
  21716: { slug: "choosing-digital-marketing-agency", title: "How to Choose a Digital Marketing Agency That Delivers Results" },
  21638: { slug: "google-ads-cost", title: "How Much Does Google Ads Cost? Average Daily Budget" },
  21578: { slug: "facebook-instagram-marketing", title: "Facebook & Instagram Marketing for Businesses in 2025" },
  17923: { slug: "google-shopping-guide", title: "Google Shopping Guide 2025: Essential Tool for E-commerce Sites" },
  10983: { slug: "popular-google-searches-israel", title: "Trending Google Searches in Israel (Live)" },
  21392: { slug: "digital-marketing-agency-carmiel", title: "Leading Digital Marketing Agency in Carmiel" },
  21272: { slug: "remarketing-guide", title: "Remarketing — What It Is, How It Works, and Why It Matters" },
  21339: { slug: "what-is-aeo", title: "What Is AEO? Will It Replace SEO?" },
  21317: { slug: "website-platform-guide", title: "Website Platform Guide: How to Choose Among 6 Options" },
  21249: { slug: "facebook-ads-guide", title: "Facebook Ads: Reach the Right Customers on the Right Budget" },
  21189: { slug: "website-building-pricing", title: "How Much Does a Website Cost? Pricing Guide + Calculator" },
  21115: { slug: "seo-guide-for-beginners", title: "SEO Guide for Beginners: 6 Essential Steps" },
  21068: { slug: "digital-marketing-for-business", title: "Digital Marketing for Business: 4 Core Strategies" },
  21051: { slug: "what-is-internet-marketing", title: "What Is Internet Marketing / Digital Marketing?" },
  20969: { slug: "free-business-advertising", title: "Free Business Advertising: 7 Simple Self-Promotion Methods" },
  20919: { slug: "google-ads-10-steps", title: "Google Ads: 10 Simple Steps to Get Started" },
  20897: { slug: "google-ads-7-strategies", title: "Google Ads: 7 Strategies to Grow Your Business" },
  20803: { slug: "digital-marketing-company", title: "Digital Marketing Company: Boost Your Business" },
  20529: { slug: "sem-vs-ppc", title: "SEM vs PPC: What's the Difference?" },
  20506: { slug: "digital-marketing-agency", title: "Digital Marketing Agency: All Digital Solutions in One Place" },
  20403: { slug: "digital-marketing-agency-leadership", title: "A Digital Marketing Agency That Moves Your Business Forward" },
  20388: { slug: "russian-speaking-audience-marketing", title: "Professional Marketing for Russian-Speaking Audiences" },
  20350: { slug: "russian-language-digital-advertising", title: "Russian-Language Digital Advertising" },
  20155: { slug: "google-maps-advertising", title: "Google Maps Advertising — Google Business Profile Promotion" },
  14288: { slug: "google-business-profile", title: "Google Business Profile — Free Google Promotion" },
  20092: { slug: "digital-consultant-partner", title: "A Digital Consultant Is Your Partner for Success" },
  20081: { slug: "internet-marketing-consultant", title: "What Is an Internet Marketing Consultant?" },
  20051: { slug: "managing-business-digital-age", title: "Managing a Business in the Digital Age" },
  20029: { slug: "internet-consultant", title: "Internet Consultant: Your Key to Digital Success" },
  19933: { slug: "managed-website-hosting", title: "Managed Website Hosting — The Perfect Solution" },
  19781: { slug: "hosting-maintenance-cost", title: "How Much Do Hosting and Website Maintenance Cost?" },
  19758: { slug: "hosting-maintenance-guide", title: "Website Hosting & Maintenance: The Complete Guide" },
  19644: { slug: "wordpress-hosting-maintenance", title: "WordPress Hosting & Maintenance: Why Professional Service Matters" },
  19548: { slug: "why-hosting-maintenance-matters", title: "Website Hosting & Maintenance: Why It Matters" },
  19428: { slug: "google-seo", title: "Google SEO: Why Invest in Organic Search?" },
  19398: { slug: "advertising-investment-tough-times", title: "Why Advertising Investment Matters Even in Tough Times" },
  19281: { slug: "digital-advertising-agency-importance", title: "The Importance of a Digital Advertising Agency" },
  19143: { slug: "what-is-digital-agency", title: "What Is a Digital Agency?" },
  19121: { slug: "google-business-promotion-guide", title: "Guide: Promoting Your Business on Google" },
  19100: { slug: "business-growth-through-seo", title: "Business Growth Through Internet Marketing" },
  19070: { slug: "business-advertising", title: "Business Advertising: Maximum Exposure in the Digital World" },
  18480: { slug: "digital-marketing-agency-maximize", title: "Maximize Your Online Presence with a Digital Marketing Agency" },
  10373: { slug: "power-of-reviews", title: "The Power of Reviews and Recommendations" },
  10369: { slug: "digital-advertising-office", title: "Digital Advertising Office — Internet Business Marketing" },
};

const CATEGORY_EN_TITLES = {
  "digital-marketing": "Digital Marketing",
  websites: "Website Building",
  google: "Google Marketing",
  "digital-agency": "Digital Agency",
  facebook: "Facebook Marketing",
  "internet-advertisement": "Internet Advertising",
  seo: "Organic SEO",
  ads: "Paid Advertising",
  "online-marketing": "Online Marketing",
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(HE_DIR, file), "utf8"));
}

function writeJson(file, data, dir = EN_DIR) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, file), JSON.stringify(data, null, 2) + "\n", "utf8");
}

const pages = readJson("pages.json");
const posts = readJson("posts.json");
const categories = readJson("categories.json");
const seoRecords = readJson("seo.json");

const routePairs = [];

function addPair(he, en, contentId) {
  routePairs.push({
    he: normalizePath(he),
    en: normalizePath(en),
    contentId,
  });
}

// Homepage
addPair("/", "/en/", "home");

// Pages
for (const page of pages) {
  const hePath = pathFromLink(page.link);
  if (hePath === "/") continue;
  const enPath = enPathForHePath(hePath);
  addPair(hePath, enPath, `page-${page.id}`);
}

// Categories
for (const cat of categories) {
  const hePath = pathFromLink(cat.link);
  const enPath = enPathForHePath(hePath);
  addPair(hePath, enPath, `category-${cat.id}`);
}

// Posts
for (const post of posts) {
  const hePath = pathFromLink(post.link);
  const enMeta = POST_EN[post.id];
  const enSlug = enMeta?.slug || post.slug;
  const enPath = normalizePath(`/en/${enSlug}/`);
  addPair(hePath, enPath, `post-${post.id}`);
}

// Blog pagination pairs (page 2+)
const POSTS_PER_PAGE = 9;
const blogPages = Math.ceil(posts.length / POSTS_PER_PAGE);
for (let p = 2; p <= blogPages; p++) {
  addPair(`/blog/page/${p}/`, `/en/blog/page/${p}/`, `blog-page-${p}`);
}

for (const cat of categories) {
  const catPosts = posts.filter((post) => post.categories?.includes(cat.id));
  const totalPages = Math.ceil(catPosts.length / POSTS_PER_PAGE);
  const heBase = pathFromLink(cat.link);
  for (let p = 2; p <= totalPages; p++) {
    addPair(`${heBase}page/${p}/`, `${enPathForHePath(heBase)}page/${p}/`, `category-${cat.id}-page-${p}`);
  }
}

// Generate routes.ts
const routesTs = `/** Auto-generated by web/scripts/generate-i18n-data.mjs — do not edit manually */
import { normalizePath } from "@/lib/content/paths";
import type { Locale } from "./routing";

export type RoutePair = {
  he: string;
  en: string;
  contentId: string;
};

export const ROUTE_PAIRS: RoutePair[] = ${JSON.stringify(routePairs, null, 2)};

const heToEn = new Map(ROUTE_PAIRS.map((p) => [p.he, p.en]));
const enToHe = new Map(ROUTE_PAIRS.map((p) => [p.en, p.he]));
const enToContentId = new Map(ROUTE_PAIRS.map((p) => [p.en, p.contentId]));
const heToContentId = new Map(ROUTE_PAIRS.map((p) => [p.he, p.contentId]));

export function getContentId(path: string, locale: Locale): string | undefined {
  const key = normalizePath(path);
  return locale === "en" ? enToContentId.get(key) : heToContentId.get(key);
}

export function pathForLocale(path: string, locale: Locale): string {
  const key = normalizePath(path);
  if (locale === "en") {
    return heToEn.get(key) ?? (key === "/" ? "/en/" : key.startsWith("/en/") ? key : normalizePath(\`/en\${key}\`));
  }
  if (key.startsWith("/en/")) {
    return enToHe.get(key) ?? "/";
  }
  return key;
}

export function alternatePaths(path: string): { he: string; en: string } | null {
  const key = normalizePath(path);
  if (heToEn.has(key)) {
    return { he: key, en: heToEn.get(key)! };
  }
  if (enToHe.has(key)) {
    return { he: enToHe.get(key)!, en: key };
  }
  return null;
}

export function localizedHref(path: string, locale: Locale): string {
  return pathForLocale(path, locale);
}
`;

fs.mkdirSync(I18N_DIR, { recursive: true });
fs.writeFileSync(path.join(I18N_DIR, "routes.ts"), routesTs, "utf8");

// English pages JSON (legal + blog shell)
const enPages = pages.map((page) => {
  const hePath = pathFromLink(page.link);
  const enPath = enPathForHePath(hePath);
  const isLegal = ["/privacy-policy/", "/terms-of-use/", "/accessibility-statement/"].includes(hePath);
  let title = decodeEntities(page.title.replace(/<[^>]+>/g, ""));
  if (hePath === "/שירותי-שיווק-דיגיטלי/") title = "Digital Marketing Services";
  if (hePath === "/מחירון-שיווק-דיגיטלי/") title = "Digital Marketing Pricing";
  if (hePath === "/") title = "Home";

  if (isLegal && LEGAL_EN_TITLES[hePath]) {
    title = LEGAL_EN_TITLES[hePath];
  }

  return {
    ...page,
    link: `https://adwrks.co.il${enPath}`,
    title,
    content: page.content,
  };
});

writeJson("pages.json", enPages);

// English posts
const enPosts = posts.map((post) => {
  const hePath = pathFromLink(post.link);
  const enMeta = POST_EN[post.id] || { slug: post.slug, title: decodeEntities(post.title) };
  const enPath = normalizePath(`/en/${enMeta.slug}/`);
  const plain = stripHtml(post.content);
  const paragraphs = plain
    .split(/(?<=[.!?])\s+/)
    .slice(0, 12)
    .map((p) => `<p>${p.trim()}</p>`)
    .join("\n");
  const enTitle = enMeta.title;
  const content = `<article class="article-en"><h1>${enTitle}</h1>${paragraphs || `<p>${plain.slice(0, 800)}</p>`}</article>`;

  return {
    ...post,
    slug: enMeta.slug,
    link: `https://adwrks.co.il${enPath}`,
    title: enTitle,
    content,
    excerpt: stripHtml(post.excerpt || "").slice(0, 300),
    pairedHePath: hePath,
  };
});

writeJson("posts.json", enPosts);

// English categories
const enCategories = categories.map((cat) => {
  const enPath = enPathForHePath(pathFromLink(cat.link));
  const enTitle = CATEGORY_EN_TITLES[cat.slug] || cat.title;
  return {
    ...cat,
    link: `https://adwrks.co.il${enPath}`,
    title: enTitle,
    description: cat.description,
  };
});

writeJson("categories.json", enCategories);

// English SEO stubs
const enSeo = seoRecords.map((record) => {
  const hePath = normalizePath(record.url);
  const pair = routePairs.find((p) => p.he === hePath);
  const enPath = pair?.en || enPathForHePath(hePath);
  const localeRecord = { ...record, url: enPath };
  if (localeRecord.title) {
    localeRecord.title = localeRecord.title.replace(/Adwrks 365/g, "Adwrks 365");
  }
  if (Array.isArray(localeRecord.jsonLd)) {
    localeRecord.jsonLd = localeRecord.jsonLd.map((node) => {
      if (node && typeof node === "object") {
        return { ...node, inLanguage: "en-US" };
      }
      return node;
    });
  }
  return localeRecord;
});

writeJson("seo.json", enSeo);

// English sitemap URLs
const enUrls = routePairs.map((p) => `https://adwrks.co.il${p.en}`);
writeJson("urls.json", { sitemapUrls: enUrls });

console.log(`Generated ${routePairs.length} route pairs`);
console.log("Written routes.ts + content-en/*.json");
