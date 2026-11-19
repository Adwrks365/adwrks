import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const seoPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "content", "seo.json");
const seo = JSON.parse(fs.readFileSync(seoPath, "utf8"));

const GOOGLE_SEO_SLUG = "%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c";

const patches = {
  title: "קידום אתרים בגוגל | מדריך SEO מקצועי 2026",
  metaDescription:
    "מדריך לקידום אתרים בגוגל: מחקר מילות מפתח, SEO טכני, תוכן, קישורים ומדידה. מתי SEO ומתי PPC — ואיך סוכנות עוזרת בלי הבטחות שווא.",
  ogTitle: "קידום אתרים בגוגל | מדריך SEO מקצועי 2026",
  ogDescription:
    "מדריך לקידום אתרים בגוגל: מחקר מילות מפתח, SEO טכני, תוכן, קישורים ומדידה. מתי SEO ומתי PPC — ואיך סוכנות עוזרת בלי הבטחות שווא.",
};

let updated = false;
for (const rec of seo) {
  if (!rec.url.includes(GOOGLE_SEO_SLUG)) continue;
  Object.assign(rec, patches);
  updated = true;
  break;
}

if (updated) {
  fs.writeFileSync(seoPath, JSON.stringify(seo));
  console.log("Updated SEO metadata for קידום אתרים בגוגל");
} else {
  console.log("No SEO record matched");
}