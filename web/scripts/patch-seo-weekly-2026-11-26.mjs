/**
 * Weekly SEO sprint 2026-11-26 — Hebrew meta patches (title + meta + OG parity).
 * Run: node web/scripts/patch-seo-weekly-2026-11-26.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const seoPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "content", "seo.json");
const seo = JSON.parse(fs.readFileSync(seoPath, "utf8"));

function findByPath(pathname) {
  return seo.find((rec) => {
    try {
      return decodeURIComponent(new URL(rec.url).pathname) === pathname;
    } catch {
      return false;
    }
  });
}

function apply(pathname, patch) {
  const rec = findByPath(pathname);
  if (!rec) throw new Error(`seo.json missing ${pathname}`);
  if (patch.title) {
    rec.title = patch.title;
    rec.ogTitle = patch.title;
  }
  if (patch.metaDescription) {
    rec.metaDescription = patch.metaDescription;
    rec.ogDescription = patch.metaDescription;
  }
  return rec;
}

const UPDATES = [
  {
    path: "/",
    title: "סוכנות שיווק דיגיטלי ⋆ Adwrks 365",
    metaDescription:
      "Adwrks 365 — סוכנות שיווק דיגיטלי לעסקים מאז 2018. שיווק דיגיטלי 360°: Google Ads, SEO, סושיאל ובניית אתרים. Google Partner · ליווי אישי ושקיפות.",
  },
  {
    path: "/שירותי-שיווק-דיגיטלי/",
    title: "שירותי שיווק דיגיטלי לעסקים ⋆ Adwrks 365",
    metaDescription:
      "מפת שירותי שיווק דיגיטלי ופרסום באינטרנט: Google Ads, SEO אורגני, Meta, בניית אתרים ואחסון. Adwrks 365 מאז 2018 — בחרו שירות או מעטפת 360°.",
  },
  {
    path: "/seo/",
    title: "חברת קידום אתרים | שירותי SEO אורגני ⋆ Adwrks 365",
    metaDescription:
      "חברת קידום אתרים ושירותי SEO אורגני בגוגל — מחקר, טכני, תוכן ומדידה. Adwrks 365 מאז 2018 · Google Partner · מקרי בוחן בעמוד. בלי הבטחות דירוג.",
  },
  {
    path: "/google-ads/",
    title: "פרסום בגוגל לעסקים | ניהול קמפיינים ⋆ Adwrks 365",
    metaDescription:
      "פרסום בגוגל לעסקים וניהול קמפיינים בגוגל (Google Ads) — Search, YouTube, PMax ו-Shopping לפי הצעה. Adwrks 365 פועלת מאז 2018 · Google Partner מאומת · שקיפות ומדידת המרות.",
  },
  {
    path: "/מחיר-קידום-אתרים/",
    title: "כמה עולה לקדם אתר? מחיר קידום אתרים [מחירון + מחשבון]",
    metaDescription:
      "גלו מה משפיע על מחיר קידום אתרים: רמת התחרות, מצב האתר והיקף העבודה. מחשבון ומידע מקצועי שיעזרו להבין את העלויות ולבחור שירות SEO מתאים.",
  },
  {
    path: "/בדיקת-מהירות-אתר/",
    title: "בדיקת מהירות אתר | בדקו את האתר שלכם חינם",
    metaDescription:
      "בדיקת מהירות אתר בחינם באמצעות PageSpeed Insights. בדקו ביצועים בנייד ובמחשב, הכירו את מדדי Core Web Vitals וקבלו הסברים לשיפור מהירות האתר.",
  },
];

const log = [];
for (const u of UPDATES) {
  const before = findByPath(u.path);
  log.push({ path: u.path, beforeTitle: before.title, beforeMeta: before.metaDescription });
  apply(u.path, u);
  log.push({
    path: u.path,
    afterTitle: before.title,
    afterMeta: before.metaDescription,
  });
}

fs.writeFileSync(seoPath, JSON.stringify(seo));
console.log(JSON.stringify(log, null, 2));
console.log(`Updated ${UPDATES.length} SEO records in ${seoPath}`);