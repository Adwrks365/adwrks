/**
 * Batch4 + FAQ layout + ratings resolve smoke.
 * npx tsx scripts/qa-batch4-faq-2026.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { normalizePath } from "../src/lib/content/paths.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";

const BATCH4 = [
  "/פרסום-בגוגל-7-אסטרטגיות/",
  "/חברה-לשיווק-דיגיטלי/",
  "/כך-בוחרים-חברה-לשיווק-דיגיטלי/",
  "/קידום-אתרים-מדריך-למתחילים/",
  "/יועץ-דיגיטל-הוא-השותף-שלך-להצלחה/",
];

const FAQ_LAYOUT = ["/קידום-אתרים-ברוסית/", "/google-shopping-guide/"];

let failed = 0;

for (const path of [...BATCH4, ...FAQ_LAYOUT, "/בדיקת-מהירות-אתר/"]) {
  const key = normalizePath(path);
  const content = getContentByPath(key, "he");
  if (!content) {
    console.error("MISSING", path);
    failed++;
    continue;
  }
  const { html } = prepareArticleBodyHtml(content.content, "he", key);
  const faqBlock = html.match(/<section[^>]*adwrks-article-faq-block[\s\S]*?<\/section>/i)?.[0] ?? "";
  const containerFlexCol = faqBlock.includes("adwrks-faq-accordion");
  const headingBeforeAccordion =
    faqBlock.indexOf("<h2") !== -1 &&
    faqBlock.indexOf("<h2") < faqBlock.indexOf("adwrks-faq-accordion");

  if (path.includes("מהירות")) {
    if (!html.includes("data-adwrks-pagespeed-insights")) {
      console.error("FAIL pagespeed embed", path);
      failed++;
    } else {
      console.log("OK pagespeed", path);
    }
    continue;
  }

  if (BATCH4.includes(path)) {
    if ((html.match(/class="adwrks-article-lead"/g) || []).length !== 1) {
      console.error("FAIL lead", path);
      failed++;
      continue;
    }
    const dates = resolveArticleDates(content, "he");
    if (!dates.dateModified.includes("2026-11-19")) {
      console.error("FAIL date", path, dates.dateModified);
      failed++;
      continue;
    }
  }

  if (faqBlock && (!containerFlexCol || !headingBeforeAccordion)) {
    console.error("FAIL faq layout", path, { containerFlexCol, headingBeforeAccordion });
    failed++;
  } else if (faqBlock) {
    console.log("OK faq layout", path);
  } else if (BATCH4.includes(path)) {
    console.error("FAIL no faq block", path);
    failed++;
  } else {
    console.log("OK", path);
  }
}

for (const path of ["/קידום-אתרים-ברוסית/", "/en/google-seo/"]) {
  const locale = path.startsWith("/en/") ? "en" : "he";
  const content = getContentByPath(normalizePath(path), locale);
  const { html } = prepareArticleBodyHtml(content.content, locale, path);
  const block = html.match(/adwrks-article-faq-block[\s\S]*?<\/section>/i)?.[0] ?? "";
  if (block && block.indexOf("adwrks-faq-accordion") > block.indexOf("<h2")) {
    console.log("OK faq order", path);
  } else if (block) {
    console.error("FAIL faq order", path);
    failed++;
  }
}

process.exit(failed ? 1 : 0);