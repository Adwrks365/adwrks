/**
 * Phase 5H.3 production QA — homepage deploy verification.
 * Run: node scripts/qa-phase-5h3-production.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = "https://adwrks.co.il";
const outDir = path.join(__dirname, "..", "..", "migration-audit", "phase-5h3-production-qa");

const FAQ = [
  "אילו שירותי שיווק דיגיטלי אתם מציעים?",
  "איך שיווק דיגיטלי יכול לעזור לעסק שלי לצמוח?",
  "מה ההבדל בין קידום אורגני, פרסום ממומן וקידום מבוסס AI?",
  "למי השירותים של Adwrks 365 מתאימים?",
  "תוך כמה זמן ניתן לראות תוצאות?",
  "האם אתם בונים אתרים כחלק מהשירות?",
];

const TESTIMONIALS = [
  "Itzik Abramov Car Detailing",
  "Danny Ben Atar",
  "דויד אשטה",
  "אמיר אמסלם",
  "אלעד שבתאי",
];

const QUOTES = ["שחר טיירי", "טל שינה", "רביב ברגר"];
const GUIDES = [
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/",
  "/פלטפורמה-בניית-אתר/",
  "/seo-2026-ai-answers/",
];

function count(html, items) {
  return items.filter((i) => html.includes(i)).length;
}

const [homeRes, robotsRes, sitemapRes] = await Promise.all([
  fetch(`${base}/`),
  fetch(`${base}/robots.txt`),
  fetch(`${base}/sitemap.xml`),
]);

const html = await homeRes.text();
const robots = await robotsRes.text();
const sitemap = await sitemapRes.text();
const sitemapCount = (sitemap.match(/<loc>/g) ?? []).length;

const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? null;
const noindex = /noindex/i.test(html);

const browser = await chromium.launch();
const page = await browser.newPage();

const report = {
  base,
  deployed: html.includes("home-hero-v2--text-led"),
  hero: {},
  desktop: {},
  mobile: {},
  counters: [],
  servicesH2: null,
  anchors: {},
  seo: { canonical, robots: robots.trim(), sitemapUrls: sitemapCount, noindex },
  content: {},
  portfolio: {},
  performance: {},
};

for (const [label, width] of [
  ["desktop", 1440],
  ["mobile", 390],
]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector(".home-hero-v2", { timeout: 30_000 });

  const hero = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim() ?? null,
    h1Count: document.querySelectorAll("h1").length,
    heroImages: document.querySelectorAll(".home-hero-v2 img").length,
    heroClass: document.querySelector(".home-hero-v2")?.className ?? null,
    portfolioLink: document.querySelector('.home-hero-v2 a[href="#portfolio"]')?.textContent?.trim() ?? null,
    aiSearch: Boolean(document.querySelector(".home-ai-search")),
    marquee: (() => {
      const t = document.querySelector(".platform-marquee-track");
      if (!t) return null;
      const s = getComputedStyle(t);
      return { animationName: s.animationName, animationDuration: s.animationDuration };
    })(),
    servicesH2: document.getElementById("home-services-heading")?.textContent?.trim() ?? null,
    contactForm: Boolean(document.querySelector(".home-final-contact form, .home-contact-card form")),
    knowledgeHub: document.getElementById("home-knowledge-heading")?.textContent?.trim() ?? null,
    blogLink: Boolean(document.querySelector('a[href="/blog/"]')),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));

  report[label] = hero;
  if (label === "desktop") {
    report.hero = hero;
    report.servicesH2 = hero.servicesH2;
  }
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/#portfolio`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#portfolio", { timeout: 30_000 });

report.portfolio = await page.evaluate(() => ({
  idPresent: Boolean(document.getElementById("portfolio")),
  slides: document.querySelectorAll("#portfolio .carousel-slide, #portfolio .portfolio-showcase-slide").length,
  lazyImages: document.querySelectorAll('#portfolio img[loading="lazy"]').length,
  priorityImages: document.querySelectorAll('#portfolio img[fetchpriority="high"], #portfolio img[data-nimg-fill]').length,
}));

report.counters = await page.evaluate(() =>
  [...document.querySelectorAll(".stat-value")].map((el) => el.getAttribute("aria-label")),
);

report.anchors = await page.evaluate(() =>
  ["about", "we-offer", "recommendations", "portfolio", "faq"].reduce((acc, id) => {
    acc[`#${id}`] = Boolean(document.getElementById(id));
    return acc;
  }, {}),
);

report.content = {
  faq: count(html, FAQ),
  testimonials: count(html, TESTIMONIALS),
  resultQuotes: count(html, QUOTES),
  highlight350: html.includes("350%"),
  seoAuthority: html.includes("מאז שנת 2018") && html.includes("קידום אורגני (SEO)"),
  aiSearch: html.includes("AI Search"),
  vision: html.includes("החזון הטכנולוגי שלנו ל-2026"),
  envelope360: html.includes("מעטפת שיווק 360°"),
  guides: count(html, GUIDES),
};

report.performance = {
  heroImages: report.hero.heroImages,
  heroPriority: (html.match(/home-hero-v2[\s\S]*?<\/section>/)?.[0] ?? "").includes('fetchpriority="high"'),
  portfolioLazy: report.portfolio.lazyImages,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

await browser.close();

const ok =
  report.deployed &&
  report.hero.h1 === "סוכנות שיווק דיגיטלי" &&
  report.hero.h1Count === 1 &&
  report.counters.join(",") === "8+,500K+,185+,6+" &&
  report.servicesH2 === "פתרונות שיווק דיגיטלי לעסקים" &&
  report.seo.sitemapUrls === 74 &&
  !report.seo.noindex &&
  report.seo.canonical === "https://adwrks.co.il/" &&
  robots.includes("Allow: /") &&
  report.content.faq === 6 &&
  report.content.testimonials === 5 &&
  report.content.resultQuotes === 3 &&
  Object.values(report.anchors).every(Boolean);

process.exit(ok ? 0 : 1);
