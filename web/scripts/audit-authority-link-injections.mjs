/**
 * Authority linking audit — injections vs skips (pipeline simulation).
 */
import fs from "node:fs";
import path from "node:path";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { AUTHORITY_LINKING_PATHS } from "../src/lib/content/article-authority-linking-2026.ts";

const posts = JSON.parse(fs.readFileSync("src/data/content/posts.json", "utf8"));
const MARKER = "adwrks-authority-link-2026";

function postForPath(pagePath) {
  return posts.find((p) => decodeURIComponent(new URL(p.link).pathname) === pagePath);
}

const injected = [];
const skipped = [];

for (const pagePath of AUTHORITY_LINKING_PATHS) {
  const post = postForPath(pagePath);
  if (!post) {
    skipped.push({ path: pagePath, reason: "no_post" });
    continue;
  }
  const { html } = prepareArticleBodyHtml(post.content, "he", pagePath);
  if (html.includes(MARKER)) {
    injected.push(pagePath);
    continue;
  }
  skipped.push({
    path: pagePath,
    reason: !html.includes("elementor-")
      ? "missing_post_marker"
      : "all_targets_already_contextual",
  });
}

const out = {
  at: new Date().toISOString(),
  configured: AUTHORITY_LINKING_PATHS.length,
  injectedCount: injected.length,
  injected,
  skipped,
};
fs.writeFileSync(
  path.join("..", "migration-audit", "authority-link-injections-2026-11-26.json"),
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out, null, 2));