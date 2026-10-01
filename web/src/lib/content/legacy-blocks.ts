/** Strip legacy WordPress/Elementor contact/footer blocks from article body HTML. */

const LEGACY_CONTACT_SECTION_MARKERS = [
  "דרכים ליצירת קשר",
  "אנחנו כאן לכל שאלה, בדרך הנוחה ביותר עבורך",
  "elementor-widget-form",
] as const;

function hasValidImageSrc(sectionHtml: string): boolean {
  const imgs = sectionHtml.match(/<img[^>]*>/gi) ?? [];
  return imgs.some((tag) => {
    const src = tag.match(/\ssrc="([^"]*)"/i)?.[1] ?? "";
    if (!src || src === '""') return false;
    if (src.startsWith("data:image/svg")) return false;
    return src.startsWith("http") || src.startsWith("/");
  });
}

function hasVisibleElementorContent(sectionHtml: string): boolean {
  if (hasValidImageSrc(sectionHtml)) return true;
  if (/<iframe[\s>]/i.test(sectionHtml)) return true;
  if (/<video[\s>]/i.test(sectionHtml)) return true;
  if (/elementor-widget-form/i.test(sectionHtml)) return true;
  if (/elementor-button-text[^>]*>[\s\S]*?\S/i.test(sectionHtml)) return true;
  if (/elementor-widget-text-editor[\s\S]*?<(?:p|h[2-6])[^>]*>[\s\S]*?\S/i.test(sectionHtml)) {
    return true;
  }
  if (/<(?:p|h[1-6]|li|td|th|figcaption|blockquote)[^>]*>[\s\S]*?\S/i.test(sectionHtml)) {
    return true;
  }
  return false;
}

function isLegacyContactSection(sectionHtml: string): boolean {
  if (LEGACY_CONTACT_SECTION_MARKERS.some((marker) => sectionHtml.includes(marker))) {
    return true;
  }

  const hasOfficePhone =
    /tel:0795599449|tel:079-5599449|079-55-99-449|079-5599449/i.test(sectionHtml);
  const hasSocialWidget = /elementor-social-icon|elementor-widget-social-icons/i.test(
    sectionHtml,
  );
  const hasPartnerBadge =
    /meta-parners|google-meta-partners|Google Partner|Meta Partner/i.test(sectionHtml);
  const hasOfficeHoursBlock =
    /שעות פתיחה[\s\S]{0,400}09:00|שעות פתיחה[\s\S]{0,400}א['']-ה['']/i.test(
      sectionHtml,
    );

  if (hasOfficePhone && (hasSocialWidget || hasPartnerBadge || hasOfficeHoursBlock)) {
    return true;
  }

  return false;
}

function isEmptyTopLevelSection(sectionHtml: string): boolean {
  return !hasVisibleElementorContent(sectionHtml);
}

/** First section is only a duplicate Elementor heading (no paragraphs, lists, media, buttons). */
function isHeadingOnlyTopSection(sectionHtml: string): boolean {
  const hasHeading = /elementor-widget-heading/i.test(sectionHtml);
  if (!hasHeading) return false;

  const hasSubstantiveContent =
    /<p[^>]*>[\s\S]*?\S/i.test(sectionHtml) ||
    /<ul[^>]*>[\s\S]*?<li/i.test(sectionHtml) ||
    /<ol[^>]*>[\s\S]*?<li/i.test(sectionHtml) ||
    /<img[^>]+src="(?:https?:|\/)/i.test(sectionHtml) ||
    /<iframe[\s>]/i.test(sectionHtml) ||
    /elementor-widget-form/i.test(sectionHtml) ||
    /elementor-button-text[^>]*>[\s\S]*?\S/i.test(sectionHtml) ||
    /elementor-widget-text-editor/i.test(sectionHtml);

  return !hasSubstantiveContent;
}

function getLeadingTopLevelSection(html: string): string | null {
  const match = html.match(
    /<section\s[^>]*class="[^"]*elementor-top-section[^"]*"[^>]*>[\s\S]*?<\/section>/i,
  );
  return match?.[0] ?? null;
}

function removeLeadingTopLevelSection(html: string): string {
  const pattern =
    /<section\s[^>]*class="[^"]*elementor-top-section[^"]*"[^>]*>[\s\S]*?<\/section>/i;
  const match = html.match(pattern);
  if (!match || match.index === undefined) return html;
  return html.slice(0, match.index) + html.slice(match.index + match[0].length);
}

function removeTopLevelElementorSections(
  html: string,
  shouldRemove: (sectionHtml: string) => boolean,
): string {
  const sectionPattern =
    /<section\s[^>]*class="[^"]*elementor-top-section[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
  return html.replace(sectionPattern, (section) => (shouldRemove(section) ? "" : section));
}

/** Remove legacy contact/form/footer Elementor sections (not keyword SEO blocks). */
export function stripLegacyArticleContactBlocks(html: string): string {
  let result = html;
  let previous = "";
  let safety = 0;

  while (result !== previous && safety < 20) {
    safety++;
    previous = result;
    result = removeTopLevelElementorSections(result, isLegacyContactSection);
  }

  return result;
}

/** Remove image widgets with no real src (placeholder shells that reserve height). */
export function stripEmptyImageWidgets(html: string): string {
  return html.replace(
    /<div[^>]*\belementor-widget-image\b[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi,
    (widget) => (hasValidImageSrc(widget) ? widget : ""),
  );
}

/** Remove empty Elementor top-level sections left by migration (e.g. blank hero shells). */
export function stripEmptyElementorSections(html: string): string {
  let result = html;
  let previous = "";
  let safety = 0;

  while (result !== previous && safety < 20) {
    safety++;
    previous = result;
    result = removeTopLevelElementorSections(result, isEmptyTopLevelSection);
  }

  return result;
}

/**
 * Remove redundant leading top-level sections: empty shells and heading-only
 * duplicates left before the real article body (common WordPress/Elementor pattern).
 */
export function stripLeadingRedundantElementorSections(html: string): string {
  let result = html;
  let safety = 0;

  while (safety < 20) {
    safety++;
    const leading = getLeadingTopLevelSection(result);
    if (!leading) break;

    const shouldRemove =
      isEmptyTopLevelSection(leading) || isHeadingOnlyTopSection(leading);
    if (!shouldRemove) break;

    result = removeLeadingTopLevelSection(result);
  }

  return result;
}
