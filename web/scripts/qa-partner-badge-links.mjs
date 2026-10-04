/**
 * Verify PartnerBadges link behavior on production/local.
 */
const BASE = process.env.QA_BASE_URL || "https://adwrks.co.il";
const GOOGLE_URL = "https://www.google.com/partners/agency?id=5451982519";

const PAGES = [
  { name: "About", path: "/about-us/", selector: ".ab-trust-badges.partner-badges, .ab-trust-strip .partner-badges" },
  { name: "Contact", path: "/contact-us/", selector: ".cp-trust-strip .partner-badges" },
  {
    name: "Pricing",
    path: "/%d7%9e%d7%97%d7%99%d7%a8%d7%95%d7%9f-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/",
    selector: ".pp-trust-strip .partner-badges",
  },
  { name: "Footer", path: "/", selector: "footer .site-footer-partners.partner-badges, footer .partner-badges" },
];

async function auditStrip(html, stripSelector) {
  // Simplified: fetch and regex within partner-badges blocks is fragile; use playwright if available
  return null;
}

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const results = {};

  for (const pageDef of PAGES) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.goto(`${BASE}${pageDef.path}`, { waitUntil: "networkidle" });
    const data = await page.evaluate(
      ({ sel, googleUrl }) => {
        const strip = document.querySelector(sel);
        if (!strip) return { found: false };

        const anchors = [...strip.querySelectorAll("a")];
        const googleAnchor = anchors.find((a) => a.href.includes("google.com/partners"));
        const metaAnchor = anchors.find(
          (a) =>
            a.href.includes("facebook.com") ||
            a.href.includes("meta.com") ||
            a.classList.contains("partner-badge-link--meta"),
        );
        const sharedWrapsBoth =
          anchors.length === 1 &&
          strip.querySelectorAll("img").length >= 2 &&
          anchors[0].querySelectorAll("img").length >= 2;

        const metaItem = strip.querySelector(".partner-badge-item--meta");
        const metaFocusable =
          metaItem &&
          [...metaItem.querySelectorAll("*")].some((el) => {
            const tag = el.tagName;
            if (tag === "A" || tag === "BUTTON") return true;
            if (el.hasAttribute("tabindex") && el.getAttribute("tabindex") !== "-1") return true;
            return false;
          });

        return {
          found: true,
          googleHref: googleAnchor?.href ?? null,
          googleLinked: !!googleAnchor,
          metaLinked: !!metaAnchor,
          sharedAnchor: sharedWrapsBoth,
          metaFocusable: !!metaFocusable,
          anchorCount: anchors.length,
          googleHasLinkClass: !!strip.querySelector(".partner-badge-link--google"),
        };
      },
      { sel: pageDef.selector, googleUrl: GOOGLE_URL },
    );

    const pass =
      data.found &&
      data.googleLinked &&
      data.googleHref === GOOGLE_URL &&
      !data.metaLinked &&
      !data.sharedAnchor &&
      !data.metaFocusable &&
      data.anchorCount === 1;

    results[pageDef.name] = { pass: pass ? "PASS" : "FAIL", ...data };
    await page.close();
  }

  await browser.close();

  const anyMetaLinked = Object.values(results).some((r) => r.metaLinked);
  const anyShared = Object.values(results).some((r) => r.sharedAnchor);
  const report = {
    base: BASE,
    googlePartnerDestination: GOOGLE_URL,
    pages: results,
    metaLinked: anyMetaLinked ? "YES" : "NO",
    sharedAnchorExists: anyShared ? "YES" : "NO",
    externalLinkIssue:
      anyMetaLinked || anyShared
        ? "Meta badge linked or shared anchor detected"
        : Object.values(results).some((r) => r.pass === "FAIL")
          ? "Google link missing or incorrect on one or more pages"
          : "None",
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
