/**
 * Polish helper + live copy must not rely on regex pipeline (fundamental rewrite 2026).
 * npx tsx scripts/qa-location-content-ux-polish-regression.mjs
 */
import { polishStringFields } from "../src/lib/pages/locations/location-content-ux-polish.ts";
import { getLocationView } from "../src/lib/pages/locations/registry.ts";

const skip = new Set(["seoTitle", "seoDescription", "h1"]);

const mock = {
  lead: "יש כאן ROI",
  challengesPoints: ["Search לכוונה"],
  faq: [{ q: "מה זה ROI?", a: "נשתמש ב-tracking" }],
  serviceBlocks: [{ title: "Google Ads (PPC)", text: "מודעות עם ROI" }],
  workSteps: [{ title: "שלב", text: "נבדוק tracking, דף ומודעות" }],
};

polishStringFields(mock, "he", skip);

let failed = 0;
if (mock.faq[0].q.includes("ROI")) {
  console.error("FAIL faq.q not polished in unit test");
  failed++;
}
if (mock.challengesPoints[0].includes("Search לכוונה")) {
  console.error("FAIL string array not polished in unit test");
  failed++;
}

const BANNED_LIVE_HE = [
  /Search לכוונה/,
  /\btracking\b/i,
  /ניצחים מקומית/,
  /שרוצים scale\b/,
  /Meta לvisual/i,
  /\bremarketing\b/i,
  /\bMVP קמפיין/i,
];

const BANNED_LIVE_EN = [/Search לכוונה/, /ניצחים/, /\bremarketing\b/i, /\bMVP\b/i];

const samples = [
  { path: "/סוכנות-שיווק-דיגיטלי-בהרצליה/", locale: "he" },
  { path: "/סוכנות-שיווק-דיגיטלי-בראשון-לציון/", locale: "he" },
  { path: "/סוכנות-שיווק-דיגיטלי-בנתניה/", locale: "he" },
  { path: "/en/digital-marketing-herzliya/", locale: "en" },
];

for (const { path, locale } of samples) {
  const copy = getLocationView(path, locale).copy;
  const banned = locale === "he" ? BANNED_LIVE_HE : BANNED_LIVE_EN;
  const blob = JSON.stringify(copy);
  for (const re of banned) {
    if (re.test(blob)) {
      console.error("FAIL banned in live copy", path, re);
      failed++;
    }
  }
}

console.log(failed ? "FAILED" : "OK polish regression", failed);
process.exit(failed ? 1 : 0);