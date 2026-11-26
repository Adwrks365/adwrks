import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import fs from "node:fs";
import { AUTHORITY_LINKING_PATHS } from "../src/lib/content/article-authority-linking-2026.ts";

const posts = JSON.parse(fs.readFileSync("src/data/content/posts.json", "utf8"));
const added = [];
const skipped = [];

for (const pagePath of AUTHORITY_LINKING_PATHS) {
  const post = posts.find((p) => {
    try {
      return decodeURIComponent(new URL(p.link).pathname) === pagePath;
    } catch {
      return false;
    }
  });
  if (!post) {
    skipped.push({ path: pagePath, reason: "no post" });
    continue;
  }
  const { html } = prepareArticleBodyHtml(post.content, "he", pagePath);
  const hit =
    html.includes("adwrks-authority-link-2026") ||
    html.includes("adwrks-authority-service-link");
  if (hit) added.push(pagePath);
  else skipped.push({ path: pagePath, reason: "skip or no marker" });
}

console.log("ADDED", added.length, added);
console.log("SKIPPED", skipped.length);