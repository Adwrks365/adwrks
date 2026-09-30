#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const AUDIT = path.join(__dirname, "..", "migration-audit");
const OUT = path.join(__dirname, "..", "web", "src", "lib", "pages", "extracted");
const pages = JSON.parse(fs.readFileSync(path.join(AUDIT, "pages.json"), "utf8"));

function stripHtml(s) {
  return (s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function walk(nodes, out) {
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    if (node.elType === "widget") {
      const wt = node.widgetType;
      const s = node.settings || {};
      if (wt === "heading" && s.title) {
        out.push({ type: "heading", level: s.header_size || "h2", text: stripHtml(s.title) });
      } else if (wt === "text-editor" && s.editor) {
        const text = stripHtml(s.editor);
        if (text.length > 15 && !text.startsWith("[")) {
          out.push({ type: "text", html: s.editor, text });
        }
      } else if (wt === "icon-list" && s.icon_list) {
        out.push({
          type: "list",
          items: s.icon_list.map((i) => stripHtml(i.text || "")).filter(Boolean),
        });
      } else if (wt === "image" && s.image?.url) {
        out.push({
          type: "image",
          url: s.image.url,
          alt: s.image.alt || "",
        });
      } else if (wt === "button" && s.text) {
        out.push({ type: "button", text: stripHtml(s.text), url: s.link?.url || "" });
      } else if (wt === "accordion" && s.tabs) {
        out.push({
          type: "faq",
          items: s.tabs.map((t) => ({
            q: stripHtml(t.tab_title),
            a: stripHtml(t.tab_content),
          })),
        });
      } else if (wt === "toggle" && s.tabs) {
        out.push({
          type: "faq",
          items: s.tabs.map((t) => ({
            q: stripHtml(t.tab_title),
            a: stripHtml(t.tab_content),
          })),
        });
      }
    }
    if (node.elements) walk(node.elements, out);
  }
}

fs.mkdirSync(OUT, { recursive: true });
const index = {};

for (const page of pages) {
  if (!page.elementor?._elementor_data) continue;
  const blocks = [];
  walk(page.elementor._elementor_data, blocks);
  let routePath = new URL(page.link).pathname.replace(/\/?$/, "/");
  routePath = routePath
    .split("/")
    .map((segment) => {
      if (!segment) return segment;
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
  if (!routePath.endsWith("/")) routePath = `${routePath}/`;
  const data = {
    wordpressId: page.id,
    slug: page.slug,
    path: routePath,
    title: stripHtml(page.title),
    blocks,
  };
  const fname = `${page.slug || page.id}.json`;
  fs.writeFileSync(path.join(OUT, fname), JSON.stringify(data, null, 2), "utf8");
  index[routePath] = fname;
}

fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2), "utf8");
console.log("Extracted", Object.keys(index).length, "pages to", OUT);
