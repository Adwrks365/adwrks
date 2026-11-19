import type { Locale } from "@/i18n/routing";

export const ARTICLE_LEAD_MARKER = "adwrks-article-lead-2026";
export const ARTICLE_FAQ_MARKER = "adwrks-article-faq-2026";

type FaqItem = { question: string; answer: string };

const LEAD_TITLE: Record<Locale, string> = {
  he: "בקצרה",
  en: "At a glance",
};

const FAQ_TITLE: Record<Locale, string> = {
  he: "שאלות נפוצות",
  en: "Frequently asked questions",
};

function heading(level: 2 | 3, text: string): string {
  const tag = `h${level}`;
  return `<div class="elementor-element elementor-widget elementor-widget-heading" data-element_type="widget" data-widget_type="heading.default"><${tag} class="elementor-heading-title elementor-size-default">${text}</${tag}></div>`;
}

function proseHtml(paragraphs: string[]): string {
  const body = paragraphs.map((p) => `<p>${p}</p>`).join("");
  return `<div class="elementor-element elementor-widget elementor-widget-text-editor" data-element_type="widget" data-widget_type="text-editor.default"><div class="elementor-widget-container">${body}</div></div>`;
}

/** Compact lead block — visible in initial HTML, subtle styling via BEM class. */
export function buildArticleLeadBlock(locale: Locale, paragraphs: string[], title?: string): string {
  const label = title ?? LEAD_TITLE[locale];
  return `<aside class="adwrks-article-lead" data-adwrks-content="${ARTICLE_LEAD_MARKER}" aria-label="${label}">
<p class="adwrks-article-lead__title">${label}</p>
${paragraphs.map((p) => `<p class="adwrks-article-lead__text">${p}</p>`).join("")}
</aside>`;
}

/** Article FAQ — headings only (no FAQPage schema). */
export function buildArticleFaqBlock(locale: Locale, items: FaqItem[], title?: string): string {
  const label = title ?? FAQ_TITLE[locale];
  const inner = [
    heading(2, label),
    ...items.flatMap((item) => [heading(3, item.question), proseHtml([item.answer])]),
  ].join("");
  return `<section class="adwrks-article-faq-block" data-adwrks-content="${ARTICLE_FAQ_MARKER}" data-element_type="section">
<div class="elementor-container elementor-column-gap-default">${inner}</div></section>`;
}

export function htmlHasArticleLead(html: string): boolean {
  if (html.includes(ARTICLE_LEAD_MARKER) || html.includes("adwrks-article-lead")) {
    return true;
  }
  return /adwrks-article-lead__title[^>]*>\s*(בקצרה|At a glance)\s*</i.test(html);
}

export function htmlHasArticleFaq(html: string): boolean {
  if (html.includes(ARTICLE_FAQ_MARKER)) return true;
  return /(שאלות נפוצות|שאלות ותשובות|Frequently asked questions|FAQ)/i.test(html);
}

/** Insert lead once, right after the main Elementor content wrap opens. */
export function injectArticleLead(html: string, block: string): string {
  if (html.includes(ARTICLE_LEAD_MARKER)) return html;
  const needle = '<div class="elementor-widget-wrap elementor-element-populated">';
  let idx = html.indexOf(needle);
  if (idx === -1) {
    const populated = html.indexOf('elementor-element-populated">');
    if (populated !== -1) {
      idx = populated + 'elementor-element-populated">'.length - 1;
      const insertAt = populated + 'elementor-element-populated">'.length;
      return `${html.slice(0, insertAt)}${block}${html.slice(insertAt)}`;
    }
    if (html.startsWith("<")) {
      const gt = html.indexOf(">");
      if (gt !== -1) {
        const insertAt = gt + 1;
        return `${html.slice(0, insertAt)}${block}${html.slice(insertAt)}`;
      }
    }
    return `${block}${html}`;
  }
  const insertAt = idx + needle.length;
  return `${html.slice(0, insertAt)}${block}${html.slice(insertAt)}`;
}

/** Append FAQ before the closing sections of the Elementor post root. */
export function injectArticleFaq(html: string, block: string, postMarker: string): string {
  if (!block || html.includes(ARTICLE_FAQ_MARKER)) return html;
  if (!html.includes(postMarker)) return html;
  const closeTag = "</section></div>";
  const last = html.lastIndexOf(closeTag);
  if (last === -1) return `${html}${block}`;
  return `${html.slice(0, last)}${block}${html.slice(last)}`;
}