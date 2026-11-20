/** Balanced removal of a single outer `<div>...</div>` starting at `startIndex`. */

const DIV_TAG_RE = /<\/?div\b[^>]*>/gi;

export function stripBalancedDivFrom(html: string, startIndex: number): string {
  if (startIndex < 0) return html;
  DIV_TAG_RE.lastIndex = startIndex;
  const first = DIV_TAG_RE.exec(html);
  if (!first || first.index !== startIndex) return html;

  let depth = 1;
  let m: RegExpExecArray | null;
  while ((m = DIV_TAG_RE.exec(html)) !== null) {
    depth += m[0].startsWith("</") ? -1 : 1;
    if (depth === 0) {
      const end = m.index + m[0].length;
      return html.slice(0, startIndex) + html.slice(end);
    }
  }
  return html;
}

/** Remove one Elementor widget whose `class` contains `elementor-element-{dataId}`. */
export function stripElementorWidgetByDataId(html: string, dataId: string): string {
  const needle = `elementor-element-${dataId}`;
  const idx = html.indexOf(needle);
  if (idx === -1) return html;
  const start = html.lastIndexOf('<div class="elementor-element', idx);
  if (start === -1) return html;
  return stripBalancedDivFrom(html, start);
}

export function stripDivByClassName(html: string, className: string): string {
  const re = new RegExp(`<div[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, "i");
  const m = re.exec(html);
  if (!m) return html;
  return stripBalancedDivFrom(html, m.index);
}

/** Remove a single `<p>...</p>` whose inner text starts with `textStart` (after tags stripped). */
export function replaceSingleParagraphStartingWith(
  html: string,
  textStart: string,
  replacement: string,
): string {
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = pRe.exec(html)) !== null) {
    const inner = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!inner.startsWith(textStart)) continue;
    return html.slice(0, m.index) + replacement + html.slice(m.index + m[0].length);
  }
  return html;
}

export function stripSingleParagraphStartingWith(html: string, textStart: string): string {
  return replaceSingleParagraphStartingWith(html, textStart, "");
}

/** Rudimentary tag balance for regression QA (not a full HTML validator). */
export function countTagBalance(html: string): { div: number; section: number; p: number } {
  const count = (tag: string) => {
    const open = (html.match(new RegExp(`<${tag}\\b`, "gi")) || []).length;
    const close = (html.match(new RegExp(`</${tag}>`, "gi")) || []).length;
    return open - close;
  };
  return { div: count("div"), section: count("section"), p: count("p") };
}