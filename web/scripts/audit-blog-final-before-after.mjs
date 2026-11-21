/**
 * Before/after audit for final rollout queue (52 posts).
 * npx tsx scripts/audit-blog-final-before-after.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml, extractArticleHeadings } from "../src/lib/content/article.ts";
import { countTagBalance } from "../src/lib/content/article-html-sanitize.ts";
import { buildFinalRolloutQueue } from "./lib/final-rollout-queue.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(root, "../../migration-audit");
const queue = buildFinalRolloutQueue();

const rows = [];
for (const q of queue) {
  const c = getContentByPath(q.path, q.locale);
  if (!c) continue;
  const before = prepareArticleBodyHtml(c.content, q.locale, q.path, {
    skipFinalRollout: true,
    skipBatch9: true,
    skipBatch8: true,
  });
  const after = prepareArticleBodyHtml(c.content, q.locale, q.path);
  const hBefore = extractArticleHeadings(before.html).map((h) => h.text);
  const hAfter = extractArticleHeadings(after.html).map((h) => h.text);
  rows.push({
    id: q.id,
    locale: q.locale,
    path: q.path,
    title: q.title,
    status: q.status,
    lenBefore: before.html.length,
    lenAfter: after.html.length,
    imgsBefore: (before.html.match(/<img\b/gi) || []).length,
    imgsAfter: (after.html.match(/<img\b/gi) || []).length,
    linksBefore: (before.html.match(/<a\b/gi) || []).length,
    linksAfter: (after.html.match(/<a\b/gi) || []).length,
    leadAdded: !before.html.includes("adwrks-article-lead-2026") && after.html.includes("adwrks-article-lead-2026"),
    faqBefore: (before.html.match(/adwrks-faq-item/g) || []).length,
    faqAfter: (after.html.match(/adwrks-faq-item/g) || []).length,
    balanceAfter: countTagBalance(after.html),
    headingsAdded: hAfter.length - hBefore.length,
  });
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "BLOG_FINAL_BEFORE_AFTER.json"), JSON.stringify({ rows }, null, 2));

let md = `# Final rollout — before/after (${rows.length} posts)\n\nGenerated: ${new Date().toISOString()}\n\n| Path | Locale | Lead | FAQ Δ | Len Δ |\n|------|--------|------|-------|-------|\n`;
for (const r of rows) {
  md += `| \`${r.path}\` | ${r.locale} | ${r.leadAdded ? "yes" : "—"} | ${r.faqBefore}→${r.faqAfter} | ${r.lenAfter - r.lenBefore >= 0 ? "+" : ""}${r.lenAfter - r.lenBefore} |\n`;
}
fs.writeFileSync(path.join(outDir, "BLOG_FINAL_BEFORE_AFTER.md"), md);
console.log("Wrote", rows.length, "rows");