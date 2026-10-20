import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(
  __dirname,
  "../src/lib/pages/extracted/%d7%9e%d7%97%d7%99%d7%a8%d7%95%d7%9f-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99.json",
);

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const block = data.blocks?.find((b) => b.type === "text" && b.html);
if (!block?.html) {
  console.error("No text/html block found");
  process.exit(1);
}

let html = block.html;
html = html.replace(/\/%D7%A7%D7%99%D7%93%D7%95%D7%9D-%D7%90%D7%95%D7%A8%D7%92%D7%A0%D7%99\/?/gi, "/seo/");
html = html.replace(/\/קידום-אורגני\/?/g, "/seo/");
html = html.replace(/\/website-design\/?/g, "/website-building/");
html = html.replace(/\/landing-page\/?/g, "/website-building/");
html = html.replace(/<link[^>]*trustindex[^>]*>/gi, "");

block.html = html;
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log("Patched extracted pricing archive links.");
