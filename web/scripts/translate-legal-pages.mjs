#!/usr/bin/env node
/**
 * Translates Hebrew legal page HTML into English while preserving h2/h3/p structure.
 * Run: node web/scripts/translate-legal-pages.mjs
 */
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HE_PAGES = path.join(ROOT, "src", "data", "content", "pages.json");
const EN_PAGES = path.join(ROOT, "src", "data", "content-en", "pages.json");
const CACHE_FILE = path.join(ROOT, "src", "data", "content-en", ".translation-cache.json");

const LEGAL_HE_PATHS = ["/privacy-policy/", "/terms-of-use/", "/accessibility-statement/"];
const LEGAL_EN_TITLES = {
  "/privacy-policy/": "Privacy Policy – adwrks.co.il",
  "/terms-of-use/": "Terms of Use – adwrks.co.il",
  "/accessibility-statement/": "Accessibility Statement",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 20);
}

function pathFromLink(link) {
  try {
    return new URL(link).pathname.endsWith("/") ? new URL(link).pathname : `${new URL(link).pathname}/`;
  } catch {
    return link;
  }
}

function splitChunks(text, max = 1500) {
  if (text.length <= max) return [text];
  const chunks = [];
  let rest = text;
  while (rest.length > max) {
    let cut = rest.lastIndexOf("\n", max);
    if (cut < max * 0.4) cut = rest.lastIndexOf(". ", max);
    if (cut <= 0) cut = max;
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) chunks.push(rest);
  return chunks;
}

async function googleTranslate(text, attempt = 0) {
  const client = ["gtx", "dict-chrome-ex", "at"][attempt % 3];
  const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=he&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });
  if (!res.ok) {
    if (attempt < 5) {
      await sleep(800 * (attempt + 1));
      return googleTranslate(text, attempt + 1);
    }
    throw new Error(`Translate HTTP ${res.status}`);
  }
  const data = await res.json();
  return data[0].map((part) => part[0]).join("");
}

async function translatePlain(trimmed, cache, stats) {
  if (!trimmed || !/[\u0590-\u05FF]/.test(trimmed)) return trimmed;
  const key = hash(trimmed);
  if (cache[key]) {
    stats.cacheHits += 1;
    return cache[key];
  }
  const chunks = splitChunks(trimmed);
  const out = [];
  for (const chunk of chunks) {
    if (!/[\u0590-\u05FF]/.test(chunk)) {
      out.push(chunk);
      continue;
    }
    await sleep(200);
    out.push(await googleTranslate(chunk));
    stats.apiCalls += 1;
  }
  const translated = out.join("");
  cache[key] = translated;
  stats.cacheMisses += 1;
  return translated;
}

async function translateHtml(html, cache, stats) {
  const parts = html.split(/(<[^>]+>)/);
  const segments = [];
  let buffer = "";

  function flush() {
    if (buffer) segments.push({ type: "text", value: buffer });
    buffer = "";
  }

  for (const part of parts) {
    if (part.startsWith("<")) {
      flush();
      segments.push({ type: "tag", value: part });
    } else {
      buffer += part;
    }
  }
  flush();

  const textSegments = segments.filter((s) => s.type === "text");
  let cursor = 0;
  async function worker() {
    while (cursor < textSegments.length) {
      const i = cursor++;
      const trimmed = textSegments[i].value.trim();
      if (!trimmed || !/[\u0590-\u05FF]/.test(textSegments[i].value)) continue;
      const translated = await translatePlain(trimmed, cache, stats);
      textSegments[i].value = textSegments[i].value.replace(trimmed, translated);
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);

  return segments.map((s) => s.value).join("");
}

function simplifyLegalHtml(html, enTitle) {
  const inner = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/data-path-to-node="[^"]*"/gi, "")
    .replace(/<div class="elementor[\s\S]*?elementor-widget-text-editor[\s\S]*?>/gi, "")
    .replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/gi, "")
    .replace(/<\/?div[^>]*>/gi, "")
    .replace(/<\/?section[^>]*>/gi, "")
    .replace(/<\/?article[^>]*>/gi, "")
    .trim();

  const body = inner.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "").trim();
  return `<article class="legal-page"><h1>${enTitle}</h1>${body}</article>`;
}

async function main() {
  const hePages = JSON.parse(fs.readFileSync(HE_PAGES, "utf8"));
  const enPages = JSON.parse(fs.readFileSync(EN_PAGES, "utf8"));
  const cache = fs.existsSync(CACHE_FILE)
    ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"))
    : {};
  const stats = { apiCalls: 0, cacheHits: 0, cacheMisses: 0 };

  for (const hePath of LEGAL_HE_PATHS) {
    const he = hePages.find((p) => pathFromLink(p.link) === hePath);
    const en = enPages.find((p) => pathFromLink(p.link).includes(hePath.replace(/^\//, "")));
    if (!he || !en) {
      console.warn("Missing legal page:", hePath);
      continue;
    }

    const enTitle = LEGAL_EN_TITLES[hePath];
    console.log(`Translating ${hePath} → ${enTitle}`);
    const translated = await translateHtml(he.content, cache, stats);
    en.title = enTitle;
    en.content = simplifyLegalHtml(translated, enTitle);
    console.log(`  done — api=${stats.apiCalls} cacheHits=${stats.cacheHits}`);
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  fs.writeFileSync(EN_PAGES, JSON.stringify(enPages, null, 2), "utf8");
  console.log("Legal pages updated in content-en/pages.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
