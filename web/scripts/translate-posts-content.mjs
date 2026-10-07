#!/usr/bin/env node
/**
 * Translates Hebrew post HTML/excerpt into English for content-en/posts.json.
 * Preserves HTML structure; caches segments to speed re-runs.
 *
 * Run: node web/scripts/translate-posts-content.mjs [--force] [--id=21496]
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HE_POSTS = path.join(ROOT, "src", "data", "content", "posts.json");
const EN_POSTS = path.join(ROOT, "src", "data", "content-en", "posts.json");
const CACHE_FILE = path.join(ROOT, "src", "data", "content-en", ".translation-cache.json");
const ROUTES_FILE = path.join(ROOT, "src", "i18n", "routes.ts");

const args = process.argv.slice(2);
const force = args.includes("--force");
const idArg = args.find((a) => a.startsWith("--id="));
const idFilter = idArg ? idArg.split("=", 2)[1] : undefined;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 20);
}

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

function loadRoutePairs() {
  const src = fs.readFileSync(ROUTES_FILE, "utf8");
  const pairs = [];
  const re = /"he":\s*"([^"]+)"[\s\S]*?"en":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    pairs.push({ he: m[1], en: m[2] });
  }
  return pairs;
}

function rewriteInternalLinks(html, locale, heToEn) {
  return html.replace(/href=(["'])(\/[^"'#?]*)\1/gi, (match, quote, href) => {
    if (href.startsWith("//") || href.startsWith("/wp-content/")) return match;
    const normalized = normalizePath(href);
    if (locale === "en") {
      if (normalized.startsWith("/en/") || normalized === "/en/") return match;
      const en = heToEn.get(normalized);
      if (!en) return match;
      return `href=${quote}${en}${quote}`;
    }
    return match;
  });
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitChunks(text, max = 1500) {
  if (text.length <= max) return [text];
  const chunks = [];
  let rest = text;
  while (rest.length > max) {
    let cut = rest.lastIndexOf("\n", max);
    if (cut < max * 0.5) cut = rest.lastIndexOf(". ", max);
    if (cut < max * 0.3) cut = rest.lastIndexOf(" ", max);
    if (cut <= 0) cut = max;
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) chunks.push(rest);
  return chunks;
}

async function googleTranslate(text, attempt = 0) {
  const clients = ["gtx", "dict-chrome-ex", "at"];
  const client = clients[attempt % clients.length];
  const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=he&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    if (attempt < 5) {
      await sleep(800 * (attempt + 1));
      return googleTranslate(text, attempt + 1);
    }
    throw new Error(`Translate HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data?.[0])) throw new Error("Unexpected translate response");
  return data[0].map((part) => part[0]).join("");
}

async function translatePlain(trimmed, cache, stats) {
  const key = hash(trimmed);
  if (!force && cache[key]) {
    stats.cacheHits += 1;
    return cache[key];
  }

  const chunks = splitChunks(trimmed);
  const translatedParts = [];
  for (const chunk of chunks) {
    if (!/[\u0590-\u05FF]/.test(chunk)) {
      translatedParts.push(chunk);
      continue;
    }
    await sleep(120);
    const out = await googleTranslate(chunk);
    translatedParts.push(out);
    stats.apiCalls += 1;
  }

  const translated = translatedParts.join("");
  cache[key] = translated;
  stats.cacheMisses += 1;
  return translated;
}

function collectTextSegments(html) {
  const parts = html.split(/(<[^>]+>)/);
  const segments = [];
  let buffer = "";

  function flushBuffer() {
    if (!buffer) return;
    const trimmed = buffer.trim();
    if (trimmed && /[\u0590-\u05FF]/.test(buffer)) {
      segments.push({ kind: "text", raw: buffer, trimmed });
    }
    buffer = "";
  }

  for (const part of parts) {
    if (part.startsWith("<")) {
      flushBuffer();
      segments.push({ kind: "tag", raw: part });
    } else {
      buffer += part;
    }
  }
  flushBuffer();
  return segments;
}

async function translateSegmentsBatch(segments, cache, stats, concurrency = 6) {
  const textSegments = segments.filter((s) => s.kind === "text");
  let cursor = 0;

  async function worker() {
    while (cursor < textSegments.length) {
      const index = cursor++;
      const segment = textSegments[index];
      segment.translated = await translatePlain(segment.trimmed, cache, stats);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

async function translateHtml(html, cache, stats) {
  const segments = collectTextSegments(html);
  await translateSegmentsBatch(segments, cache, stats);

  return segments
    .map((segment) => {
      if (segment.kind === "tag") return segment.raw;
      if (!segment.translated) return segment.raw;
      return segment.raw.replace(segment.trimmed, segment.translated);
    })
    .join("");
}

function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}

async function main() {
  const hePosts = JSON.parse(fs.readFileSync(HE_POSTS, "utf8"));
  const enPosts = JSON.parse(fs.readFileSync(EN_POSTS, "utf8"));
  const enById = new Map(enPosts.map((p) => [String(p.id), p]));
  const heToEn = new Map(loadRoutePairs().map((p) => [p.he, p.en]));
  const cache = loadCache();
  const stats = { apiCalls: 0, cacheHits: 0, cacheMisses: 0, translated: 0, skipped: 0 };

  const targets = hePosts.filter((p) => !idFilter || String(p.id) === idFilter);
  console.log(`Translating ${targets.length} posts…`);

  for (let i = 0; i < targets.length; i++) {
    const he = targets[i];
    const en = enById.get(String(he.id));
    if (!en) {
      console.warn(`  skip id=${he.id}: no EN metadata`);
      stats.skipped += 1;
      continue;
    }

    const hasEnBody =
      en.content &&
      !/[\u0590-\u05FF]/.test(stripHtml(en.content).slice(0, 400)) &&
      en.content.length > 200;

    if (!force && hasEnBody) {
      console.log(`  [${i + 1}/${targets.length}] id=${he.id} already EN — skip`);
      stats.skipped += 1;
      continue;
    }

    console.log(`  [${i + 1}/${targets.length}] id=${he.id} ${en.title?.slice(0, 50)}…`);
    let content = await translateHtml(he.content, cache, stats);
    content = rewriteInternalLinks(content, "en", heToEn);

    let excerpt = he.excerpt ? await translateHtml(he.excerpt, cache, stats) : en.excerpt;
    excerpt = stripHtml(excerpt).slice(0, 320);

    en.content = content;
    en.excerpt = excerpt;
    stats.translated += 1;

    if ((i + 1) % 3 === 0) {
      saveCache(cache);
      fs.writeFileSync(EN_POSTS, JSON.stringify(enPosts, null, 2), "utf8");
      console.log(`    checkpoint — api=${stats.apiCalls} cacheHits=${stats.cacheHits}`);
    }
  }

  saveCache(cache);
  fs.writeFileSync(EN_POSTS, JSON.stringify(enPosts, null, 2), "utf8");

  console.log("\nDone.");
  console.log(`  translated: ${stats.translated}`);
  console.log(`  skipped:    ${stats.skipped}`);
  console.log(`  api calls:  ${stats.apiCalls}`);
  console.log(`  cache hits: ${stats.cacheHits}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
