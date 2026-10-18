const TOP_SECTION_OPEN = '<section class="elementor-section elementor-top-section';

const SECTION_ORDER = ["1003df00", "2a4602c2", "30c33ca0", "44a33fef"] as const;

function findTopSectionBounds(html: string, sectionId: string): { start: number; end: number } | null {
  const idMarker = `data-id="${sectionId}"`;
  const idIndex = html.indexOf(idMarker);
  if (idIndex === -1) return null;

  const start = html.lastIndexOf(TOP_SECTION_OPEN, idIndex);
  if (start === -1) return null;

  const nextTop = html.indexOf(TOP_SECTION_OPEN, start + TOP_SECTION_OPEN.length);
  const end = nextTop === -1 ? html.length : nextTop;
  return { start, end };
}

/** Reorder marketing blocks on the speed-test article into a clearer narrative flow. */
export function polishPageSpeedArticleHtml(html: string): string {
  if (!html.includes("elementor-21496")) return html;

  const extracted: { id: string; content: string; start: number; end: number }[] = [];

  for (const id of SECTION_ORDER) {
    const bounds = findTopSectionBounds(html, id);
    if (!bounds) continue;
    extracted.push({
      id,
      content: html.slice(bounds.start, bounds.end),
      start: bounds.start,
      end: bounds.end,
    });
  }

  if (extracted.length < 2) return html;

  extracted.sort((a, b) => b.start - a.start);
  let result = html;
  for (const item of extracted) {
    result = result.slice(0, item.start) + result.slice(item.end);
  }

  const embedMarker = 'data-adwrks-pagespeed-insights';
  const embedIndex = result.indexOf(embedMarker);
  if (embedIndex === -1) return result;

  const embedClose = result.indexOf("</div>", embedIndex);
  if (embedClose === -1) return result;

  const insertAt = embedClose + "</div>".length;
  const reordered = SECTION_ORDER.map((id) => extracted.find((x) => x.id === id)?.content)
    .filter(Boolean)
    .join("\n");

  return `${result.slice(0, insertAt)}\n${reordered}${result.slice(insertAt)}`;
}
