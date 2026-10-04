/**
 * Phase 5I.3C — Contact planner UX + hero visual QA
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i3c-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

async function runInteractionTests(page) {
  const results = {};

  await page.goto(`${BASE}/contact-us/`, { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 1440, height: 900 });

  // A: select goal
  await page.getByRole("button", { name: "להגדיל מכירות", exact: true }).click();
  results.A = await page.evaluate(() => ({
    hasSummary: !!document.querySelector(".cp-planner-summary"),
    hasContinue: !!document.querySelector(".cp-planner-continue"),
    summaryText: document.querySelector(".cp-planner-summary")?.textContent?.trim() ?? null,
  }));

  // B: add SEO
  await page.getByRole("button", { name: "SEO", exact: true }).click();
  results.B = await page.evaluate(() => document.querySelector(".cp-planner-summary")?.textContent?.includes("SEO"));

  // C: add Google Ads
  await page.getByRole("button", { name: "Google Ads", exact: true }).click();
  results.C = await page.evaluate(() => {
    const text = document.querySelector(".cp-planner-summary")?.textContent ?? "";
    return text.includes("SEO") && text.includes("Google Ads");
  });

  // D: continue scroll/focus
  await page.getByRole("button", { name: "המשיכו להשארת פרטים" }).click();
  await page.waitForTimeout(500);
  results.D = await page.evaluate(() => {
    const formCard = document.querySelector(".cp-form-card");
    const rect = formCard?.getBoundingClientRect();
    const active = document.activeElement?.id ?? null;
    return {
      formInView: rect ? rect.top < window.innerHeight * 0.35 : false,
      focusedField: active,
      hasFormContext: !!document.querySelector(".cp-form-context"),
    };
  });

  // E: change primary goal
  await page.getByRole("button", { name: "לקבל יותר לידים", exact: true }).click();
  results.E = await page.evaluate(() => ({
    summaryHasNewGoal: document.querySelector(".cp-planner-summary")?.textContent?.includes("לקבל יותר לידים"),
    formContext: document.querySelector(".cp-form-context-line")?.textContent?.trim() ?? null,
  }));

  // F: clear and verify form still present without planner requirement
  await page.getByRole("button", { name: "נקה בחירה" }).click();
  results.F = await page.evaluate(() => ({
    noSummary: !document.querySelector(".cp-planner-summary"),
    formFields: [...document.querySelectorAll(".contact-form input[name], .contact-form textarea[name]")].map((el) =>
      el.getAttribute("name"),
    ),
    submitEnabled: !document.querySelector(".contact-form-submit")?.disabled,
  }));

  return results;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { base: BASE, interactions: null, visual: {}, screenshots: [] };

  report.interactions = await runInteractionTests(await browser.newPage({ locale: "he-IL" }));

  for (const viewport of [
    { w: 1440, h: 900, shots: ["hero", "planner-selected", "conversion"] },
    { w: 390, h: 844, shots: ["hero", "planner-selected"] },
  ]) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.setViewportSize({ width: viewport.w, height: viewport.h });
    await page.goto(`${BASE}/contact-us/`, { waitUntil: "networkidle" });

    if (viewport.shots.includes("planner-selected")) {
      await page.getByRole("button", { name: "להגדיל מכירות", exact: true }).click();
      await page.getByRole("button", { name: "SEO", exact: true }).click();
    }

    report.visual[viewport.w] = await page.evaluate(() => ({
      hasConsultCard: !!document.querySelector(".cp-consult-card"),
      hasChatPreview: !!document.querySelector(".cp-chat-preview"),
      hasSummary: !!document.querySelector(".cp-planner-summary"),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    }));

    for (const shot of viewport.shots) {
      const selector =
        shot === "hero"
          ? ".cp-hero"
          : shot === "planner-selected"
            ? ".cp-planner"
            : "#contact-form";
      const name = `contact-${viewport.w}-${shot}.png`;
      const el = page.locator(selector).first();
      if ((await el.count()) > 0) {
        await el.screenshot({ path: path.join(OUT_DIR, name) });
        report.screenshots.push(name);
      }
    }

    await page.close();
  }

  await browser.close();
  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
