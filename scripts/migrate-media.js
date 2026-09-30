#!/usr/bin/env node
/**
 * Download WordPress upload assets referenced in migration audit
 * to web/public/wp-content/uploads/ preserving paths.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const AUDIT = path.join(ROOT, "migration-audit");
const PUBLIC_UPLOADS = path.join(ROOT, "web", "public", "wp-content", "uploads");
const MAP_FILE = path.join(AUDIT, "media-map.json");

const UPLOAD_RE =
  /https?:\/\/(?:www\.)?adwrks\.co\.il\/wp-content\/uploads\/[A-Za-z0-9_\-./%]+\.(?:webp|png|jpe?g|gif|svg|avif|ico)/gi;

function collectUrls() {
  const urls = new Set();
  const files = [
    "pages.json",
    "posts.json",
    "seo.json",
    "media.json",
    "elementor-templates.json",
  ];
  for (const file of files) {
    const fp = path.join(AUDIT, file);
    if (!fs.existsSync(fp)) continue;
    const text = fs.readFileSync(fp, "utf8");
    let m;
    while ((m = UPLOAD_RE.exec(text))) {
      urls.add(m[0].split("?")[0].replace("https://www.adwrks.co.il", "https://adwrks.co.il"));
    }
  }
  for (const rel of ["web/src/lib/site.ts", "web/src/lib/homepage/data.ts"]) {
    const fp = path.join(ROOT, rel);
    if (!fs.existsSync(fp)) continue;
    const text = fs.readFileSync(fp, "utf8");
    let m;
    while ((m = UPLOAD_RE.exec(text))) {
      urls.add(m[0].split("?")[0]);
    }
  }
  return [...urls].sort();
}

function localPathFromUrl(url) {
  const u = new URL(url);
  const rel = u.pathname.replace(/^\/wp-content\/uploads\//, "");
  return path.join(PUBLIC_UPLOADS, rel.replace(/\//g, path.sep));
}

function fetchFile(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, { headers: { "User-Agent": "AdwrksMigration/1.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchFile(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function main() {
  const urls = collectUrls();
  const mapping = {};
  const stats = { total: urls.length, downloaded: 0, skipped: 0, failed: [] };

  fs.mkdirSync(PUBLIC_UPLOADS, { recursive: true });

  for (const url of urls) {
    const local = localPathFromUrl(url);
    const localUrl = `/wp-content/uploads/${path.relative(PUBLIC_UPLOADS, local).replace(/\\/g, "/")}`;
    mapping[url] = localUrl;

    if (fs.existsSync(local) && fs.statSync(local).size > 0) {
      stats.skipped++;
      continue;
    }

    fs.mkdirSync(path.dirname(local), { recursive: true });
    try {
      const buf = await fetchFile(url);
      fs.writeFileSync(local, buf);
      stats.downloaded++;
      process.stdout.write(".");
    } catch (err) {
      stats.failed.push({ url, error: err.message });
      process.stdout.write("x");
    }
  }

  fs.writeFileSync(MAP_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), mapping, stats }, null, 2));
  console.log("\n", stats);
  if (stats.failed.length) {
    console.log("Failed:", stats.failed.length);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
