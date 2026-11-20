/**
 * QA — batch6 HE + batch7 EN rollout (local prepareArticleBodyHtml).
 * npx tsx scripts/qa-blog-rollout-batch67.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";

const BATCH6_HE = [
  "/פרסום-לעסקים/",
  "/כוחם-של-ביקורות-והמלצות/",
  "/מהי-סוכנות-דיגיטלית/",
  "/סוכנות-לשיווק-דיגיטלי/",
  "/מדריך-קידום-העסק-בגוגל/",
];

const BATCH7_EN = [
  "/en/business-advertising/",
  "/en/what-is-internet-marketing/",
  "/en/paid-vs-organic-seo/",
  "/en/remarketing-guide/",
  "/en/choosing-digital-marketing-agency/",
];

let failed = 0;

function check(path, locale, datePrefix = "2026-11-20") {
  const c = getContentByPath(path, locale);
  if (!c) {
    console.error("FAIL missing", path, locale);
    failed++;
    return;
  }
  const { html, headings } = prepareArticleBodyHtml(c.content, locale, path);
  const leadIdx = html.indexOf("adwrks-article-lead-2026");
  const faqIdx = html.indexOf("adwrks-article-faq-block");
  const details = (html.match(/<details class="adwrks-faq-item"/g) || []).length;
  if (leadIdx === -1 || faqIdx === -1 || leadIdx >= faqIdx) {
    console.error("FAIL lead/faq", path);
    failed++;
  }
  if (details < 3) {
    console.error("FAIL faq count", path, details);
    failed++;
  }
  const dup = headings.filter((h) => /^(סיכום|לסיכום|Summary:)/i.test(h.text.trim()));
  if (dup.length > 1) {
    console.error("FAIL dup summary", path, dup);
    failed++;
  }
  const dates = resolveArticleDates(c, locale);
  if (!dates.dateModified?.includes(datePrefix)) {
    console.error("FAIL dateModified", path, dates.dateModified);
    failed++;
  }
  if (!html.includes("article-inline-cta-block") && !/#|data-open-contextual-popup/.test(html)) {
    console.warn("WARN no inline CTA wrap", path);
  }
  console.log("OK", path, "faq", details);
}

for (const p of BATCH6_HE) check(p, "he");
for (const p of BATCH7_EN) check(p, "en");

process.exit(failed ? 1 : 0);