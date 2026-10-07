#!/usr/bin/env node
/**
 * Validates hreflang pairs, trailing slashes, and EN internal links.
 * Run: node web/scripts/qa-i18n-seo.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const routesFile = path.join(root, "src", "i18n", "routes.ts");
const postsEn = JSON.parse(
  fs.readFileSync(path.join(root, "src", "data", "content-en", "posts.json"), "utf8"),
);

const routesSource = fs.readFileSync(routesFile, "utf8");
const pairs = [...routesSource.matchAll(/"he": "([^"]+)",\s*\n\s*"en": "([^"]+)"/g)].map((m) => ({
  he: m[1],
  en: m[2],
}));

let errors = 0;

for (const pair of pairs) {
  if (!pair.he.endsWith("/") || !pair.en.endsWith("/")) {
    console.error("Trailing slash missing:", pair);
    errors++;
  }
  if (!pair.en.startsWith("/en/") && pair.en !== "/en/") {
    console.error("EN path must use /en/ prefix:", pair);
    errors++;
  }
}

const hebrewHref = /href="\/(?!en\/|wp-content)[^"]*[\u0590-\u05FF]/;
for (const post of postsEn) {
  if (hebrewHref.test(post.content)) {
    console.error("Hebrew href in EN post:", post.slug);
    errors++;
  }
}

console.log(`Checked ${pairs.length} route pairs and ${postsEn.length} EN posts`);
if (errors > 0) {
  console.error(`${errors} i18n SEO issue(s) found`);
  process.exit(1);
}
console.log("i18n SEO QA passed");
