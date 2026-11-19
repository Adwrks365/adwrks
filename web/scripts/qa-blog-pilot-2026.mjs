/**
 * QA pilot article enrichment (lead/FAQ) + date sync for 5 Hebrew posts.
 * Run: npx tsx scripts/qa-blog-pilot-2026.mjs (from web/)
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { mergePageJsonLd } from "../src/lib/content/schema.ts";
import { getSeoByPath } from "../src/lib/content/loader.ts";
import { normalizePath } from "../src/lib/content/paths.ts";

const PILOT = [
  {
    key: "strategies",
    path: "/אסטרטגיות-שיווק-דיגיטלי-2025/",
    expectLead: true,
    expectFaq: false,
    expectBody2026: true,
  },
  {
    key: "seo-future",
    path: "/עתיד-ה-seo-כך-ייראה-הקידום-האורגני-ב-2025-ומעב/",
    expectLead: true,
    expectFaq: false,
    expectBody2026: true,
  },
  { key: "seo-ai", path: "/seo-2026-ai-answers/", expectLead: true, expectFaq: false },
  { key: "seo-price", path: "/מחיר-קידום-אתרים/", expectLead: true, expectFaq: false },
  {
    key: "meta",
    path: "/שיווק-בפייסבוק-ואינסטגרם/",
    expectLead: true,
    expectFaq: false,
    expectBody2026: true,
  },
];

function findArticleNode(blocks) {
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    const graph = block["@graph"];
    if (Array.isArray(graph)) {
      for (const node of graph) {
        const t = node?.["@type"];
        const types = Array.isArray(t) ? t : t ? [t] : [];
        if (types.some((x) => x === "BlogPosting" || x === "Article")) return node;
      }
    }
  }
  return null;
}

let failed = 0;
for (const c of PILOT) {
  const pathKey = normalizePath(c.path);
  const content = getContentByPath(pathKey, "he");
  if (!content) {
    console.error("MISSING", c.key, pathKey);
    failed++;
    continue;
  }
  const { html } = prepareArticleBodyHtml(content.content, "he", content.path);
  const hasLead = /adwrks-article-lead/.test(html);
  const faqBlocks = (html.match(/adwrks-article-faq-2026/g) || []).length;
  const hasLegacyFaq = /(שאלות נפוצות|שאלות ותשובות)/i.test(html);
  const hasFaq = faqBlocks > 0 || hasLegacyFaq;

  if (c.expectLead && !hasLead) {
    console.error("FAIL lead", c.key);
    failed++;
  }
  if (c.expectFaq && !hasFaq) {
    console.error("FAIL faq", c.key);
    failed++;
  }
  if (faqBlocks > 1) {
    console.error("FAIL duplicate pilot faq", c.key, faqBlocks);
    failed++;
  }
  if (c.expectBody2026 && !html.includes("adwrks-pilot-2026-body")) {
    console.error("FAIL missing 2026 body patch", c.key);
    failed++;
  }

  const dates = resolveArticleDates(content);
  const seo = getSeoByPath(pathKey, "he");
  const jsonLd = mergePageJsonLd({
    locale: "he",
    path: pathKey,
    title: content.title,
    seoNodes: seo?.jsonLd ?? [],
    isBlogPost: true,
    articleDates: dates,
  });
  const article = findArticleNode(jsonLd);
  const ldMod = article?.dateModified?.slice(0, 10);
  const visMod = dates.dateModified?.slice(0, 10);
  if (ldMod !== visMod) {
    console.error("FAIL date sync", c.key, { ldMod, visMod });
    failed++;
  }
  if (!dates.dateModified?.startsWith("2026-11-19")) {
    console.error("FAIL expected modified 2026-11-19", c.key, dates.dateModified);
    failed++;
  }
  if (!dates.showUpdated) {
    console.error("FAIL showUpdated", c.key);
    failed++;
  }

  console.log("OK", c.key, {
    hasLead,
    faqBlocks,
    hasLegacyFaq,
    modified: dates.dateModified,
    showUpdated: dates.showUpdated,
  });
}

if (failed) {
  console.error("QA failed:", failed);
  process.exit(1);
}
console.log("All pilot QA checks passed.");