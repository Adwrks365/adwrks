/**
 * Phase 5H.3B homepage content parity audit.
 * Run: node scripts/qa-phase-5h3b-content-parity.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const outDir = path.join(webRoot, "..", "migration-audit", "phase-5h3b-qa");

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

const SERVICE_LINKS = [
  "/website-building/",
  "/google-ads/",
  "/seo/",
  "/social-media-management/",
  "/פרסום-בגוגל-מפות/",
];

const SEO_SNIPPETS = [
  "מאז שנת 2018",
  "קידום אורגני (SEO)",
  "ניהול קמפיינים ממומנים (PPC/SEM)",
  "עברית, רוסית ואנגלית",
];

const AI_SNIPPETS = [
  "AI Search",
  "AIO",
  "SEO",
  "PPC",
  "E-E-A-T",
];

const COUNTERS = ["8+", "500K+", "185+", "6+"];

const CURATED_GUIDES = [
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/",
  "/פלטפורמה-בניית-אתר/",
  "/seo-2026-ai-answers/",
];

function countMatches(html, items) {
  return items.filter((item) => html.includes(item)).length;
}

const [homeRes, sitemapRes] = await Promise.all([
  fetch(`${baseUrl}/`),
  fetch(`${baseUrl}/sitemap.xml`),
]);

if (!homeRes.ok) throw new Error(`Homepage fetch failed: ${homeRes.status}`);
const html = await homeRes.text();
const sitemapText = sitemapRes.ok ? await sitemapRes.text() : "";
const sitemapCount = (sitemapText.match(/<loc>/g) ?? []).length;

const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
const h1Texts = h1Matches.map((m) => m[1].replace(/<[^>]+>/g, "").trim());

const report = {
  baseUrl,
  h1: {
    count: h1Matches.length,
    texts: h1Texts,
    exact: h1Texts.some((t) => t.includes("סוכנות שיווק דיגיטלי")),
  },
  sitemapUrls: sitemapCount,
  contentParity: {
    faq: { found: countMatches(html, FAQ_QUESTIONS), expected: 6 },
    testimonials: { found: countMatches(html, TESTIMONIAL_NAMES), expected: 5 },
    resultQuotes: { found: countMatches(html, RESULT_QUOTE_NAMES), expected: 3 },
    highlight350: html.includes("350%"),
    serviceChecklistLinks: {
      found: countMatches(html, SERVICE_LINKS),
      expected: 4,
      note: "4 of 8 checklist items have href; all 8 texts checked separately",
    },
    serviceChecklistTexts: {
      found: countMatches(html, [
        "בניית אתרים ודפי נחיתה אפקטיביים",
        "ניהול קמפיינים ממוקדי המרה",
        "קידום אורגני ואופטימיזציית AI",
        "ניהול מודעות במנועי חיפוש",
        "אסטרטגיית תוכן ושיווק ברשתות חברתיות",
        "פרסום וקידום בגוגל מפות",
        "פרסום בשפה עברית, רוסית ואנגלית",
        "עיצוב ושיווק תכנים בהתאמה אישית",
      ]),
      expected: 8,
    },
    seoAuthority: { found: countMatches(html, SEO_SNIPPETS), expected: SEO_SNIPPETS.length },
    aiAioPpc: { found: countMatches(html, AI_SNIPPETS), expected: AI_SNIPPETS.length },
    counters: { found: countMatches(html, COUNTERS), expected: 4 },
    curatedGuides: { found: countMatches(html, CURATED_GUIDES), expected: 3 },
    portfolioLabel: html.includes("אתרים שבנינו ומקדמים"),
    portfolioTitle: html.includes("דוגמאות מהשטח"),
    heroCtaPrimary: html.includes("ייעוץ ללא התחייבות"),
    heroCtaSecondary: html.includes('href="#portfolio"') || html.includes("צפו בעבודות שלנו"),
    midPageFormAbsent: !html.includes('formId="homepage-contact"') || html.split('formId="homepage-contact"').length <= 2,
  },
  sectionOrder: [
    "home-hero-v2",
    "home-trust-band",
    "home-services-v2",
    "portfolio",
    "home-approach-360",
    "home-how-we-work",
    "home-mid-cta",
    "home-social-proof",
    "home-about-v2",
    "faq",
    "home-knowledge-hub",
    "home-seo-authority",
    "home-final-contact",
  ].map((id) => ({
    id,
    index: html.indexOf(id === "portfolio" ? 'id="portfolio"' : id === "faq" ? 'id="faq"' : id),
  })),
};

report.sectionOrderOk = report.sectionOrder.every((s, i, arr) =>
  i === 0 ? s.index >= 0 : s.index > arr[i - 1].index,
);

fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "content-parity-report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const ok =
  report.h1.count === 1 &&
  report.h1.exact &&
  report.sitemapUrls === 74 &&
  report.contentParity.faq.found === 6 &&
  report.contentParity.testimonials.found === 5 &&
  report.contentParity.resultQuotes.found === 3 &&
  report.contentParity.serviceChecklistTexts.found === 8 &&
  report.contentParity.seoAuthority.found === report.contentParity.seoAuthority.expected &&
  report.contentParity.aiAioPpc.found >= 4 &&
  report.contentParity.counters.found === 4 &&
  report.sectionOrderOk;

process.exit(ok ? 0 : 1);
