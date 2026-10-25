#!/usr/bin/env node
/**
 * Rewrite English seo.json titles/descriptions from EN content (posts, pages, categories).
 * Run: node web/scripts/sync-en-seo-metadata.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(__dirname, "..");
const EN_DIR = path.join(WEB, "src", "data", "content-en");
const EN_SEO_OVERRIDES = JSON.parse(
  fs.readFileSync(path.join(EN_DIR, "en-seo-overrides.json"), "utf8"),
);

const BRAND = "Adwrks 365";
const TITLE_MAX = 60;
const DESC_MAX = 155;
const DESC_MIN = 120;

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(EN_DIR, name), "utf8"));
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(EN_DIR, name), `${JSON.stringify(data, null, 2)}\n`, "utf8");
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

function pathFromLink(link) {
  return normalizePath(link);
}

function parsePagination(p) {
  const m = p.match(/^(.+\/)page\/(\d+)\/$/);
  if (!m) return null;
  return { base: m[1], page: Number(m[2]) };
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(text) {
  return (text || "")
    .replace(/&#8211;/g, "–")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

function hasHebrew(text) {
  return /[\u0590-\u05FF]/.test(text || "");
}

function clampTitle(title, max = TITLE_MAX) {
  const t = title.trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > 32) return `${slice.slice(0, lastSpace).trim()}…`;
  return `${slice.trim()}…`;
}

function clampDescription(text, max = DESC_MAX) {
  const t = text.trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > 100) return `${slice.slice(0, lastSpace).trim()}…`;
  return `${slice.trim()}…`;
}

function categorySeoTitle(categoryTitle) {
  const long = `${categoryTitle} Guides & Articles | ${BRAND}`;
  if (long.length <= TITLE_MAX) return long;
  return clampTitle(`${categoryTitle} | ${BRAND}`);
}

function postSeoTitle(postTitle) {
  const clean = decodeEntities(stripHtml(postTitle));
  if (clean.length >= 30 && clean.length <= TITLE_MAX) return clean;
  if (clean.length < 30) return clampTitle(`${clean} | ${BRAND}`);
  return clampTitle(clean);
}

function buildDescription({ excerpt, content, categoryDesc, fallbackTitle }) {
  let raw =
    stripHtml(excerpt) ||
    categoryDesc ||
    stripHtml(content).slice(0, 400) ||
    "";
  raw = decodeEntities(raw);
  if (!raw || hasHebrew(raw)) {
    raw = `Expert guide: ${fallbackTitle}. Practical digital marketing, SEO, and paid ads insights from ${BRAND} for Israeli businesses.`;
  }
  if (raw.length < DESC_MIN) {
    raw = `${raw} Strategy, measurement, and ROI tips from the ${BRAND} team.`.trim();
  }
  return clampDescription(raw);
}

function uniqueValue(base, used, uniquify) {
  let candidate = base;
  let n = 2;
  while (used.has(candidate)) {
    candidate = uniquify(base, n);
    n++;
    if (n > 30) break;
  }
  used.add(candidate);
  return candidate;
}

function resolveMappedTitle(p, titleByPath, descByPath) {
  const override = EN_SEO_OVERRIDES[p];
  if (override?.title && override?.description) {
    return {
      title: clampTitle(override.title),
      description: clampDescription(override.description),
    };
  }

  const direct = titleByPath.get(p);
  if (direct) {
    return { title: direct, description: descByPath.get(p) };
  }

  const pag = parsePagination(p);
  if (pag) {
    const baseTitle = titleByPath.get(pag.base);
    const baseDesc = descByPath.get(pag.base);
    if (baseTitle) {
      const stem = baseTitle.replace(/\s*\|\s*Adwrks 365$/, "").replace(/\s*Guides & Articles$/, "");
      const title = clampTitle(`${stem} – Page ${pag.page} | ${BRAND}`);
      const description = baseDesc
        ? clampDescription(`${baseDesc.replace(/…$/, "")} Page ${pag.page}.`)
        : buildDescription({ fallbackTitle: title });
      return { title, description };
    }
  }

  return null;
}

function main() {
  const posts = readJson("posts.json");
  const pages = readJson("pages.json");
  const categories = readJson("categories.json");
  const seo = readJson("seo.json");

  const titleByPath = new Map();
  const descByPath = new Map();

  for (const cat of categories) {
    const p = pathFromLink(cat.link);
    titleByPath.set(p, categorySeoTitle(cat.title));
    descByPath.set(
      p,
      buildDescription({ categoryDesc: cat.description, fallbackTitle: cat.title }),
    );
  }

  for (const post of posts) {
    const p = pathFromLink(post.link);
    const title = postSeoTitle(post.title);
    titleByPath.set(p, title);
    descByPath.set(
      p,
      buildDescription({
        excerpt: post.excerpt,
        content: post.content,
        fallbackTitle: title,
      }),
    );
  }

  for (const page of pages) {
    const p = pathFromLink(page.link);
    const title = postSeoTitle(page.title);
    titleByPath.set(p, title);
    descByPath.set(
      p,
      buildDescription({
        excerpt: page.excerpt,
        content: page.content,
        fallbackTitle: title,
      }),
    );
  }

  const usedTitles = new Set();
  const usedDescs = new Set();
  let updated = 0;

  for (const rec of seo) {
    const p = normalizePath(rec.url);
    if (!p.startsWith("/en/")) continue;

    const mapped = resolveMappedTitle(p, titleByPath, descByPath);

    if (mapped?.title) {
      const title = uniqueValue(mapped.title, usedTitles, (base, n) =>
        clampTitle(`${base.replace(/\s*\|\s*Adwrks 365$/, "")} · ${n} | ${BRAND}`),
      );
      if (rec.title !== title) updated++;
      rec.title = title;
      rec.ogTitle = title;
    } else if (!rec.title || hasHebrew(rec.title)) {
      continue;
    }

    if (mapped?.description) {
      const metaDescription = uniqueValue(mapped.description, usedDescs, (base, n) =>
        clampDescription(`${base.slice(0, 140)} (${n})`),
      );
      if (rec.metaDescription !== metaDescription) updated++;
      rec.metaDescription = metaDescription;
      rec.ogDescription = metaDescription;
    } else if (rec.metaDescription && hasHebrew(rec.metaDescription)) {
      const metaDescription = uniqueValue(
        buildDescription({ fallbackTitle: rec.title || "Article" }),
        usedDescs,
        (base, n) => clampDescription(`${base.slice(0, 140)} (${n})`),
      );
      rec.metaDescription = metaDescription;
      rec.ogDescription = metaDescription;
      updated++;
    }
  }

  writeJson("seo.json", seo);
  console.log(`Updated EN seo.json (${updated} changes, ${seo.length} records)`);
}

main();
