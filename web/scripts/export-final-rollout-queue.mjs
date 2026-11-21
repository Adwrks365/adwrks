/**
 * Export final blog rollout queue (needs-content / needs-partial, no enrichment source).
 * npx tsx scripts/export-final-rollout-queue.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildFinalRolloutQueue } from "./lib/final-rollout-queue.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(root, "../../migration-audit/FINAL_ROLLOUT_QUEUE.json");

const queue = buildFinalRolloutQueue();

const payload = {
  generatedAt: new Date().toISOString(),
  count: queue.length,
  queue,
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
console.log(JSON.stringify({ count: queue.length, first3: queue.slice(0, 3) }, null, 2));
console.log("Wrote", outPath);