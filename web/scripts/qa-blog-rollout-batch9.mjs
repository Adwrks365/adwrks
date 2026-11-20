/**
 * QA — batch9 article rollout (content + HTML safety).
 * npx tsx scripts/qa-blog-rollout-batch9.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { getArticleEnrichmentSource } from "../src/lib/content/article-enrichment-registry.ts";
import { countTagBalance } from "../src/lib/content/article-html-sanitize.ts";

const BATCH9 = [
  {
    path: "/צמיחה-עסקית-באמצעות-קידום-באינטרנט/",
    locale: "he",
    preserve: ["כוחו של קידום", "אסטרטגיות", "מדידה"],
  },
  {
    path: "/en/google-business-profile/",
    locale: "en",
    preserve: ["Google Business Profile", "verify", "review"],
  },
  {
    path: "/en/google-business-promotion-guide/",
    locale: "en",
    preserve: ["SEO", "Google Ads", "Business Profile"],
  },
  {
    path: "/en/business-growth-through-seo/",
    locale: "en",
    preserve: ["SEO", "organic", "digital"],
  },
  {
    path: "/en/digital-marketing-agency-maximize/",
    locale: "en",
    preserve: ["digital marketing agency", "services"],
  },
];

const REGRESSION = [
  { path: "/google-business-profile/", locale: "he" },
  { path: "/מדריך-קידום-העסק-בגוגל/", locale: "he" },
  { path: "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/", locale: "he" },
  { path: "/en/popular-google-searches-israel/", locale: "en" },
  { path: "/en/power-of-reviews/", locale: "en" },
  { path: "/סוכנות-שיווק-דיגיטלית/", locale: "he" },
];

let failed = 0;
const CLOCK_SKEW_MS = 3 * 60 * 1000;

function parseIso(s) {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function check({ path: articlePath, locale, preserve }) {
  const c = getContentByPath(articlePath, locale);
  if (!c) {
    console.error("FAIL missing", articlePath, locale);
    failed++;
    return;
  }
  const source = getArticleEnrichmentSource(articlePath, locale);
  if (source !== "batch9-2026") {
    console.error("FAIL registry", articlePath, source);
    failed++;
  }
  const { html, headings } = prepareArticleBodyHtml(c.content, locale, articlePath);
  const baseline = prepareArticleBodyHtml(c.content, locale, articlePath, { skipBatch9: true });

  if (!html.includes("adwrks-article-lead-2026")) {
    console.error("FAIL lead", articlePath);
    failed++;
  }
  if (!html.includes("adwrks-article-faq-block")) {
    console.error("FAIL faq block", articlePath);
    failed++;
  }
  const details = (html.match(/<details class="adwrks-faq-item"/g) || []).length;
  if (details < 3) {
    console.error("FAIL faq count", articlePath, details);
    failed++;
  }
  for (const p of preserve ?? []) {
    if (!html.toLowerCase().includes(p.toLowerCase())) {
      console.error("FAIL preserve", articlePath, p);
      failed++;
    }
  }
  const imgBefore = (baseline.html.match(/<img\b/gi) || []).length;
  const imgAfter = (html.match(/<img\b/gi) || []).length;
  const imgDrop = imgBefore - imgAfter;
  if (imgDrop > 2) {
    console.error("FAIL images dropped", articlePath, imgBefore, "->", imgAfter);
    failed++;
  }
  if (baseline.html.length > 500 && html.length < baseline.html.length * 0.5) {
    console.error("FAIL content mass drop", articlePath, baseline.html.length, html.length);
    failed++;
  }
  const balAfter = countTagBalance(html);
  if (Math.abs(balAfter.div) > 12 || Math.abs(balAfter.section) > 8 || Math.abs(balAfter.p) > 8) {
    console.error("FAIL html tag imbalance", articlePath, balAfter);
    failed++;
  }
  const h1 = headings.filter((h) => h.level === 1);
  if (h1.length > 0) {
    console.error("FAIL embedded h1", articlePath, h1.length);
    failed++;
  }
  const dup = headings.filter((h) => /^(סיכום|לסיכום|In summary|Summary:)/i.test(h.text.trim()));
  if (dup.length > 1) {
    console.error("FAIL dup summary", articlePath, dup.map((d) => d.text));
    failed++;
  }
  const dates = resolveArticleDates(c, locale);
  const published = parseIso(dates.datePublished);
  const modified = parseIso(dates.dateModified);
  if (modified && published && modified < published) {
    console.error("FAIL modified before published", articlePath, dates);
    failed++;
  }
  const now = Date.now();
  if (modified && modified.getTime() > now + CLOCK_SKEW_MS) {
    console.error("FAIL future dateModified", articlePath, dates.dateModified);
    failed++;
  }
  if (dates.dateModified && dates.schemaDateModified) {
    const visibleDay = dates.dateModified.slice(0, 10);
    const schemaDay = dates.schemaDateModified.slice(0, 10);
    if (visibleDay !== schemaDay) {
      console.error("FAIL schema/visible date mismatch", articlePath, { visibleDay, schemaDay });
      failed++;
    }
  }
  const leadIdx = html.indexOf("adwrks-article-lead-2026");
  if (leadIdx !== -1) {
    const sectionTag = html.slice(html.lastIndexOf("<section", leadIdx), html.indexOf(">", html.lastIndexOf("<section", leadIdx)) + 1);
    if (/elementor-hidden-desktop/i.test(sectionTag)) {
      console.error("FAIL lead inside elementor-hidden-desktop", articlePath);
      failed++;
    }
  }
  console.log("OK", articlePath, "faq", details, "modified", dates.dateModified);
}

function checkRegression({ path: articlePath, locale }) {
  const c = getContentByPath(articlePath, locale);
  const full = prepareArticleBodyHtml(c.content, locale, articlePath);
  const skip = prepareArticleBodyHtml(c.content, locale, articlePath, { skipBatch9: true });
  if (full.html !== skip.html) {
    console.error("FAIL batch9 touched non-batch9 article", articlePath);
    failed++;
    return;
  }
  console.log("OK regression isolated", articlePath);
}

for (const row of BATCH9) check(row);
for (const row of REGRESSION) checkRegression(row);

const auditPath = path.resolve("..", "migration-audit", "BATCH9_HTML_BEFORE_AFTER.json");
try {
  const audit = JSON.parse(readFileSync(auditPath, "utf8"));
  if (audit.articles?.some((a) => !a.preserveCheck?.ok)) {
    console.error("FAIL audit json preserve");
    failed++;
  }
} catch {
  console.warn("WARN run audit-batch9-before-after.mjs first");
}

process.exit(failed ? 1 : 0);