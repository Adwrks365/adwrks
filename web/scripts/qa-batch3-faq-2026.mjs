/**
 * Batch3 + FAQ accordion QA (static pipeline).
 * npx tsx scripts/qa-batch3-faq-2026.mjs
 */
import { getContentByPath, getSeoByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { mergePageJsonLd } from "../src/lib/content/schema.ts";
import { normalizePath } from "../src/lib/content/paths.ts";
import {
  countVisibleFaqSections,
  parseInjectedFaqItems,
} from "../src/lib/content/article-faq-detect.ts";

const BATCH3 = [
  "/פרסום-בגוגל-אדס-10-שלבים-פשוטים/",
  "/כמה-עולה-פרסום-בגוגל/",
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/",
  "/פרסום-בגוגל-מפות/",
  "/מה-ההבדל-בין-sem-ל-ppc/",
];

const LEGACY_SAMPLE = [
  { path: "/שיווק-דיגיטלי-לעסקים/", locale: "he", minFaq: 1 },
  { path: "/google-shopping-guide/", locale: "he", minFaq: 1 },
];

const EXCEPTIONS = [
  { path: "/מחשבון-roi-מעודכן-2026/", locale: "he", allowNoAccordion: true },
  { path: "/google-business-profile/", locale: "he", allowNoAccordion: true },
];

function findArticleNode(blocks) {
  for (const block of blocks) {
    const graph = block?.["@graph"];
    if (!Array.isArray(graph)) continue;
    for (const node of graph) {
      const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
      if (types.some((t) => t === "BlogPosting" || t === "Article")) return node;
    }
  }
  return null;
}

let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL", msg);
    failed++;
  } else {
    console.log("OK", msg);
  }
}

for (const path of BATCH3) {
  const pathKey = normalizePath(path);
  const content = getContentByPath(pathKey, "he");
  const { html } = prepareArticleBodyHtml(content.content, "he", pathKey);
  const leads = (html.match(/class="adwrks-article-lead"/g) || []).length;
  const faqSections = countVisibleFaqSections(html).totalSections;
  const hasAccordion = html.includes('class="adwrks-faq-accordion"');
  const orphanFaqH2 = /<h2[^>]*id="שאלות-ותשובות"[^>]*>\s*שאלות ותשובות\s*<\/h2>/i.test(html);
  const details = (html.match(/<details class="adwrks-faq-item"/g) || []).length;
  const answersInHtml = (html.match(/class="adwrks-faq-item__answer"/g) || []).length;

  assert(content, `${path} content`);
  assert(leads === 1, `${path} single lead (${leads})`);
  assert(faqSections <= 1, `${path} faq sections (${faqSections})`);
  assert(!orphanFaqH2, `${path} no orphan שאלות ותשובות h2`);
  if (path.includes("מפות")) {
    assert(html.includes("GL-T8JKm5Zw"), `${path} YouTube preserved`);
  }
  if (details > 0) {
    assert(hasAccordion, `${path} accordion present`);
    assert(details === answersInHtml, `${path} answers in initial HTML`);
  }

  const dates = resolveArticleDates(content, "he");
  assert(dates.dateModified.includes("2026-11-20"), `${path} dateModified ${dates.dateModified}`);

  const seo = getSeoByPath(pathKey, "he");
  const jsonLd = mergePageJsonLd({
    locale: "he",
    path: pathKey,
    title: content.title,
    seoNodes: seo?.jsonLd ?? [],
    isBlogPost: true,
    articleDates: dates,
  });
  const art = findArticleNode(jsonLd);
  assert(art?.dateModified === dates.dateModified, `${path} JSON-LD date sync`);
  assert((seo?.canonical ?? "").includes("adwrks.co.il"), `${path} canonical`);
}

for (const c of LEGACY_SAMPLE) {
  const content = getContentByPath(normalizePath(c.path), c.locale);
  const { html } = prepareArticleBodyHtml(content.content, c.locale, c.path);
  const items = parseInjectedFaqItems(html);
  const legacy = parseInjectedFaqItems(html).length || (html.match(/<details class="adwrks-faq-item"/g) || []).length;
  assert(legacy >= c.minFaq, `${c.path} legacy/injected faq retained (${legacy})`);
  assert(html.includes("adwrks-faq-accordion"), `${c.path} accordion`);
}

for (const c of EXCEPTIONS) {
  const content = getContentByPath(normalizePath(c.path), c.locale);
  const { html } = prepareArticleBodyHtml(content.content, c.locale, c.path);
  const accordion = html.includes("adwrks-faq-accordion");
  if (c.allowNoAccordion) {
    assert(!accordion || countVisibleFaqSections(html).totalSections <= 1, `${c.path} exception stable`);
    console.log("NOTE", c.path, { accordion, faq: countVisibleFaqSections(html) });
  }
}

process.exit(failed ? 1 : 0);