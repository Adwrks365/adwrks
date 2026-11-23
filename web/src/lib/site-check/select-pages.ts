import { isContentScanUrl } from "./content-url";
import { scoreLinkForSiteKind, type SiteKind } from "./site-kind";
import { isStoreCategoryUrl, isStoreProductUrl } from "./store-page-classify";
import { canonicalScanUrl } from "./url-canonical";

const STORE_RESERVED_CATEGORIES = 8;
const STORE_RESERVED_PRODUCTS = 6;

const SKIP_PATH =
  /\/(wp-admin|wp-login\.php|wp-json|xmlrpc\.php|feed|cart|checkout|my-account|customer\/account|tag|author|cdn-cgi)(\/|$)/i;
const SKIP_EXT = /\.(pdf|jpe?g|png|gif|webp|svg|zip|mp4|mp3|css|js|xml)\/?$/i;

function hostKey(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function samePage(a: string, b: string): boolean {
  const left = canonicalScanUrl(a);
  const right = canonicalScanUrl(b);
  if (!left || !right) return false;
  return left === right;
}

function isContact(blob: string): boolean {
  return /contact|יצירת[\s-]*קשר|צור[\s-]*קשר|צרו[\s-]*קשר|השאירו|get-in-touch/i.test(blob);
}

function isService(blob: string): boolean {
  return /service|שירות|בניית|בנייה|מוצר|product|solution|פתרון|\bseo\b/i.test(blob);
}

function isPricing(blob: string): boolean {
  return /pricing|מחירון|תמחור|price|מחיר/i.test(blob);
}

export function pageIntent(url: string, text = ""): { contact: boolean; service: boolean; pricing: boolean } {
  const blob = `${url} ${text}`;
  return {
    contact: isContact(blob),
    service: isService(blob),
    pricing: isPricing(blob),
  };
}

function scoreLink(link: { href: string; text: string; inNav: boolean }, homeUrl: string): number {
  let url: URL;
  try {
    url = new URL(link.href);
  } catch {
    return -99;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return -99;
  if (hostKey(url.hostname) !== hostKey(new URL(homeUrl).hostname)) return -99;
  if (samePage(url.toString(), homeUrl)) return -99;
  if (SKIP_PATH.test(url.pathname) || SKIP_EXT.test(url.pathname)) return -99;

  const blob = `${url.pathname} ${link.text}`;
  const depth = url.pathname.split("/").filter(Boolean).length;
  let score = link.inNav ? 5 : 1;
  const contact = isContact(blob);
  const service = isService(blob);
  const pricing = isPricing(blob);
  if (contact) score += 8;
  if (service) score += 6;
  if (pricing) score += 7;
  if (/להזמנה|לרכישה|הוספ[\s\S]{0,10}לסל|buy\s+now|add[\s-]*to[\s-]*cart|checkout/i.test(blob)) {
    score += 10;
  }
  if (depth === 1) score += 2;
  if (depth >= 4) score -= 2;
  if (/\/(blog|category|tag|news|מאמרים)(\/|$)/i.test(url.pathname)) score -= 4;
  return score;
}

export function selectInnerPages(
  homeUrl: string,
  links: readonly { href: string; text: string; inNav: boolean }[],
  preferredUrl: string | null,
  limit = 3,
): string[] {
  const maxPages = limit + (preferredUrl && !samePage(preferredUrl, homeUrl) ? 2 : 1);
  return planScanUrls({
    entryUrl: preferredUrl ?? homeUrl,
    homeUrl,
    links,
    sitemapUrls: [],
    maxPages,
  })
    .filter((url) => !samePage(url, homeUrl))
    .slice(0, limit);
}

export function planScanUrls(input: {
  entryUrl: string;
  homeUrl: string;
  links: readonly { href: string; text: string; inNav: boolean }[];
  sitemapUrls: readonly string[];
  maxPages: number;
  siteKind?: SiteKind;
}): string[] {
  const siteKind = input.siteKind ?? "general";
  const cap = siteKind === "landing" ? 3 : 20;
  const maxPages = Math.max(1, Math.min(cap, input.maxPages));
  const entry = canonicalScanUrl(input.entryUrl);
  const home = canonicalScanUrl(input.homeUrl);
  if (!entry || !home) return [];

  const picked: string[] = [];
  const seen = new Set<string>();
  const take = (raw: string) => {
    const canonical = canonicalScanUrl(raw);
    if (!canonical || !isContentScanUrl(canonical) || seen.has(canonical) || picked.length >= maxPages) return;
    seen.add(canonical);
    picked.push(canonical);
  };

  take(entry);
  if (!samePage(entry, home)) take(home);

  const candidates: { href: string; score: number }[] = [];
  for (const link of input.links) {
    let score = scoreLink(link, home);
    if (score < 0) continue;
    score = scoreLinkForSiteKind(link, home, score, siteKind);
    const canonical = canonicalScanUrl(link.href);
    if (!canonical || !isContentScanUrl(canonical)) continue;
    candidates.push({ href: canonical, score });
  }
  for (const href of input.sitemapUrls) {
    const canonical = canonicalScanUrl(href);
    if (!canonical || !isContentScanUrl(canonical)) continue;
  let score = scoreSitemapCandidate(canonical, siteKind);
    candidates.push({ href: canonical, score });
  }

  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  if (siteKind === "store") {
    const tier = (href: string) =>
      isStoreProductUrl(href) ? "product" : isStoreCategoryUrl(href) ? "category" : null;
    const products = sorted.filter((row) => tier(row.href) === "product");
    const categories = sorted.filter((row) => tier(row.href) === "category");
    const rest = sorted.filter((row) => !tier(row.href));
    for (const row of categories.slice(0, STORE_RESERVED_CATEGORIES)) take(row.href);
    for (const row of products.slice(0, STORE_RESERVED_PRODUCTS)) take(row.href);
    for (const row of rest) take(row.href);
    for (const row of sorted) take(row.href); // fill remaining slots; take() skips duplicates
  } else {
    for (const item of sorted) take(item.href);
  }
  return picked;
}

function scoreSitemapCandidate(canonical: string, siteKind: SiteKind): number {
  let score = 2;
  const intent = pageIntent(canonical);
  if (intent.contact) score += 8;
  if (intent.service) score += 6;
  if (intent.pricing) score += 7;
  if (siteKind === "store") {
    if (isStoreProductUrl(canonical)) score += 18;
    else if (isStoreCategoryUrl(canonical)) score += 16;
  } else if (/\/blog|\/tag/i.test(canonical)) {
    score -= 5;
  } else if (/\/category/i.test(canonical) && !/product-category/i.test(canonical)) {
    score -= 5;
  }
  return score;
}

export function pickLinksToProbe(
  homeUrl: string,
  links: readonly { href: string; text: string; inNav: boolean }[],
  limit = 10,
  siteKind: SiteKind = "general",
): string[] {
  const ranked = links
    .map((link) => {
      let score = scoreLink(link, homeUrl);
      score = scoreLinkForSiteKind(link, homeUrl, score, siteKind);
      return { link, score };
    })
    .filter((item) => item.score >= 4)
    .sort((a, b) => b.score - a.score);

  const picked: string[] = [];
  const seen = new Set<string>();
  for (const item of ranked) {
    const canonical = canonicalScanUrl(item.link.href);
    if (!canonical || seen.has(canonical)) continue;
    seen.add(canonical);
    picked.push(canonical);
    if (picked.length >= limit) break;
  }
  return picked;
}