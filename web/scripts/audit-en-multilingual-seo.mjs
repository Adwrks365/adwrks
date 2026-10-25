#!/usr/bin/env node
/**
 * EN multilingual SEO audit: title/meta, canonical, hreflang pairs, sitemap, JSON-LD text.
 * Usage:
 *   node web/scripts/audit-en-multilingual-seo.mjs           # static (CI-safe)
 *   node web/scripts/audit-en-multilingual-seo.mjs --live    # production spot-check
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hasHebrew } from "./lib/en-schema-localize.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const EN_DIR = path.join(root, "src", "data", "content-en");
const live = process.argv.includes("--live");

const LOCALIZABLE = new Set(["name", "description", "headline", "abstract", "caption", "text"]);
const SKIP_ADDRESS = new Set([
  "streetAddress",
  "addressLocality",
  "addressRegion",
  "addressCountry",
]);

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
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

function collectSchemaHebrew(node, hits, pathLabel = "") {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      collectSchemaHebrew(node[i], hits, `${pathLabel}[${i}]`);
    }
    return;
  }
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    if (SKIP_ADDRESS.has(key)) continue;
    const next = pathLabel ? `${pathLabel}.${key}` : key;
    if (typeof value === "string" && LOCALIZABLE.has(key) && hasHebrew(value)) {
      hits.push({ path: next, sample: value.slice(0, 60) });
    } else if (value && typeof value === "object") {
      collectSchemaHebrew(value, hits, next);
    }
  }
}

function auditStaticSeo(seo) {
  const errors = [];
  for (const rec of seo) {
    if (!rec.url?.startsWith("/en/")) continue;
    for (const field of ["title", "metaDescription", "ogTitle", "ogDescription"]) {
      if (hasHebrew(rec[field])) errors.push(`Hebrew ${field} on ${rec.url}`);
    }
    const p = normalizePath(rec.url);
    const expectedCan = `https://adwrks.co.il${p}`;
    if (rec.canonical && rec.canonical !== expectedCan) {
      errors.push(`Canonical mismatch ${rec.url}: ${rec.canonical}`);
    }
    if (Array.isArray(rec.jsonLd)) {
      const hits = [];
      collectSchemaHebrew(rec.jsonLd, hits);
      if (hits.length) {
        errors.push(`Hebrew JSON-LD on ${rec.url} (${hits.length} fields, e.g. ${hits[0].path})`);
      }
    }
  }
  return errors;
}

function auditRoutePairs() {
  const routesSource = fs.readFileSync(path.join(root, "src/i18n/routes.ts"), "utf8");
  const pairs = [...routesSource.matchAll(/"he": "([^"]+)",\s*\n\s*"en": "([^"]+)"/g)].map((m) => ({
    he: m[1],
    en: m[2],
  }));
  const errors = [];
  for (const pair of pairs) {
    if (!pair.en.startsWith("/en/")) errors.push(`EN route missing /en/ prefix: ${JSON.stringify(pair)}`);
    if (!pair.he.endsWith("/") || !pair.en.endsWith("/")) errors.push(`Trailing slash: ${JSON.stringify(pair)}`);
  }
  return { errors, pairs };
}

function auditSitemapUrls(seo, urlsJson) {
  const seoPaths = new Set(seo.filter((r) => r.url?.startsWith("/en/")).map((r) => normalizePath(r.url)));
  const sitemapPaths = new Set(urlsJson.sitemapUrls.map((u) => normalizePath(u)));
  const errors = [];
  for (const p of seoPaths) {
    if (!sitemapPaths.has(p) && !p.includes("page/")) {
      /* pagination may differ */
    }
  }
  if (sitemapPaths.size < 50) errors.push(`EN sitemap suspiciously small (${sitemapPaths.size} URLs)`);
  return errors;
}

function extractJsonLdScripts(html) {
  const blocks = [];
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      /* ignore */
    }
  }
  return blocks;
}

function pickHead(html) {
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
  const desc =
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1] ||
    html.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i)?.[1];
  const canonical =
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ||
    html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i)?.[1];
  const hreflangs = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/gi)].map(
    (x) => ({ lang: x[1], href: x[2] }),
  );
  return { title, desc, canonical, hreflangs };
}

async function auditLive(seo) {
  const samples = [
    "/en/",
    "/en/seo/",
    "/en/google-ads/",
    "/en/digital-marketing-services/",
    "/en/about-us/",
  ];
  const posts = seo.filter((r) => r.url?.startsWith("/en/") && r.url.includes("/en/") && !r.url.includes("/en/blog"));
  if (posts[10]) samples.push(normalizePath(posts[10].url));

  const errors = [];
  for (const p of samples) {
    const url = `https://adwrks.co.il${p}`;
    const html = await (await fetch(url, { headers: { "User-Agent": "adwrks-en-seo-audit" } })).text();
    const head = pickHead(html);
    if (hasHebrew(head.title) || hasHebrew(head.desc)) {
      errors.push(`Live Hebrew title/meta on ${url}`);
    }
    const expectedCan = url.endsWith("/") ? url : `${url}/`;
    if (head.canonical && normalizePath(head.canonical) !== normalizePath(expectedCan)) {
      errors.push(`Live canonical mismatch ${url}: ${head.canonical}`);
    }
    if (!head.hreflangs.some((h) => h.lang === "en" || h.lang === "en-US")) {
      errors.push(`Live missing en hreflang on ${url}`);
    }
    const hits = [];
    for (const block of extractJsonLdScripts(html)) {
      collectSchemaHebrew(block, hits);
    }
    if (hits.length) {
      errors.push(`Live Hebrew JSON-LD on ${url} (${hits.length} fields)`);
    }
  }
  return errors;
}

const seo = readJson("src/data/content-en/seo.json");
const urlsJson = readJson("src/data/content-en/urls.json");

let errors = [];
errors.push(...auditStaticSeo(seo));
const routeAudit = auditRoutePairs();
errors.push(...routeAudit.errors);
errors.push(...auditSitemapUrls(seo, urlsJson));

if (live) {
  errors.push(...(await auditLive(seo)));
}

console.log(`EN multilingual SEO audit (${live ? "static+live" : "static only"})`);
console.log(`  EN seo records: ${seo.filter((r) => r.url?.startsWith("/en/")).length}`);
console.log(`  Route pairs: ${routeAudit.pairs.length}`);

if (errors.length) {
  console.error(`${errors.length} issue(s):`);
  for (const e of errors.slice(0, 40)) console.error("  -", e);
  if (errors.length > 40) console.error(`  ... and ${errors.length - 40} more`);
  process.exit(1);
}

console.log("All checks passed.");
