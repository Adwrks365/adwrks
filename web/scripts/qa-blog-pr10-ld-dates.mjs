/**
 * Batch5 JSON-LD dateModified vs revisions.
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";

const BATCH5 = [
  ["/ניהול-עסק-בעידן-הדיגיטלי/", "he"],
  ["/יועץ-שיווק-באינטרנט/", "he"],
  ["/en/managing-business-digital-age/", "en"],
];

let failed = 0;
for (const [p, locale] of BATCH5) {
  const c = getContentByPath(p, locale);
  const dates = resolveArticleDates(c, locale);
  prepareArticleBodyHtml(c.content, locale, p);
  if (!dates.dateModified?.includes("2026-11-19")) {
    console.error("FAIL visible date", p, dates.dateModified);
    failed++;
  } else {
    console.log("OK date", p, dates.dateModified);
  }
}
process.exit(failed ? 1 : 0);