/**
 * Sample 8 location pages — layout, FAQ centering, nav geography (HE hub).
 * QA_BASE=http://127.0.0.1:3023 npx tsx scripts/qa-location-sample-8-2026.mjs
 */
import { chromium, devices } from "playwright";
import { serviceAreaGroups } from "../src/lib/pages/locations/nav.ts";

const BASE = (process.env.QA_BASE || "http://127.0.0.1:3000").replace(/\/$/, "");

const PAGES = [
  { id: "herzliya", he: "/סוכנות-שיווק-דיגיטלי-בהרצליה/", en: "/en/digital-marketing-herzliya/" },
  { id: "rishon-lezion", he: "/סוכנות-שיווק-דיגיטלי-בראשון-לציון/", en: "/en/digital-marketing-rishon-lezion/" },
  { id: "ramat-gan", he: "/סוכנות-שיווק-דיגיטלי-ברמת-גן/", en: "/en/digital-marketing-ramat-gan/" },
  { id: "netanya", he: "/סוכנות-שיווק-דיגיטלי-בנתניה/", en: "/en/digital-marketing-netanya/" },
  { id: "hadera", he: "/סוכנות-שיווק-דיגיטלי-בחדרה/", en: "/en/digital-marketing-hadera/" },
  { id: "karmiel", he: "/סוכנות-פרסום-שיווק-בכרמיאל/", en: "/en/digital-marketing-agency-carmiel/" },
  { id: "jerusalem", he: "/סוכנות-שיווק-דיגיטלי-בירושלים/", en: "/en/digital-marketing-jerusalem/" },
  { id: "south", he: "/סוכנות-שיווק-דיגיטלי-בדרום/", en: "/en/digital-marketing-south/" },
];

function navOk() {
  const he = serviceAreaGroups("he");
  const sharon = he.find((g) => g.id === "sharon");
  const north = he.find((g) => g.id === "north");
  const sharonIds = sharon?.cities.map((c) => c.id) ?? [];
  const northIds = north?.cities.map((c) => c.id) ?? [];
  if (!sharonIds.includes("netanya") || !sharonIds.includes("hadera")) return "sharon missing cities";
  if (northIds.includes("netanya") || northIds.includes("hadera")) return "north still has sharon cities";
  return null;
}

async function checkPage(page, path, mobile) {
  await page.goto(`${BASE}${encodeURI(path)}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(".sp-page--location, .sp-page--locations-hub", { timeout: 30000 }).catch(() => null);
  const layout = await page.evaluate(() => {
    const doc = document.documentElement;
    const faqList = document.querySelector(".sp-section-faq .sp-faq-list");
    const st = faqList ? getComputedStyle(faqList) : null;
    const lead = document.querySelector(".sp-hero--location .sp-hero-lead, .sp-page--location .sp-hero-lead");
    const overflowX = doc.scrollWidth > doc.clientWidth + 8;
    return {
      overflowX,
      faqCentered:
        st &&
        (st.marginLeft === st.marginRight || (parseFloat(st.marginLeft) > 0 && parseFloat(st.marginRight) > 0)),
      faqMaxWidth: st ? parseFloat(st.maxWidth) : 0,
      hasLead: !!lead && (lead.textContent?.length ?? 0) > 80,
    };
  });
  await page.locator(".sp-section-faq summary").first().click({ timeout: 5000 }).catch(() => null);
  const open = await page.locator(".sp-section-faq details[open]").count();
  return { ...layout, faqOpens: open >= 1, mobile };
}

let failed = 0;
const navErr = navOk();
if (navErr) {
  console.error("FAIL nav", navErr);
  failed++;
} else {
  console.log("OK nav geography");
}

const browser = await chromium.launch();
for (const p of PAGES) {
  for (const locale of ["he", "en"]) {
    for (const mobile of [false, true]) {
      const ctx = mobile
        ? await browser.newContext(devices["Pixel 5"])
        : await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      await page.addInitScript(() => sessionStorage.setItem("adwrks_popup_session_suppressed", "1"));
      const path = locale === "he" ? p.he : p.en;
      const r = await checkPage(page, path, mobile);
      const label = `${p.id} ${locale} ${mobile ? "mobile" : "desktop"}`;
      if (r.overflowX || !r.hasLead || !r.faqCentered || r.faqMaxWidth < 200) {
        console.error("FAIL", label, r);
        failed++;
      } else if (!r.faqOpens) {
        console.error("FAIL faq interaction", label);
        failed++;
      } else {
        console.log("OK sample", label);
      }
      await ctx.close();
    }
  }
}
await browser.close();

console.log(failed ? "SAMPLE_FAILED" : "SAMPLE_ALL_PASSED", failed);
process.exit(failed ? 1 : 0);