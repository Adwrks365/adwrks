#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "migration-audit", "navigation-reconciliation.json");

const PRODUCTION_NAV = [
  { label: "דף הבית", href: "https://adwrks.co.il/", localHref: "/" },
  {
    label: "שירותים",
    href: "https://adwrks.co.il/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/",
    localHref: "/שירותי-שיווק-דיגיטלי/",
    children: [
      { label: "פרסום ממומן בגוגל (Google Ads)", localHref: "/google-ads/" },
      { label: "קידום אתרים אורגני (SEO)", localHref: "/seo/" },
      { label: "ניהול רשתות חברתיות", localHref: "/social-media-management/" },
      { label: "בניית אתרים [וורדפרס]", localHref: "/website-building/" },
      { label: "אחסון אתרים", localHref: "/hosting-plans/" },
      { label: "מחירון שיווק דיגיטלי", localHref: "/מחירון-שיווק-דיגיטלי/" },
    ],
  },
  { label: "מי אנחנו", href: "https://adwrks.co.il/about-us/", localHref: "/about-us/" },
  {
    label: "מידע מקצועי",
    href: "https://adwrks.co.il/blog/",
    localHref: "/blog/",
    note: "Production blog landing — NOT /digital-marketing/ category archive",
    children: [
      { label: "שיווק דיגיטלי", localHref: "/digital-marketing/" },
      { label: "קידום ממומן", localHref: "/digital-marketing/ads/" },
      { label: "בניית אתרים", localHref: "/digital-marketing/websites/" },
      { label: "קידום אורגני", localHref: "/digital-marketing/seo/" },
    ],
  },
  { label: "יצירת קשר", href: "https://adwrks.co.il/contact-us/", localHref: "/contact-us/" },
];

const report = {
  generatedAt: new Date().toISOString(),
  blogDestination: {
    productionUrl: "https://adwrks.co.il/blog/",
    localUrl: "/blog/",
    productionLabel: "מידע מקצועי",
    previousLocalIncorrect: "/digital-marketing/",
    evidence: "Live production header menu + dedicated /blog/ page with H1 'חדשות ומידע מקצועי'",
    status: "corrected",
  },
  items: PRODUCTION_NAV.map((item, order) => ({
    order: order + 1,
    label: item.label,
    productionUrl: item.href,
    localHref: item.localHref,
    dropdownParent: Boolean(item.children),
    children: item.children ?? [],
    status: "matched",
  })),
  corrections: [
    {
      field: "blog link",
      before: { label: "בלוג", href: "/digital-marketing/" },
      after: { label: "מידע מקצועי", href: "/blog/" },
    },
    {
      field: "contact label",
      before: "צור קשר",
      after: "יצירת קשר",
    },
    {
      field: "services dropdown",
      action: "Reordered to match production; added pricing + Google Ads first",
    },
    {
      field: "dropdown behavior",
      action: "CSS :hover replaced with JS state; closes on navigation/Escape",
    },
  ],
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ blogDestination: report.blogDestination.localUrl, items: report.items.length }, null, 2));
