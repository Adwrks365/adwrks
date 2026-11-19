const INJECTED_FAQ_MARKER = "adwrks-article-faq-2026";

const FAQ_H2_HE = /שאלות\s*(נפוצות|ותשובות)/i;
const FAQ_H2_EN = /frequently\s+asked\s+questions|^faq$/i;

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;\s]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isFaqHeadingText(text: string): boolean {
  const t = stripTags(text);
  return FAQ_H2_HE.test(t) || FAQ_H2_EN.test(t);
}

function htmlWithoutInjectedFaqBlocks(html: string): string {
  return html.replace(/<section[^>]*adwrks-article-faq-block[\s\S]*?<\/section>/gi, "");
}

export type VisibleFaqAudit = {
  injectedBlocks: number;
  legacyFaqH2: number;
  accordionWidgets: number;
  toggleWidgets: number;
  totalSections: number;
};

export function legacyFaqRegionHasItems(html: string): boolean {
  const legacy = extractLegacyFaqChunk(html);
  if (!legacy) return false;
  if (parseFaqChunkItems(legacy.chunk).length > 0) return true;
  const window = html.slice(legacy.start, Math.min(html.length, legacy.start + 20000));
  const tabTitles = window.match(/elementor-tab-title|elementor-toggle-title/g);
  return (tabTitles?.length ?? 0) >= 2;
}

export function countVisibleFaqSections(html: string): VisibleFaqAudit {
  const injectedBlocks = (html.match(/class="adwrks-article-faq-block"/g) || []).length;
  const withoutInjected = htmlWithoutInjectedFaqBlocks(html);

  const legacyWithItems = legacyFaqRegionHasItems(withoutInjected) ? 1 : 0;

  const accordionWidgets = (withoutInjected.match(/elementor-widget-accordion/g) || []).length;
  const toggleWidgets = (withoutInjected.match(/elementor-widget-toggle/g) || []).length;

  let totalSections = injectedBlocks + legacyWithItems;
  if (accordionWidgets > 0) totalSections += 1;
  if (toggleWidgets > 0) totalSections += 1;

  return {
    injectedBlocks,
    legacyFaqH2: legacyWithItems,
    accordionWidgets,
    toggleWidgets,
    totalSections,
  };
}

export function htmlHasLegacyArticleFaq(html: string): boolean {
  if (html.includes(INJECTED_FAQ_MARKER)) return true;

  const withoutInjected = htmlWithoutInjectedFaqBlocks(html);
  if (legacyFaqRegionHasItems(withoutInjected)) return true;

  if (/elementor-widget-accordion|elementor-widget-toggle/.test(withoutInjected)) {
    const tabs = withoutInjected.match(/elementor-tab-title|elementor-toggle-title/g);
    if (tabs && tabs.length >= 2) return true;
  }

  return false;
}

export function htmlHasArticleFaq(html: string): boolean {
  return htmlHasLegacyArticleFaq(html);
}

export type ParsedFaqItem = { question: string; answer: string };

function parseDetailsFaqItems(chunk: string): ParsedFaqItem[] {
  const items: ParsedFaqItem[] = [];
  const re = /<details[^>]*class="[^"]*adwrks-faq-item[^"]*"[\s\S]*?<\/details>/gi;
  for (const block of chunk.match(re) ?? []) {
    const qm = block.match(/adwrks-faq-item__question[^>]*>([\s\S]*?)<\/span>/i);
    const am = block.match(/class="adwrks-faq-item__answer"[^>]*>([\s\S]*?)<\/div>/i);
    const question = qm ? stripTags(qm[1]) : "";
    const answer = am ? stripTags(am[1]) : "";
    if (question) items.push({ question, answer });
  }
  return items;
}

export function parseFaqChunkItems(chunk: string): ParsedFaqItem[] {
  if (chunk.includes("adwrks-faq-item")) {
    const fromDetails = parseDetailsFaqItems(chunk);
    if (fromDetails.length > 0) return fromDetails;
  }

  const parts = chunk.split(/<h3[^>]*>/i).slice(1);
  const items: ParsedFaqItem[] = [];
  for (const part of parts) {
    const qEnd = part.indexOf("</h3>");
    if (qEnd === -1) continue;
    const question = stripTags(part.slice(0, qEnd));
    const after = part.slice(qEnd + 5);
    const pm = after.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const answer = pm ? stripTags(pm[1]) : stripTags(after).slice(0, 500);
    if (question) items.push({ question, answer });
  }
  return items;
}

export function parseInjectedFaqItems(html: string): ParsedFaqItem[] {
  const m = html.match(/<section[^>]*adwrks-article-faq-block[\s\S]*?<\/section>/i);
  if (!m) return [];
  if (m[0].includes("adwrks-faq-item")) {
    return parseDetailsFaqItems(m[0]);
  }
  return parseFaqChunkItems(m[0]);
}

export function extractLegacyFaqChunk(html: string): { chunk: string; start: number; end: number } | null {
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let m;
  while ((m = re.exec(html))) {
    const before = html.slice(Math.max(0, m.index - 80), m.index);
    if (before.includes("adwrks-article-faq-block")) continue;
    if (!isFaqHeadingText(m[1])) continue;

    const start = m.index;
    const afterH2 = html.slice(start);
    const tail = afterH2.replace(/^<h2[\s\S]*?<\/h2>/i, "");
    const nextH2 = tail.search(/<h2[^>]*>/i);
    const end = start + (afterH2.length - tail.length) + (nextH2 === -1 ? tail.length : nextH2);
    return { chunk: html.slice(start, end), start, end };
  }
  return null;
}

/** Extract article body inner HTML from a rendered page (QA / production smoke). */
export function extractArticleBodyFromPageHtml(pageHtml: string): string {
  const marker = 'class="article-body-html';
  const start = pageHtml.indexOf(marker);
  if (start === -1) return "";
  const openEnd = pageHtml.indexOf(">", start);
  if (openEnd === -1) return "";

  let depth = 0;
  let i = openEnd + 1;
  const divOpen = /<div[\s>]/gi;
  const divClose = /<\/div>/gi;

  while (i < pageHtml.length) {
    divOpen.lastIndex = i;
    divClose.lastIndex = i;
    const nextOpen = divOpen.exec(pageHtml);
    const nextClose = divClose.exec(pageHtml);
    if (!nextClose) break;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++;
      i = nextOpen.index + nextOpen[0].length;
    } else {
      if (depth === 0) {
        return pageHtml.slice(openEnd + 1, nextClose.index);
      }
      depth--;
      i = nextClose.index + nextClose[0].length;
    }
  }
  return "";
}