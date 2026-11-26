/**
 * Baseline internal links on Hebrew posts (raw posts.json + rendered estimate via enrichments applied in app).
 * Usage: node scripts/audit-internal-links-2026-11-26.mjs [--json-out path]
 */
import fs from "node:fs";
import path from "node:path";

const TARGETS = [
  "/",
  "/seo/",
  "/google-ads/",
  "/website-building/",
  "/שירותי-שיווק-דיגיטלי/",
  "/מחיר-קידום-אתרים/",
  "/בדיקת-מהירות-אתר/",
];

const posts = JSON.parse(
  fs.readFileSync(path.join("web", "src", "data", "content", "posts.json"), "utf8"),
);

function hasLink(html, href) {
  return html.includes(`href="${href}"`) || html.includes(`href='${href}'`);
}

const byPost = [];
for (const p of posts) {
  const postPath = decodeURIComponent(new URL(p.link).pathname);
  const c = p.content || "";
  const links = {};
  for (const t of TARGETS) links[t] = hasLink(c, t);
  byPost.push({ path: postPath, links });
}

const summary = {};
for (const t of TARGETS) {
  summary[t] = {
    withLink: byPost.filter((x) => x.links[t]).length,
    withoutLink: byPost.filter((x) => !x.links[t]).length,
  };
}

const out = {
  at: new Date().toISOString(),
  postCount: posts.length,
  summary,
  inboundToService: summary,
};

const outPath = process.argv.includes("--json-out")
  ? process.argv[process.argv.indexOf("--json-out") + 1]
  : "migration-audit/internal-links-baseline-2026-11-26.json";

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ ...out, posts: byPost }, null, 2));
console.log("Wrote", outPath);
console.log("Summary:", JSON.stringify(summary));