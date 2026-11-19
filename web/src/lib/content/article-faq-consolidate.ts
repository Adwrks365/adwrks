import type { Locale } from "@/i18n/routing";
import {
  buildArticleFaqBlock,
  type FaqItem,
} from "@/lib/content/article-content-blocks";
import {
  countVisibleFaqSections,
  extractLegacyFaqChunk,
  parseFaqChunkItems,
  parseInjectedFaqItems,
} from "@/lib/content/article-faq-detect";

function normalizeQ(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").replace(/[?؟]/g, "").trim();
}

/** One FAQ region: drop duplicate legacy block; merge unique legacy Q&As into injected block. */
export function consolidateDuplicateFaqSections(html: string, locale: Locale): string {
  const audit = countVisibleFaqSections(html);
  if (audit.totalSections <= 1) return html;
  if (!html.includes("adwrks-article-faq-block")) return html;

  const legacy = extractLegacyFaqChunk(html);
  if (!legacy) return html;

  const injected = parseInjectedFaqItems(html);
  const legacyItems = parseFaqChunkItems(legacy.chunk);
  const seen = new Set(injected.map((i) => normalizeQ(i.question)));
  const merged: FaqItem[] = [...injected];
  for (const item of legacyItems) {
    const key = normalizeQ(item.question);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  const rebuilt = buildArticleFaqBlock(locale, merged);
  let next = html.slice(0, legacy.start) + html.slice(legacy.end);
  const blockIdx = next.indexOf("adwrks-article-faq-block");
  if (blockIdx === -1) return next;
  const secStart = next.lastIndexOf("<section", blockIdx);
  const secEnd = next.indexOf("</section>", blockIdx);
  if (secStart === -1 || secEnd === -1) return next;
  return next.slice(0, secStart) + rebuilt + next.slice(secEnd + "</section>".length);
}