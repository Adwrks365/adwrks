#!/usr/bin/env node
/**
 * Migration validator — compares production WordPress SEO signals
 * against local Next.js build output.
 *
 * Usage:
 *   node scripts/validate-migration.js
 *   node scripts/validate-migration.js --base http://localhost:3000
 *   node scripts/validate-migration.js --output migration-audit/validation-report.json
 */

const fs = require("fs");
const path = require("path");

const AUDIT_DIR = path.join(__dirname, "..", "migration-audit");
const DEFAULT_BASE = process.env.MIGRATION_VALIDATE_BASE || "http://localhost:3000";

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { base: DEFAULT_BASE, output: null, limit: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--base") opts.base = args[++i];
    else if (args[i] === "--output") opts.output = args[++i];
    else if (args[i] === "--limit") opts.limit = Number(args[++i]);
  }
  return opts;
}

function normalizeText(value) {
  return (value || "")
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function extractMeta(html, name, attr = "name") {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, "i");
  return normalizeText(html.match(re)?.[1] || html.match(alt)?.[1] || "");
}

function extractTitle(html) {
  return normalizeText(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "");
}

function extractCanonical(html) {
  const re = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i;
  const alt = /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i;
  return normalizeText(html.match(re)?.[1] || html.match(alt)?.[1] || "");
}

function extractRobots(html) {
  return extractMeta(html, "robots");
}

function extractH1(html) {
  return [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    normalizeText(m[1].replace(/<[^>]+>/g, "")),
  );
}

function extractH2(html) {
  return [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
    normalizeText(m[1].replace(/<[^>]+>/g, "")),
  );
}

function extractOg(html, prop) {
  return extractMeta(html, prop, "property");
}

function extractJsonLdTypes(html) {
  const types = new Set();
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) {
    try {
      const data = JSON.parse(match[1]);
      const walk = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) return node.forEach(walk);
        if (node["@type"]) {
          (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]).forEach((t) =>
            types.add(t),
          );
        }
        Object.values(node).forEach(walk);
      };
      walk(data);
    } catch {
      /* skip */
    }
  }
  return [...types].sort();
}

function extractInternalLinks(html, origin) {
  const links = new Set();
  const re = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = re.exec(html))) {
    const href = match[1];
    if (href.startsWith("/") || href.startsWith(origin)) links.add(href.split("#")[0]);
  }
  return [...links].sort();
}

function isStagingBase(base) {
  return !base.includes("adwrks.co.il");
}

function compareField(name, expected, actual, opts = {}) {
  const e = normalizeText(expected);
  const a = normalizeText(actual);
  if (name === "robots" && opts.staging && a.includes("noindex")) {
    return {
      field: name,
      status: "acceptable",
      expected: e,
      actual: a,
      note: "staging noindex intentional",
    };
  }
  if (!e && !a) return { field: name, status: "acceptable", note: "both empty" };
  if (e === a) return { field: name, status: "exact", expected: e, actual: a };
  if (e && a && (a.includes(e) || e.includes(a)))
    return { field: name, status: "acceptable", expected: e, actual: a, note: "partial match" };
  return { field: name, status: "seo-significant", expected: e, actual: a };
}

function compareArrays(name, expected, actual) {
  const e = expected || [];
  const a = actual || [];
  if (e.length === 0 && a.length === 0) return { field: name, status: "acceptable" };
  const missing = e.filter((x) => !a.some((y) => y === x || y.includes(x) || x.includes(y)));
  const extra = a.filter((x) => !e.some((y) => y === x || y.includes(x) || x.includes(y)));
  if (missing.length === 0 && extra.length === 0) return { field: name, status: "exact" };
  if (missing.length <= Math.ceil(e.length * 0.2))
    return { field: name, status: "acceptable", missing, extra };
  return { field: name, status: "seo-significant", missing, extra, expected: e, actual: a };
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "adwrks-migration-validator/1.0" },
    redirect: "follow",
  });
  const html = await res.text();
  return { status: res.status, html, finalUrl: res.url };
}

async function validateUrl(seoRecord, localBase) {
  const prodUrl = seoRecord.url;
  let localPath;
  try {
    localPath = new URL(prodUrl).pathname;
  } catch {
    return { url: prodUrl, status: "missing", error: "invalid url" };
  }
  if (!localPath.endsWith("/")) localPath += "/";
  const localUrl = `${localBase.replace(/\/$/, "")}${localPath}`;

  const result = {
    url: prodUrl,
    localUrl,
    comparisons: [],
    overall: "exact",
  };

  try {
    const [prod, local] = await Promise.all([fetchHtml(prodUrl), fetchHtml(localUrl)]);

    if (local.status === 404) {
      result.overall = "missing";
      result.error = "local route not found";
      return result;
    }

    result.comparisons.push({
      field: "httpStatus",
      status: prod.status === local.status ? "exact" : "acceptable",
      expected: prod.status,
      actual: local.status,
    });

    const staging = isStagingBase(localBase);
    const checks = [
      compareField("title", extractTitle(prod.html), extractTitle(local.html), { staging }),
      compareField("metaDescription", seoRecord.metaDescription, extractMeta(local.html, "description"), {
        staging,
      }),
      compareField("canonical", seoRecord.canonical || prodUrl, extractCanonical(local.html), { staging }),
      compareField("robots", seoRecord.robots, extractRobots(local.html), { staging }),
      compareField("ogTitle", seoRecord.ogTitle || seoRecord.title, extractOg(local.html, "og:title"), {
        staging,
      }),
      compareField(
        "ogDescription",
        seoRecord.ogDescription || seoRecord.metaDescription,
        extractOg(local.html, "og:description"),
        { staging },
      ),
      compareArrays("h1", seoRecord.h1, extractH1(local.html)),
      compareArrays("h2", seoRecord.h2?.slice(0, 8), extractH2(local.html).slice(0, 8)),
      compareArrays(
        "jsonLdTypes",
        (seoRecord.jsonLd || []).flatMap((b) => {
          const types = [];
          const walk = (n) => {
            if (!n || typeof n !== "object") return;
            if (Array.isArray(n)) return n.forEach(walk);
            if (n["@type"]) types.push(...(Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]));
            Object.values(n).forEach(walk);
          };
          walk(b);
          return types;
        }),
        extractJsonLdTypes(local.html),
      ),
    ];

    result.comparisons.push(...checks);

    const prodOrigin = new URL(prodUrl).origin;
    const prodLinks = (seoRecord.internalLinks || extractInternalLinks(prod.html, prodOrigin)).slice(
      0,
      30,
    );
    const localLinks = extractInternalLinks(local.html, new URL(localBase).origin).slice(0, 30);
    result.comparisons.push(compareArrays("internalLinks", prodLinks, localLinks));

    if (result.comparisons.some((c) => c.status === "missing")) result.overall = "missing";
    else if (result.comparisons.some((c) => c.status === "seo-significant"))
      result.overall = "seo-significant";
    else if (result.comparisons.some((c) => c.status === "acceptable")) result.overall = "acceptable";
    else result.overall = "exact";
  } catch (err) {
    result.overall = "missing";
    result.error = err.message;
  }

  return result;
}

async function main() {
  const opts = parseArgs();
  const seo = JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, "seo.json"), "utf8"));
  const sitemap = JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, "urls.json"), "utf8"));
  const indexable = new Set(sitemap.sitemapUrls.map((u) => u.replace(/\/$/, "") + "/"));

  let targets = seo.filter((r) => indexable.has(r.url.replace(/\/$/, "") + "/"));
  if (opts.limit) targets = targets.slice(0, opts.limit);

  console.log(`Validating ${targets.length} indexable URLs against ${opts.base}...`);

  const results = [];
  for (const record of targets) {
    const row = await validateUrl(record, opts.base);
    results.push(row);
    const icon =
      row.overall === "exact"
        ? "✓"
        : row.overall === "acceptable"
          ? "~"
          : row.overall === "seo-significant"
            ? "!"
            : "✗";
    console.log(`${icon} ${row.url} → ${row.overall}`);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    localBase: opts.base,
    total: results.length,
    exact: results.filter((r) => r.overall === "exact").length,
    acceptable: results.filter((r) => r.overall === "acceptable").length,
    seoSignificant: results.filter((r) => r.overall === "seo-significant").length,
    missing: results.filter((r) => r.overall === "missing").length,
    results,
  };

  const outPath =
    opts.output || path.join(AUDIT_DIR, "validation-report.json");
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`\nReport written to ${outPath}`);
  console.log(
    `Summary: ${summary.exact} exact, ${summary.acceptable} acceptable, ${summary.seoSignificant} SEO-significant, ${summary.missing} missing`,
  );

  if (summary.missing > 0 || summary.seoSignificant > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
