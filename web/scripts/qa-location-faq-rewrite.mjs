/**
 * FAQ arrays touched by section rewrite — counts, required topics, banned legacy wording.
 * npx tsx scripts/qa-location-faq-rewrite.mjs
 */
import { getLocationView } from "../src/lib/pages/locations/registry.ts";

const BANNED_HE = [
  /האם השירות מתבצע מ/,
  /שייכת למרכז/,
  /האם נתניה «מרכז»/,
];

const BANNED_EN = [/Center or the Sharon/i, /provide service from/i, /work from this city/i];

const EXPECT = [
  {
    id: "sharon",
    he: "/סוכנות-שיווק-דיגיטלי-בשרון/",
    en: "/en/digital-marketing-sharon/",
    minFaq: 5,
    heMust: ["נתניה", "מספקים שירותי שיווק דיגיטלי"],
    enMust: ["Netanya", "digital marketing services"],
  },
  {
    id: "herzliya",
    he: "/סוכנות-שיווק-דיגיטלי-בהרצליה/",
    en: "/en/digital-marketing-herzliya/",
    minFaq: 5,
    heMust: ["הרצליה", "מספקים שירותי שיווק דיגיטלי"],
    enMust: ["Herzliya", "digital marketing services"],
  },
  {
    id: "tel-aviv",
    he: "/סוכנות-שיווק-דיגיטלי-בתל-אביב/",
    en: "/en/digital-marketing-tel-aviv/",
    minFaq: 4,
    heMust: ["סטארטאפ"],
    enMust: ["Tel Aviv"],
  },
  {
    id: "netanya",
    he: "/סוכנות-שיווק-דיגיטלי-בנתניה/",
    en: "/en/digital-marketing-netanya/",
    minFaq: 5,
    heMust: ["לפרסם גם בנתניה", "מספקים שירותי שיווק"],
    enMust: ["Netanya and other Sharon", "digital marketing services"],
  },
];

let failed = 0;

for (const row of EXPECT) {
  for (const locale of ["he", "en"]) {
    const path = locale === "he" ? row.he : row.en;
    const copy = getLocationView(path, locale).copy;
    if (copy.faq.length < row.minFaq) {
      console.error("FAIL faq count", row.id, locale, copy.faq.length, "<", row.minFaq);
      failed++;
    }
    const blob = copy.faq.map((f) => `${f.q} ${f.a}`).join(" ");
    const banned = locale === "he" ? BANNED_HE : BANNED_EN;
    for (const re of banned) {
      if (re.test(blob)) {
        console.error("FAIL banned faq", row.id, locale, String(re));
        failed++;
      }
    }
    const must = locale === "he" ? row.heMust : row.enMust;
    for (const needle of must) {
      if (!blob.includes(needle) && !blob.toLowerCase().includes(needle.toLowerCase())) {
        console.error("FAIL faq missing", row.id, locale, needle);
        failed++;
      }
    }
    console.log("OK faq", row.id, locale, copy.faq.length);
  }
}

process.exit(failed ? 1 : 0);