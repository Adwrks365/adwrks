/**
 * Phase A — Blog content audit (HE + EN posts). Read-only scan of posts.json + seo.json.
 * Run: node web/scripts/audit-blog-content-2026.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(root, "../../migration-audit");
const outJson = path.join(outDir, "BLOG_CONTENT_AUDIT_2026.json");
const outMd = path.join(outDir, "BLOG_CONTENT_AUDIT_2026.md");

function stripTags(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pathFromLink(link) {
  try {
    return decodeURIComponent(new URL(link).pathname);
  } catch {
    return link;
  }
}

function countYear(text, year) {
  const re = new RegExp(`\\b${year}\\b`, "g");
  return (text.match(re) || []).length;
}

function hasFaq(html) {
  return /(שאלות נפוצות|שאלות ותשובות|Frequently asked questions|FAQ)/i.test(html);
}

function hasStructuredLead(html) {
  return (
    /adwrks-article-lead|adwrks-article-lead-2026/i.test(html) ||
    />(\s*בקצרה|מה חשוב לדעת\?|At a glance)\s*</i.test(html)
  );
}

function hasOpeningSummary(html) {
  const firstP = html.match(/<p[^>]*>([\s\S]{80,}?)<\/p>/i);
  if (!firstP) return false;
  const words = stripTags(firstP[1]).split(/\s+/).length;
  return words >= 40 && words <= 120;
}

function scorePost(row) {
  let score = 0;
  if (row.mentions2025Title) score += 3;
  if (row.mentions2025Body >= 3) score += 2;
  if (row.mentions2024Body >= 5) score += 1;
  if (!row.hasLead) score += 2;
  if (!row.hasFaq) score += 2;
  if (row.modifiedBefore2025) score += 1;
  return score;
}

function auditLocale(locale) {
  const dataDir = locale === "en" ? "content-en" : "content";
  const posts = JSON.parse(
    fs.readFileSync(path.join(root, `../src/data/${dataDir}/posts.json`), "utf8"),
  );
  const seo = JSON.parse(fs.readFileSync(path.join(root, `../src/data/${dataDir}/seo.json`), "utf8"));
  const seoByUrl = new Map(seo.map((r) => [r.url, r]));

  return posts.map((p) => {
    const pagePath = pathFromLink(p.link);
    const seoRec = seoByUrl.get(p.link) || seoByUrl.get(p.link.replace(/\/$/, ""));
    const title = stripTags(p.title);
    const bodyText = stripTags(p.content);
    const meta = `${seoRec?.title || ""} ${seoRec?.metaDescription || ""}`;
    const combined = `${title} ${meta} ${bodyText}`;
    const row = {
      id: p.id,
      locale,
      path: pagePath,
      title,
      date: p.date,
      modified: p.modified,
      mentions2025Title: /\b2025\b/.test(title) || /\b2025\b/.test(seoRec?.title || ""),
      mentions2025Meta: /\b2025\b/.test(seoRec?.metaDescription || ""),
      mentions2025Body: countYear(bodyText, 2025),
      mentions2024Body: countYear(bodyText, 2024),
      mentions2026Body: countYear(bodyText, 2026),
      hasStructuredLead: hasStructuredLead(p.content),
      hasOpeningSummary: hasOpeningSummary(p.content),
      hasLead: hasStructuredLead(p.content) || hasOpeningSummary(p.content),
      hasFaq: hasFaq(p.content),
      modifiedBefore2025: p.modified && p.modified.slice(0, 4) < "2025",
      seoTitle: seoRec?.title || null,
    };
    row.priorityScore = scorePost(row);
    row.flags = [];
    if (row.mentions2025Title || row.mentions2025Body >= 2) row.flags.push("year-2025");
    if (!row.hasLead) row.flags.push("missing-lead");
    if (!row.hasFaq) row.flags.push("missing-faq");
    if (row.modifiedBefore2025) row.flags.push("stale-modified");
    return row;
  });
}

const he = auditLocale("he");
const en = auditLocale("en");
const all = [...he, ...en];

const summary = {
  generatedAt: new Date().toISOString(),
  counts: {
    he: he.length,
    en: en.length,
    total: all.length,
    withYear2025: all.filter((r) => r.flags.includes("year-2025")).length,
    missingStructuredLead: all.filter((r) => !r.hasStructuredLead).length,
    missingLead: all.filter((r) => !r.hasLead).length,
    missingFaq: all.filter((r) => !r.hasFaq).length,
    staleModified: all.filter((r) => r.flags.includes("stale-modified")).length,
  },
  pilotExcludedIds: [19428, 20350, 21496],
};

const ranked = [...all].sort((a, b) => b.priorityScore - a.priorityScore || b.mentions2025Body - a.mentions2025Body);

summary.topPriority = ranked.slice(0, 25).map((r) => ({
  id: r.id,
  locale: r.locale,
  path: r.path,
  title: r.title,
  score: r.priorityScore,
  flags: r.flags,
}));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify({ summary, posts: all, ranked: summary.topPriority }, null, 2));

const md = `# Blog Content Audit 2026

Generated: ${summary.generatedAt}

## Summary

| Metric | Count |
|--------|------:|
| Hebrew posts | ${summary.counts.he} |
| English posts | ${summary.counts.en} |
| With 2025 in title/body (flag) | ${summary.counts.withYear2025} |
| Missing quality lead | ${summary.counts.missingLead} |
| Missing FAQ block | ${summary.counts.missingFaq} |
| Modified before 2025 (data) | ${summary.counts.staleModified} |

## Top priority (first 25)

${summary.topPriority
  .map(
    (r) =>
      `- **${r.score}** \`${r.path}\` (${r.locale}, id ${r.id}) — ${r.flags.join(", ") || "—"}`,
  )
  .join("\n")}

## Pilot batch (this PR)

See \`article-pilot-enrichment-2026.ts\` — 5 Hebrew posts (not PR #2 trio).
`;

fs.writeFileSync(outMd, md);
console.log("Wrote", outJson);
console.log("Wrote", outMd);
console.log(JSON.stringify(summary.counts, null, 2));