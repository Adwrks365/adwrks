/** Surgical removal of redundant Elementor blocks identified by H2 text (batch article cleanup). */

const INJECTED_FAQ_SECTION_OPEN = '<section class="adwrks-article-faq-block"';
const INJECTED_FAQ_DATA = 'data-adwrks-content="adwrks-article-faq-2026"';

function normalizeHeadingText(htmlFragment: string): string {
  return htmlFragment.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function indexInsideInjectedContentBlock(html: string, index: number): boolean {
  const leadStart = html.lastIndexOf("adwrks-article-lead", index);
  if (leadStart !== -1) {
    const leadOpen = html.lastIndexOf("<aside", leadStart);
    const leadClose = html.indexOf("</aside>", leadStart);
    if (leadOpen !== -1 && leadClose !== -1 && index > leadOpen && index < leadClose) return true;
  }

  const faqMarker = html.lastIndexOf(INJECTED_FAQ_DATA, index);
  if (faqMarker !== -1) {
    const secOpen = html.lastIndexOf("<section", faqMarker);
    const secClose = html.indexOf("</section>", faqMarker);
    if (secOpen !== -1 && secClose !== -1 && index > secOpen && index < secClose) return true;
  }

  return false;
}

function nextInjectedFaqSectionStart(html: string, after: number): number {
  const fromSection = html.indexOf(INJECTED_FAQ_SECTION_OPEN, after);
  const fromData = html.indexOf(INJECTED_FAQ_DATA, after);
  if (fromSection === -1) return fromData;
  if (fromData === -1) return fromSection;
  return Math.min(fromSection, fromData);
}

/**
 * Removes a matching `elementor-heading-title` H2 and following widgets until the next H2 or FAQ block.
 * Safe inside the post root — does not drop the whole Elementor wrapper.
 */
export function stripElementorContentBlockByH2(
  html: string,
  matches: (headingText: string) => boolean,
): string {
  const h2Re = /<h2 class="elementor-heading-title[^"]*"[\s\S]*?<\/h2>/gi;
  let result = html;
  let m: RegExpExecArray | null;
  const hits: { start: number; end: number }[] = [];

  while ((m = h2Re.exec(result)) !== null) {
    const text = normalizeHeadingText(m[0]);
    if (!matches(text)) continue;
    if (indexInsideInjectedContentBlock(result, m.index)) continue;
    const start = m.index;
    const after = m.index + m[0].length;
    const nextH2 = result.indexOf('<h2 class="elementor-heading-title', after);
    const nextFaq = nextInjectedFaqSectionStart(result, after);
    let end = result.length;
    if (nextH2 !== -1) end = Math.min(end, nextH2);
    if (nextFaq !== -1) end = Math.min(end, nextFaq);
    hits.push({ start, end });
  }

  for (let i = hits.length - 1; i >= 0; i--) {
    const { start, end } = hits[i];
    result = result.slice(0, start) + result.slice(end);
  }

  return result;
}

/** @deprecated use stripElementorContentBlockByH2 */
export function stripElementorTopSectionsByH2(
  html: string,
  matches: (headingText: string) => boolean,
): string {
  return stripElementorContentBlockByH2(html, matches);
}

export function stripH2HeadingWidgets(html: string, matches: (headingText: string) => boolean): string {
  const widgetRe =
    /<div class="elementor-element elementor-widget elementor-widget-heading"[\s\S]*?<\/div>\s*<\/div>/gi;
  return html.replace(widgetRe, (widget) => {
    const m = widget.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (!m) return widget;
    const text = normalizeHeadingText(m[1]);
    if (matches(text)) return "";
    return widget;
  });
}