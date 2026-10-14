#!/usr/bin/env node
/**
 * Build-time routable URL index for middleware fast 404.
 * Mirrors getAllStaticParams + sitemap urls (pages, posts, categories, pagination).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(WEB_ROOT, "src", "generated", "routable-path-index.json");

const POSTS_PER_PAGE = 9;

function normalizePath(input) {
  if (!input || input === "/") return "/";
  let p = input;
  if (p.startsWith("http")) {
    try {
      p = new URL(p).pathname;
    } catch {
      return "/";
    }
  }
  if (!p.startsWith("/")) p = `/${p}`;
  p = p
    .split("/")
    .map((s) => {
      if (!s) return s;
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    })
    .join("/");
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

function pathFromLink(link) {
  return normalizePath(link);
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(WEB_ROOT, rel), "utf8"));
}

function collectLocalePaths(localeDir, locale) {
  const paths = new Set();
  const homePath = locale === "en" ? "/en/" : "/";
  paths.add(homePath);

  const urls = readJson(`${localeDir}/urls.json`);
  for (const raw of urls.sitemapUrls) {
    paths.add(normalizePath(raw));
  }

  const categories = readJson(`${localeDir}/categories.json`);
  const posts = readJson(`${localeDir}/posts.json`);

  for (const cat of categories) {
    paths.add(pathFromLink(cat.link));
    const catPosts = posts.filter((p) => p.categories?.includes(cat.id));
    const totalPages = Math.max(1, Math.ceil(catPosts.length / POSTS_PER_PAGE));
    for (let page = 2; page <= totalPages; page++) {
      paths.add(normalizePath(`${pathFromLink(cat.link)}page/${page}/`));
    }
  }

  const blogPath = locale === "en" ? "/en/blog/" : "/blog/";
  paths.add(blogPath);
  const blogPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  for (let page = 2; page <= blogPages; page++) {
    paths.add(normalizePath(`${blogPath}page/${page}/`));
  }

  return paths;
}

/** Legacy redirect sources (next.config) — must pass middleware before redirect. */
const REDIRECT_SOURCES = ["/plans/", "/plans", "/contact/", "/contact", "/en"];

const hePaths = collectLocalePaths("src/data/content", "he");
const enPaths = collectLocalePaths("src/data/content-en", "en");

const all = new Set([...hePaths, ...enPaths, ...REDIRECT_SOURCES.map(normalizePath)]);

const payload = {
  generatedAt: new Date().toISOString(),
  count: all.size,
  paths: [...all].sort(),
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, `${JSON.stringify(payload)}\n`);
console.log(`Wrote ${payload.count} routable paths → ${path.relative(WEB_ROOT, OUT_FILE)}`);
