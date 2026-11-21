/**
 * QA — final blog rollout (52 posts) + batch8/9 regression hooks.
 * npx tsx scripts/qa-blog-final-rollout.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { getArticleEnrichmentSource } from "../src/lib/content/article-enrichment-registry.ts";
import { countTagBalance } from "../src/lib/content/article-html-sanitize.ts";
import { FINAL_ROLLOUT_PATHS } from "../src/lib/content/article-final-rollout-enrichment-2026.ts";
import { buildFinalRolloutQueue } from "./lib/final-rollout-queue.mjs";

const queue = buildFinalRolloutQueue();

const INTERACTIVE_PATHS = new Set([
  "/בדיקת-מהירות-אתר/",
  "/en/website-speed-test/",
  "/שיפור-מהירות-אתר-2026-pagespeed/",
  "/en/website-speed-optimization-2026-pagespeed/",
  "/מחשבון-roi-מעודכן-2026/",
  "/en/roi-calculator-2026/",
  "/כמה-עולה-לבנות-אתר-מחירון-מחשבון/",
  "/en/website-building-pricing/",
  "/en/wordpress-website-cost/",
]);

let failed = 0;
const CLOCK_SKEW_MS = 3 * 60 * 1000;

function parseIso(s) {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

for (const articlePath of FINAL_ROLLOUT_PATHS) {
  const locale = articlePath.startsWith("/en/") ? "en" : "he";
  const row = queue.find((q) => q.path === articlePath && q.locale === locale);
  const c = getContentByPath(articlePath, locale);
  if (!c) {
    console.error("FAIL missing", articlePath);
    failed++;
    continue;
  }
  const source = getArticleEnrichmentSource(articlePath, locale);
  if (source !== "final-rollout-2026") {
    console.error("FAIL registry", articlePath, source);
    failed++;
  }
  const baseline = prepareArticleBodyHtml(c.content, locale, articlePath, {
    skipFinalRollout: true,
    skipBatch9: true,
    skipBatch8: true,
  });
  const { html, headings } = prepareArticleBodyHtml(c.content, locale, articlePath);

  if (!html.includes("adwrks-article-lead-2026")) {
    console.error("FAIL lead", articlePath);
    failed++;
  }

  const adwrksFaq = (html.match(/adwrks-faq-item/g) || []).length;
  const anyFaq = (html.match(/<details[\s>]/gi) || []).length;
  const needsFaq = row?.status === "needs-content";
  const faqCount = Math.max(adwrksFaq, anyFaq);
  if (needsFaq && faqCount < 3) {
    console.error("FAIL faq count", articlePath, faqCount);
    failed++;
  }
  if (!needsFaq && faqCount < 1) {
    console.error("FAIL faq missing entirely", articlePath);
    failed++;
  }

  const summaryHeads = headings.filter((h) =>
    /^(סיכום|לסיכום|summary|in summary)$/i.test(h.text.trim()),
  );
  if (summaryHeads.length > 1) {
    console.error("FAIL dup summary headings", articlePath, summaryHeads.map((h) => h.text));
    failed++;
  }

  const bal = countTagBalance(html);
  if (Math.abs(bal.div) > 14 || Math.abs(bal.section) > 10) {
    console.error("FAIL tag imbalance", articlePath, bal);
    failed++;
  }

  if (baseline.html.length > 500 && html.length < baseline.html.length * 0.45) {
    console.error("FAIL mass drop", articlePath, baseline.html.length, html.length);
    failed++;
  }

  const dates = resolveArticleDates(c, locale);
  const published = parseIso(dates.datePublished);
  const modified = parseIso(dates.dateModified);
  if (modified && published && modified < published) {
    console.error("FAIL date order", articlePath, dates);
    failed++;
  }
  if (modified && modified.getTime() > Date.now() + CLOCK_SKEW_MS) {
    console.error("FAIL future modified", articlePath, dates.dateModified);
    failed++;
  }

  if (INTERACTIVE_PATHS.has(articlePath)) {
    const slot =
      html.includes("adwrks-pagespeed-insights") ||
      html.includes("adwrks-roi-calculator") ||
      html.includes("PRICING_CALCULATOR") ||
      html.includes("pricing-calculator");
    if (!slot && !html.includes("elementor")) {
      console.error("FAIL interactive embed missing", articlePath);
      failed++;
    }
  }

  console.log("OK", articlePath, { faq: faqCount, modified: dates.dateModified?.slice(0, 10) });
}

// Batch9 summary regression (included in final PR; supersedes open PR #19)
for (const p of [
  "/en/digital-marketing-agency-maximize/",
  "/en/google-business-promotion-guide/",
]) {
  const c = getContentByPath(p, "en");
  const { headings } = prepareArticleBodyHtml(c.content, "en", p);
  const bad = headings.filter((h) => /^summary$/i.test(h.text.trim()));
  const hasIn = headings.some((h) => /^in summary$/i.test(h.text.trim()));
  if (bad.length && hasIn) {
    console.error("FAIL batch9 summary dup", p);
    failed++;
  } else {
    console.log("OK batch9 summary", p);
  }
}

process.exit(failed ? 1 : 0);