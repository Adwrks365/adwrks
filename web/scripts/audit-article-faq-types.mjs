/**
 * Count FAQ presentation types across all posts (he + en).
 * npx tsx scripts/audit-article-faq-types.mjs
 */
import { getAllPosts } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { countVisibleFaqSections } from "../src/lib/content/article-faq-detect.ts";

const stats = {
  none: 0,
  injectedAccordion: 0,
  injectedLegacyOpen: 0,
  legacyH2Only: 0,
  elementorAccordion: 0,
};

function classify(html, audit) {
  const hasAccordion = html.includes("adwrks-faq-accordion");
  const hasInjectedOpen =
    html.includes("adwrks-article-faq-block") &&
    !hasAccordion &&
    /<h3[^>]*>/.test(
      html.match(/adwrks-article-faq-block[\s\S]*?<\/section>/i)?.[0] ?? "",
    );

  if (audit.totalSections === 0) {
    stats.none++;
    return;
  }
  if (hasAccordion) stats.injectedAccordion++;
  else if (hasInjectedOpen) stats.injectedLegacyOpen++;
  else if (audit.legacyFaqH2 > 0 && audit.injectedBlocks === 0) stats.legacyH2Only++;
  else if (audit.accordionWidgets > 0 || audit.toggleWidgets > 0) stats.elementorAccordion++;
  else stats.none++;
}

for (const locale of ["he", "en"]) {
  for (const post of getAllPosts(locale)) {
    const { html } = prepareArticleBodyHtml(post.content, locale, post.path);
    const audit = countVisibleFaqSections(html);
    classify(html, audit);
  }
}

console.log(JSON.stringify(stats, null, 2));