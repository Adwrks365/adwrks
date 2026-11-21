import type { Locale } from "@/i18n/routing";

export const ARTICLE_LEAD_MARKER = "adwrks-article-lead-2026";
export const ARTICLE_FAQ_MARKER = "adwrks-article-faq-2026";

export type FaqItem = { question: string; answer: string };

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

/** Compact lead block — visible in initial HTML, subtle styling via BEM class. */
export function buildArticleLeadBlock(locale: Locale, paragraphs: string[], title?: string): string {
  const label = title ?? LEAD_TITLE[locale];
  return `<aside class="adwrks-article-lead" data-adwrks-content="${ARTICLE_LEAD_MARKER}" aria-label="${label}">
<p class="adwrks-article-lead__title">${label}</p>
${paragraphs.map((p) => `<p class="adwrks-article-lead__text">${p}</p>`).join("")}
</aside>`;
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function faqAnswerHtml(answer: string): string {
  if (/<[a-z][\s\S]*>/i.test(answer)) {
    return answer;
  }
  return `<p>${answer}</p>`;
}

/** Article FAQ — semantic accordion (`details`); answers stay in initial HTML (no FAQPage schema). */
export function buildArticleFaqBlock(locale: Locale, items: FaqItem[], title?: string): string {
  const label = title ?? FAQ_TITLE[locale];
  const accordionItems = items
    .map(
      (item) =>
        `<details class="adwrks-faq-item">
<summary class="adwrks-faq-item__summary">
<span class="adwrks-faq-item__icon" aria-hidden="true"></span>
<span class="adwrks-faq-item__question">${escapeHtmlText(item.question)}</span>
</summary>
<div class="adwrks-faq-item__answer">${faqAnswerHtml(item.answer)}</div>
</details>`,
    )
    .join("");
  const inner = [
    heading(2, label),
    `<div class="adwrks-faq-accordion" data-adwrks-faq-accordion="exclusive" role="presentation">${accordionItems}</div>`,
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

const LEAD_ASIDE_RE =
  /<aside[^>]*class="[^"]*adwrks-article-lead[^"]*"[^>]*data-adwrks-content="adwrks-article-lead-2026"[\s\S]*?<\/aside>/i;

const INJECTED_FAQ_SECTION_RE =
  /<section[^>]*class="[^"]*adwrks-article-faq-block[^"]*"[^>]*data-adwrks-content="adwrks-article-faq-2026"[\s\S]*?<\/section>/i;

/** Replace runtime lead block or inject if missing. */
export function upsertArticleLead(html: string, block: string): string {
  const withoutPrior = html.replace(LEAD_ASIDE_RE, "");
  return injectArticleLead(withoutPrior, block);
}

/** PageSpeed posts: place lead after the interactive tool so it is not trapped in a hidden Elementor column. */
export function upsertArticleLeadAfterPagespeedTool(html: string, block: string): string {
  const withoutPrior = html.replace(LEAD_ASIDE_RE, "");
  const marker = "data-adwrks-pagespeed-insights";
  const idx = withoutPrior.indexOf(marker);
  if (idx === -1) return injectArticleLead(withoutPrior, block);

  let probe = withoutPrior.indexOf("</section>", idx);
  if (probe === -1) {
    probe = withoutPrior.indexOf("</div>", idx);
    for (let depth = 0; depth < 4 && probe !== -1; depth++) {
      probe = withoutPrior.indexOf("</div>", probe + 6);
    }
  } else {
    probe += "</section>".length;
  }
  if (probe === -1) return injectArticleLead(withoutPrior, block);
  return `${withoutPrior.slice(0, probe)}${block}${withoutPrior.slice(probe)}`;
}

/** Replace injected FAQ section or append if missing. */
export function upsertArticleFaq(
  html: string,
  block: string,
  postMarker: string,
): string {
  if (INJECTED_FAQ_SECTION_RE.test(html)) {
    return html.replace(INJECTED_FAQ_SECTION_RE, block);
  }
  return injectArticleFaq(html, block, postMarker);
}

export { consolidateDuplicateFaqSections } from "@/lib/content/article-faq-consolidate";

function sectionOpenTagBefore(html: string, position: number): string {
  const sectionStart = html.lastIndexOf("<section", position);
  if (sectionStart === -1) return "";
  const sectionEnd = html.indexOf(">", sectionStart);
  if (sectionEnd === -1) return "";
  return html.slice(sectionStart, sectionEnd + 1);
}

/** Skip Elementor sections hidden on desktop (lead must be visible without scroll hacks). */
function isElementorSectionHiddenOnDesktop(sectionOpenTag: string): boolean {
  return /elementor-hidden-desktop/i.test(sectionOpenTag);
}

function findVisibleLeadInjectionPoint(html: string, needle: string): number {
  let searchFrom = 0;
  while (searchFrom < html.length) {
    const idx = html.indexOf(needle, searchFrom);
    if (idx === -1) return -1;
    const sectionTag = sectionOpenTagBefore(html, idx);
    if (!sectionTag || !isElementorSectionHiddenOnDesktop(sectionTag)) {
      return idx + needle.length;
    }
    searchFrom = idx + needle.length;
  }
  return -1;
}

/** Insert lead once, right after the main Elementor content wrap opens. */
export function injectArticleLead(html: string, block: string): string {
  if (html.includes(ARTICLE_LEAD_MARKER)) return html;
  const needle = '<div class="elementor-widget-wrap elementor-element-populated">';
  const visibleAt = findVisibleLeadInjectionPoint(html, needle);
  if (visibleAt !== -1) {
    return `${html.slice(0, visibleAt)}${block}${html.slice(visibleAt)}`;
  }
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
  if (!html.includes(postMarker)) {
    if (!/data-elementor-type\s*=\s*["']wp-post["']/i.test(html)) {
      return `${html}${block}`;
    }
    return html;
  }
  const closeTag = "</section></div>";
  const last = html.lastIndexOf(closeTag);
  if (last === -1) return `${html}${block}`;
  return `${html.slice(0, last)}${block}${html.slice(last)}`;
}