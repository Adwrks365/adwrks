/** Strip legacy WordPress/Elementor contact/footer blocks from article body HTML. */

const LEGACY_CONTACT_SECTION_MARKERS = [
  "דרכים ליצירת קשר",
  "אנחנו כאן לכל שאלה, בדרך הנוחה ביותר עבורך",
  "elementor-widget-form",
] as const;

function hasVisibleElementorContent(sectionHtml: string): boolean {
  if (/<img[^>]+src="(?:https?:|\/)/i.test(sectionHtml)) return true;
  if (/<iframe[\s>]/i.test(sectionHtml)) return true;
  if (/<video[\s>]/i.test(sectionHtml)) return true;
  if (/elementor-widget-form/i.test(sectionHtml)) return true;
  if (/elementor-button-text[^>]*>[\s\S]*?\S/i.test(sectionHtml)) return true;
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
