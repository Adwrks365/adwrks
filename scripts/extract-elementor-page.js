#!/usr/bin/env node
/** Extract structured content from Elementor JSON for a page slug. */
const fs = require("fs");
const path = require("path");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node extract-elementor-page.js <slug>");
  process.exit(1);
}

const pages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "migration-audit", "pages.json"), "utf8"),
);
const page = pages.find((p) => p.slug === slug);
if (!page?.elementor?._elementor_data) {
  console.error("No elementor data for", slug);
  process.exit(1);
}

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
        if (text.length > 20) out.push({ type: "text", html: s.editor, text });
      } else if (wt === "icon-list" && s.icon_list) {
        out.push({
          type: "list",
          items: s.icon_list.map((i) => stripHtml(i.text || i._id)),
        });
      } else if (wt === "image" && s.image?.url) {
        out.push({
          type: "image",
          url: s.image.url,
          alt: s.image.alt || "",
          caption: s.caption || "",
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
      }
    }
    if (node.elements) walk(node.elements, out);
  }
}

const blocks = [];
walk(page.elementor._elementor_data, blocks);
console.log(JSON.stringify({ id: page.id, title: page.title, slug, blocks: blocks.slice(0, 40) }, null, 2));
