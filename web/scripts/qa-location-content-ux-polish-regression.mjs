/**
 * Regression: polishStringFields must polish faq, serviceBlocks, workSteps (not skip via generic array branch).
 * npx tsx scripts/qa-location-content-ux-polish-regression.mjs
 */
import { polishStringFields } from "../src/lib/pages/locations/location-content-ux-polish.ts";
import { getLocationView } from "../src/lib/pages/locations/registry.ts";
import { FAQ_BUDGET_ROI_HE } from "../src/lib/pages/locations/copy-shared-he.ts";

const skip = new Set(["seoTitle", "seoDescription", "h1"]);

const mock = {
  lead: "יש כאן ROI",
  challengesPoints: ["Search לכוונה"],
  faq: [{ q: "מה זה ROI?", a: "נשתמש ב-tracking" }],
  serviceBlocks: [
    { title: "Google Ads (PPC)", text: "מודעות עם ROI" },
  ],
  workSteps: [{ title: "שלב", text: "נבדוק tracking, דף ומודעות" }],
};

polishStringFields(mock, "he", skip);

let failed = 0;
if (mock.faq[0].q.includes("ROI")) {
  console.error("FAIL faq.q not polished");
  failed++;
}
if (mock.faq[0].a.includes("tracking")) {
  console.error("FAIL faq.a not polished");
  failed++;
}
if (mock.serviceBlocks[0].text.includes("ROI")) {
  console.error("FAIL serviceBlocks not polished");
  failed++;
}
if (mock.workSteps[0].text.includes("tracking")) {
  console.error("FAIL workSteps not polished");
  failed++;
}
if (mock.challengesPoints[0].includes("Search לכוונה")) {
  console.error("FAIL string array not polished");
  failed++;
}

// Live copy: shared FAQ on a location page after full pipeline
const copy = getLocationView("/סוכנות-שיווק-דיגיטלי-ברמת-גן/", "he").copy;
const roiFaq = copy.faq.find((f) => f.q.includes("תשואה") || f.q.includes("מחזיר"));
if (!roiFaq) {
  console.error("FAIL live faq polish — expected Hebrew results question");
  failed++;
}

const rawFaq = FAQ_BUDGET_ROI_HE[1].q;
if (copy.faq[1].q === rawFaq && rawFaq.includes("ROI")) {
  console.error("FAIL pipeline did not polish spread faq");
  failed++;
}

console.log(failed ? "FAILED" : "OK polish regression", failed);
process.exit(failed ? 1 : 0);