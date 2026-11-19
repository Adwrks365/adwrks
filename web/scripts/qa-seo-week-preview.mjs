#!/usr/bin/env node
/**
 * QA the three SEO-week articles on local/preview origin.
 * Usage: node scripts/qa-seo-week-preview.mjs [baseUrl]
 */
const base = process.argv[2] || "http://localhost:3000";

const paths = [
  { key: "google-seo", path: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/" },
  { key: "speed", path: "/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/" },
  { key: "ru", path: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%91%d7%a9%d7%a4%d7%94-%d7%94%d7%a8%d7%95%d7%a1%d7%99%d7%aa/" },
];

function extractMeta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]*)"`, "i");
  const alt = new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${name}"`, "i");
  return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}

function headings(html) {
  return [...html.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: m[2].replace(/<[^>]+>/g, "").trim(),
  }));
}

function duplicateTexts(items) {
  const counts = new Map();
  for (const t of items) {
    const k = t.toLowerCase();
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  return [...counts.entries()].filter(([, c]) => c > 1).map(([t]) => t);
}

function internalLinks(html) {
  return [...new Set([...html.matchAll(/href="(\/[^"#?]+)/g)].map((m) => m[1]))];
}

async function checkArticle({ key, path }) {
  const url = `${base}${path}`;
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  const report = {
    key,
    url,
    status: res.status,
    title: html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null,
    description: extractMeta(html, "description"),
    canonical: html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? null,
    hreflangHe: html.match(/<link[^>]+hreflang="he-IL"[^>]+href="([^"]+)"/i)?.[1] ?? null,
    hreflangEn: html.match(/<link[^>]+hreflang="en"[^>]+href="([^"]+)"/i)?.[1] ?? null,
    jsonLd: (html.match(/<script[^>]+type="application\/ld\+json"[^>]*>/gi) || []).length,
    markers: {
      googleGuide: html.includes("adwrks-google-seo-guide-2026-11"),
      ruGuide: html.includes("adwrks-ru-digital-2026-11"),
      speedLinks: html.includes("adwrks-speed-links-2026-11"),
      pagespeedEmbed: html.includes("data-adwrks-pagespeed-insights"),
    },
    h2: headings(html).filter((h) => h.level === 2),
    duplicateH2: duplicateTexts(headings(html).filter((h) => h.level === 2).map((h) => h.text)),
    links: internalLinks(html).slice(0, 40),
    issues: [],
  };

  if (res.status !== 200) report.issues.push(`HTTP ${res.status}`);
  if (!report.jsonLd) report.issues.push("missing JSON-LD");
  if (key === "google-seo" && !report.markers.googleGuide) report.issues.push("missing google guide block");
  if (key === "ru" && !report.markers.ruGuide) report.issues.push("missing RU guide block");
  if (key === "speed" && !report.markers.pagespeedEmbed) report.issues.push("missing pagespeed embed");
  if (report.duplicateH2.length) report.issues.push(`duplicate H2: ${report.duplicateH2.join("; ")}`);

  const body = html.match(/article-body-html[\s\S]*?(?=<aside class="article-aside")/i)?.[0] ?? html;
  const markerCount = (body.match(/adwrks-google-seo-guide-2026-11/g) || []).length;
  if (markerCount > 1) report.issues.push(`guide marker duplicated in body x${markerCount}`);

  return report;
}

const results = [];
for (const p of paths) {
  try {
    results.push(await checkArticle(p));
  } catch (e) {
    results.push({ key: p.key, issues: [String(e)] });
  }
}

console.log(JSON.stringify({ base, results }, null, 2));
const failed = results.flatMap((r) => r.issues || []);
process.exit(failed.length ? 1 : 0);