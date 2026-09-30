#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const AUDIT = path.join(__dirname, "..", "migration-audit");
const pages = JSON.parse(fs.readFileSync(path.join(AUDIT, "pages.json"), "utf8"));
const posts = JSON.parse(fs.readFileSync(path.join(AUDIT, "posts.json"), "utf8"));
const urls = JSON.parse(fs.readFileSync(path.join(AUDIT, "urls.json"), "utf8")).sitemapUrls;

const SHORTCODE_RE = /\[([\w\-]+)([^\]]*)\]/g;

function stripHtml(h) {
  return (h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function findShortcodes(text) {
  const found = [];
  if (!text) return found;
  let m;
  const re = new RegExp(SHORTCODE_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    found.push({ tag: m[1], full: m[0], attrs: m[2].trim() });
  }
  return found;
}

function walkElementor(nodes, out) {
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    if (node.elType === "widget") {
      const s = node.settings || {};
      for (const val of Object.values(s)) {
        if (typeof val === "string") {
          out.push(...findShortcodes(val));
        }
      }
    }
    if (node.elements) walkElementor(node.elements, out);
  }
}

const results = [];
const seen = new Set();

for (const url of urls) {
  const pathname = new URL(url).pathname.replace(/\/?$/, "/");
  const page = pages.find((p) => new URL(p.link).pathname.replace(/\/?$/, "/") === pathname);
  const post = posts.find((p) => new URL(p.link).pathname.replace(/\/?$/, "/") === pathname);
  const item = page || post;
  if (!item) continue;

  const inContent = findShortcodes(item.content);
  const inExcerpt = findShortcodes(item.excerpt);
  const inElementor = [];
  if (item.elementor?._elementor_data) walkElementor(item.elementor._elementor_data, inElementor);

  const all = [...inContent, ...inExcerpt, ...inElementor];
  const unique = [];
  for (const sc of all) {
    const key = sc.full;
    if (!seen.has(key)) seen.add(key);
    unique.push(sc);
  }

  if (unique.length) {
    results.push({
      url: pathname,
      wordpressId: item.id,
      contentType: page ? "page" : "post",
      title: stripHtml(item.title),
      shortcodes: unique.map((s) => ({
        tag: s.tag,
        full: s.full,
        purpose: s.tag.includes("elfsight")
          ? "Elfsight widget (click-to-call / WhatsApp chat)"
          : s.tag.includes("elementor")
            ? "Elementor template/widget"
            : "WordPress plugin shortcode",
        fixStatus:
          pathname === "/contact-us/" && s.tag.includes("elfsight")
            ? "replaced-with-ui"
            : "needs-review",
      })),
    });
  }
}

const summary = {
  timestamp: new Date().toISOString(),
  urlsScanned: urls.length,
  urlsWithShortcodes: results.length,
  totalShortcodes: results.reduce((n, r) => n + r.shortcodes.length, 0),
  fixed: results.reduce(
    (n, r) => n + r.shortcodes.filter((s) => s.fixStatus === "replaced-with-ui").length,
    0,
  ),
  remaining: results.reduce(
    (n, r) => n + r.shortcodes.filter((s) => s.fixStatus !== "replaced-with-ui").length,
    0,
  ),
  entries: results,
};

fs.writeFileSync(path.join(AUDIT, "shortcode-audit.json"), JSON.stringify(summary, null, 2), "utf8");
console.log(JSON.stringify({ urlsWithShortcodes: summary.urlsWithShortcodes, total: summary.totalShortcodes, fixed: summary.fixed, remaining: summary.remaining }, null, 2));
