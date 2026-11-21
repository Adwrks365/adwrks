/**
 * Append final-rollout content revision timestamps for queue postIds (per locale).
 * npx tsx scripts/patch-final-rollout-revisions.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildFinalRolloutQueue } from "./lib/final-rollout-queue.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const revisionsPath = path.resolve(root, "../src/data/content/article-content-revisions.json");

const STAMP = "2026-11-20T11:30:00+02:00";
const SOURCE = "final-rollout-2026";

const queue = buildFinalRolloutQueue();
const doc = JSON.parse(fs.readFileSync(revisionsPath, "utf8"));

const byId = new Map();
for (const r of doc.revisions) byId.set(r.postId, r);

for (const row of queue) {
  let rec = byId.get(row.id);
  if (!rec) {
    rec = { postId: row.id, locales: {}, source: SOURCE, note: "Final rollout — lead/FAQ" };
    doc.revisions.push(rec);
    byId.set(row.id, rec);
  }
  if (!rec.locales) rec.locales = {};
  rec.locales[row.locale] = STAMP;
  if (!rec.note?.includes("Final rollout")) {
    rec.note = [rec.note, "Final rollout — lead/FAQ"].filter(Boolean).join("; ");
  }
  rec.source = rec.source?.includes("batch") ? `${rec.source}; ${SOURCE}` : SOURCE;
}

fs.writeFileSync(revisionsPath, `${JSON.stringify(doc, null, 2)}\n`);
console.log("Patched revisions for", queue.length, "queue rows");