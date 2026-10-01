/** Detect and repair dead legacy Elementor CTA buttons in article body HTML. */

const DEAD_HASH_IDS = new Set([
  "contact",
  "form-section",
  "form",
  "elementor-form",
  "popup-form",
]);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeHref(href: string): string {
  return href.trim().replace(/\s+/g, "");
}

function anchorExists(html: string, id: string): boolean {
  if (!id) return false;
  const pattern = new RegExp(`\\bid=["']${escapeRegExp(id)}["']`, "i");
  return pattern.test(html);
}

/** True when a repaired CTA opens the contextual popup instead of a dead href. */
export function isRepairedArticleCtaAnchor(attrs: string): boolean {
  return attrs.includes('data-open-contextual-popup="true"');
}

/** Returns true when an Elementor CTA href no longer resolves to real content/action. */
export function isBrokenArticleCtaHref(href: string, html: string): boolean {
  const normalized = normalizeHref(href);
  if (!normalized) return true;
  if (/^javascript:/i.test(normalized)) return true;
  if (normalized === "#") return true;

  if (normalized.startsWith("#")) {
    const rawId = decodeURIComponent(normalized.slice(1)).trim();
    const id = rawId.toLowerCase();
    if (!id) return true;
    if (DEAD_HASH_IDS.has(id)) return true;
    if (id.includes("contact") || id.includes("form")) return true;
    return !anchorExists(html, rawId);
  }

  return false;
}

export type ArticleCtaAuditEntry = {
  href: string;
  label: string;
  broken: boolean;
  repaired: boolean;
};

export type ArticleCtaAuditResult = {
  postId: number;
  path: string;
  ctas: ArticleCtaAuditEntry[];
};

const ELEMENTOR_BUTTON_RE =
  /<a\s([^>]*class="[^"]*elementor-button[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi;

function extractButtonLabel(innerHtml: string): string {
  const match = innerHtml.match(/elementor-button-text[^>]*>([\s\S]*?)<\//i);
  if (match) {
    return match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  return innerHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

function readHref(attrs: string): string {
  return attrs.match(/\shref="([^"]*)"/i)?.[1] ?? "";
}

/** Audit Elementor CTA buttons in article HTML (before repair). */
export function auditArticleCtaLinks(html: string, postId: number, path: string): ArticleCtaAuditResult {
  const ctas: ArticleCtaAuditEntry[] = [];
  let match: RegExpExecArray | null;

  ELEMENTOR_BUTTON_RE.lastIndex = 0;
  while ((match = ELEMENTOR_BUTTON_RE.exec(html)) !== null) {
    const href = readHref(match[1]);
    const broken = isBrokenArticleCtaHref(href, html);
    ctas.push({
      href,
      label: extractButtonLabel(match[2]),
      broken,
      repaired: false,
    });
  }

  return { postId, path, ctas };
}

/** Rewrite broken Elementor CTA hrefs to open the contextual lead popup client-side. */
export function repairArticleCtaLinks(html: string): string {
  return html.replace(ELEMENTOR_BUTTON_RE, (full, attrs, inner) => {
    const href = readHref(attrs);
    if (!isBrokenArticleCtaHref(href, html)) return full;

    let newAttrs = attrs.replace(/\shref="[^"]*"/i, "");
    newAttrs = `${newAttrs.trim()} href="#" data-open-contextual-popup="true"`.trim();
    if (!/role=/i.test(newAttrs)) {
      newAttrs += ' role="button"';
    }
    return `<a ${newAttrs}>${inner}</a>`;
  });
}

const REPAIRED_BUTTON_WIDGET_RE =
  /<div class="elementor-element[^"]*\belementor-widget-button\b[^"]*"[^>]*>\s*<a\s[^>]*\bdata-open-contextual-popup="true"[^>]*>[\s\S]*?<\/a>\s*<\/div>/gi;

const REPAIRED_PRICE_TABLE_FOOTER_RE =
  /<div class="elementor-price-table__footer">\s*(<a\s[^>]*\bdata-open-contextual-popup="true"[^>]*>[\s\S]*?<\/a>)\s*<\/div>/gi;

const HEADING_WIDGET_TAIL_RE =
  /<div class="elementor-element[^"]*\belementor-widget-heading\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*$/i;

/**
 * Wrap repaired CTA widgets in a dedicated block so spacing/alignment can be normalized globally.
 * Does not alter popup attributes, hrefs, or CTA copy.
 */
export function wrapRepairedArticleCtaBlocks(html: string): string {
  const spans: Array<{ start: number; end: number; solo: boolean }> = [];
  let match: RegExpExecArray | null;

  REPAIRED_BUTTON_WIDGET_RE.lastIndex = 0;
  while ((match = REPAIRED_BUTTON_WIDGET_RE.exec(html)) !== null) {
    const before = html.slice(Math.max(0, match.index - 1200), match.index);
    const heading = before.match(HEADING_WIDGET_TAIL_RE);
    const start = heading ? match.index - heading[0].length : match.index;
    spans.push({
      start,
      end: match.index + match[0].length,
      solo: !heading,
    });
  }

  let result = html;
  if (spans.length > 0) {
    result = "";
    let cursor = 0;

    for (const span of spans) {
      if (span.start < cursor) continue;
      result += html.slice(cursor, span.start);
      const inner = html.slice(span.start, span.end);
      const modifier = span.solo ? " article-inline-cta-block--solo" : "";
      result += `<div class="article-inline-cta-block${modifier}">${inner}</div>`;
      cursor = span.end;
    }

    result += html.slice(cursor);
  }

  result = result.replace(
    REPAIRED_PRICE_TABLE_FOOTER_RE,
    '<div class="article-inline-cta-block article-inline-cta-block--solo article-inline-cta-block--price-table"><div class="elementor-price-table__footer">$1</div></div>',
  );

  return result;
}

/** Summarize audit results across all articles. */
export function summarizeCtaAudits(results: ArticleCtaAuditResult[]): {
  totalButtons: number;
  brokenBefore: number;
  brokenAfter: number;
} {
  let totalButtons = 0;
  let brokenBefore = 0;
  let brokenAfter = 0;

  for (const result of results) {
    for (const cta of result.ctas) {
      totalButtons++;
      if (cta.broken) brokenBefore++;
      if (cta.broken && !cta.repaired) brokenAfter++;
    }
  }

  return { totalButtons, brokenBefore, brokenAfter };
}
