import { hasVisitorContactPath } from "./contact-signals";
import { groupSeoField, isSeoAuditPage, type AnalyzablePage } from "./findings";
import type { ImageProbeStats, SiteCheckAuditMetric, SiteCheckAuditScore, StoreSnapshot } from "./types";

export function buildAuditScore(input: {
  pages: AnalyzablePage[];
  linksVerifiedOk: number;
  brokenLinksVerified: number;
  images: ImageProbeStats;
  store: StoreSnapshot | null;
}): SiteCheckAuditScore | null {
  const pages = input.pages.filter(isSeoAuditPage);
  if (pages.length === 0) return null;

  const metrics: SiteCheckAuditMetric[] = [
    { id: "title", passed: groupSeoField(pages, "title").filter((group) => group.length === 1).length, verified: pages.length },
    { id: "description", passed: groupSeoField(pages, "metaDescription").filter((group) => group.length === 1).length, verified: pages.length },
    { id: "h1", passed: pages.filter((page) => page.parsed.h1.length > 0).length, verified: pages.length },
    { id: "indexing", passed: pages.filter((page) => !/\bnoindex\b/i.test(`${page.parsed.robots} ${page.headerRobots}`)).length, verified: pages.length },
  ];

  const linksVerified = input.linksVerifiedOk + input.brokenLinksVerified;
  if (linksVerified > 0) metrics.push({ id: "links", passed: input.linksVerifiedOk, verified: linksVerified });

  const imagesVerified = input.images.loadedOk + input.images.broken;
  if (imagesVerified > 0) metrics.push({ id: "images", passed: input.images.loadedOk, verified: imagesVerified });

  if (input.store) {
    const { productsScanned, productsWithPurchaseCta } = input.store;
    if (productsScanned > 0) metrics.push({ id: "purchase", passed: productsWithPurchaseCta, verified: productsScanned });
  } else {
    const keyPages = pages.filter((page) => page.role === "home" || page.isEntry || page.intent?.contact);
    if (keyPages.length > 0) {
      const passed = keyPages.filter((page) => hasVisitorContactPath(page.parsed)).length;
      metrics.push({ id: "contact", passed, verified: keyPages.length });
    }
  }

  const result = metrics.reduce((sum, metric) => sum + metric.passed / metric.verified, 0);
  return { score: Math.round(100 * result / metrics.length), metrics };
}
