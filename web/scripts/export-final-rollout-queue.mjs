/**
 * Export final blog rollout queue (needs-content / needs-partial, no enrichment source).
 * npx tsx scripts/export-final-rollout-queue.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getContentByPath } from "../src/lib/content/loader.ts";

const root = path.dirname(fileURLToPath(import.meta.url));
const statusPath = path.resolve(root, "../../migration-audit/BLOG_CONTENT_ROLLOUT_STATUS.json");
const outPath = path.resolve(root, "../../migration-audit/FINAL_ROLLOUT_QUEUE.json");

/** Root Elementor post marker, e.g. elementor-19398 */
function extractPostMarker(html) {
  if (!html) return null;
  const wpPost = html.match(
    /data-elementor-type=["']wp-post["'][^>]*data-elementor-id=["'](\d+)["']/i,
  );
  if (wpPost) return `elementor-${wpPost[1]}`;
  const wpPostAlt = html.match(
    /data-elementor-id=["'](\d+)["'][^>]*data-elementor-type=["']wp-post["']/i,
  );
  if (wpPostAlt) return `elementor-${wpPostAlt[1]}`;
  const postRoot = html.match(
    /class=["']elementor elementor-(\d+)["'][^>]*data-elementor-post-type=["']post["']/i,
  );
  if (postRoot) return `elementor-${postRoot[1]}`;
  const loose = html.match(/\bclass=["']elementor elementor-(\d+)["']/i);
  return loose ? `elementor-${loose[1]}` : null;
}

const { rows } = JSON.parse(fs.readFileSync(statusPath, "utf8"));

const queue = rows
  .filter(
    (r) =>
      r.source == null &&
      (r.status === "needs-content" || r.status === "needs-partial"),
  )
  .sort((a, b) => a.id - b.id)
  .map((r) => {
    const item = getContentByPath(r.path, r.locale);
    const postMarker = item ? extractPostMarker(item.content) : null;
    return {
      id: r.id,
      locale: r.locale,
      path: r.path,
      title: r.title,
      status: r.status,
      postMarker,
    };
  });

const payload = {
  generatedAt: new Date().toISOString(),
  count: queue.length,
  queue,
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
console.log(JSON.stringify({ count: queue.length, first3: queue.slice(0, 3) }, null, 2));
console.log("Wrote", outPath);