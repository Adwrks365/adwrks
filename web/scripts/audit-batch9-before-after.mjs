/**
 * Before/after audit — batch9 HTML polish (skipBatch9 vs full).
 * Writes migration-audit/BATCH9_HTML_BEFORE_AFTER.json
 * npx tsx scripts/audit-batch9-before-after.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { getContentByPath } from "../src/lib/content/loader.ts";
import { extractArticleHeadings, prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { countTagBalance } from "../src/lib/content/article-html-sanitize.ts";
import { BATCH9_REMOVED_MARKERS } from "../src/lib/content/post-batch9-content-polish.ts";

const ARTICLES = [
  {
    path: "/צמיחה-עסקית-באמצעות-קידום-באינטרנט/",
    locale: "he",
    key: "growth-he",
    preserve: ["כוחו של קידום", "אסטרטגיות", "מדידה"],
    removed: BATCH9_REMOVED_MARKERS["growth-he"],
  },
  {
    path: "/en/google-business-profile/",
    locale: "en",
    key: "gbp-en",
    preserve: ["Google Business Profile", "verification", "reviews"],
    removed: BATCH9_REMOVED_MARKERS["gbp-en"],
  },
  {
    path: "/en/google-business-promotion-guide/",
    locale: "en",
    key: "promo-en",
    preserve: ["SEO", "Google Ads", "Business Profile"],
    removed: BATCH9_REMOVED_MARKERS["promo-en"],
  },
  {
    path: "/en/business-growth-through-seo/",
    locale: "en",
    key: "growth-en",
    preserve: ["SEO", "digital marketing", "growth"],
    removed: BATCH9_REMOVED_MARKERS["growth-en"],
  },
  {
    path: "/en/digital-marketing-agency-maximize/",
    locale: "en",
    key: "agency-en",
    preserve: ["digital marketing agency", "services"],
    removed: BATCH9_REMOVED_MARKERS["agency-en"],
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
  const before = prepareArticleBodyHtml(c.content, row.locale, row.path, { skipBatch9: true });
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
    preserveCheck: { required: row.preserve, missing: missingPreserve, ok: missingPreserve.length === 0 },
    balance: { before: balanceBefore, after: balanceAfter },
    removedLabels: row.removed,
    length: { before: before.html.length, after: after.html.length },
    hasLead: after.html.includes("adwrks-article-lead-2026"),
    hasFaq: after.html.includes("adwrks-article-faq-block"),
  };
}

const articles = ARTICLES.map(auditOne);
const outPath = path.resolve("..", "migration-audit", "BATCH9_HTML_BEFORE_AFTER.json");
writeFileSync(
  outPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), articles }, null, 2),
  "utf8",
);

let failed = 0;
for (const a of articles) {
  if (!a.preserveCheck.ok) {
    console.error("FAIL preserve", a.path, a.preserveCheck.missing);
    failed++;
  }
  const imgDrop = a.images.before - a.images.after;
  if (imgDrop > 2) {
    console.error("FAIL images", a.path, a.images);
    failed++;
  } else if (imgDrop > 0) {
    console.warn("WARN images", a.path, a.images, "(legacy contact/widgets)");
  }
  if (!a.hasLead || !a.hasFaq) {
    console.error("FAIL lead/faq", a.path);
    failed++;
  }
  const imb = a.balance.before;
  const ima = a.balance.after;
  if (ima.div - imb.div < -2 || ima.section - imb.section < -2) {
    console.error("FAIL balance", a.path, { imb, ima });
    failed++;
  }
  console.log("OK", a.path, "len", a.length.before, "->", a.length.after);
}

process.exit(failed ? 1 : 0);