import { isProductLikePage, isStoreCategoryPage } from "./content-url";
import type { AnalyzablePage } from "./findings";
import type { SiteKind } from "./site-kind";

const MAX_HERO_IMAGE_PROBES = 8;
const MAX_IMAGES_PER_PAGE = 2;

export type HeroImageCandidate = {
  imageUrl: string;
  pageUrl: string;
  pageLabel: string;
};

function pageImagePriority(page: AnalyzablePage, siteKind: SiteKind): number {
  let score = 0;
  if (page.role === "home") score += 5;
  if (page.isEntry) score += 6;
  if (siteKind === "store") {
    if (isProductLikePage(page.url, page.label)) score += 14;
    if (isStoreCategoryPage(page.url)) score += 11;
  } else if (siteKind === "service") {
    if (/\/pricing|מחירון|שירות|service/i.test(`${page.url} ${page.label}`)) score += 4;
  }
  return score;
}

/** Up to 8 same-origin hero images from pages we already scanned (store: product/category first). */
export function selectHeroImagesToProbe(
  pages: readonly AnalyzablePage[],
  homeUrl: string,
  siteKind: SiteKind,
  limit = MAX_HERO_IMAGE_PROBES,
): HeroImageCandidate[] {
  let origin: string;
  try {
    origin = new URL(homeUrl).origin;
  } catch {
    return [];
  }

  const readable = pages.filter((page) => page.readable);
  const rankedPages = [...readable].sort(
    (a, b) => pageImagePriority(b, siteKind) - pageImagePriority(a, siteKind),
  );

  const picked: HeroImageCandidate[] = [];
  const seenImages = new Set<string>();

  for (const page of rankedPages) {
    if (picked.length >= limit) break;
    let takenOnPage = 0;
    for (const raw of page.parsed.heroImages) {
      if (picked.length >= limit || takenOnPage >= MAX_IMAGES_PER_PAGE) break;
      let canonical = raw;
      try {
        const parsed = new URL(raw);
        if (parsed.origin !== origin) continue;
        canonical = parsed.toString();
      } catch {
        continue;
      }
      if (seenImages.has(canonical)) continue;
      seenImages.add(canonical);
      picked.push({
        imageUrl: canonical,
        pageUrl: page.url,
        pageLabel: page.label,
      });
      takenOnPage += 1;
    }
  }

  return picked;
}

export { MAX_HERO_IMAGE_PROBES };