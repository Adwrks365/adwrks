/**
 * Before/after audit — batch8 HTML polish (pipeline with skipBatch8 vs full).
 * Writes migration-audit/BATCH8_HTML_BEFORE_AFTER.json
 * npx tsx scripts/audit-batch8-before-after.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { getContentByPath } from "../src/lib/content/loader.ts";
import { extractArticleHeadings, prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { countTagBalance } from "../src/lib/content/article-html-sanitize.ts";
import { BATCH8_REMOVED_MARKERS } from "../src/lib/content/post-batch8-content-polish.ts";

const ARTICLES = [
  {
    path: "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/",
    locale: "he",
    key: "popular-he",
    preserve: ["איך חיפושים פופולריים", "מה אפשר ללמוד", "איך אנחנו משתמשים"],
    removed: BATCH8_REMOVED_MARKERS.popular,
  },
  {
    path: "/google-business-profile/",
    locale: "he",
    key: "gbp-he",
    preserve: ["מהו פרופיל העסק", "כיצד להגדיר", "כיצד לבצע אופטימיזציה", "לקוחות ממליצים"],
    removed: BATCH8_REMOVED_MARKERS.gbp,
  },
  {
    path: "/en/popular-google-searches-israel/",
    locale: "en",
    key: "popular-en",
    preserve: ["How can popular Google searches", "What can be learned"],
    removed: BATCH8_REMOVED_MARKERS.popular,
  },
  {
    path: "/en/power-of-reviews/",
    locale: "en",
    key: "reviews-en",
    preserve: ["The impact of online reviews", "The power of reviews"],
    removed: BATCH8_REMOVED_MARKERS.reviews,
  },
  {
    path: "/en/digital-advertising-office/",
    locale: "en",
    key: "office-en",
    preserve: ["Where can I promote", "What are the advantages", "Who can help"],
    removed: BATCH8_REMOVED_MARKERS.office,
  },
];

function countImages(html) {
  return (html.match(/<img\b/gi) || []).length;
}

function countLinks(html) {
  return (html.match(/<a\b/gi) || []).length;
}

function headingTexts(html) {
  return extractArticleHeadings(html).map((h) => `${h.level}:${h.text.slice(0, 80)}`);
}

function auditOne(row) {
  const c = getContentByPath(row.path, row.locale);
  const before = prepareArticleBodyHtml(c.content, row.locale, row.path, { skipBatch8: true });
  const after = prepareArticleBodyHtml(c.content, row.locale, row.path);
  const beforeH = new Set(headingTexts(before.html));
  const afterH = new Set(headingTexts(after.html));
  const removedHeadings = [...beforeH].filter((h) => !afterH.has(h));
  const addedHeadings = [...afterH].filter((h) => !beforeH.has(h));
  const missingPreserve = row.preserve.filter((s) => !after.html.includes(s));
  const balanceBefore = countTagBalance(before.html);
  const balanceAfter = countTagBalance(after.html);
  return {
    path: row.path,
    locale: row.locale,
    images: { before: countImages(before.html), after: countImages(after.html) },
    links: { before: countLinks(before.html), after: countLinks(after.html) },
    headings: {
      beforeCount: beforeH.size,
      afterCount: afterH.size,
      removed: removedHeadings,
      added: addedHeadings,
    },
    tagBalance: { before: balanceBefore, after: balanceAfter },
    intentionalRemovals: row.removed,
    preserveCheck: { ok: missingPreserve.length === 0, missing: missingPreserve },
    flags: {
      trendsWidget: after.html.includes('id="google-trends-widget"'),
      gbpBridge: after.html.includes("adwrks-sprint2-gbp-service-bridge"),
      adsense: /adsbygoogle/i.test(after.html),
      sneakPeek: /Get a sneak peek at the stats/i.test(after.html),
      enjoyPackages: /With us you can enjoy advertising packages/i.test(after.html),
    },
  };
}

const report = {
  generatedAt: new Date().toISOString(),
  articles: ARTICLES.map(auditOne),
};

const out = path.resolve("..", "migration-audit", "BATCH8_HTML_BEFORE_AFTER.json");
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
console.log("Wrote", out);
let failed = 0;
for (const a of report.articles) {
  if (!a.preserveCheck.ok) {
    console.error("FAIL preserve", a.path, a.preserveCheck.missing);
    failed++;
  }
  const divDelta = a.tagBalance.after.div - a.tagBalance.before.div;
  const secDelta = a.tagBalance.after.section - a.tagBalance.before.section;
  if (Math.abs(divDelta) > 2 || Math.abs(secDelta) > 2) {
    console.error("FAIL tag balance delta", a.path, { divDelta, secDelta });
    failed++;
  }
  if (Object.values(a.flags).some(Boolean)) {
    console.error("FAIL leftover removed content", a.path, a.flags);
    failed++;
  }
  if (a.images.after < a.images.before) {
    console.error("WARN images dropped", a.path, a.images);
  }
  console.log("OK", a.path, "img", a.images, "links", a.links);
}
process.exit(failed ? 1 : 0);