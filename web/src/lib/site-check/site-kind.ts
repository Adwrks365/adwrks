import { isProductLikePage, isStoreCategoryPage } from "./content-url";
import type { ParsedLink, ParsedPage } from "./types";

export type SiteKind = "landing" | "store" | "service" | "general";

export function detectSiteKindFromSignals(input: {
  entryIsHome: boolean;
  entryParsed: ParsedPage | null;
  homeParsed: ParsedPage | null;
  innerLinkCount: number;
}): SiteKind {
  const { entryParsed, homeParsed, entryIsHome, innerLinkCount } = input;
  const page = entryParsed ?? homeParsed;
  if (!page) return "general";

  const htmlSignals = `${page.title} ${page.links.map((l) => `${l.text} ${l.href}`).join(" ")}`;
  const linkStoreHits = page.links.filter(
    (l) => isProductLikePage(l.href, l.text) || isStoreCategoryPage(l.href),
  ).length;
  const storeHits =
    linkStoreHits +
    (/\/cart|woocommerce|add-to-cart|הוסף\s+לסל/i.test(htmlSignals) ? 2 : 0);

  if (storeHits >= 2) return "store";

  const serviceHits =
    (/(?:service|שירות|solution|פתרון|saas|platform|software|דמו|demo|trial|pricing|מחירון)/i.test(htmlSignals)
      ? 1
      : 0) + (page.hasForm ? 1 : 0);

  const navCount = page.navLinks.length;
  const isLikelyLanding =
    (!entryIsHome && navCount <= 2) ||
    (entryIsHome && navCount <= 1 && innerLinkCount <= 4) ||
    /landing|עמוד[\s-]*נחיתה|lp\//i.test(htmlSignals);

  if (isLikelyLanding) return "landing";
  if (serviceHits >= 2) return "service";
  if (storeHits >= 1) return "store";
  return "general";
}

export function scoreLinkForSiteKind(
  link: ParsedLink,
  homeUrl: string,
  baseScore: number,
  siteKind: SiteKind,
): number {
  if (baseScore < 0) return baseScore;
  let score = baseScore;
  const blob = `${link.href} ${link.text}`;
  if (siteKind === "store") {
    if (isProductLikePage(link.href, link.text)) score += 10;
    if (isStoreCategoryPage(link.href)) score += 8;
    if (/\/cart|checkout|account/i.test(link.href)) score -= 20;
  }
  if (siteKind === "landing") {
    if (link.inNav) score -= 3;
    if (/(?:#|cta|הירשמו|התחילו|buy|order|הזמינו)/i.test(blob)) score += 6;
  }
  if (siteKind === "service") {
    if (/(?:demo|trial|הרשמה|יצירת[\s-]*קשר|contact|pricing|מחירון)/i.test(blob)) score += 5;
  }
  if (siteKind === "general") return score;
  return score;
}