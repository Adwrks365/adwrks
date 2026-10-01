#!/usr/bin/env node
/**
 * Phase 5G — audit legacy article body blocks + keyword sections.
 * Reads migrated posts.json; simulates prepareArticleBodyHtml + processContentHtml checks.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const POSTS_PATH = path.join(ROOT, "web", "src", "data", "content", "posts.json");
const RATING_PATH = path.join(ROOT, "migration-audit", "article-rating-migration.json");
const OUT_PATH = path.join(ROOT, "migration-audit", "phase-5g-audit-data.json");

function decodeHtmlEntities(text) {
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function pathFromLink(link) {
  try {
    const u = new URL(link);
    return u.pathname;
  } catch {
    return link;
  }
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
    let depth = 1;
    let i = colStart + 4;
    let colEnd = -1;
    while (i < result.length && depth > 0) {
      const nextOpen = result.indexOf("<div", i);
      const nextClose = result.indexOf("</div>", i);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        i = nextOpen + 4;
      } else {
        depth--;
        i = nextClose + 6;
        if (depth === 0) colEnd = i;
      }
    }
    if (colEnd === -1) break;
    result = result.slice(0, colStart) + result.slice(colEnd);
  }
  return result
    .replace(/<div[^>]*class="[^"]*trustindex[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<img[^>]+graph\.facebook\.com[^>]*>/gi, "")
    .replace(/<iframe[^>]+trustindex[^>]*>[\s\S]*?<\/iframe>/gi, "");
}

const LEGACY_CONTACT_SECTION_MARKERS = [
  "דרכים ליצירת קשר",
  "אנחנו כאן לכל שאלה, בדרך הנוחה ביותר עבורך",
  "elementor-widget-form",
];

function hasVisibleElementorContent(sectionHtml) {
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

function stripLegacyArticleContactBlocks(html) {
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

function stripEmptyElementorSections(html) {
  let result = html;
  let previous = "";
  let safety = 0;
  while (result !== previous && safety < 20) {
    safety++;
    previous = result;
    result = removeTopLevelElementorSections(result, (section) => !hasVisibleElementorContent(section));
  }
  return result;
}

function prepareArticleBodyHtml(rawHtml) {
  let html = stripEmbeddedArticleSidebar(rawHtml);
  html = stripLegacyArticleContactBlocks(html);
  html = stripEmptyElementorSections(html);
  html = html.replace(
    /<div class="elementor-widget-container">\s*<h1[^>]*>[\s\S]*?<\/h1>\s*<\/div>/i,
    "",
  );
  html = html.replace(/<h1(\s[^>]*)?>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");
  return html;
}

function stripShortcodes(html) {
  return html.replace(/\[[\w\-]+(?:[^\]]*)?\]/g, "");
}

function processContentHtml(html) {
  if (!html) return "";
  return stripShortcodes(html)
    .replace(/meta-parners\.png/gi, "google-meta-partners-e1769685292174.webp")
    .replace(/\t/g, "")
    .replace(/<script(?![^>]*type\s*=\s*["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
}

const LEGACY_PATTERNS = {
  contact_section_heading: {
    label: 'Legacy contact section heading "דרכים ליצירת קשר"',
    test: (h) => /דרכים ליצירת קשר/.test(h),
    htmlHint: 'elementor-heading-title containing "דרכים ליצירת קשר"',
  },
  elementor_contact_form: {
    label: "Legacy Elementor contact form in body",
    test: (h) =>
      /elementor-widget-form|class="elementor-form"|elementor-field-type-email|wpcf7-form|type="tel"[^>]*elementor/.test(
        h,
      ),
    htmlHint: "elementor-widget-form / elementor-form markup",
  },
  legacy_contact_details: {
    label: "Legacy inline contact details block",
    test: (h) => {
      const hasPhone = /079[- ]?5599449|055[- ]?5589449/.test(h);
      const hasEmail = /info@adwrks\.co\.il/.test(h);
      const hasAddress = /מתכת\s*34|כרמיאל/.test(h);
      const hits = [hasPhone, hasEmail, hasAddress].filter(Boolean).length;
      return hits >= 2;
    },
    htmlHint: "phone + email and/or address cluster in article body HTML",
  },
  opening_hours: {
    label: "Legacy opening hours block",
    test: (h) => /שעות פתיחה|א['']-ה['']|שישי.*שבת.*סגור|09:00.?17:00/.test(h),
    htmlHint: "business hours text in migrated Elementor block",
  },
  legacy_social_links: {
    label: "Legacy social links block in body",
    test: (h) =>
      /elementor-social-icon|class="[^"]*social-icons[^"]*"|facebook\.com\/adwrks|instagram\.com\/adwrks/.test(
        h,
      ),
    htmlHint: "elementor-social-icon or hardcoded social URLs in body",
  },
  partner_promo_image: {
    label: "Legacy Google/Meta partner promotional image",
    test: (h) =>
      /meta-parners|google-meta-partners|Google Partner|Meta Partner|google-partner|meta-partner/i.test(
        h,
      ) && /<img[^>]+(?:meta-parners|google-meta-partners|partner)/i.test(h),
    htmlHint: "partner badge img in article body (not sidebar template)",
  },
  rate_my_post_widget: {
    label: "Legacy Rate My Post widget embedded in body",
    test: (h) => /rate-my-post|rmp-|data-post-id/.test(h),
    htmlHint: "Rate My Post plugin markup still in article HTML",
  },
};

const KEYWORD_PATTERNS = {
  keyword_block_heading: {
    label: "Legacy SEO keyword block heading",
    test: (h) => /מונחי חיפוש/.test(h),
    htmlHint: 'heading like "מונחי חיפוש פופולריים/פופלריים בנושא..."',
  },
  keyword_list_density: {
    label: "Large keyword list following SEO block",
    test: (h) => {
      if (!/מונחי חיפוש/.test(h)) return false;
      const idx = h.search(/מונחי חיפוש/);
      const slice = h.slice(idx, idx + 4000);
      const liCount = (slice.match(/<li[\s>]/gi) || []).length;
      const pKeywordLines = (slice.match(/קידום|פרסום|SEO|גוגל/gi) || []).length;
      return liCount >= 5 || pKeywordLines >= 8;
    },
    htmlHint: "unordered list or dense keyword lines after heading",
  },
};

function detectPatterns(html, patternMap) {
  const found = [];
  for (const [key, def] of Object.entries(patternMap)) {
    if (def.test(html)) found.push({ key, ...def });
  }
  return found;
}

function plainTextLength(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
}

function keywordBlockTextLength(html) {
  const m = html.match(/מונחי חיפוש[\s\S]{0,8000}/i);
  if (!m) return 0;
  return plainTextLength(m[0]);
}

const posts = JSON.parse(fs.readFileSync(POSTS_PATH, "utf8"));
const ratingData = JSON.parse(fs.readFileSync(RATING_PATH, "utf8"));

const articles = posts.map((post) => {
  const title = decodeHtmlEntities(post.title.replace(/<[^>]+>/g, ""));
  const url = pathFromLink(post.link);
  const raw = post.content || "";
  const prepared = prepareArticleBodyHtml(raw);
  const rendered = processContentHtml(prepared);

  const legacyRaw = detectPatterns(prepared, LEGACY_PATTERNS);
  const legacyRendered = detectPatterns(rendered, LEGACY_PATTERNS);
  const keywordRaw = detectPatterns(prepared, KEYWORD_PATTERNS);
  const keywordRendered = detectPatterns(rendered, KEYWORD_PATTERNS);

  const legacyKeys = [...new Set([...legacyRaw.map((x) => x.key), ...legacyRendered.map((x) => x.key)])];
  const keywordKeys = [...new Set([...keywordRaw.map((x) => x.key), ...keywordRendered.map((x) => x.key)])];

  return {
    url,
    title,
    wordpressId: post.id,
    legacyBlocks: legacyKeys.map((key) => {
      const def = LEGACY_PATTERNS[key];
      return { key, label: def.label, htmlHint: def.htmlHint, inRendered: legacyRendered.some((x) => x.key === key) };
    }),
    keywordBlocks: keywordKeys.map((key) => {
      const def = KEYWORD_PATTERNS[key];
      return {
        key,
        label: def.label,
        htmlHint: def.htmlHint,
        inRendered: keywordRendered.some((x) => x.key === key),
        keywordSectionTextChars: keywordBlockTextLength(rendered),
      };
    }),
    hasLegacyContact: legacyKeys.some((k) =>
      ["contact_section_heading", "elementor_contact_form", "legacy_contact_details"].includes(k),
    ),
    hasLegacyKeywordBlock: keywordKeys.includes("keyword_block_heading"),
  };
});

const summary = {
  articlesAudited: articles.length,
  withLegacyContactBlocks: articles.filter((a) =>
    a.legacyBlocks.some((b) =>
      ["contact_section_heading", "elementor_contact_form", "legacy_contact_details", "opening_hours"].includes(
        b.key,
      ),
    ),
  ).length,
  withLegacyForms: articles.filter((a) => a.legacyBlocks.some((b) => b.key === "elementor_contact_form")).length,
  withLegacyKeywordBlocks: articles.filter((a) => a.hasLegacyKeywordBlock).length,
  withPartnerImage: articles.filter((a) => a.legacyBlocks.some((b) => b.key === "partner_promo_image")).length,
  withLegacySocial: articles.filter((a) => a.legacyBlocks.some((b) => b.key === "legacy_social_links")).length,
  withRateMyPostInBody: articles.filter((a) => a.legacyBlocks.some((b) => b.key === "rate_my_post_widget")).length,
};

const totalVotes = ratingData.articles.reduce((sum, a) => sum + Number(a.voteCount || 0), 0);

const output = {
  generatedAt: new Date().toISOString(),
  summary,
  ratingMigration: {
    postsChecked: ratingData.postsChecked,
    withVotes: ratingData.withVotes,
    totalVotes,
    articles: ratingData.articles.length,
  },
  articles,
};

fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));

console.log(JSON.stringify({ summary, ratingMigration: output.ratingMigration }, null, 2));
