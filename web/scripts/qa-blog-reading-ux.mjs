/**
 * Reading UX QA — Batch4 + regression articles.
 * npx tsx scripts/qa-blog-reading-ux.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";

const HE_BATCH4 = [
  "/פרסום-בגוגל-7-אסטרטגיות/",
  "/חברה-לשיווק-דיגיטלי/",
  "/כך-בוחרים-חברה-לשיווק-דיגיטלי/",
  "/קידום-אתרים-מדריך-למתחילים/",
  "/יועץ-דיגיטל-הוא-השותף-שלך-להצלחה/",
];

let failed = 0;

for (const path of HE_BATCH4) {
  const c = getContentByPath(path, "he");
  const { html, headings } = prepareArticleBodyHtml(c.content, "he", path);
  const leadIdx = html.indexOf("adwrks-article-lead");
  const toc = html.indexOf("article-toc"); // toc is outside body
  const faqIdx = html.indexOf("adwrks-article-faq-block");
  const details = (html.match(/<details class="adwrks-faq-item"/g) || []).length;
  if (details < 4) {
    console.error("FAIL faq count", path, details);
    failed++;
  }
  if (leadIdx === -1 || faqIdx === -1 || leadIdx >= faqIdx) {
    console.error("FAIL lead/faq order", path);
    failed++;
  }
  const dup = headings.filter((h) => /^(סיכום|לסיכום|Summary:)/i.test(h.text.trim()));
  if (dup.length) {
    console.error("FAIL duplicate summary h2", path, dup);
    failed++;
  }
  const dates = resolveArticleDates(c, "he");
  if (!dates.dateModified?.includes("2026-11-19")) {
    console.error("FAIL date", path, dates.dateModified);
    failed++;
  }
  const leadTexts = [...html.matchAll(/adwrks-article-lead__text[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
  const words = leadTexts.join(" ").split(/\s+/).filter(Boolean).length;
  if (words < 25) {
    console.error("FAIL lead thin", path, words);
    failed++;
  }
  console.log("OK", path, "faq", details);
}

for (const [path, locale] of [
  ["/קידום-אתרים-ברוסית/", "he"],
  ["/en/google-shopping-guide/", "en"],
]) {
  const c = getContentByPath(path, locale);
  const { html, headings } = prepareArticleBodyHtml(c.content, locale, path);
  const bad = headings.filter((h) =>
    /Search terms that people search|^Summary:|Sell .*Adwrks/i.test(h.text),
  );
  if (bad.length) {
    console.error("FAIL regression headings", path, bad);
    failed++;
  } else {
    console.log("OK regression", path);
  }
  if (locale === "en" && !html.includes("adwrks-article-lead")) {
    console.error("FAIL en lead", path);
    failed++;
  }
}

process.exit(failed ? 1 : 0);