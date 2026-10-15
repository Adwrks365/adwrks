#!/usr/bin/env node
/**
 * Report duplicate titles/descriptions and length issues across routable SEO surfaces.
 * Run: node web/scripts/audit-seo-uniqueness.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(__dirname, "..");

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 155;

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(WEB, rel), "utf8"));
}

function normalizePath(input) {
  if (!input || input === "/") return "/";
  let p = input;
  if (p.startsWith("http")) {
    try {
      p = new URL(p).pathname;
    } catch {
      return "/";
    }
  }
  if (!p.startsWith("/")) p = `/${p}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

function collectLocationSeo() {
  const entries = [];
  for (const file of ["src/lib/pages/locations/copy-he.ts", "src/lib/pages/locations/copy-he-extra.ts"]) {
    const src = fs.readFileSync(path.join(WEB, file), "utf8");
    for (const m of src.matchAll(/seoTitle:\s*"([^"]+)"/g)) {
      entries.push({ source: file, title: m[1] });
    }
    for (const m of src.matchAll(/seoDescription:\s*\n?\s*"([^"]+)"/g)) {
      entries.push({ source: file, description: m[1] });
    }
  }
  return entries;
}

function indexByField(records, field) {
  const map = new Map();
  for (const { url, value } of records) {
    if (!value) continue;
    const key = value.trim();
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(url);
  }
  return [...map.entries()].filter(([, urls]) => urls.length > 1);
}

function main() {
  const locales = [
    { id: "he", dir: "src/data/content" },
    { id: "en", dir: "src/data/content-en" },
  ];

  const all = [];
  for (const { id, dir } of locales) {
    const seo = readJson(`${dir}/seo.json`);
    for (const rec of seo) {
      all.push({
        locale: id,
        url: normalizePath(rec.url),
        title: rec.title?.trim() || "",
        description: rec.metaDescription?.trim() || "",
      });
    }
  }

  const titleRecords = all.map((r) => ({ url: `${r.locale}:${r.url}`, value: r.title }));
  const descRecords = all.map((r) => ({ url: `${r.locale}:${r.url}`, value: r.description }));

  const dupTitles = indexByField(titleRecords, "title");
  const dupDescs = indexByField(descRecords, "description");

  const shortTitles = all.filter((r) => r.title && r.title.length < TITLE_MIN);
  const longTitles = all.filter((r) => r.title && r.title.length > TITLE_MAX);
  const shortDescs = all.filter((r) => r.description && r.description.length < DESC_MIN);
  const longDescs = all.filter((r) => r.description && r.description.length > DESC_MAX);
  const missingDescs = all.filter((r) => !r.description);

  console.log("=== SEO uniqueness audit ===\n");
  console.log(`Total records: ${all.length} (he+en seo.json)`);
  console.log(`Duplicate title groups: ${dupTitles.length}`);
  console.log(`Duplicate description groups: ${dupDescs.length}`);
  console.log(`Titles too short (<${TITLE_MIN}): ${shortTitles.length}`);
  console.log(`Titles too long (>${TITLE_MAX}): ${longTitles.length}`);
  console.log(`Descriptions too short (<${DESC_MIN}): ${shortDescs.length}`);
  console.log(`Descriptions too long (>${DESC_MAX}): ${longDescs.length}`);
  console.log(`Missing descriptions: ${missingDescs.length}`);

  if (dupTitles.length) {
    console.log("\n--- Top duplicate titles (first 8 groups) ---");
    for (const [title, urls] of dupTitles.slice(0, 8)) {
      console.log(`\n"${title.slice(0, 70)}${title.length > 70 ? "…" : ""}" (${urls.length} urls)`);
      urls.slice(0, 4).forEach((u) => console.log(`  ${u}`));
    }
  }

  const loc = collectLocationSeo();
  const locTitles = loc.filter((e) => e.title).map((e) => e.title);
  const locTitleDup = locTitles.filter((t, i) => locTitles.indexOf(t) !== i);
  console.log(`\nLocation copy seoTitle entries: ${locTitles.length}, duplicates in copy: ${new Set(locTitleDup).size}`);

  const outDir = path.join(WEB, "..", "migration-audit");
  fs.mkdirSync(outDir, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    duplicateTitleGroups: dupTitles.length,
    duplicateDescriptionGroups: dupDescs.length,
    shortTitles: shortTitles.map((r) => ({ locale: r.locale, url: r.url, title: r.title, len: r.title.length })),
    missingDescriptions: missingDescs.map((r) => ({ locale: r.locale, url: r.url })),
  };
  fs.writeFileSync(path.join(outDir, "seo-uniqueness-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\nWrote migration-audit/seo-uniqueness-report.json`);
}

main();
