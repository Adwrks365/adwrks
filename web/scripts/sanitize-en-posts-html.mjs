#!/usr/bin/env node
/**
 * Post-process content-en/posts.json: EN links, attributes, strip inline scripts.
 * Run after translate-posts-content.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hasHebrew } from "./lib/en-schema-localize.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const EN_POSTS = path.join(root, "src/data/content-en/posts.json");
const ROUTES_FILE = path.join(root, "src/i18n/routes.ts");

const PLACEHOLDER_EN = {
  שם: "Name",
  "שם מלא": "Full name",
  אימייל: "Email",
  'דוא"ל': "Email",
  הודעה: "Message",
  טלפון: "Phone",
  "טופס חדש": "Contact form",
  "שליחת טופס": "Submit",
};

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
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

function loadHeToEn() {
  const src = fs.readFileSync(ROUTES_FILE, "utf8");
  const map = new Map();
  const re = /"he":\s*"([^"]+)"[\s\S]*?"en":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    map.set(m[1], m[2]);
  }
  return map;
}

function rewriteHref(href, heToEn) {
  const trimmed = href.trim();
  if (/^https?:\/\/(www\.)?adwrks\.co\.il/i.test(trimmed)) {
    try {
      const pathname = normalizePath(new URL(trimmed).pathname);
      if (pathname.startsWith("/en/")) return trimmed;
      const en = heToEn.get(pathname);
      if (en) return `https://adwrks.co.il${en}`;
    } catch {
      return href;
    }
  }
  if (trimmed.startsWith("/")) {
    const normalized = normalizePath(trimmed);
    if (normalized.startsWith("/en/")) return trimmed;
    const en = heToEn.get(normalized);
    if (en) return en;
  }
  return href;
}

function translateAttr(value) {
  const t = value.trim();
  if (!hasHebrew(t)) return null;
  if (PLACEHOLDER_EN[t]) return PLACEHOLDER_EN[t];
  return "";
}

function sanitizeHtml(html, heToEn) {
  let out = html.replace(/href=(["'])([^"'#?]+)\1/gi, (match, quote, href) => {
    if (href.startsWith("//") || href.startsWith("/wp-content/")) return match;
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      return match;
    }
    const next = rewriteHref(href, heToEn);
    return next === href ? match : `href=${quote}${next}${quote}`;
  });

  out = out.replace(/<script(?![^>]*type\s*=\s*["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, "");

  for (const attr of ["title", "placeholder", "aria-label", "name", "alt"]) {
    const re = new RegExp(`\\s${attr}=(["'])([^"']*)\\1`, "gi");
    out = out.replace(re, (match, quote, value) => {
      const next = translateAttr(value);
      if (next === null) return match;
      if (next === "") return "";
      return ` ${attr}=${quote}${next}${quote}`;
    });
  }

  return out;
}

function stripVisibleHebrew(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  return hasHebrew(text);
}

const heToEn = loadHeToEn();
const posts = JSON.parse(fs.readFileSync(EN_POSTS, "utf8"));
let updated = 0;
let stillHebrew = [];

for (const post of posts) {
  const before = post.content;
  post.content = sanitizeHtml(before, heToEn);
  if (post.excerpt) {
    post.excerpt = sanitizeHtml(post.excerpt, heToEn).replace(/<[^>]+>/g, " ").trim().slice(0, 320);
  }
  if (post.content !== before) updated++;
  if (stripVisibleHebrew(post.content)) stillHebrew.push(post.slug);
}

fs.writeFileSync(EN_POSTS, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
console.log(`Sanitized ${updated}/${posts.length} posts`);
if (stillHebrew.length) {
  console.warn(`Visible Hebrew remains in ${stillHebrew.length} posts:`, stillHebrew.slice(0, 15));
  process.exit(1);
}
console.log("All EN posts pass visible-text Hebrew check.");
