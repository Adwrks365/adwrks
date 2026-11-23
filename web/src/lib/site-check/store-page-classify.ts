import { isProductLikePage, isStoreCategoryPage } from "./content-url";
import type { AnalyzablePage } from "./findings";
import type { ParsedPage } from "./types";
import { canonicalScanUrl } from "./url-canonical";

export type CommercePageKind = "product" | "category";

const NUMERIC_CATALOG_PATH = /\/\d{4,}-[^/]+\/?$/i;

export function isStoreProductUrl(url: string): boolean {
  if (isProductLikePage(url)) return true;
  try {
    return /\/items\/\d+/i.test(new URL(url).pathname);
  } catch {
    return /\/items\/\d+/i.test(url);
  }
}

export function isStoreCategoryUrl(url: string): boolean {
  if (isStoreCategoryPage(url)) return true;
  try {
    const path = new URL(url).pathname;
    return NUMERIC_CATALOG_PATH.test(path) && !/\/items\//i.test(path);
  } catch {
    return NUMERIC_CATALOG_PATH.test(url) && !/\/items\//i.test(url);
  }
}

function countDistinctCatalogLinks(parsed: ParsedPage): number {
  const seen = new Set<string>();
  let count = 0;
  for (const link of parsed.links) {
    const canonical = canonicalScanUrl(link.href);
    if (!canonical) continue;
    if (!isStoreCategoryUrl(canonical) && !isStoreProductUrl(canonical)) continue;
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    count += 1;
  }
  return count;
}

function countItemProductLinks(parsed: ParsedPage): number {
  const seen = new Set<string>();
  let count = 0;
  for (const link of parsed.links) {
    if (!/\/items\/\d+/i.test(link.href)) continue;
    const canonical = canonicalScanUrl(link.href);
    if (!canonical || seen.has(canonical)) continue;
    seen.add(canonical);
    count += 1;
  }
  return count;
}

/** Classify a commerce page after HTML is available (overrides URL-only heuristics). */
const NON_CATALOG_PATH =
  /\/(?:contact|about|customer(?:[_\-/]|$)|location|contract|privacy|policy|login|signup)(?:\/|$)/i;

export function classifyCommercePage(input: {
  html: string;
  url: string;
  parsed: ParsedPage;
}): CommercePageKind | null {
  const { html, url, parsed } = input;
  if (parsed.visibleTextLength < 120) return null;
  if (NON_CATALOG_PATH.test(url)) return null;

  if (
    /"@type"\s*:\s*"Product"/i.test(html) ||
    /itemtype\s*=\s*["']https?:\/\/schema\.org\/Product/i.test(html) ||
    /property=["']og:type["'][^>]*content=["']product/i.test(html)
  ) {
    return "product";
  }

  if (isStoreProductUrl(url)) return "product";

  const priceCount = (html.match(/₪/g) ?? []).length;
  const listingLinks = countDistinctCatalogLinks(parsed);
  const itemLinks = countItemProductLinks(parsed);
  const hasGrid = /product-list|catalog-product|grid-row|products-wrapper|woocommerce-loop|קטלוג|cat-list/i.test(
    html,
  );

  if (isStoreCategoryUrl(url)) {
    if (itemLinks >= 3 || listingLinks >= 4 || (hasGrid && priceCount >= 10)) return "category";
    if (parsed.h1.length >= 1 && priceCount >= 8) return "category";
  }

  if (itemLinks >= 3 || (hasGrid && priceCount >= 12) || listingLinks >= 6) return "category";

  if (parsed.hasPurchaseCta && parsed.h1.length <= 1 && itemLinks === 0 && listingLinks <= 2 && priceCount <= 12) {
    return "product";
  }

  if (/\/מוצרים\b|קטלוג|catalog/i.test(`${parsed.title} ${url}`) && priceCount >= 6) return "category";

  return null;
}

export function attachCommerceKind(page: AnalyzablePage, html: string): AnalyzablePage {
  if (page.role === "home") return page;
  const kind = classifyCommercePage({ html, url: page.url, parsed: page.parsed });
  if (!kind) return page;
  return { ...page, commerceKind: kind };
}

export function commercePages(
  pages: readonly AnalyzablePage[],
  kind: CommercePageKind,
): AnalyzablePage[] {
  return pages.filter((p) => p.readable && p.commerceKind === kind);
}

export function extractItemProductUrls(html: string, baseUrl: string, parsed: ParsedPage, limit = 12): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const link of parsed.links) {
    if (!/\/items\/\d+/i.test(link.href)) continue;
    const canonical = canonicalScanUrl(link.href);
    if (!canonical || seen.has(canonical)) continue;
    if (!sameHost(canonical, baseUrl)) continue;
    seen.add(canonical);
    out.push(canonical);
    if (out.length >= limit) break;
  }
  // Fallback: raw regex in HTML when anchors are built late
  if (out.length < limit) {
    const re = /href\s*=\s*["']([^"']*\/items\/\d+[^"']*)["']/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(html)) && out.length < limit) {
      try {
        const absolute = new URL(match[1]!, baseUrl).toString();
        const canonical = canonicalScanUrl(absolute);
        if (!canonical || seen.has(canonical) || !sameHost(canonical, baseUrl)) continue;
        seen.add(canonical);
        out.push(canonical);
      } catch {
        /* skip */
      }
    }
  }
  return out;
}

function sameHost(a: string, b: string): boolean {
  try {
    return new URL(a).hostname.replace(/^www\./, "") === new URL(b).hostname.replace(/^www\./, "");
  } catch {
    return false;
  }
}