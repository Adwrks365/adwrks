import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/lib/pages/locations/copy-en-extra.ts");

const ids = [
  "sharon",
  "south",
  "ramat-gan",
  "petah-tikva",
  "rishon-lezion",
  "holon",
  "bat-yam",
  "akko",
  "hadera",
  "afula",
  "herzliya",
  "kfar-saba",
  "raanana",
  "ashdod",
  "ashkelon",
];

const names = {
  sharon: "Sharon region",
  south: "Southern Israel",
  "ramat-gan": "Ramat Gan",
  "petah-tikva": "Petah Tikva",
  "rishon-lezion": "Rishon LeZion",
  holon: "Holon",
  "bat-yam": "Bat Yam",
  akko: "Akko",
  hadera: "Hadera",
  afula: "Afula",
  herzliya: "Herzliya",
  "kfar-saba": "Kfar Saba",
  raanana: "Ra'anana",
  ashdod: "Ashdod",
  ashkelon: "Ashkelon",
};

function block(id) {
  const n = names[id];
  const key = id.includes("-") ? `'${id}'` : id;
  return `  ${key}: enCity("${n}"),`;
}

const header = `import type { LocationCopy } from "./types";
import { FAQ_BUDGET_ROI_EN, SHARED_SERVICE_BLOCKS_EN, SHARED_WORK_EN } from "./copy-shared-en";

function enCity(name: string): LocationCopy {
  return {
    ...SHARED_WORK_EN,
    serviceBlocks: SHARED_SERVICE_BLOCKS_EN,
    name,
    cardText: \`Digital marketing in \${name}: Google Ads, Meta, SEO, and landing pages with measurable ROI.\`,
    badge: name,
    h1: \`Digital marketing in \${name} — leads, sales, and growth\`,
    lead: \`Businesses in \${name} compete with national brands online. We build Google Ads, Meta, SEO, and landing pages that turn budget into qualified leads — with fully remote guidance across Israel.\`,
    seoTitle: \`Digital marketing in \${name} | Adwrks 365\`,
    seoDescription: \`Digital marketing for \${name}: PPC, SEO, social ads, strategy, and ROI reporting.\`,
    challengesLabel: "Local challenges",
    challengesTitle: "Competition online — how the right strategy wins",
    challengesIntro: \`In \${name}, buyers compare multiple providers before they call. Generic campaigns waste budget. You need sharp messaging, strong landing pages, and ongoing optimization.\`,
    challengesPoints: [
      "National competitors on the same keywords",
      "Weak conversion tracking",
      "Mobile pages that do not convert",
      "SEO and PPC not coordinated",
    ],
    audienceLabel: "Who it is for",
    audienceTitle: "Businesses that want measurable results",
    audienceItems: [
      "Local service providers",
      "B2B and tech companies",
      "Teams that need transparency",
      "Owners who want strategy and execution",
    ],
    servicesLabel: "Services",
    servicesTitle: "Full digital marketing stack",
    servicesIntro: "We combine Ads, SEO, Meta, and conversion-focused pages based on your goals.",
    faqTitle: \`FAQ — digital marketing in \${name}\`,
    faq: [
      ...FAQ_BUDGET_ROI_EN,
      {
        q: "How fast can Google Ads deliver leads?",
        a: "Often within days when the offer and landing page are clear. SEO takes longer — we set expectations per channel.",
      },
    ],
    contactTitle: \`Consultation — digital marketing in \${name}\`,
    contactIntro: "Tell us about your business and goals.",
    nearbyTitle: "Nearby areas",
    nearbyIntro: "See related city and region pages, or contact us for a general plan.",
    midCtaEyebrow: name,
    midCtaTitle: "Ready to grow qualified leads?",
    midCtaBody: "We will review budget, tracking, and ROI.",
    finalCtaEyebrow: "Consultation",
    finalCtaTitle: "Build a marketing plan that pays back",
    finalCtaBody: "Leave your details — no obligation.",
    popupHeadline: \`Digital marketing in \${name}?\`,
    popupDescription: "Tell us about your business.",
    popupCta: "Let's talk",
    imageAlt: \`Digital marketing in \${name}\`,
    areaServedName: name,
  };
}

export const EXTRA_LOCATION_EN: Record<string, LocationCopy> = {
`;

fs.writeFileSync(out, `${header}${ids.map(block).join("\n")}\n};\n`);
console.log("Wrote", out);
