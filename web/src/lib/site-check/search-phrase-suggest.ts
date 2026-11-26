import type { AnalyzablePage } from "./findings";
import type { SiteKind } from "./site-kind";
import type { SiteCheckLocale } from "./types";

export type SuggestedSearchPhrase = {
  text: string;
  /** Why we picked it (shown subtly). */
  source: string;
};

const SITE_SUFFIX = /\s+[-–|]\s+.+$/;

function cleanPhrase(raw: string): string {
  return raw.replace(SITE_SUFFIX, "").replace(/\s+/g, " ").trim();
}

function uniquePhrases(rows: { text: string; source: string }[], limit = 3): SuggestedSearchPhrase[] {
  const seen = new Set<string>();
  const out: SuggestedSearchPhrase[] = [];
  for (const row of rows) {
    const text = cleanPhrase(row.text);
    if (text.length < 3 || text.length > 72) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ text, source: row.source });
    if (out.length >= limit) return out;
  }
  return out;
}

/** Up to 3 editable query suggestions from pages we actually opened. */
export function suggestSearchPhrases(
  pages: readonly AnalyzablePage[],
  siteKind: SiteKind,
  locale: SiteCheckLocale,
): SuggestedSearchPhrase[] {
  const readable = pages.filter((p) => p.readable);
  const home = readable.find((p) => p.role === "home");
  const candidates: { text: string; source: string; score: number }[] = [];

  const push = (text: string, source: string, score: number) => {
    const t = cleanPhrase(text);
    if (!t) return;
    candidates.push({ text: t, source, score });
  };

  if (home) {
    const h1 = home.parsed.h1[0];
    const title = home.parsed.title;
    if (h1) push(h1, locale === "en" ? "Homepage H1" : "כותרת ראשית בדף הבית", 10);
    if (title && title !== h1) push(title, locale === "en" ? "Homepage title" : "כותרת דף הבית", 8);
    const meta = home.parsed.metaDescription;
    if (meta && meta.length <= 64) push(meta, locale === "en" ? "Homepage description" : "תיאור דף הבית", 4);
  }

  for (const page of readable) {
    if (page.role === "home") continue;
    const label = page.label;
    const h1 = page.parsed.h1[0];
    let score = 3;
    let source = locale === "en" ? "Inner page" : "עמוד פנימי";

    if (page.commerceKind === "product") {
      score = 12;
      source = locale === "en" ? "Product page" : "עמוד מוצר";
      push(h1 || label, source, score);
      continue;
    }
    if (page.commerceKind === "category") {
      score = 11;
      source = locale === "en" ? "Category page" : "עמוד קטגוריה";
      push(h1 || label, source, score);
      continue;
    }
    if (page.intent?.contact) {
      push(
        locale === "en" ? "contact" : "יצירת קשר",
        locale === "en" ? "Contact intent" : "עמוד יצירת קשר",
        2,
      );
      continue;
    }
    if (page.intent?.service || /שירות|service/i.test(`${page.url} ${label}`)) {
      score = 9;
      source = locale === "en" ? "Service page" : "עמוד שירות";
      push(h1 || label, source, score);
      continue;
    }
    if (page.intent?.pricing) {
      score = 8;
      source = locale === "en" ? "Pricing page" : "מחירון";
      push(h1 || label, source, score);
    }
  }

  if (siteKind === "store") {
    candidates.forEach((c) => {
      if (c.source.includes("מוצר") || c.source.includes("Product")) c.score += 2;
    });
  } else if (siteKind === "landing") {
    candidates.forEach((c) => {
      if (c.source.includes("בית") || c.source.includes("Home")) c.score += 3;
    });
  } else if (siteKind === "service") {
    candidates.forEach((c) => {
      if (c.source.includes("שירות") || c.source.includes("Service")) c.score += 3;
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  const phrases = uniquePhrases(
    candidates.map((c) => ({ text: c.text, source: c.source })),
    3,
  );

  if (siteKind === "store" && phrases.length < 3 && locale === "he") {
    const hasProduct = phrases.some((p) => p.source.includes("מוצר"));
    if (!hasProduct) {
      /* slot left for user to type */
    }
  }

  return phrases.slice(0, 3);
}