import { isStoreCategoryUrl } from "./store-page-classify";
import type { AnalyzablePage } from "./findings";
import type { SiteKind } from "./site-kind";
import type { SiteCheckLocale, StoreSnapshot } from "./types";

export type PageTypeCounts = {
  home: number;
  product: number;
  category: number;
  contact: number;
  service: number;
  other: number;
};

function pageCommerceKind(page: AnalyzablePage): "product" | "category" | null {
  return page.commerceKind ?? null;
}

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
    const kind = pageCommerceKind(page);
    if (kind === "product") {
      counts.product += 1;
      continue;
    }
    if (kind === "category") {
      counts.category += 1;
      continue;
    }
    const blob = `${page.url} ${page.label}`;
    if (/\/contact|יצירת[\s-]*קשר|צור[\s-]*קשר/i.test(blob)) {
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
  if (counts.service) {
    parts.push(counts.service === 1 ? "עמוד שירות אחד" : `${counts.service} עמודי שירות`);
  }
  if (counts.contact) {
    parts.push(counts.contact === 1 ? "עמוד יצירת קשר אחד" : `${counts.contact} עמודי יצירת קשר`);
  }
  if (counts.other) parts.push(`${counts.other} עמודים נוספים`);

  return parts.length
    ? `בין העמודים שנפתחו: ${parts.join(", ")}.`
    : "נפתחו העמודים המפורטים למטה.";
}

export type StorePageAudit = StoreSnapshot;



export function auditStorePages(pages: readonly AnalyzablePage[], locale: SiteCheckLocale): StorePageAudit {
  const products = pages.filter((p) => p.readable && p.role !== "home" && p.commerceKind === "product");
  const categories = pages.filter((p) => p.readable && p.role !== "home" && p.commerceKind === "category");
  const home = pages.find((p) => p.role === "home" && p.readable);

  const categoryReachableFromNav = home
    ? home.parsed.links.some((link) => {
        const href = link.href;
        return isStoreCategoryUrl(href) || (link.inNav && isStoreCategoryUrl(href));
      }) ||
      home.parsed.links.filter((link) => isStoreCategoryUrl(link.href)).length >= 3
    : null;

  const productReachableFromCategory = categories.length
    ? categories.some((cat) => cat.parsed.links.some((link) => /\/items\/\d+/i.test(link.href)))
    : null;

  let navEvidence: string | null = null;
  if (locale === "he") {
    if (categoryReachableFromNav === true) {
      navEvidence = "מדף הבית נמצאו קישורים לקטגוריות (כולל בתפריט אם סומן ב-HTML).";
    } else if (categoryReachableFromNav === false) {
      navEvidence = "מדף הבית לא אימתנו קישורי קטגוריה ברורים.";
    }
    if (productReachableFromCategory === true) {
      navEvidence = [navEvidence, "מעמודי קטגוריה שנפתחו יש קישורים למוצרים (למשל /items/)."]
        .filter(Boolean)
        .join(" ");
    } else if (productReachableFromCategory === false && categories.length > 0) {
      navEvidence = [navEvidence, "בעמודי הקטגוריה שנפתחו לא אימתנו קישורי מוצר."]
        .filter(Boolean)
        .join(" ");
    }
  } else {
    if (categoryReachableFromNav === true) {
      navEvidence = "The homepage links to categories (including menu links when marked in HTML).";
    }
    if (productReachableFromCategory === true) {
      navEvidence = [navEvidence, "Category pages we opened link to product URLs (e.g. /items/)."]
        .filter(Boolean)
        .join(" ");
    }
  }

  let coverageNote: string | null = null;
  if (locale === "he") {
    if (products.length === 0 && categories.length > 0) {
      coverageNote =
        "לא נפתחו עמודי מוצר בודדים במדגם (לעיתים הם מופיעים רק מתוך עמוד קטגוריה, או כשמפת האתר חסומה לסורק).";
    } else if (categories.length === 0) {
      coverageNote = "לא זוהו עמודי קטגוריה בתוכן שנפתח — ייתכן מבנה כתובות לא סטנדרטי או מעט קישורים מהבית.";
    }
  } else if (products.length === 0 && categories.length > 0) {
    coverageNote = "No single product pages in this sample (often only linked from category pages).";
  }

  const recommendationBasis =
    locale === "he"
      ? "ההמלצות מבוססות על תוכן העמודים שנפתחו: כותרות, H1, כפתורי רכישה וקישורים פנימיים — לא על דירוג או מיקום בגוגל."
      : "Recommendations are based on opened pages: titles, H1, purchase controls, and internal links — not Google rankings.";

  return {
    productsScanned: products.length,
    categoriesScanned: categories.length,
    productsWithPurchaseCta: products.filter((p) => p.parsed.hasPurchaseCta).length,
    productsMissingH1: products.filter((p) => p.parsed.h1.length === 0).length,
    categoriesMissingH1: categories.filter((p) => p.parsed.h1.length === 0).length,
    productsChecked: products.map((p) => ({ url: p.url, label: p.label })),
    categoriesChecked: categories.map((p) => ({ url: p.url, label: p.label })),
    categoryReachableFromNav,
    productReachableFromCategory,
    navEvidence,
    coverageNote,
    recommendationBasis,
  };
}
