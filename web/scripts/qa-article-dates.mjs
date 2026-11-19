/**
 * QA article published/modified dates vs revision registry and JSON-LD sync.
 * Run: npx tsx scripts/qa-article-dates.mjs (from web/)
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { mergePageJsonLd } from "../src/lib/content/schema.ts";
import { getSeoByPath } from "../src/lib/content/loader.ts";
import { normalizePath } from "../src/lib/content/paths.ts";

const CASES = [
  {
    key: "google-seo-he",
    path: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/",
    locale: "he",
    expectUpdated: true,
    expectModifiedPrefix: "2026-11-19",
    expectPublishedPrefix: "2023-10",
  },
  {
    key: "ru-ad-he",
    path: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%91%d7%a9%d7%a4%d7%94-%d7%94%d7%a8%d7%95%d7%a1%d7%99%d7%aa/",
    locale: "he",
    expectUpdated: true,
    expectModifiedPrefix: "2026-11-19",
    expectPublishedPrefix: "2024-08",
  },
  {
    key: "speed-he",
    path: "/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/",
    locale: "he",
    expectUpdated: true,
    expectModifiedPrefix: "2026-11-19",
    expectPublishedPrefix: "2026-09",
  },
  {
    key: "ru-build-he",
    path: "/%d7%91%d7%a0%d7%99%d7%99%d7%aa-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/",
    locale: "he",
    expectUpdated: false,
    expectModifiedPrefix: "2026-11-15",
    expectPublishedPrefix: "2026-11-15",
  },
  {
    key: "google-seo-en",
    path: "/en/google-seo/",
    locale: "en",
    expectUpdated: true,
    expectModifiedPrefix: "2026-11-19",
    expectPublishedPrefix: "2023-10",
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
for (const c of CASES) {
  const pathKey = normalizePath(c.path);
  const content = getContentByPath(pathKey, c.locale);
  if (!content) {
    console.error("MISSING", c.key, pathKey);
    failed++;
    continue;
  }
  const dates = resolveArticleDates(content);
  const seo = getSeoByPath(pathKey, c.locale);
  const jsonLd = mergePageJsonLd({
    locale: c.locale,
    path: pathKey,
    title: content.title,
    seoNodes: seo?.jsonLd ?? [],
    isBlogPost: true,
    articleDates: dates,
  });
  const art = findArticleNode(jsonLd);
  const okShow = dates.showUpdated === c.expectUpdated;
  const okMod = dates.dateModified?.startsWith(c.expectModifiedPrefix);
  const okPub = dates.datePublished?.startsWith(c.expectPublishedPrefix);
  const okLd = art
    ? art.dateModified?.startsWith(c.expectModifiedPrefix) &&
      art.datePublished?.startsWith(c.expectPublishedPrefix.slice(0, 7))
    : !c.expectUpdated;

  if (!okShow || !okMod || !okPub || !okLd) {
    console.error("FAIL", c.key, { okShow, okMod, okPub, okLd, dates, ld: art });
    failed++;
  } else {
    console.log(
      "OK",
      c.key,
      "pub",
      dates.datePublished?.slice(0, 10),
      "mod",
      dates.dateModified?.slice(0, 10),
      "showUpdated",
      dates.showUpdated,
    );
  }
}

process.exit(failed ? 1 : 0);