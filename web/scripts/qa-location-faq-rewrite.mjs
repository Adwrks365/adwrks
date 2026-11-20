/**
 * FAQ arrays touched by section rewrite must keep budget + local questions.
 * npx tsx scripts/qa-location-faq-rewrite.mjs
 */
import { getLocationView } from "../src/lib/pages/locations/registry.ts";

const EXPECT = [
  {
    id: "sharon",
    he: "/סוכנות-שיווק-דיגיטלי-בשרון/",
    en: "/en/digital-marketing-sharon/",
    minFaq: 5,
    heMust: ["נתניה", "האם השירות"],
    enMust: ["Netanya", "service"],
  },
  {
    id: "herzliya",
    he: "/סוכנות-שיווק-דיגיטלי-בהרצליה/",
    en: "/en/digital-marketing-herzliya/",
    minFaq: 5,
    heMust: ["הרצליה", "האם השירות"],
    enMust: ["Herzliya", "provide service"],
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
    minFaq: 4,
    heMust: ["שרון"],
    enMust: ["Sharon"],
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
    const must = locale === "he" ? row.heMust : row.enMust;
    for (const needle of must) {
      if (!blob.toLowerCase().includes(needle.toLowerCase())) {
        console.error("FAIL faq missing", row.id, locale, needle);
        failed++;
      }
    }
    console.log("OK faq", row.id, locale, copy.faq.length);
  }
}

process.exit(failed ? 1 : 0);