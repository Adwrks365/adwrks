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
  return LEGACY_CONTACT_SECTION_MARKERS.some((marker) => sectionHtml.includes(marker));
}

function isHeadingOnlyTopSection(sectionHtml) {
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

function removeTopLevelElementorSections(html, shouldRemove) {
  const sectionPattern =
    /<section\s[^>]*class="[^"]*elementor-top-section[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
  return html.replace(sectionPattern, (section) => (shouldRemove(section) ? "" : section));
}

function removeLeadingTopLevelSection(html) {
  return html.replace(
    /<section\s[^>]*class="[^"]*elementor-top-section[^"]*"[^>]*>[\s\S]*?<\/section>/i,
    "",
    1,
  );
}

function stripLeadingRedundantElementorSections(html) {
  let result = html;
  let safety = 0;
  while (safety < 20) {
    safety++;
    const leading = result.match(
      /<section\s[^>]*class="[^"]*elementor-top-section[^"]*"[^>]*>[\s\S]*?<\/section>/i,
    )?.[0];
    if (!leading) break;
    const shouldRemove =
      !hasVisibleElementorContent(leading) || isHeadingOnlyTopSection(leading);
    if (!shouldRemove) break;
    result = removeLeadingTopLevelSection(result);
  }
  return result;
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
    html = removeTopLevelElementorSections(
      html,
      (section) => !hasVisibleElementorContent(section),
    );
    if (html === previous) break;
  }
  html = stripLeadingRedundantElementorSections(html);
  return html;
}

function hasEmptyLeadingSection(html) {
  const match = html.match(
    /<section\s[^>]*elementor-top-section[^>]*>[\s\S]*?<\/section>/i,
  );
  if (!match) return false;
  return (
    !hasVisibleElementorContent(match[0]) || isHeadingOnlyTopSection(match[0])
  );
}

const hits = posts.filter((post) =>
  hasEmptyLeadingSection(prepareArticleBodyHtml(post.content)),
);

console.log(
  JSON.stringify(
    {
      redundantLeadingAfterCleanup: hits.length,
      ids: hits.map((p) => p.id),
    },
    null,
    2,
  ),
);
