#!/usr/bin/env node
/** Compare WP sitemapUrls list to routable index — production HTTP for gaps. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(__dirname, "..");
const BASE = "https://adwrks.co.il";

const { sitemapUrls } = JSON.parse(
  fs.readFileSync(path.join(WEB, "src/data/content/urls.json"), "utf8"),
);
const routable = new Set(
  JSON.parse(fs.readFileSync(path.join(WEB, "src/generated/routable-path-index.json"), "utf8")).paths,
);

function normPath(url) {
  const p = new URL(url).pathname;
  return p.endsWith("/") ? p : `${p}/`;
}

const unique = [...new Set(sitemapUrls.map(normPath))];
const notInIndex = unique.filter((p) => !routable.has(p));

async function status(pathname) {
  const url = BASE + pathname;
  const res = await fetch(url, { redirect: "manual" });
  return { url, status: res.status, location: res.headers.get("location") };
}

const sample = notInIndex.slice(0, 40);
const checks = [];
for (const p of sample) {
  checks.push({ path: p, ...(await status(p)) });
}

const summary = {
  wpSitemapPaths: unique.length,
  routableCount: routable.size,
  notInRoutableIndex: notInIndex.length,
  sampleChecked: checks.length,
  sample404: checks.filter((c) => c.status === 404).length,
  sample308: checks.filter((c) => c.status >= 301 && c.status < 400).length,
  sample200: checks.filter((c) => c.status === 200).length,
};

console.log(JSON.stringify({ summary, notInIndex, checks }, null, 2));
