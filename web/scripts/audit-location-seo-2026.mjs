/**
 * Location pages — SEO title/description audit + before snapshot from main.
 * npx tsx scripts/audit-location-seo-2026.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { getHubView, getLocationView } from "../src/lib/pages/locations/registry.ts";
import { clampSeoDescription, clampSeoTitle } from "../src/lib/content/seo-clamp.ts";

const root = path.resolve("..");
const outMd = path.join(root, "migration-audit", "LOCATION_SEO_BEFORE_AFTER_2026.md");
const outJson = path.join(root, "migration-audit", "LOCATION_SEO_BEFORE_AFTER_2026.json");

function estPixels(text, locale) {
  const isHe = locale === "he" || /[\u0590-\u05FF]/.test(text);
  const perChar = isHe ? 11 : 7;
  return text.length * perChar;
}

function readBeforeFromMain(id, locale, kind) {
  const file = locale === "he" ? "web/src/lib/pages/locations/copy-he.ts" : "web/src/lib/pages/locations/copy-en.ts";
  try {
    const raw = execSync(`git show main:${file}`, { cwd: root, encoding: "utf8" });
    if (kind === "hub") {
      const hubConst = locale === "he" ? "HUB_HE" : "HUB_EN";
      const block = raw.match(
        new RegExp(
          `export const ${hubConst}[\\s\\S]*?seoTitle:\\s*"([^"]+)"[\\s\\S]*?seoDescription:\\s*\\n?\\s*"([^"]+)"`,
        ),
      );
      if (block) return { title: block[1], description: block[2] };
    }
    const idEsc = id.replace(/-/g, "\\-");
    const re = new RegExp(
      `${idEsc}:\\s*base\\(\\{[\\s\\S]*?seoTitle:\\s*"([^"]+)"[\\s\\S]*?seoDescription:\\s*\\n?\\s*"([^"]+)"`,
    );
    const m = raw.match(re);
    if (m) return { title: m[1], description: m[2] };
    const extraFile =
      locale === "he" ? "web/src/lib/pages/locations/copy-he-extra.ts" : "web/src/lib/pages/locations/copy-en-extra.ts";
    const extra = execSync(`git show main:${extraFile}`, { cwd: root, encoding: "utf8" });
    const er = new RegExp(
      `'${idEsc}':[\\s\\S]*?seoTitle:\\s*"([^"]+)"[\\s\\S]*?seoDescription:\\s*\\n?\\s*"([^"]+)"`,
    );
    const em = extra.match(er);
    if (em) return { title: em[1], description: em[2] };
  } catch {
    /* */
  }
  return { title: "(unknown)", description: "(unknown)" };
}

const rows = [];

for (const route of LOCATION_ROUTES) {
  for (const locale of ["he", "en"]) {
    const pathKey = locale === "he" ? route.he : route.en;
    const isHub = route.kind === "hub";
    const copy = isHub ? getHubView(pathKey, locale).copy : getLocationView(pathKey, locale).copy;
    const before = readBeforeFromMain(route.id, locale, isHub ? "hub" : "city");
    const titleAfter = copy.seoTitle;
    const descAfter = copy.seoDescription;
    const titleClamped = clampSeoTitle(titleAfter);
    const descClamped = clampSeoDescription(descAfter);

    const issues = [];
    if (!titleAfter.includes("Adwrks 365")) issues.push("brand-title");
    if (!descAfter.includes("Adwrks 365") && locale === "he" && !descAfter.includes("Adwrks")) {
      /* EN always has brand in our copy */
    }
    if (locale === "en" && !descAfter.includes("Adwrks 365")) issues.push("brand-desc-en");
    if (
      locale === "he" &&
      route.id !== "hub" &&
      !/שיווק דיגיטלי|פרסום דיגיטלי|חברה לשיווק|סוכנות/.test(`${titleAfter} ${descAfter}`)
    ) {
      issues.push("keyword-he");
    }
    if (titleAfter.length > 62) issues.push("title-long");
    if (descAfter.length > 158) issues.push("desc-long");
    if (!titleAfter.includes("שיווק דיגיטלי") && locale === "he" && route.id === "hub" && !titleAfter.includes("שיווק דיגיטלי")) {
      /* hub has it */
    }

    rows.push({
      id: route.id,
      locale,
      path: pathKey,
      beforeTitle: before.title,
      beforeDesc: before.description,
      afterTitle: titleAfter,
      afterDesc: descAfter,
      clampedTitle: titleClamped,
      clampedDesc: descClamped,
      titleLen: titleAfter.length,
      descLen: descAfter.length,
      titlePxEstDesktop: estPixels(titleClamped, locale),
      titlePxEstMobile: estPixels(titleClamped.slice(0, 45), locale),
      descPxEstDesktop: estPixels(descClamped, locale),
      issues,
    });
  }
}

const dupTitles = new Map();
for (const r of rows) {
  const k = `${r.locale}:${r.afterTitle}`;
  dupTitles.set(k, (dupTitles.get(k) || 0) + 1);
}
const dupDesc = new Map();
for (const r of rows) {
  const k = `${r.locale}:${r.afterDesc}`;
  dupDesc.set(k, (dupDesc.get(k) || 0) + 1);
}
for (const r of rows) {
  if ((dupTitles.get(`${r.locale}:${r.afterTitle}`) || 0) > 1) r.issues.push("dup-title");
  if ((dupDesc.get(`${r.locale}:${r.afterDesc}`) || 0) > 1) r.issues.push("dup-desc");
}

fs.writeFileSync(outJson, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2));

let md = `# Location SEO — לפני / אחרי (25 עמודים × HE+EN)

Generated: ${new Date().toISOString()}

> אורך יעד: Title ~45–60 תווים · Meta ~120–155. הערכת רוחב: HE ~11px/תו, EN ~7px/תו (מחשב ~580px, מובייל ~320px לכותרת). Google עשויה לקצר או לשכתב.

| # | id | locale | path | Title לפני | Title אחרי | len | Meta לפני (מקוצר) | Meta אחרי (מקוצר) | len | issues |
|---:|---|-----|------|------------|------------|----:|---------------------|---------------------|----:|--------|
`;

rows.forEach((r, i) => {
  const bt = r.beforeTitle.replace(/\|/g, "\\|");
  const at = r.afterTitle.replace(/\|/g, "\\|");
  const bd = r.beforeDesc.slice(0, 55).replace(/\|/g, "\\|") + (r.beforeDesc.length > 55 ? "…" : "");
  const ad = r.afterDesc.slice(0, 55).replace(/\|/g, "\\|") + (r.afterDesc.length > 55 ? "…" : "");
  md += `| ${i + 1} | ${r.id} | ${r.locale} | \`${r.path}\` | ${bt} | ${at} | ${r.titleLen} | ${bd} | ${ad} | ${r.descLen} | ${r.issues.join(", ") || "—"} |\n`;
});

const failed = rows.filter((r) => r.issues.length).length;
md += `\n**סיכום:** ${rows.length} רשומות, ${failed} עם flags.\n`;
fs.writeFileSync(outMd, md);

console.log(`Wrote ${outJson} ${outMd}`);
if (failed) {
  console.error("ISSUES", rows.filter((r) => r.issues.length));
  process.exit(1);
}
process.exit(0);