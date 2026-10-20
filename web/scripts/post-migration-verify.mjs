#!/usr/bin/env node
/**
 * Production crawl: all routable paths — status, redirects, core SEO in raw HTML.
 * Run: node web/scripts/post-migration-verify.mjs [--base=https://adwrks.co.il] [--out=path.json]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(__dirname, "..");

const GOOGLEBOT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

function parseArgs() {
  let base = "https://adwrks.co.il";
  let out = path.join(WEB, "..", "migration-audit", "post-migration-verify-2026-10-20.json");
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--base=")) base = arg.slice(7).replace(/\/$/, "");
    if (arg.startsWith("--out=")) out = arg.slice(6);
  }
  return { base, out };
}

function loadPaths() {
  const index = JSON.parse(
    fs.readFileSync(path.join(WEB, "src/generated/routable-path-index.json"), "utf8"),
  );
  return index.paths;
}

async function fetchChain(url, init) {
  const hops = [];
  let current = url;
  const seen = new Set();
  for (let i = 0; i < 8; i++) {
    if (seen.has(current)) {
      hops.push({ url: current, status: "loop" });
      break;
    }
    seen.add(current);
    const res = await fetch(current, { ...init, redirect: "manual" });
    const location = res.headers.get("location");
    hops.push({ url: current, status: res.status, location });
    if (res.status < 300 || res.status >= 400 || !location) {
      return { hops, finalResponse: res, finalUrl: current };
    }
    current = new URL(location, current).href;
  }
  return { hops, finalResponse: null, finalUrl: current };
}

function analyzeHtml(html) {
  const titleM = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descM = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const canonM = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  const ldJsonCount = (html.match(/application\/ld\+json/gi) ?? []).length;
  const hasCreativeWorkSeason = /CreativeWorkSeason/.test(html);
  const hasAggregateRating = /"AggregateRating"/.test(html);
  const hasBlogPosting = /BlogPosting/.test(html);
  return {
    title: titleM?.[1]?.trim() ?? "",
    description: descM?.[1]?.trim() ?? "",
    canonical: canonM?.[1]?.trim() ?? "",
    h1Count,
    ldJsonCount,
    hasCreativeWorkSeason,
    hasAggregateRating,
    hasBlogPosting,
  };
}

async function checkOne(base, pathname, concurrencySlot) {
  const url = `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  const init = { headers: { "User-Agent": GOOGLEBOT } };
  const { hops, finalResponse, finalUrl } = await fetchChain(url, init);

  let html = "";
  if (finalResponse?.status === 200) {
    html = await finalResponse.text();
  } else if (hops.length > 0) {
    const last = hops[hops.length - 1];
    if (last.status === 200) {
      const r = await fetch(last.url, { ...init, redirect: "follow" });
      html = await r.text();
    }
  }

  const seo = html ? analyzeHtml(html) : null;
  const firstStatus = hops[0]?.status ?? 0;
  const finalStatus = hops[hops.length - 1]?.status ?? 0;
  const redirectCount = hops.filter((h) => h.status >= 300 && h.status < 400).length;

  const issues = [];
  if (firstStatus >= 500) issues.push("5xx");
  if (finalStatus === 404) issues.push("404");
  if (redirectCount > 1) issues.push("redirect_chain");
  if (finalStatus === 200 && seo) {
    if (!seo.title) issues.push("missing_title");
    if (!seo.canonical) issues.push("missing_canonical");
    if (seo.h1Count < 1) issues.push("missing_h1");
  }

  return {
    path: pathname,
    url,
    firstStatus,
    finalStatus,
    redirectCount,
    finalUrl,
    hops: hops.map((h) => ({ status: h.status, location: h.location })),
    seo,
    issues,
  };
}

async function pool(items, limit, fn) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

async function main() {
  const { base, out } = parseArgs();
  const paths = loadPaths();
  const startedAt = new Date().toISOString();
  console.log(`Crawling ${paths.length} paths on ${base} ...`);

  const results = await pool(paths, 6, (p) => checkOne(base, p));

  const summary = {
    total: results.length,
    ok200: results.filter((r) => r.finalStatus === 200).length,
    redirect308: results.filter((r) => r.firstStatus >= 300 && r.firstStatus < 400).length,
    notFound: results.filter((r) => r.finalStatus === 404).length,
    serverError: results.filter((r) => r.firstStatus >= 500 || r.finalStatus >= 500).length,
    redirectChains: results.filter((r) => r.issues.includes("redirect_chain")).length,
    missingSeo: results.filter((r) =>
      r.issues.some((x) => x.startsWith("missing_")),
    ).length,
    creativeWorkSeasonPages: results.filter((r) => r.seo?.hasCreativeWorkSeason).length,
    aggregateRatingPages: results.filter((r) => r.seo?.hasAggregateRating).length,
  };

  const failures = results.filter((r) => r.issues.length > 0);

  const report = {
    generatedAt: startedAt,
    base,
    commitNote: "post-migration-verify",
    summary,
    failures,
    results,
  };

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
  console.log("Summary:", summary);
  console.log(`Wrote ${out}`);
  if (summary.serverError > 0 || summary.notFound > 0) {
    console.error(`${failures.length} URL(s) with issues`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
