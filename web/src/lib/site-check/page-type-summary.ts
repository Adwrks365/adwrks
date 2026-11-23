import { isProductLikePage, isStoreCategoryPage } from "./content-url";
import type { AnalyzablePage } from "./findings";
import type { SiteKind } from "./site-kind";
import type { SiteCheckLocale } from "./types";

export type PageTypeCounts = {
  home: number;
  product: number;
  category: number;
  contact: number;
  service: number;
  other: number;
};

export function countPageTypes(pages: readonly AnalyzablePage[]): PageTypeCounts {
  const counts: PageTypeCounts = {
    home: 0,
    product: 0,
    category: 0,
    contact: 0,
    service: 0,
    other: 0,
  };
  for (const page of pages.filter((row) => row.readable)) {
    if (page.role === "home") {
      counts.home += 1;
      continue;
    }
    const blob = `${page.url} ${page.label}`;
    if (isProductLikePage(page.url, page.label)) {
      counts.product += 1;
    } else if (isStoreCategoryPage(page.url)) {
      counts.category += 1;
    } else if (/\/contact|יצירת[\s-]*קשר|צור[\s-]*קשר/i.test(blob)) {
      counts.contact += 1;
    } else if (page.intent?.service || /שירות|service|pricing|מחירון/i.test(blob)) {
      counts.service += 1;
    } else {
      counts.other += 1;
    }
  }
  return counts;
}

export function formatPageTypeSummary(
  locale: SiteCheckLocale,
  siteKind: SiteKind,
  counts: PageTypeCounts,
): string {
  const parts: string[] = [];

  if (locale === "en") {
    if (counts.home) parts.push(counts.home === 1 ? "homepage" : `${counts.home} homepages`);
    if (siteKind === "store") {
      if (counts.category) parts.push(`${counts.category} categor${counts.category === 1 ? "y" : "ies"}`);
      if (counts.product) parts.push(`${counts.product} product page${counts.product === 1 ? "" : "s"}`);
    }
    if (counts.service) parts.push(`${counts.service} service page${counts.service === 1 ? "" : "s"}`);
    if (counts.contact) parts.push(`${counts.contact} contact page${counts.contact === 1 ? "" : "s"}`);
    if (counts.other) parts.push(`${counts.other} other page${counts.other === 1 ? "" : "s"}`);
    return parts.length
      ? `Among the pages we opened: ${parts.join(", ")}.`
      : "We opened the pages listed below.";
  }

  if (counts.home) parts.push(counts.home === 1 ? "דף הבית" : `${counts.home} עמודי בית`);
  if (siteKind === "store") {
    if (counts.category) parts.push(`${counts.category} עמודי קטגוריה`);
    if (counts.product) parts.push(`${counts.product} עמודי מוצר`);
  }
  if (counts.service) parts.push(`${counts.service} עמודי שירות`);
  if (counts.contact) parts.push(`${counts.contact} עמודי יצירת קשר`);
  if (counts.other) parts.push(`${counts.other} עמודים נוספים`);

  return parts.length
    ? `בין העמודים שנפתחו: ${parts.join(", ")}.`
    : "נפתחו העמודים המפורטים למטה.";
}

export type StorePageAudit = {
  productsScanned: number;
  categoriesScanned: number;
  productsWithPurchaseCta: number;
  productsMissingH1: number;
  categoriesMissingH1: number;
  productsSparseNav: number;
  categoriesSparseNav: number;
  productExampleUrl?: string;
  categoryExampleUrl?: string;
};

export function auditStorePages(pages: readonly AnalyzablePage[]): StorePageAudit {
  const products = pages.filter((p) => p.readable && isProductLikePage(p.url, p.label));
  const categories = pages.filter((p) => p.readable && isStoreCategoryPage(p.url));
  const navLinksCount = (page: AnalyzablePage) =>
    page.parsed.navLinks.length + page.parsed.links.filter((l) => l.inNav).length;
  return {
    productsScanned: products.length,
    categoriesScanned: categories.length,
    productsWithPurchaseCta: products.filter((p) => p.parsed.hasPurchaseCta).length,
    productsMissingH1: products.filter((p) => p.parsed.h1.length === 0).length,
    categoriesMissingH1: categories.filter((p) => p.parsed.h1.length === 0).length,
    productsSparseNav: products.filter((p) => navLinksCount(p) < 2).length,
    categoriesSparseNav: categories.filter((p) => navLinksCount(p) < 2).length,
    productExampleUrl: products[0]?.url,
    categoryExampleUrl: categories[0]?.url,
  };
}

export function storeAuditLines(locale: SiteCheckLocale, audit: StorePageAudit): string[] {
  if (audit.productsScanned === 0 && audit.categoriesScanned === 0) return [];

  const lines: string[] = [];
  if (locale === "en") {
    if (audit.productsScanned > 0) {
      lines.push(
        `Products (${audit.productsScanned} opened): ${audit.productsWithPurchaseCta} with a clear purchase/add-to-cart action; ${audit.productsMissingH1} without H1 in HTML; ${audit.productsSparseNav} with sparse menu/internal navigation.`,
      );
    }
    if (audit.categoriesScanned > 0) {
      lines.push(
        `Categories (${audit.categoriesScanned} opened): ${audit.categoriesMissingH1} without H1 in HTML; ${audit.categoriesSparseNav} with sparse menu/internal navigation.`,
      );
    }
    return lines;
  }

  if (audit.productsScanned > 0) {
    lines.push(
      `עמודי מוצר (${audit.productsScanned} שנפתחו): ב־${audit.productsWithPurchaseCta} יש כפתור רכישה/הוספה לסל ברור; ב־${audit.productsMissingH1} לא נמצאה H1 ב-HTML; ב־${audit.productsSparseNav} מעט קישורי תפריט/ניווט פנימי.`,
    );
  }
  if (audit.categoriesScanned > 0) {
    lines.push(
      `עמודי קטגוריה (${audit.categoriesScanned} שנפתחו): ב־${audit.categoriesMissingH1} לא נמצאה H1 ב-HTML; ב־${audit.categoriesSparseNav} מעט קישורי תפריט/ניווט פנימי.`,
    );
  }
  return lines;
}