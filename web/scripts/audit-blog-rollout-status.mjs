/**
 * Full blog rollout status — runtime lead/FAQ after all enrichments.
 * npx tsx scripts/audit-blog-rollout-status.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPosts } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { getArticleEnrichmentSource } from "../src/lib/content/article-enrichment-registry.ts";
import { BATCH6_HE_PATHS } from "../src/lib/content/article-batch6-enrichment-2026.ts";
import { BATCH7_EN_PATHS } from "../src/lib/content/article-batch7-enrichment-2026.ts";

const ROLLOUT_BATCHES = [
  { id: "batch6-2026", paths: BATCH6_HE_PATHS.map((p) => ({ path: p, locale: "he" })) },
  { id: "batch7-2026", paths: BATCH7_EN_PATHS.map((p) => ({ path: p, locale: "en" })) },
];

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(root, "../../migration-audit");
const outJson = path.join(outDir, "BLOG_CONTENT_ROLLOUT_STATUS.json");
const outMd = path.join(outDir, "BLOG_CONTENT_ROLLOUT_PLAN.md");

const rows = [];
for (const locale of ["he", "en"]) {
  for (const post of getAllPosts(locale)) {
    const { html, headings } = prepareArticleBodyHtml(post.content, locale, post.path);
    const source = getArticleEnrichmentSource(post.path, locale);
    const hasLead = html.includes("adwrks-article-lead-2026");
    const faqItems = (html.match(/<details class="adwrks-faq-item"/g) || []).length;
    const hasFaqBlock = html.includes("adwrks-article-faq-block");
    const dupSummary = headings.filter((h) => /^(סיכום|לסיכום|Summary:)/i.test(h.text)).length;
    const year2025 = /\b2025\b/.test(post.title + html.slice(0, 8000));

    let status = "ok";
    if (source) status = "enriched";
    else if (!hasLead && faqItems < 2) status = "needs-content";
    else if (!hasLead || faqItems < 2) status = "needs-partial";
    else if (dupSummary > 0) status = "needs-structure";
    else status = "acceptable-no-runtime";

    rows.push({
      id: post.id,
      locale,
      path: post.path,
      title: post.title.replace(/<[^>]+>/g, "").slice(0, 80),
      source,
      status,
      hasLead,
      faqItems,
      hasFaqBlock,
      dupSummary,
      year2025,
      plannedBatch: "pending",
    });
  }
}

const queue = rows
  .filter((r) => !r.source && r.status !== "acceptable-no-runtime")
  .sort((a, b) => a.id - b.id);

function planBatch(source, status, p, locale, queueIndex) {
  if (source) return source;
  if (status === "acceptable-no-runtime") return "—";
  for (const b of ROLLOUT_BATCHES) {
    if (b.paths.some((x) => x.path === p && x.locale === locale)) return b.id;
  }
  if (queueIndex >= 0) return `batch${8 + Math.floor(queueIndex / 5)}-planned`;
  return "review";
}

const queueIndex = new Map(queue.map((r, i) => [`${r.locale}:${r.path}`, i]));
for (const r of rows) {
  const idx = queueIndex.get(`${r.locale}:${r.path}`) ?? -1;
  r.plannedBatch = planBatch(r.source, r.status, r.path, r.locale, idx);
}

const summary = {
  generatedAt: new Date().toISOString(),
  total: rows.length,
  enriched: rows.filter((r) => r.source).length,
  needsContent: rows.filter((r) => r.status === "needs-content").length,
  needsPartial: rows.filter((r) => r.status === "needs-partial").length,
  needsStructure: rows.filter((r) => r.status === "needs-structure").length,
  acceptable: rows.filter((r) => r.status === "acceptable-no-runtime").length,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify({ summary, rows }, null, 2));

const byBatch = new Map();
for (const r of rows.filter((x) => !x.source && x.status !== "acceptable-no-runtime")) {
  const b = r.plannedBatch;
  if (!byBatch.has(b)) byBatch.set(b, []);
  byBatch.get(b).push(r);
}

let md = `# Blog content rollout plan (108 routable posts; 110 in posts.json incl. 2 Carmiel location)

Generated: ${summary.generatedAt}

## Summary

| Metric | Count |
|--------|------:|
| Total posts | ${summary.total} |
| Already enriched (pilot/batch2–5) | ${summary.enriched} |
| Needs full content work | ${summary.needsContent} |
| Needs partial (lead or FAQ) | ${summary.needsPartial} |
| Needs structure polish only | ${summary.needsStructure} |
| Acceptable (no runtime injection) | ${summary.acceptable} |

## Already enriched (do not re-edit except shared CSS)

${rows
  .filter((r) => r.source)
  .map((r) => `- \`${r.path}\` (${r.locale}) — **${r.source}**`)
  .join("\n")}

## Planned batches (remaining)

`;

for (const [batch, items] of [...byBatch.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  md += `### ${batch} (${items.length} posts)\n\n`;
  md += items
    .slice(0, 30)
    .map((r) => `- \`${r.path}\` (${r.locale}, id ${r.id}) — ${r.status}`)
    .join("\n");
  if (items.length > 30) md += `\n- … +${items.length - 30} more in JSON\n`;
  md += "\n\n";
}

md += `## Google Sheets rows (copy)

| Category | Task | Count |
|----------|------|------:|
| Blog UX | CTA centering (merged PR #10) | all |
| Content | Batch6 pilot (this PR) | 5 |
| Content | Batch7 pilot (this PR) | 5 |
| Content | Remaining planned batches | ${summary.needsContent + summary.needsPartial + summary.needsStructure} |
| QA | Rollout status audit | ongoing |
`;

fs.writeFileSync(outMd, md);
console.log(JSON.stringify(summary, null, 2));
console.log("Wrote", outJson, outMd);