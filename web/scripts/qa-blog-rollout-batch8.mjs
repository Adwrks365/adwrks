/**
 * QA — batch8 article rollout (content + HTML safety).
 * npx tsx scripts/qa-blog-rollout-batch8.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { getArticleEnrichmentSource } from "../src/lib/content/article-enrichment-registry.ts";
import { countTagBalance } from "../src/lib/content/article-html-sanitize.ts";

const BATCH8 = [
  {
    path: "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/",
    locale: "he",
    preserve: ["איך חיפושים פופולריים", "מה אפשר ללמוד"],
  },
  {
    path: "/google-business-profile/",
    locale: "he",
    preserve: ["מהו פרופיל העסק", "כיצד להגדיר", "כיצד לבצע אופטימיזציה"],
  },
  { path: "/en/popular-google-searches-israel/", locale: "en", preserve: ["How can popular Google searches"] },
  { path: "/en/power-of-reviews/", locale: "en", preserve: ["The impact of online reviews"] },
  {
    path: "/en/digital-advertising-office/",
    locale: "en",
    preserve: ["Where can I promote", "Who can help"],
  },
];

const REGRESSION = [
  { path: "/כוחם-של-ביקורות-והמלצות/", locale: "he" },
  { path: "/פרסום-לעסקים/", locale: "he" },
  { path: "/en/paid-vs-organic-seo/", locale: "en" },
  { path: "/en/business-advertising/", locale: "en" },
];

let failed = 0;

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
  if (source !== "batch8-2026") {
    console.error("FAIL registry", articlePath, source);
    failed++;
  }
  const { html, headings } = prepareArticleBodyHtml(c.content, locale, articlePath);
  const baseline = prepareArticleBodyHtml(c.content, locale, articlePath, { skipBatch8: true });

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
  if (html.includes('<table id="trend-table">') || html.includes('id="google-trends-widget"')) {
    console.error("FAIL fake trends widget", articlePath);
    failed++;
  }
  for (const p of preserve ?? []) {
    if (!html.includes(p)) {
      console.error("FAIL preserve", articlePath, p);
      failed++;
    }
  }
  const imgBefore = (baseline.html.match(/<img\b/gi) || []).length;
  const imgAfter = (html.match(/<img\b/gi) || []).length;
  if (imgAfter < imgBefore) {
    console.error("FAIL images dropped", articlePath, imgBefore, "->", imgAfter);
    failed++;
  }
  const balBefore = countTagBalance(baseline.html);
  const balAfter = countTagBalance(html);
  const divDelta = balAfter.div - balBefore.div;
  if (Math.abs(divDelta) > 2 || Math.abs(balAfter.section - balBefore.section) > 2) {
    console.error("FAIL html balance worsened", articlePath, { balBefore, balAfter });
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
  console.log("OK", articlePath, "faq", details, "modified", dates.dateModified);
}

function checkRegression({ path: articlePath, locale }) {
  const c = getContentByPath(articlePath, locale);
  const full = prepareArticleBodyHtml(c.content, locale, articlePath);
  const skip = prepareArticleBodyHtml(c.content, locale, articlePath, {
    skipBatch8: true,
    skipBatch9: true,
  });
  if (full.html !== skip.html) {
    console.error("FAIL batch8/9 touched non-batch article", articlePath);
    failed++;
    return;
  }
  console.log("OK regression isolated", articlePath);
}

for (const row of BATCH8) check(row);

for (const row of REGRESSION) checkRegression(row);

const auditPath = path.resolve("..", "migration-audit", "BATCH8_HTML_BEFORE_AFTER.json");
try {
  const audit = JSON.parse(readFileSync(auditPath, "utf8"));
  if (audit.articles?.some((a) => !a.preserveCheck?.ok)) {
    console.error("FAIL audit json preserve");
    failed++;
  }
} catch {
  console.warn("WARN run audit-batch8-before-after.mjs first");
}

process.exit(failed ? 1 : 0);