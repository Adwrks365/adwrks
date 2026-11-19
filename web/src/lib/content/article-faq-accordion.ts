import type { Locale } from "@/i18n/routing";
import {
  ARTICLE_FAQ_MARKER,
  buildArticleFaqBlock,
  type FaqItem,
} from "@/lib/content/article-content-blocks";
import {
  extractLegacyFaqChunk,
  parseFaqChunkItems,
  parseInjectedFaqItems,
} from "@/lib/content/article-faq-detect";

const SKIP_ANCESTOR =
  /elementor-widget-price-table|article-pricing-grid-section|pricing-calculator|roi-calculator|data-adwrks-pagespeed-insights/i;

function sectionHasSkipWidget(chunk: string): boolean {
  return SKIP_ANCESTOR.test(chunk);
}

/** Upgrade injected FAQ sections that still use open h3 layout to the accordion format. */
function migrateInjectedFaqSections(html: string, locale: Locale): string {
  const re = /<section[^>]*adwrks-article-faq-block[\s\S]*?<\/section>/gi;
  return html.replace(re, (section) => {
    if (section.includes("adwrks-faq-accordion")) return section;
  if (sectionHasSkipWidget(section)) return section;

    const items = parseFaqChunkItems(section);
    if (items.length === 0) return section;

    const titleMatch = section.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : undefined;
    return buildArticleFaqBlock(locale, items, title || undefined);
  });
}

/** Replace standalone legacy FAQ (h2 + h3/p) with the shared accordion block. */
function convertLegacyFaqChunk(html: string, locale: Locale): string {
  if (html.includes(ARTICLE_FAQ_MARKER) && html.includes("adwrks-faq-accordion")) {
    return html;
  }

  const legacy = extractLegacyFaqChunk(html);
  if (!legacy || sectionHasSkipWidget(legacy.chunk)) return html;

  const items = parseFaqChunkItems(legacy.chunk);
  if (items.length === 0) return html;

  const titleMatch = legacy.chunk.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : undefined;
  const block = buildArticleFaqBlock(locale, items, title || undefined);
  return html.slice(0, legacy.start) + block + html.slice(legacy.end);
}

/**
 * Presentation-only: accordion markup for injected + plain legacy FAQ regions.
 * Does not add/remove Q&A text; skips Elementor service/pricing accordions.
 */
export function applyArticleFaqAccordionPresentation(html: string, locale: Locale): string {
  let next = migrateInjectedFaqSections(html, locale);
  if (!next.includes("adwrks-article-faq-block")) {
    next = convertLegacyFaqChunk(next, locale);
  } else if (extractLegacyFaqChunk(next)) {
    const injected = parseInjectedFaqItems(next);
    const legacy = extractLegacyFaqChunk(next);
    if (legacy && injected.length === 0) {
      next = convertLegacyFaqChunk(next, locale);
    }
  }
  return next;
}

export function faqItemsFromHtml(html: string): FaqItem[] {
  const injected = parseInjectedFaqItems(html);
  if (injected.length > 0) return injected;
  const legacy = extractLegacyFaqChunk(html);
  if (!legacy) return [];
  return parseFaqChunkItems(legacy.chunk);
}