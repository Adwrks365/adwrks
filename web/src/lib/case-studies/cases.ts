import { HOMEPAGE_RESULT_QUOTES as HE_QUOTES } from "@/lib/homepage/data";
import { HOMEPAGE_RESULT_QUOTES as EN_QUOTES } from "@/lib/homepage/data.en";
import type { CaseStudyRecord } from "./types";

const talHe = HE_QUOTES.find((q) => q.name === "טל שינה")!.content;
const talEn = EN_QUOTES.find((q) => q.name === "Tal Shina")!.content;

/** Verified case studies — metrics from owner-supplied rank reports & ad screenshots (2026-10-31). */
export const CASE_STUDIES: readonly CaseStudyRecord[] = [
  {
    id: "cs-seo-menofeyhasdai",
    categories: ["seo"],
    status: "published",
    title: {
      he: "קידום אורגני — מנופי הרמה במרכז",
      en: "Organic SEO — crane services in central Israel",
    },
    clientLabel: { he: "חסדאי מנופי הרמה", en: "Menofey Hasdai Cranes" },
    clientSiteUrl: "https://menofeyhasdai.co.il/",
    industry: {
      he: "מנופי הרמה ושירותי הרמה באזור המרכז",
      en: "Crane and lifting services in central Israel",
    },
    services: {
      he: "קידום אתרים אורגני (SEO) — מעקב מיקומים, אופטימיזציה ותוכן לפי צורך הפרויקט",
      en: "Organic SEO — rank tracking, on-page optimization, and content as needed",
    },
    measurementPeriod: {
      he: "08.05.2025–31.10.2026 (דוח מעקב דירוגים)",
      en: "May 8, 2025–Oct 31, 2026 (rank tracking report)",
    },
    dataSource: {
      he: "דוח מעקב דירוגים (Ubersuggest rank tracking) — menofeyhasdai.co.il",
      en: "Rank tracking report (Ubersuggest) — menofeyhasdai.co.il",
    },
    challenge: {
      he: "תחרות גבוהה בחיפושים מקומיים ומסחריים סביב מנופי הרמה — צורך בנראות אורגנית באזורי שירות שונים.",
      en: "High competition on local and commercial crane-related searches — need organic visibility across service areas.",
    },
    approach: {
      he: "ליווי SEO שוטף עם מעקב קבוצת ביטויי מפתח, התאמות לאתר ושיפור נראות מקומית — בהתאם למצב האתר והתחרות. (פירוט טכני נשמר פרטי לפרויקט.)",
      en: "Ongoing SEO with tracked keyword sets, site adjustments, and local visibility work — scoped to the site and competition. (Technical detail remains project-specific.)",
    },
    outcome: {
      he: "בדוח המעקב נרשם שיפור במיקום הממוצע של קבוצת הביטויים מ-52 ל-23.52, לצד ביטויים בדירוגים גבוהים באזורי שירות מרכזיים. לאורך התקופה נרשמו גם ביטויים בירידה (3 בדוח). בתקופה האחרונה, בסמוך למעבר האתר לפלטפורמה אחרת, נצפתה תנודתיות בחלק מהביטויים — אין לייחס את כל השינוי למעבר בלי אבחון נוסף. הנתונים משקפים את כלי המעקב — לא את כל החיפושים בגוגל.",
      en: "The tracking report shows average position for the monitored set improving from 52 to 23.52, with strong positions on selected central-service queries. Three tracked queries declined in the report summary. Recently, around a platform migration, some queries showed volatility — not all changes can be attributed to migration without further diagnosis. Figures reflect the tracking tool — not all Google searches.",
    },
    highlightMetrics: [
      {
        label: { he: "ביטויים במעקב", en: "Keywords tracked" },
        value: { he: "86", en: "86" },
      },
      {
        label: { he: "מיקום ממוצע (דוח)", en: "Avg. position (report)" },
        value: { he: "52 → 23.52", en: "52 → 23.52" },
      },
      {
        label: { he: "סיכום תנועה בדוח", en: "Report movement summary" },
        value: { he: "31 בעלייה · 3 בירידה · 52 ללא שינוי", en: "31 up · 3 down · 52 unchanged" },
      },
    ],
    keywordRanks: [
      { phrase: "מנוף סולם במרכז", rank: 2 },
      { phrase: "מנופי הרמה בתל אביב", rank: 3 },
      { phrase: "מנוף הרמה בתל אביב", rank: 6 },
      { phrase: "מנוף הרמה מחיר", rank: 8 },
    ],
    limitations: {
      he: "דירוגים לפי כלי מעקב — לא התחייבות למיקום בגוגל. אין בדוח בלבד הוכחה לגידול בכניסות, לידים או הכנסות. ביטויים שלא מופיעים ברשימה אינם מוצגים כמדורגים.",
      en: "Rankings are from a tracking tool — not a guarantee of Google positions. The report alone does not prove traffic, lead, or revenue growth. Queries not listed are not shown as ranked.",
    },
    serviceHref: { he: "/seo/", en: "/en/seo/" },
    portfolioImage: "/images/portfolio/menofeyhasdai.webp",
    portfolioImageAlt: {
      he: "צילום מסך מאתר הלקוח — עיצוב Adwrks 365",
      en: "Client site screenshot — Adwrks 365 design",
    },
  },
  {
    id: "cs-seo-express-hovalot",
    categories: ["seo"],
    status: "published",
    title: {
      he: "קידום אורגני — הובלות ואחסון בירושלים",
      en: "Organic SEO — moving & storage in Jerusalem",
    },
    clientLabel: { he: "אקספרס הובלות", en: "Express Hovalot" },
    clientSiteUrl: "https://express-hovalot.co.il/",
    industry: {
      he: "הובלות, אריזה ואחסון — ירושלים והסביבה",
      en: "Moving, packing, and storage — Jerusalem area",
    },
    services: {
      he: "קידום אתרים אורגני (SEO) עם מעקב ביטויים מקומיים",
      en: "Organic SEO with local keyword tracking",
    },
    measurementPeriod: {
      he: "08.05.2025–31.10.2026 (דוח מעקב דירוגים)",
      en: "May 8, 2025–Oct 31, 2026 (rank tracking report)",
    },
    dataSource: {
      he: "דוח מעקב דירוגים (Ubersuggest rank tracking) — express-hovalot.co.il",
      en: "Rank tracking report (Ubersuggest) — express-hovalot.co.il",
    },
    challenge: {
      he: "שוק תחרותי של הובלות ואחסון — צורך בנוכחות אורגנית לפניות מקומיות.",
      en: "Competitive moving and storage market — need organic visibility for local inquiries.",
    },
    approach: {
      he: "SEO שוטף, מעקב ביטויים ואופטימיזציה לפי צורך — ללא ייחוס שינוי בודד לפעולה ספציפית ללא ראיה.",
      en: "Ongoing SEO, keyword tracking, and optimization as needed — without attributing shifts to a single action without evidence.",
    },
    outcome: {
      he: "לאורך תקופת המעקב נרשמה מגמת שיפור משמעותית במיקומי קבוצת ביטויי המפתח שנמדדה (מיקום ממוצע בדוח מ-33.11 ל-19.50), לצד תנודתיות בתקופה האחרונה לאחר מעבר האתר לפלטפורמה אחרת. חלק מהביטויים ירדו בדוח — במיוחד בשבועות האחרונים — ואין לייחס את כל הירידות למעבר בלי בדיקה נוספת.",
      en: "Over the tracking period, the monitored keyword set showed meaningful average-position improvement (report avg. 33.11 → 19.50), alongside volatility after a recent platform migration. Some queries declined in the report — especially in recent weeks — and not all drops can be attributed to migration without further review.",
    },
    highlightMetrics: [
      {
        label: { he: "ביטויים במעקב", en: "Keywords tracked" },
        value: { he: "59", en: "59" },
      },
      {
        label: { he: "מיקום ממוצע (דוח)", en: "Avg. position (report)" },
        value: { he: "33.11 → 19.50", en: "33.11 → 19.50" },
      },
    ],
    keywordRanks: [
      { phrase: "הובלות קטנות בירושלים", rank: 4 },
      { phrase: "הובלת משרדים בירושלים", rank: 5 },
      { phrase: "שירותי אחסון בירושלים", rank: 6 },
      { phrase: "הובלות בבית שמש", rank: 8 },
    ],
    limitations: {
      he: "מגמת השיפור מתייחסת לקבוצת ביטויים במעקב, לא לכל החיפושים. אין הסקה מדוח הדירוגים בלבד על לידים או הכנסות. תאריך מדויק לנקודת השוואה לפני המעבר — לעדכון כאשר יוצגו נתוני GSC/דוח מלא.",
      en: "Improvement trends refer to the tracked keyword set, not all search demand. Rank data alone does not prove leads or revenue. A precise pre-migration comparison date will be added when full GSC/report data is available.",
    },
    serviceHref: { he: "/seo/", en: "/en/seo/" },
  },
  {
    id: "cs-wb-tal-shina-gads",
    categories: ["website-building", "google-ads"],
    status: "published",
    title: {
      he: "אתר, Google Ads וליווי — לקוח ותיק",
      en: "Website, Google Ads & ongoing support — long-term client",
    },
    clientLabel: { he: "טל שינה", en: "Tal Shina" },
    industry: {
      he: "עסק שירותים (לקוח ותיק של Adwrks 365)",
      en: "Service business (long-term Adwrks 365 client)",
    },
    services: {
      he: "בניית אתר · ניהול Google Ads · ליווי ושירות לאורך זמן",
      en: "Website build · Google Ads management · Ongoing support",
    },
    measurementPeriod: {
      he: "עדות לקוח — ללא תאריך מדויק בביקורת; נתוני Ads — אוקטובר 2026 (יש לאמת טווח מדויק בממשק)",
      en: "Client testimony — undated on site; Ads data — October 2026 (confirm exact range in account)",
    },
    dataSource: {
      he: "ביקורת לקוח מפורסמת בדף הבית · צילום Google Ads (אוקטובר 2026)",
      en: "Published homepage testimonial · Google Ads screenshot (October 2026)",
    },
    challenge: {
      he: "הגדלת פניות לעסק תוך שמירה על יחס אישי, שקיפות ותמחור הוגן.",
      en: "Growing business inquiries while keeping personal support, transparency, and fair pricing.",
    },
    approach: {
      he: "בניית נכס דיגיטלי, ניהול פרסום ממומן בגוגל וליווי שוטף — שיתוף פעולה ארוך טווח.",
      en: "Digital asset build, Google Ads management, and ongoing partnership over time.",
    },
    outcome: {
      he: "שילוב בין אתר, קמפיין ממומן וליווי — עם עדות הלקוח על עלייה בכמות הפניות (ראו להלן, נפרד מנתוני המדיה).",
      en: "Combined website, paid search, and support — with separate client testimony on inquiry volume (below, distinct from media metrics).",
    },
    highlightMetrics: [],
    limitations: {
      he: "עליית 350% — לפי דברי הלקוח בביקורת, לא לפי דוח Google Ads. נתוני הקליקים/חשיפות מתייחסים לתקופה המצולמת בלבד ואינם מייצגים בהכרח את כל תקופת ההתקשרות. אין כאן דוח המרות שמוכיח 350% במערכת הפרסום.",
      en: "The ~350% increase is from the client testimonial, not Google Ads reporting. Click/impression figures cover the screenshot period only and may not represent the full engagement. No conversion report here proves 350% in ads.",
    },
    serviceHref: { he: "/website-building/", en: "/en/website-building/" },
    testimony: {
      quote: { he: talHe, en: talEn },
      attribution: { he: "טל שינה — ביקורת לקוח באתר Adwrks 365", en: "Tal Shina — client review on Adwrks 365" },
      sourceLabel: { he: "עדות לקוח (דף הבית)", en: "Client testimony (homepage)" },
    },
    adsSnapshot: {
      title: { he: "תמונת מצב Google Ads — אוקטובר 2026", en: "Google Ads snapshot — October 2026" },
      period: { he: "אוקטובר 2026 (לאמת תאריכים בחשבון)", en: "October 2026 (confirm dates in account)" },
      sourceLabel: { he: "נתוני מערכת Google Ads (צילום מסך)", en: "Google Ads manager (screenshot)" },
      metrics: [
        { label: { he: "קליקים", en: "Clicks" }, value: { he: "450", en: "450" } },
        { label: { he: "חשיפות", en: "Impressions" }, value: { he: "4.65K", en: "4.65K" } },
        { label: { he: "עלות ממוצעת לקליק", en: "Avg. CPC" }, value: { he: "₪3.32", en: "₪3.32" } },
        { label: { he: "הוצאה", en: "Spend" }, value: { he: "כ-₪1.49K", en: "~₪1.49K" } },
      ],
      disclaimer: {
        he: "נתונים אלו אינם מוכיחים את עדות 350% הפניות ואינם מהווים דוח המרות.",
        en: "These figures do not prove the ~350% inquiry testimony and are not a conversion report.",
      },
    },
  },
  {
    id: "cs-meta-leads-oct2026",
    categories: ["meta-ads"],
    status: "published",
    title: {
      he: "Meta Ads — תוצאות מדווחות (אוקטובר 2026)",
      en: "Meta Ads — reported results (October 2026)",
    },
    clientLabel: {
      he: "לקוח בתחום השירותים (שם לא מפורסם)",
      en: "Service-sector client (name not published)",
    },
    industry: { he: "שירותים — פרטים מזהים לא פורסמו", en: "Services — identifying details not published" },
    services: {
      he: "ניהול קמפיינים ממומנים ב-Meta (Facebook / Instagram)",
      en: "Paid Meta (Facebook / Instagram) campaign management",
    },
    measurementPeriod: { he: "01.10.2026–30.10.2026", en: "Oct 1–30, 2026" },
    dataSource: {
      he: "צילום Meta Ads Manager — שני סטים של מודעות",
      en: "Meta Ads Manager screenshot — two ad sets",
    },
    challenge: {
      he: "השגת תוצאות מדווחות במערכת Meta בעלות מדידה — תוך בקרת תקציב.",
      en: "Achieving reported results in Meta Ads at measurable cost — within budget control.",
    },
    approach: {
      he: "ניהול שני סטים של מודעות עם אופטימיזציה ל«תוצאות» (Results) בממשק Meta — סוג האירוע (למשל טופס/ליד) טרם אומת לפרסום.",
      en: "Two ad sets managed with Meta “Results” optimization — the underlying conversion event (e.g. form/lead) is not yet verified for publication.",
    },
    outcome: {
      he: "13 תוצאות מדווחות בשתי סדרות מודעות במהלך תקופת המדידה — לפי הממשק בלבד, לא כ«13 לידים מאומתים», לא כלקוחות חדשים ולא כעסקאות.",
      en: "13 reported results across two ad sets during the period — per the interface only, not verified as 13 leads, new customers, or closed deals.",
    },
    highlightMetrics: [
      {
        label: { he: "סה״כ תוצאות מדווחות (שני סטים)", en: "Total reported results (both sets)" },
        value: { he: "13", en: "13" },
      },
    ],
    metaAdSets: [
      {
        label: { he: "סט מודעות 1", en: "Ad set 1" },
        metrics: [
          { label: { he: "תוצאות מדווחות", en: "Reported results" }, value: { he: "7", en: "7" } },
          { label: { he: "עלות לתוצאה מדווחת", en: "Cost per reported result" }, value: { he: "₪14.40", en: "₪14.40" } },
          { label: { he: "הוצאה", en: "Spend" }, value: { he: "₪100.80", en: "₪100.80" } },
          { label: { he: "חשיפות", en: "Impressions" }, value: { he: "1,940", en: "1,940" } },
          { label: { he: "תפוצה", en: "Reach" }, value: { he: "1,410", en: "1,410" } },
        ],
      },
      {
        label: { he: "סט מודעות 2", en: "Ad set 2" },
        metrics: [
          { label: { he: "תוצאות מדווחות", en: "Reported results" }, value: { he: "6", en: "6" } },
          { label: { he: "עלות לתוצאה מדווחת", en: "Cost per reported result" }, value: { he: "₪34.31", en: "₪34.31" } },
          { label: { he: "הוצאה", en: "Spend" }, value: { he: "₪205.83", en: "₪205.83" } },
          { label: { he: "חשיפות", en: "Impressions" }, value: { he: "1,895", en: "1,895" } },
          { label: { he: "תפוצה", en: "Reach" }, value: { he: "1,133", en: "1,133" } },
        ],
      },
    ],
    limitations: {
      he: "«תוצאות מדווחות» = המדד Results בממשק Meta; לא אומת שמדובר בלידים/טפסים עד בדיקה בחשבון. אין חישוב ממוצע משוקלל של עלות לתוצאה בין הסטים. אין חשיפת פרטי חשבון, לקוח או לידים. פרסום הנתונים מותנה באישור לקוח.",
      en: "“Reported results” means Meta’s Results column; lead/form meaning is unverified until checked in Ads Manager. No blended average cost across sets. No account, client, or lead PII. Publishing depends on client authorization.",
    },
    serviceHref: { he: "/social-media-management/", en: "/en/social-media-management/" },
  },
] as const;
