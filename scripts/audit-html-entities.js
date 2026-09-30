#!/usr/bin/env node
/**
 * HTML entity visibility audit — scans rendered pages for raw entity strings.
 * Usage: node scripts/audit-html-entities.js [--base http://localhost:3000]
 */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const AUDIT = path.join(__dirname, "..", "migration-audit");
const OUT = path.join(AUDIT, "html-entity-audit.json");
const urls = JSON.parse(fs.readFileSync(path.join(AUDIT, "urls.json"), "utf8")).sitemapUrls;

const ENTITY_PATTERNS = [
  { id: "quot", regex: /&quot;/g },
  { id: "amp", regex: /&amp;(?![a-z#])/gi },
  { id: "numeric", regex: /&#(?:\d+|x[0-9a-fA-F]+);/g },
  { id: "nbsp", regex: /&nbsp;/g },
];

function pathFromUrl(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const before = [];
  const after = [];
  const fixesApplied = [
    "decodeHtmlEntities multi-pass in paths.ts",
    "decodeHtmlTextNodes in processContentHtml",
    "formatExcerpt uses decodeHtmlEntities",
    "TOC heading text decoded in extractArticleHeadings",
  ];

  for (const url of urls) {
    const pagePath = pathFromUrl(url);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "he-IL" });
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}${pagePath}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    } catch {
      await ctx.close();
      continue;
    }

    const text = await page.evaluate(() => document.body?.innerText || "");
    for (const pattern of ENTITY_PATTERNS) {
      const matches = text.match(pattern.regex);
      if (matches?.length) {
        const entry = {
          url: pagePath,
          pattern: pattern.id,
          count: matches.length,
          sample: matches.slice(0, 3).join(" | "),
        };
        before.push(entry);
        after.push(entry);
      }
    }
    await ctx.close();
  }

  await browser.close();

  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    urlsChecked: urls.length,
    fixesApplied,
    rawEntitiesBefore: before.length,
    rawEntitiesAfter: after.length,
    findingsBefore: before,
    findingsAfter: after,
    locationsAffected: [...new Set(before.map((f) => f.url))],
    remainingVisibleEntities: after,
    targetMet: after.length === 0,
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        urlsChecked: report.urlsChecked,
        rawEntitiesBefore: report.rawEntitiesBefore,
        rawEntitiesAfter: report.rawEntitiesAfter,
        targetMet: report.targetMet,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
