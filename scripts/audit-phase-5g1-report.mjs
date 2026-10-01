#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const audit = JSON.parse(
  fs.readFileSync(path.join(ROOT, "migration-audit", "phase-5g-audit-data.json"), "utf8"),
);
const rating = JSON.parse(
  fs.readFileSync(path.join(ROOT, "migration-audit", "article-rating-migration.json"), "utf8"),
);
const POSTS_PER_PAGE = 9;
const posts = JSON.parse(
  fs.readFileSync(path.join(ROOT, "web", "src", "data", "content", "posts.json"), "utf8"),
);

function stripSidebar(html) {
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
  return result;
}

function hasEmptyLeadingSection(html) {
  const match = html.match(
    /<section\s[^>]*elementor-top-section[^>]*>[\s\S]*?<\/section>/i,
  );
  if (!match) return false;
  const section = match[0];
  const hasContent =
    /<img[^>]+src="(?:https?:|\/)/i.test(section) ||
    /<iframe[\s>]/i.test(section) ||
    /elementor-widget-form/i.test(section) ||
    /<(?:p|h[1-6]|li)[^>]*>[\s\S]*?\S/i.test(section);
  return !hasContent;
}

const blankGapArticles = posts.filter((post) => {
  const prepared = audit.articles.find((a) => a.wordpressId === post.id);
  if (!prepared) return false;
  return hasEmptyLeadingSection(stripSidebar(post.content));
});

const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
const pageSizes = Array.from({ length: totalPages }, (_, i) => {
  const start = i * POSTS_PER_PAGE;
  return posts.length - start >= POSTS_PER_PAGE
    ? POSTS_PER_PAGE
    : posts.length - start;
});

const report = {
  generatedAt: new Date().toISOString(),
  ARTICLES_CLEANED: audit.summary.articlesAudited - audit.summary.withLegacyContactBlocks,
  LEGACY_CONTACT_BLOCKS_REMAINING: audit.summary.withLegacyContactBlocks,
  LEGACY_FORMS_REMAINING: audit.summary.withLegacyForms,
  LEGACY_KEYWORD_BLOCKS: audit.summary.withLegacyKeywordBlocks,
  BLANK_GAP_ARTICLES_REMAINING: blankGapArticles.length,
  BLANK_GAP_ROOT_CAUSE:
    "Empty Elementor top-level section shells (elementor-widget-wrap without populated widgets) left after WordPress migration; removed via stripEmptyElementorSections() in prepareArticleBodyHtml().",
  BLOG_ARTICLES_PER_PAGE: POSTS_PER_PAGE,
  BLOG_PAGE_SIZES: pageSizes,
  BLOG_TOTAL_PAGES: totalPages,
  HISTORICAL_RATING_ARTICLES: rating.articles.length,
  HISTORICAL_TOTAL_VOTES: rating.articles.reduce((sum, a) => sum + Number(a.voteCount || 0), 0),
};

fs.writeFileSync(
  path.join(ROOT, "migration-audit", "phase-5g1-report.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
