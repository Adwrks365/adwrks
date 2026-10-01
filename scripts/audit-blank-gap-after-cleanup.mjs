import fs from "fs";

const posts = JSON.parse(
  fs.readFileSync("web/src/data/content/posts.json", "utf8"),
);

function findBalancedDivClose(html, openIndex) {
  let depth = 1;
  let i = openIndex + 4;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      i = nextClose + 6;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function stripEmbeddedArticleSidebar(html) {
  let result = html;
  const marker = "elementor-inner-column elementor-col-33";
  let safety = 0;
  while (result.includes(marker) && safety < 50) {
    safety++;
    const idx = result.indexOf(marker);
    const colStart = result.lastIndexOf("<div", idx);
    if (colStart === -1) break;
    const colEnd = findBalancedDivClose(result, colStart);
    if (colEnd === -1) break;
    result = result.slice(0, colStart) + result.slice(colEnd);
  }
  return result;
}

const LEGACY_CONTACT_SECTION_MARKERS = [
  "דרכים ליצירת קשר",
  "אנחנו כאן לכל שאלה, בדרך הנוחה ביותר עבורך",
  "elementor-widget-form",
];

function hasVisibleElementorContent(sectionHtml) {
  if (/<img[^>]+src="(?:https?:|\/)/i.test(sectionHtml)) return true;
  if (/<iframe[\s>]/i.test(sectionHtml)) return true;
  if (/elementor-widget-form/i.test(sectionHtml)) return true;
  if (/elementor-button-text[^>]*>[\s\S]*?\S/i.test(sectionHtml)) return true;
  if (/<(?:p|h[1-6]|li|td|th|figcaption|blockquote)[^>]*>[\s\S]*?\S/i.test(sectionHtml)) {
    return true;
  }
  return false;
}

function isLegacyContactSection(sectionHtml) {
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

function removeTopLevelElementorSections(html, shouldRemove) {
  const sectionPattern =
    /<section\s[^>]*class="[^"]*elementor-top-section[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
  return html.replace(sectionPattern, (section) => (shouldRemove(section) ? "" : section));
}

function prepareArticleBodyHtml(rawHtml) {
  let html = stripEmbeddedArticleSidebar(rawHtml);
  let previous = "";
  for (let i = 0; i < 20; i++) {
    previous = html;
    html = removeTopLevelElementorSections(html, isLegacyContactSection);
    if (html === previous) break;
  }
  for (let i = 0; i < 20; i++) {
    previous = html;
    html = removeTopLevelElementorSections(html, (section) => !hasVisibleElementorContent(section));
    if (html === previous) break;
  }
  return html;
}

function hasEmptyLeadingSection(html) {
  const match = html.match(
    /<section\s[^>]*elementor-top-section[^>]*>[\s\S]*?<\/section>/i,
  );
  if (!match) return false;
  return !hasVisibleElementorContent(match[0]);
}

const hits = posts.filter((post) =>
  hasEmptyLeadingSection(prepareArticleBodyHtml(post.content)),
);

console.log(JSON.stringify({ emptyLeadingAfterCleanup: hits.length, ids: hits.map((p) => p.id) }, null, 2));
