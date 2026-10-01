import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seoPath = path.join(__dirname, "..", "src", "data", "content", "seo.json");
const seo = JSON.parse(fs.readFileSync(seoPath, "utf8"));

const GOOGLE_ADS_FAQ = [
  {
    q: "מה זה פרסום ממומן בגוגל (Google Ads)?",
    a: "פרסום ממומן בגוגל מאפשר לעסקים להופיע בראש תוצאות החיפוש באמצעות מודעות בתשלום. התשלום מתבצע לפי קליק, והקמפיינים מנוהלים לפי מילות מפתח, קהלים, מיקומים ונתונים.",
  },
  {
    q: "אילו סוגי קמפיינים אתם מנהלים?",
    a: "אנו מנהלים קמפיינים בחיפוש (Search), ברשת התצוגה (Display), ב-YouTube, Google Shopping, קמפיינים מקומיים ואופטימיזציה שוטפת עם דוחות ROI.",
  },
  {
    q: "למי מתאים פרסום ממומן בגוגל?",
    a: "פרסום ממומן בגוגל מתאים לעסקים שרוצים תוצאות מהירות, שליטה בתקציב והגעה לקהל עם כוונת רכישה גבוהה – עסקים מקומיים, נותני שירותים, חנויות אונליין ועוד.",
  },
  {
    q: "איך מודדים תוצאות ו-ROI בקמפיינים?",
    a: "אנו מחברים את הקמפיינים למדידת המרות, עוקבים אחרי לידים, שיחות ופעולות רלוונטיות, ומספקים דוחות שקופים על ביצועים והתאמות.",
  },
  {
    q: "מה ההבדל בין Google Ads לקידום אורגני?",
    a: "Google Ads מייצר תוצאות מיידיות כל עוד התקציב פעיל, בעוד קידום אורגני (SEO) בונה נוכחות ארוכת טווח בתוצאות החיפוש הטבעיות. לרוב מומלץ לשלב בין השניים.",
  },
  {
    q: "האם צריך דף נחיתה או אתר כדי לפרסם בגוגל?",
    a: "קמפיין Google Ads יעיל צריך יעד המרה ברור – דף נחיתה או אתר שמניע לפעולה. אנו יכולים לחבר בין הקמפיין, האתר והמדידה כחלק מהמעטפת הדיגיטלית.",
  },
];

const SOCIAL_FAQ = [
  {
    q: "מה זה ניהול רשתות חברתיות לעסקים?",
    a: "ניהול רשתות חברתיות לעסקים הוא תהליך קבוע של יצירת תוכן, ניהול עמודים, קמפיינים ממומנים וניתוח נתונים בפלטפורמות כמו פייסבוק ואינסטגרם, במטרה לחזק את המותג ולהניע לפעולה.",
  },
  {
    q: "באילו רשתות חברתיות אתם מתמקדים?",
    a: "אצל Adwrks 365 אנו מתמקדים בעיקר בניהול מקצועי של פייסבוק ואינסטגרם, כולל עמודים עסקיים, סטוריז וקמפיינים ממומנים.",
  },
  {
    q: "מה כולל שירות ניהול רשתות חברתיות אצל Adwrks 365?",
    a: "שירות ניהול רשתות חברתיות אצל Adwrks 365 כולל בניית אסטרטגיית תוכן, כתיבת פוסטים שיווקיים ותדמיתיים, עיצוב גרפיקות וקריאייטיב, ניהול קמפיינים ממומנים, ניתוח נתונים ודוחות ביצועים.",
  },
  {
    q: "האם חייבים לשלב גם פרסום ממומן או שאפשר רק ניהול אורגני?",
    a: "אפשר לנהל את הרשתות גם בצורה אורגנית בלבד, אך ברוב המקרים שילוב של ניהול שוטף עם פרסום ממומן נותן תוצאות מהירות וחזקות יותר.",
  },
  {
    q: "תוך כמה זמן רואים תוצאות מניהול רשתות חברתיות?",
    a: "משך הזמן עד שרואים תוצאות מניהול רשתות חברתיות תלוי במצב הנוכחי של העמודים, בתחום הפעילות ובתקציב. בדרך כלל ניתן לראות שיפור מדורג במעורבות ובפניות.",
  },
  {
    q: "למי מתאים שירות ניהול רשתות חברתיות?",
    a: "שירות ניהול רשתות חברתיות מתאים לעסקים שרוצים להגדיל נוכחות בפייסבוק ובאינסטגרם, לשדר מקצועיות, לחזק את המותג ולקבל יותר פניות מהרשתות.",
  },
];

function faqPage(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

const hubCanonical =
  "https://adwrks.co.il/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/";
const hubIndex = seo.findIndex((e) => e.url === hubCanonical);

const hubRecord = {
  url: hubCanonical,
  title: "שירותי שיווק דיגיטלי לעסקים ⋆ Adwrks 365",
  metaDescription:
    "Adwrks 365 – סוכנות שיווק דיגיטלי מאז 2018. Google Ads, SEO, סושיאל, בניית אתרים ואחסון – מעטפת 360° לעסקים בישראל. ליווי אישי, שקיפות ותוצאות ⭐⭐⭐⭐⭐",
  robots: "follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
  canonical: hubCanonical,
  ogTitle: "שירותי שיווק דיגיטלי לעסקים ⋆ Adwrks 365",
  ogDescription:
    "Adwrks 365 – סוכנות שיווק דיגיטלי מאז 2018. Google Ads, SEO, סושיאל, בניית אתרים ואחסון – מעטפת 360° לעסקים בישראל.",
  ogImage: "https://adwrks.co.il/wp-content/uploads/digital-marketing-agency.webp",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "@id": `${hubCanonical}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: "1", item: { "@id": "https://adwrks.co.il", name: "Home" } },
            {
              "@type": "ListItem",
              position: "2",
              item: { "@id": hubCanonical, name: "שירותי שיווק דיגיטלי" },
            },
          ],
        },
      ],
    },
  ],
};

if (hubIndex >= 0) seo[hubIndex] = { ...seo[hubIndex], ...hubRecord };
else seo.push(hubRecord);

const gads = seo.find((e) => e.url === "https://adwrks.co.il/google-ads/");
if (gads) {
  gads.jsonLd = (gads.jsonLd ?? []).filter((j) => j["@type"] !== "FAQPage");
  gads.jsonLd.push(faqPage(GOOGLE_ADS_FAQ));
}

const social = seo.find((e) => e.url === "https://adwrks.co.il/social-media-management/");
if (social) {
  social.jsonLd = (social.jsonLd ?? []).filter((j) => j["@type"] !== "FAQPage");
  social.jsonLd.push(faqPage(SOCIAL_FAQ));
}

fs.writeFileSync(seoPath, JSON.stringify(seo));
console.log(JSON.stringify({ hub: hubIndex >= 0 ? "updated" : "added", googleFaq: GOOGLE_ADS_FAQ.length, socialFaq: SOCIAL_FAQ.length }, null, 2));
