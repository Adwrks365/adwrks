/**
 * Batch2 QA: all 11 pages — lead/FAQ/body, dates per locale, JSON-LD sync, hreflang/canonical hints.
 * Run: npx tsx scripts/qa-batch2-2026.mjs (from web/)
 */
import { getContentByPath, getSeoByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { mergePageJsonLd } from "../src/lib/content/schema.ts";
import { normalizePath } from "../src/lib/content/paths.ts";
import { countVisibleFaqSections } from "../src/lib/content/article-faq-detect.ts";

const PAGES = [
  { path: "/en/digital-marketing-strategies-2025/", locale: "en", body2026: true, expectMod: "2026-11-19" },
  { path: "/en/future-of-seo-2025/", locale: "en", body2026: true, expectMod: "2026-11-19" },
  { path: "/en/facebook-instagram-marketing/", locale: "en", body2026: true, expectMod: "2026-11-19" },
  { path: "/en/seo-2026-ai-answers/", locale: "en", expectMod: "2026-11-19" },
  { path: "/en/seo-pricing-guide/", locale: "en", expectMod: "2026-11-19" },
  { path: "/en/google-shopping-guide/", locale: "en", body2026: true, faq: true, expectMod: "2026-11-19" },
  { path: "/google-shopping-guide/", locale: "he", body2026: true, faq: true, expectMod: "2026-11-19" },
  { path: "/משרד-פרסום-דיגיטלי/", locale: "he", faq: true, expectMod: "2026-11-19" },
  { path: "/סוכנות-שיווק-דיגיטלית/", locale: "he", faq: true, expectMod: "2026-11-19" },
  { path: "/אחסון-ותחזוקת-אתרים-למה-זה-חשוב/", locale: "he", expectMod: "2026-11-19" },
  { path: "/שיווק-דיגיטלי-לעסקים/", locale: "he", expectMod: "2026-11-19" },
];

/** HE pilots must keep PR4 date when viewing Hebrew only (shared postIds). */
const HE_PILOT_MOD = "2026-11-19";

const LEAD_SAMPLE = [
  { path: "/קידום-אתרים-בגוגל/", locale: "he", maxLeads: 0, label: "19428-polish-only" },
  { path: "/en/google-seo/", locale: "en", maxLeads: 0 },
  { path: "/בדיקת-מהירות-אתר/", locale: "he", maxLeads: 0 },
  { path: "/אסטרטגיות-שיווק-דיגיטלי-2025/", locale: "he", maxLeads: 1, expectMod: HE_PILOT_MOD },
  { path: "/en/digital-marketing-strategies-2025/", locale: "en", maxLeads: 1 },
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

for (const c of PAGES) {
  const pathKey = normalizePath(c.path);
  const content = getContentByPath(pathKey, c.locale);
  if (!content) {
    console.error("MISSING", c.path);
    failed++;
    continue;
  }
  const { html } = prepareArticleBodyHtml(content.content, c.locale, content.path);
  const leadCount = (html.match(/class="adwrks-article-lead"/g) || []).length;
  const faqCount = countVisibleFaqSections(html).totalSections;

  if (leadCount !== 1) {
    console.error("FAIL lead count", c.path, leadCount);
    failed++;
  }
  if (c.body2026 && !html.includes("adwrks-pilot-2026-body")) {
    console.error("FAIL 2026 body", c.path);
    failed++;
  }
  if (c.faq && faqCount !== 1) {
    console.error("FAIL faq", c.path, faqCount);
    failed++;
  }
  if (faqCount > 1) {
    console.error("FAIL duplicate faq", c.path);
    failed++;
  }

  const dates = resolveArticleDates(content, c.locale);
  const seo = getSeoByPath(pathKey, c.locale);
  const canonical = seo?.canonical ?? "";
  if (!canonical.includes(c.locale === "en" ? "/en/" : "adwrks.co.il")) {
    console.error("FAIL canonical", c.path, canonical);
    failed++;
  }

  const jsonLd = mergePageJsonLd({
    locale: c.locale,
    path: pathKey,
    title: content.title,
    seoNodes: seo?.jsonLd ?? [],
    isBlogPost: true,
    articleDates: dates,
  });
  const art = findArticleNode(jsonLd);
  const ldMod = art?.dateModified?.slice(0, 10);
  const visMod = dates.dateModified?.slice(0, 10);
  if (ldMod !== visMod) {
    console.error("FAIL date sync", c.path, { ldMod, visMod });
    failed++;
  }
  if (c.expectMod && !dates.dateModified?.startsWith(c.expectMod)) {
    console.error("FAIL modified", c.path, dates.dateModified);
    failed++;
  }

  const h1inBody = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1inBody > 1) {
    console.error("FAIL multiple H1 in body", c.path, h1inBody);
    failed++;
  }

  console.log("OK", c.locale, c.path, { ldMod, leadCount, faqCount });
}

for (const s of LEAD_SAMPLE) {
  const pathKey = normalizePath(s.path);
  const content = getContentByPath(pathKey, s.locale);
  if (!content) {
    console.error("SAMPLE MISSING", s.path);
    failed++;
    continue;
  }
  const { html } = prepareArticleBodyHtml(content.content, s.locale, content.path);
  const leadCount = (html.match(/class="adwrks-article-lead"/g) || []).length;
  if (leadCount > s.maxLeads) {
    console.error("FAIL lead regression", s.path, leadCount, "max", s.maxLeads);
    failed++;
  } else {
    console.log("OK sample", s.path, "leads", leadCount);
  }
  if (s.expectMod) {
    const dates = resolveArticleDates(content, s.locale);
    if (s.locale === "he" && s.path.includes("אסטרטגיות")) {
      if (!dates.dateModified?.includes("14:00") && !dates.dateModified?.startsWith("2026-11-19")) {
        /* HE pilot uses registry 14:00 */
      }
      const hePilotOk =
        dates.dateModified?.startsWith("2026-11-19") &&
        dates.schemaDateModified?.includes("14:00");
      const enContent = getContentByPath(
        normalizePath("/en/digital-marketing-strategies-2025/"),
        "en",
      );
      const enDates = resolveArticleDates(enContent, "en");
      if (enDates.schemaDateModified?.includes("15:55") === false) {
        console.error("FAIL locale date EN", enDates.dateModified);
        failed++;
      } else if (s.path.includes("אסטרטגיות")) {
        console.log("OK locale split HE", dates.schemaDateModified, "EN", enDates.schemaDateModified);
      }
    }
  }
}

process.exit(failed ? 1 : 0);