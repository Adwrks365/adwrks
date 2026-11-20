/**
 * QA — batch8 article rollout (local prepareArticleBodyHtml).
 * npx tsx scripts/qa-blog-rollout-batch8.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { getArticleEnrichmentSource } from "../src/lib/content/article-enrichment-registry.ts";

const BATCH8 = [
  { path: "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/", locale: "he" },
  { path: "/google-business-profile/", locale: "he" },
  { path: "/en/popular-google-searches-israel/", locale: "en" },
  { path: "/en/power-of-reviews/", locale: "en" },
  { path: "/en/digital-advertising-office/", locale: "en" },
];

const DATE_PREFIX = "2026-11-20";

let failed = 0;

function check({ path, locale }) {
  const c = getContentByPath(path, locale);
  if (!c) {
    console.error("FAIL missing", path, locale);
    failed++;
    return;
  }
  const source = getArticleEnrichmentSource(path, locale);
  if (source !== "batch8-2026") {
    console.error("FAIL registry", path, source);
    failed++;
  }
  const { html, headings } = prepareArticleBodyHtml(c.content, locale, path);
  if (!html.includes("adwrks-article-lead-2026")) {
    console.error("FAIL lead", path);
    failed++;
  }
  if (!html.includes("adwrks-article-faq-block")) {
    console.error("FAIL faq block", path);
    failed++;
  }
  const details = (html.match(/<details class="adwrks-faq-item"/g) || []).length;
  if (details < 3) {
    console.error("FAIL faq count", path, details);
    failed++;
  }
  if (html.includes('<table id="trend-table">') || html.includes('id="google-trends-widget"')) {
    console.error("FAIL fake trends widget", path);
    failed++;
  }
  const h1 = headings.filter((h) => h.level === 1);
  if (h1.length > 0) {
    console.error("FAIL embedded h1", path, h1.length);
    failed++;
  }
  const dup = headings.filter((h) => /^(סיכום|לסיכום|In summary|Summary:)/i.test(h.text.trim()));
  if (dup.length > 1) {
    console.error("FAIL dup summary", path, dup.map((d) => d.text));
    failed++;
  }
  const dates = resolveArticleDates(c, locale);
  if (!dates.dateModified?.includes(DATE_PREFIX)) {
    console.error("FAIL dateModified", path, dates.dateModified);
    failed++;
  }
  console.log("OK", path, "faq", details, "modified", dates.dateModified);
}

for (const row of BATCH8) check(row);

process.exit(failed ? 1 : 0);