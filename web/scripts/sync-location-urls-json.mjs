import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.join(__dirname, "..");
const DOMAIN = "https://adwrks.co.il";

function collectLocationUrls() {
  const src = fs.readFileSync(path.join(WEB_ROOT, "src/lib/pages/locations/paths.ts"), "utf8");
  const block = src.slice(
    src.indexOf("export const LOCATION_ROUTES"),
    src.indexOf("];", src.indexOf("LOCATION_ROUTES")) + 2,
  );
  const he = [...block.matchAll(/he: "([^"]+)"/g)].map((m) => m[1]);
  const en = [...block.matchAll(/en: "([^"]+)"/g)].map((m) => m[1]);
  return {
    he: he.map((p) => `${DOMAIN}${encodeURI(p)}`),
    en: en.map((p) => `${DOMAIN}${encodeURI(p)}`),
  };
}

function mergeUrls(jsonPath, toAdd) {
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const set = new Set(data.sitemapUrls);
  for (const url of toAdd) set.add(url);
  data.sitemapUrls = [...set].sort();
  fs.writeFileSync(jsonPath, `${JSON.stringify(data)}\n`);
  console.log(`Updated ${jsonPath} (+${toAdd.length} location urls, total ${data.sitemapUrls.length})`);
}

const loc = collectLocationUrls();
mergeUrls(path.join(WEB_ROOT, "src/data/content/urls.json"), loc.he);
mergeUrls(path.join(WEB_ROOT, "src/data/content-en/urls.json"), loc.en);
