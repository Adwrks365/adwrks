/**
 * Sync HUB_FAQ to seo.json FAQPage (Hebrew hub + EN hub).
 * Run: node web/scripts/sync-sprint2-hub-faq.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function faqPage(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

function upsertFaq(seo, url, items) {
  const record = seo.find((e) => e.url === url || e.canonical === url);
  if (!record) throw new Error(`seo.json missing ${url}`);
  record.jsonLd = (record.jsonLd ?? []).filter((j) => j["@type"] !== "FAQPage");
  record.jsonLd.push(faqPage(items));
}

const hubHe = await import(new URL("../src/lib/pages/services/hub-content.ts", import.meta.url).href);
const hubEn = await import(new URL("../src/lib/pages/services/hub-content.en.ts", import.meta.url).href);

const hubHeUrl =
  "https://adwrks.co.il/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/";
const hubEnUrl = "https://adwrks.co.il/en/digital-marketing-services/";

for (const [file, url, items] of [
  ["content/seo.json", hubHeUrl, hubHe.HUB_FAQ],
  ["content-en/seo.json", hubEnUrl, hubEn.HUB_FAQ],
]) {
  const seoPath = path.join(__dirname, "..", "src", "data", file);
  const seo = JSON.parse(fs.readFileSync(seoPath, "utf8"));
  upsertFaq(seo, url, items);
  fs.writeFileSync(seoPath, JSON.stringify(seo));
  console.log(JSON.stringify({ file, url, count: items.length }));
}

console.log(JSON.stringify({ ok: true }));
