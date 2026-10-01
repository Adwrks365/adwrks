/**
 * Phase 5H.3C content parity + section order audit.
 * Run: node scripts/qa-phase-5h3c-content-parity.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const outDir = path.join(webRoot, "..", "migration-audit", "phase-5h3c-qa");

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4321";

const FAQ_QUESTIONS = [
  "אילו שירותי שיווק דיגיטלי אתם מציעים?",
  "איך שיווק דיגיטלי יכול לעזור לעסק שלי לצמוח?",
  "מה ההבדל בין קידום אורגני, פרסום ממומן וקידום מבוסס AI?",
  "למי השירותים של Adwrks 365 מתאימים?",
  "תוך כמה זמן ניתן לראות תוצאות?",
  "האם אתם בונים אתרים כחלק מהשירות?",
];

const TESTIMONIAL_NAMES = [
  "Itzik Abramov Car Detailing",
  "Danny Ben Atar",
  "דויד אשטה",
  "אמיר אמסלם",
  "אלעד שבתאי",
];

const RESULT_QUOTE_NAMES = ["שחר טיירי", "טל שינה", "רביב ברגר"];

const SERVICE_CHECKLIST_TEXTS = [
  "בניית אתרים ודפי נחיתה אפקטיביים",
  "ניהול קמפיינים ממוקדי המרה",
  "קידום אורגני ואופטימיזציית AI",
  "ניהול מודעות במנועי חיפוש",
  "אסטרטגיית תוכן ושיווק ברשתות חברתיות",
  "פרסום וקידום בגוגל מפות",
  "פרסום בשפה עברית, רוסית ואנגלית",
  "עיצוב ושיווק תכנים בהתאמה אישית",
];

const SEO_SNIPPETS = [
  "מאז שנת 2018",
  "קידום אורגני (SEO)",
  "ניהול קמפיינים ממומנים (PPC/SEM)",
  "עברית, רוסית ואנגלית",
];

const AI_SNIPPETS = ["AI Search", "AIO", "SEO", "PPC", "E-E-A-T"];
const COUNTERS = ["8+", "500K+", "185+", "6+"];
const PLATFORMS = ["Google", "Facebook", "Instagram", "WordPress", "ChatGPT"];
const CURATED_GUIDES = [
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/",
  "/פלטפורמה-בניית-אתר/",
  "/seo-2026-ai-answers/",
];

function countMatches(html, items) {
  return items.filter((item) => html.includes(item)).length;
}

function indexOf(html, marker) {
  return html.indexOf(marker);
}

const homeRes = await fetch(`${baseUrl}/`);
if (!homeRes.ok) throw new Error(`Homepage fetch failed: ${homeRes.status}`);
const html = await homeRes.text();

const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
const sitemapText = sitemapRes.text ? await sitemapRes.text() : "";
const sitemapCount = (sitemapText.match(/<loc>/g) ?? []).length;

const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];

const sectionMarkers = [
  { id: "hero", marker: "home-hero-v2" },
  { id: "ai-search", marker: "home-ai-search" },
  { id: "stats", marker: "home-stats" },
  { id: "platform-marquee", marker: "home-platform-marquee" },
  { id: "vision", marker: "home-vision-v2" },
  { id: "about", marker: 'id="about"' },
  { id: "envelope-360", marker: "home-envelope-360" },
  { id: "services", marker: 'id="we-offer"' },
  { id: "mid-cta", marker: "home-mid-cta" },
  { id: "strategic-partner", marker: "home-strategic-partner" },
  { id: "social-proof", marker: 'id="recommendations"' },
  { id: "portfolio", marker: 'id="portfolio"' },
  { id: "faq", marker: 'id="faq"' },
  { id: "seo-authority", marker: "home-seo-authority" },
  { id: "knowledge-hub", marker: "home-knowledge-hub" },
  { id: "final-contact", marker: "home-final-contact" },
];

const sectionOrder = sectionMarkers.map((s) => ({
  id: s.id,
  index: indexOf(html, s.marker),
}));

const report = {
  baseUrl,
  h1: {
    count: h1Matches.length,
    exact: h1Matches.some((m) => m[1].includes("סוכנות שיווק דיגיטלי")),
  },
  sitemapUrls: sitemapCount,
  heroImagesInHero: (html.match(/home-hero-v2[\s\S]*?<\/section>/)?.[0] ?? "").includes("<img"),
  contentParity: {
    faq: { found: countMatches(html, FAQ_QUESTIONS), expected: 6 },
    testimonials: { found: countMatches(html, TESTIMONIAL_NAMES), expected: 5 },
    resultQuotes: { found: countMatches(html, RESULT_QUOTE_NAMES), expected: 3 },
    highlight350: html.includes("350%"),
    serviceChecklistTexts: {
      found: countMatches(html, SERVICE_CHECKLIST_TEXTS),
      expected: 8,
    },
    seoAuthority: { found: countMatches(html, SEO_SNIPPETS), expected: SEO_SNIPPETS.length },
    aiAioPpc: { found: countMatches(html, AI_SNIPPETS), expected: AI_SNIPPETS.length },
    counters: { found: countMatches(html, COUNTERS), expected: 4 },
    platforms: { found: countMatches(html, PLATFORMS), expected: PLATFORMS.length },
    marqueeAnimated: html.includes("platform-marquee-track"),
    curatedGuides: { found: countMatches(html, CURATED_GUIDES), expected: 3 },
    recommendationsAnchor: html.includes('id="recommendations"'),
  },
  sectionOrder,
  sectionOrderOk: sectionOrder.every((s, i, arr) =>
    i === 0 ? s.index >= 0 : s.index > arr[i - 1].index,
  ),
};

fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "content-parity-report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const ok =
  report.h1.count === 1 &&
  report.h1.exact &&
  report.sitemapUrls === 74 &&
  !report.heroImagesInHero &&
  report.contentParity.faq.found === 6 &&
  report.contentParity.testimonials.found === 5 &&
  report.contentParity.resultQuotes.found === 3 &&
  report.contentParity.serviceChecklistTexts.found === 8 &&
  report.contentParity.marqueeAnimated &&
  report.sectionOrderOk;

process.exit(ok ? 0 : 1);
