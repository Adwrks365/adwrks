/**
 * CTA centering + batch5 pilot smoke (local prepareArticleBodyHtml).
 * npx tsx scripts/qa-blog-cta-centering.mjs
 */
import { getAllPosts } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { isArticleContactCtaButton, isRepairedArticleCtaAnchor } from "../src/lib/content/article-ctas.ts";

const BATCH5 = new Set([
  "/ניהול-עסק-בעידן-הדיגיטלי/",
  "/יועץ-שיווק-באינטרנט/",
  "/יועץ-אינטרנט/",
  "/אחסון-אתרים-מנוהל/",
  "/החשיבות-של-משרד-פרסום-דיגיטלי/",
  "/en/managing-business-digital-age/",
]);

let failed = 0;
let unwrappedContact = 0;
let wrappedTotal = 0;

for (const locale of ["he", "en"]) {
  for (const post of getAllPosts(locale)) {
    const { html } = prepareArticleBodyHtml(post.content, locale, post.path);
    const re =
      /<div class="elementor-element[^"]*\belementor-widget-button\b[^"]*"[^>]*>\s*<a\s([^>]*)>([\s\S]*?)<\/a>\s*<\/div>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      if (!isArticleContactCtaButton(m[1], m[2])) continue;
      const before = html.slice(Math.max(0, m.index - 120), m.index);
      if (before.includes("article-inline-cta-block")) {
        wrappedTotal++;
      } else if (!isRepairedArticleCtaAnchor(m[1])) {
        unwrappedContact++;
      }
    }
    if (BATCH5.has(post.path)) {
      const lead = html.includes("adwrks-article-lead");
      const faq = (html.match(/adwrks-faq-item/g) || []).length;
      if (!lead || faq < 3) {
        console.error("FAIL batch5 pilot", post.path, { lead, faq });
        failed++;
      } else {
        console.log("OK batch5 pilot", post.path, "faq", faq);
      }
    }
  }
}

console.log({ wrappedTotal, unwrappedContact });
if (unwrappedContact > 50) {
  console.error("WARN high unwrapped contact buttons", unwrappedContact);
}

process.exit(failed ? 1 : 0);