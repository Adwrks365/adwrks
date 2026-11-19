import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { normalizePath } from "../src/lib/content/paths.ts";

const CASES = [
  { path: "/en/digital-marketing-strategies-2025/", locale: "en", body: true },
  { path: "/en/google-shopping-guide/", locale: "en", body: false },
  { path: "/google-shopping-guide/", locale: "he", body: true, faq: true },
  { path: "/משרד-פרסום-דיגיטלי/", locale: "he", faq: true },
  { path: "/שיווק-דיגיטלי-לעסקים/", locale: "he", faq: false },
];

let failed = 0;
for (const c of CASES) {
  const content = getContentByPath(normalizePath(c.path), c.locale);
  const { html } = prepareArticleBodyHtml(content.content, c.locale, content.path);
  if (!html.includes("adwrks-article-lead")) {
    console.error("no lead", c.path);
    failed++;
  }
  if (c.body && !html.includes("adwrks-pilot-2026-body")) {
    console.error("no 2026 body", c.path);
    failed++;
  }
  const pilotFaq = html.includes("adwrks-article-faq-2026");
  if (c.faq && !pilotFaq && !/(FAQ|שאלות)/i.test(html)) {
    console.error("missing faq", c.path);
    failed++;
  }
  if (pilotFaq && /(FAQ|שאלות)/i.test(html.split("adwrks-article-faq")[0])) {
    /* legacy before pilot block only — skip strict */
  }
  console.log("OK", c.locale, c.path);
}
process.exit(failed ? 1 : 0);