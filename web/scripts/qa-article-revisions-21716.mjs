/**
 * postId 21716 — shared HE/EN article dates must be locale-specific.
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { resolveArticleDates } from "../src/lib/content/article-dates.ts";

const cases = [
  { path: "/כך-בוחרים-חברה-לשיווק-דיגיטלי/", locale: "he", expect: "2026-11-19" },
  { path: "/en/choosing-digital-marketing-agency/", locale: "en", expect: "2026-11-20" },
];

let failed = 0;
for (const { path, locale, expect } of cases) {
  const c = getContentByPath(path, locale);
  const d = resolveArticleDates(c, locale);
  if (!d.dateModified?.includes(expect)) {
    console.error("FAIL", path, d.dateModified, "expected", expect);
    failed++;
  } else {
    console.log("OK", path, d.dateModified);
  }
}
process.exit(failed ? 1 : 0);