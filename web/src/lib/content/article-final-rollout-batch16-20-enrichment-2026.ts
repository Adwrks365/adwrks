import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  buildArticleFaqBlock,
  buildArticleLeadBlock,
  upsertArticleFaq,
  upsertArticleLead,
  upsertArticleLeadAfterPagespeedTool,
} from "@/lib/content/article-content-blocks";

/**
 * Final rollout batches 16–20 (queue ids ~20529–22841).
 *
 * Special handling:
 * - Speed pages (21496 HE/EN, 22310 HE): lead + minimal FAQ; PageSpeed embed is not touched.
 * - ROI calculator (22727 HE/EN): short lead + 3 FAQ max; calculator embed is not touched.
 * - Pricing pages (21189 HE/EN): focused lead + FAQ; calculators/polish unchanged.
 * - Pages that already ship a visible FAQ (19792 EN, 21068 EN, 21860 HE, 22840/22841 HE): lead only.
 */
type BatchConfig = {
  /** Elementor post marker (or any string present in the post body) used to place the FAQ. */
  postMarker?: string;
  lead: (locale: Locale) => string;
  /** Omit for lead-only entries (existing FAQ or partial migration). */
  faq?: (locale: Locale) => string;
};

const FINAL_ROLLOUT_BATCH16_20: Record<string, BatchConfig> = {
  /* ───────────────────────── Batch 16 — EN paid search / agency ───────────────────────── */
  "/en/sem-vs-ppc/": {
    postMarker: "elementor-20529",
    lead: () =>
      buildArticleLeadBlock("en", [
        "SEM (search engine marketing) is the umbrella; PPC (pay-per-click) is the paid part of it. SEO is the organic part that many definitions also include.",
        "This article explains how the two terms differ, when each one fits, and how they work together — see also <a href=\"/en/google-ads/\">Google Ads</a> and <a href=\"/en/seo/\">SEO</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Is PPC part of SEM?",
          answer:
            "Yes. SEM covers every way of gaining visibility in search results; PPC is the paid branch, and SEO is the organic branch.",
        },
        {
          question: "Which should a small business start with?",
          answer:
            "If you need leads soon, a focused PPC campaign gives quick feedback. If you can wait, SEO builds lasting visibility. Many businesses run both once tracking is in place.",
        },
        {
          question: "Does PPC replace SEO?",
          answer:
            "No. PPC stops when the budget stops; SEO keeps working but takes months and carries no guaranteed ranking. They answer different time horizons.",
        },
      ]),
  },
  "/en/digital-marketing-company/": {
    postMarker: "elementor-20803",
    lead: () =>
      buildArticleLeadBlock("en", [
        "A digital marketing company manages channels such as SEO, paid search, social media, and content on your behalf, with reporting tied to business goals.",
        "This article covers what such a company does, how to choose one, and what to expect from the relationship — see <a href=\"/en/digital-marketing-services/\">digital marketing services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What does a digital marketing company actually do?",
          answer:
            "Typically strategy, campaign management (Google Ads, social), SEO and content, plus tracking and monthly reporting. The exact scope should be written down before you start.",
        },
        {
          question: "How do I choose a digital marketing company?",
          answer:
            "Ask about scope, who owns the ad and analytics accounts, how results are reported, and request relevant examples. Be wary of guaranteed rankings or vague reports.",
        },
        {
          question: "Do I keep ownership of my ad accounts?",
          answer:
            "You should. Agencies manage campaigns, but the business keeps admin access to its Google Ads, Analytics, and social accounts.",
        },
        {
          question: "When is a company better than doing it in-house?",
          answer:
            "When you need several skills at once and cannot give the channels weekly attention. A single channel can often start in-house.",
        },
      ]),
  },
  "/en/google-ads-7-strategies/": {
    postMarker: "elementor-20897",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Google Ads reaches people at the moment they search for what you offer. Results depend on keywords, ad quality, landing pages, and budget — not on any single trick.",
        "This guide walks through seven strategies for building and improving campaigns. Costs are covered in <a href=\"/en/google-ads-cost/\">How much does Google Ads cost?</a>; for service details see <a href=\"/en/google-ads/\">Google Ads management</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Which Google Ads campaign type should I start with?",
          answer:
            "Most local and service businesses start with Search, because it targets people already looking for the service. Add Display, YouTube, or Performance Max once tracking and offers are proven.",
        },
        {
          question: "How long before a campaign performs well?",
          answer:
            "Plan for a learning period of several weeks. Keyword, ad, and landing-page adjustments usually continue for months.",
        },
        {
          question: "What is the most common mistake?",
          answer:
            "Sending traffic to a page that does not match the ad, and not tracking conversions. Without conversion tracking, you cannot tell which keywords bring leads.",
        },
        {
          question: "Can Google Ads work together with SEO?",
          answer:
            "Yes. Paid keyword data shows which terms convert, which helps prioritize SEO content — see <a href=\"/en/seo/\">SEO</a>.",
        },
      ]),
  },
  "/en/google-ads-10-steps/": {
    postMarker: "elementor-20919",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Starting Google Ads is easier with a fixed sequence: goal, account, conversion tracking, keywords, ads, budget, and review.",
        "This guide lists ten simple steps for a first search campaign. Budget expectations are in <a href=\"/en/google-ads-cost/\">Google Ads cost</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Do I need a website before running Google Ads?",
          answer:
            "You need a landing page with a clear offer and a way to contact you. A weak page wastes budget regardless of how good the ads are.",
        },
        {
          question: "What should I set up before spending money?",
          answer:
            "Conversion tracking (calls, forms), a daily budget you can sustain, and a short, relevant keyword list with negative keywords.",
        },
        {
          question: "Can I manage the campaign myself?",
          answer:
            "Yes, for a small, simple campaign. Time, learning curve, and more channels are the usual reasons to bring in a specialist.",
        },
      ]),
  },

  /* ───────────────────────── Batch 17 — free advertising, internet marketing, SEO guide ───────────────────────── */
  "/פרסום-עסק-חינם/": {
    postMarker: "elementor-20969",
    lead: () =>
      buildArticleLeadBlock("he", [
        "אפשר לקדם עסק בלי תקציב פרסום — אבל זה עולה זמן, עקביות וסבלנות. הדרך החינמית מתאימה בעיקר להתחלה או לעסק מקומי קטן.",
        "המאמר מציג 7 שיטות לפרסום עצמי, כולל <a href=\"/google-ads/\">Google Ads</a> כשמגיעים לשלב שבו שווה להאיץ בתשלום, ואת החסרונות שכדאי להכיר מראש.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "איך מתחילים לפרסם עסק בחינם?",
          answer:
            "מתחילים מהבסיס: פרופיל עסקי בגוגל, דף אתר ברור עם פרטי קשר ונוכחות ברשת חברתית אחת שבה הלקוחות שלכם פעילים.",
        },
        {
          question: "כמה זמן לוקח לראות תוצאות מקידום חינמי?",
          answer:
            "לרוב חודשים. אין זמן קבוע — התוצאות תלויות בתחום, בתחרות ובעקביות הפעילות.",
        },
        {
          question: "מתי כדאי לעבור לפרסום בתשלום?",
          answer:
            "כשיש הצעה מוכחת וצורך בפניות מהר יותר. פרסום ממומן מאפשר בדיקה מהירה — ראו <a href=\"/google-ads/\">Google Ads</a>.",
        },
      ]),
  },
  "/en/free-business-advertising/": {
    postMarker: "elementor-20969",
    lead: () =>
      buildArticleLeadBlock("en", [
        "You can promote a business without an ad budget, but it costs time, consistency, and patience. Free methods suit startups and small local businesses best.",
        "This article presents seven self-promotion methods, the downsides worth knowing, and when to add paid channels such as <a href=\"/en/google-ads/\">Google Ads</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "How do I start advertising a business for free?",
          answer:
            "Begin with the basics: a Google Business Profile, a clear website page with contact details, and one social channel where your customers are active.",
        },
        {
          question: "How long do free methods take to work?",
          answer:
            "Usually months. There is no fixed timeline; results depend on your niche, competition, and consistency.",
        },
        {
          question: "When should I move to paid advertising?",
          answer:
            "When you have a proven offer and need leads faster. Paid campaigns let you test quickly — see <a href=\"/en/google-ads/\">Google Ads</a>.",
        },
      ]),
  },
  "/מהו-שיווק-באינטרנט/": {
    postMarker: "elementor-21051",
    lead: () =>
      buildArticleLeadBlock("he", [
        "שיווק באינטרנט (שיווק דיגיטלי) הוא קידום עסק דרך חיפוש, פרסום ממומן, תוכן, רשתות חברתיות ודוא\"ל — עם מדידה של מה שמביא פניות.",
        "המאמר מסביר את הערוצים המרכזיים ומתי כדאי להתחיל בכל אחד מהם. להרחבה: <a href=\"/שירותי-שיווק-דיגיטלי/\">שירותי שיווק דיגיטלי</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין שיווק באינטרנט לשיווק דיגיטלי?",
          answer:
            "בדרך כלל משתמשים במונחים לחילופין. שניהם מתארים שיווק בערוצים מקוונים שאפשר למדוד.",
        },
        {
          question: "מאיפה מתחילים?",
          answer:
            "מאתר תקין, דרך ברורה ליצור קשר ומדידה בסיסית (Google Analytics). אחר כך בוחרים ערוץ אחד או שניים לפי היעד והתקציב.",
        },
        {
          question: "צריך להיות בכל הערוצים?",
          answer:
            "לא. עומק בערוץ אחד או שניים עדיף בדרך כלל על נוכחות דקה בכל מקום.",
        },
        {
          question: "אפשר להתחיל בלי סוכנות?",
          answer:
            "כן, בערוץ אחד ובהיקף קטן. סוכנות מתאימה כשחסר זמן או ידע לתאם כמה ערוצים יחד.",
        },
      ]),
  },
  "/en/seo-guide-for-beginners/": {
    postMarker: "elementor-21115",
    lead: () =>
      buildArticleLeadBlock("en", [
        "SEO is the work of making your site easier for search engines to understand and more useful for people, so it can appear for relevant searches.",
        "This beginner guide covers how search engines work, the main parts of SEO, and six steps to start with. For hands-on help see <a href=\"/en/seo/\">SEO services</a>; no ranking is guaranteed.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "How long does SEO take?",
          answer:
            "Often several months. It varies with competition, site history, and content quality, and no one can promise a specific position.",
        },
        {
          question: "Can I do SEO myself?",
          answer:
            "Yes, the basics — clear page titles, useful content, a fast mobile-friendly site — are achievable in-house. Competitive niches usually need ongoing expertise.",
        },
        {
          question: "What should I fix first?",
          answer:
            "Make sure the site loads well on mobile, each service has its own page, and titles and headings reflect what people search for.",
        },
      ]),
  },
  "/en/digital-marketing-for-business/": {
    // Plain-HTML post with its own FAQ — lead only.
    lead: () =>
      buildArticleLeadBlock("en", [
        "Digital marketing for business combines search, paid media, social, and measurement into one plan matched to your stage and budget.",
        "This 2026 guide shows how to balance <a href=\"/en/seo/\">SEO</a>, <a href=\"/en/google-ads/\">Google Ads</a>, and social channels, and which KPIs to track.",
      ]),
  },

  /* ───────────────────────── Batch 18 — pricing, Facebook, remarketing, platforms, AEO ───────────────────────── */
  "/כמה-עולה-לבנות-אתר-מחירון-מחשבון/": {
    postMarker: "elementor-21189",
    lead: () =>
      buildArticleLeadBlock("he", [
        "עלות בניית אתר תלויה בסוג האתר, בהיקף העמודים, בפלטפורמה, בעיצוב ובפונקציונליות — ולכן הערכה אמינה דורשת הגדרת צרכים.",
        "במאמר תמצאו את גורמי המחיר, סוגי האתרים והפלטפורמות, והמחשבון להערכה ראשונית. למידע על השירות: <a href=\"/website-building/\">בניית אתרים</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "ממה מורכב המחיר של בניית אתר?",
          answer:
            "מסוג האתר (תדמית, חנות), מספר העמודים, העיצוב, הפונקציונליות, התוכן, האחסון והתחזוקה. אתר חנות יקר בדרך כלל מאתר תדמית.",
        },
        {
          question: "האם המחשבון נותן מחיר סופי?",
          answer:
            "לא, זו הערכה ראשונית. הצעת מחיר מדויקת מתקבלת אחרי הגדרת הדרישות.",
        },
        {
          question: "האם יש עלויות נוספות מעבר לבניית האתר?",
          answer:
            "כן — דומיין, אחסון ותחזוקה שוטפת, ולעיתים קידום ותוכן. ראו <a href=\"/hosting-plans/\">חבילות אחסון ותחזוקה</a>.",
        },
      ]),
  },
  "/en/website-building-pricing/": {
    postMarker: "elementor-21189",
    lead: () =>
      buildArticleLeadBlock("en", [
        "What a website costs depends on its type, number of pages, platform, design, and features, so a reliable estimate starts with defining your needs.",
        "This guide covers price factors, site types, and platforms, plus a calculator for a first estimate. For the service itself, see <a href=\"/en/website-building/\">website building</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What determines the price of a website?",
          answer:
            "Site type (brochure vs. store), number of pages, design, features, content, hosting, and maintenance. A store usually costs more than a brochure site.",
        },
        {
          question: "Does the calculator give a final price?",
          answer:
            "No — it is a first estimate. An exact quote follows once requirements are defined.",
        },
        {
          question: "Are there costs beyond building the site?",
          answer:
            "Yes: domain, hosting, ongoing maintenance, and often SEO and content. See <a href=\"/en/hosting-plans/\">hosting and maintenance plans</a>.",
        },
      ]),
  },
  "/פרסום-ממומן-בפייסבוק/": {
    postMarker: "elementor-21249",
    lead: () =>
      buildArticleLeadBlock("he", [
        "פרסום בפייסבוק ובאינסטגרם מאפשר למקד לפי קהל, תחומי עניין ומיקום, ולבנות תקציב לפי יעד — פניות, מכירות או מודעות.",
        "המאמר מסביר איך מגיעים ללקוחות הנכונים וקובעים תקציב, ומפנה ל<a href=\"/social-media-management/\">ניהול רשתות חברתיות</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "כמה תקציב צריך לפרסום בפייסבוק?",
          answer:
            "אין סכום קבוע. חשוב תקציב שמאפשר איסוף נתונים לאורך כמה שבועות, ולא סכום סמלי מדי.",
        },
        {
          question: "במה שונה פרסום בפייסבוק מ-Google Ads?",
          answer:
            "בגוגל פונים למי שמחפש כבר; ברשתות מגיעים לקהל לפי עניין וסגנון חיים. הערוצים משלימים זה את זה.",
        },
        {
          question: "איך יודעים שהפרסום מביא לידים?",
          answer:
            "מגדירים מעקב המרות (פיקסל, טפסים, שיחות) ובודקים עלות לליד, לא רק קליקים או לייקים.",
        },
      ]),
  },
  "/en/facebook-ads-guide/": {
    postMarker: "elementor-21249",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Facebook and Instagram ads let you target by audience, interests, and location, with budgets matched to a goal — leads, sales, or awareness.",
        "This guide explains how to reach the right customers and set a budget, and links to <a href=\"/en/social-media-management/\">social media management</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "How much should I spend on Facebook ads?",
          answer:
            "There is no fixed number. Budget enough to gather data over several weeks rather than a token amount.",
        },
        {
          question: "How are Facebook ads different from Google Ads?",
          answer:
            "Google reaches people already searching; social reaches audiences by interest and demographics. They complement each other.",
        },
        {
          question: "How do I know ads bring leads?",
          answer:
            "Set up conversion tracking (pixel, forms, calls) and review cost per lead rather than clicks or likes.",
        },
      ]),
  },
  "/רימרקטינג-מה-זה-איך-ולמה/": {
    postMarker: "elementor-21272",
    lead: () =>
      buildArticleLeadBlock("he", [
        "רימרקטינג (שיווק מחדש) מציג מודעות לאנשים שכבר ביקרו באתר או הראו עניין — ולכן הוא בדרך כלל משלים ערוץ אחר, לא תחליף לו.",
        "המאמר מסביר איך זה עובד בגוגל וברשתות החברתיות, אילו קהלים אפשר לבנות ומה כדאי למדוד. ראו גם <a href=\"/google-ads/\">Google Ads</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין רימרקטינג לפרסום רגיל?",
          answer:
            "פרסום רגיל מגיע לקהל חדש; רימרקטינג חוזר למי שכבר הכיר את העסק, ולכן הוא לרוב זול יותר להמרה.",
        },
        {
          question: "כמה תנועה צריך כדי להתחיל?",
          answer:
            "יש מינימום קהל שהפלטפורמות דורשות. אם התנועה נמוכה, כדאי קודם להביא מבקרים בערוץ אחר.",
        },
        {
          question: "האם רימרקטינג מפריע ללקוחות?",
          answer:
            "אפשר לצמצם זאת: מגבילים תדירות חשיפה, מחריגים מי שכבר קנה ומשנים את המסר לפי שלב.",
        },
      ]),
  },
  "/פלטפורמה-בניית-אתר/": {
    postMarker: "elementor-21317",
    lead: () =>
      buildArticleLeadBlock("he", [
        "אין פלטפורמה אחת שמתאימה לכולם: הבחירה תלויה בסוג האתר, בצורך בגמישות, בתקציב וביכולת התחזוקה.",
        "המאמר משווה WordPress, Wix, Shopify, Site123 ו-Google Sites, ועוזר להחליט. לליווי מקצועי: <a href=\"/website-building/\">בניית אתרים</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "איזו פלטפורמה הכי מתאימה לעסק קטן?",
          answer:
            "תלוי במטרה. אתר תדמית פשוט יכול להתאים לבונה אתרים; עסק שצריך גמישות, SEO והתרחבות לרוב יעדיף WordPress.",
        },
        {
          question: "מה כדאי לבדוק לפני הבחירה?",
          answer:
            "בעלות על האתר והנתונים, עלויות לאורך זמן, מהירות, אפשרויות SEO והאפשרות לעבור פלטפורמה בעתיד.",
        },
        {
          question: "האם אפשר להחליף פלטפורמה אחר כך?",
          answer:
            "אפשר, אבל זה דורש עבודה — הגירת תוכן, כתובות והפניות. עדיף לתכנן נכון מההתחלה.",
        },
      ]),
  },
  "/en/website-platform-guide/": {
    postMarker: "elementor-21317",
    lead: () =>
      buildArticleLeadBlock("en", [
        "No single platform fits everyone: the right choice depends on site type, flexibility needs, budget, and who will maintain it.",
        "This guide compares WordPress, Wix, Shopify, Site123, and Google Sites to help you decide. For professional help see <a href=\"/en/website-building/\">website building</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Which platform suits a small business best?",
          answer:
            "It depends on the goal. A simple brochure site may fit a site builder; businesses needing flexibility, SEO, and growth often prefer WordPress.",
        },
        {
          question: "What should I check before choosing?",
          answer:
            "Ownership of the site and data, long-term costs, speed, SEO options, and whether you can migrate later.",
        },
        {
          question: "Can I switch platforms later?",
          answer:
            "Yes, but it takes work — content, URLs, and redirects must be migrated. It is better to plan well up front.",
        },
      ]),
  },
  "/מהו-aeo-האם-יחליף-את-seo/": {
    postMarker: "elementor-21339",
    lead: () =>
      buildArticleLeadBlock("he", [
        "AEO (אופטימיזציה למנועי תשובות) שואף שהתוכן שלכם יספק תשובות ישירות לשאלות. הוא לא מחליף SEO, אלא נשען עליו.",
        "המאמר מסביר את ההבדלים בין AEO ל-SEO, איך משלבים ביניהם ומה אפשר לשפר בתוכן. ראו גם <a href=\"/seo/\">קידום אתרים (SEO)</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "האם AEO יחליף את SEO?",
          answer:
            "לא. AEO מוסיף שכבה של תשובות ישירות; עדיין צריך אתר תקין, תוכן איכותי ואמינות.",
        },
        {
          question: "איך מתאימים תוכן ל-AEO?",
          answer:
            "כותבים כותרות כשאלות, עונים בקצרה בתחילת הפסקה, מוסיפים פירוט ומקורות, ומשתמשים במבנה ברור.",
        },
        {
          question: "אפשר להבטיח הופעה בתשובות AI?",
          answer:
            "לא. אפשר לשפר את הסיכוי באיכות ובבהירות התוכן, אבל אי אפשר להבטיח הופעה.",
        },
      ]),
  },
  "/en/what-is-aeo/": {
    postMarker: "elementor-21339",
    lead: () =>
      buildArticleLeadBlock("en", [
        "AEO (answer engine optimization) aims to make your content provide direct answers to questions. It does not replace SEO; it builds on it.",
        "This article explains how AEO differs from SEO, how they work together, and what to improve in your content. See also <a href=\"/en/seo/\">SEO services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Will AEO replace SEO?",
          answer:
            "No. AEO adds a layer of direct answers; you still need a sound site, quality content, and credibility.",
        },
        {
          question: "How do I adapt content for AEO?",
          answer:
            "Use question-style headings, answer briefly at the start of a section, then add detail and sources, with a clear structure.",
        },
        {
          question: "Can anyone guarantee appearing in AI answers?",
          answer:
            "No. You can improve your chances with clear, high-quality content, but appearance cannot be guaranteed.",
        },
      ]),
  },

  /* ───────────────────────── Batch 19 — speed (embed-safe), Google Ads cost, paid vs organic ───────────────────────── */
  "/בדיקת-מהירות-אתר/": {
    // Post 21496 — PageSpeed embed must stay intact; lead + minimal FAQ only.
    postMarker: "elementor-21496",
    lead: () =>
      buildArticleLeadBlock("he", [
        "בדיקת מהירות אתר מראה כמה מהר האתר נטען בנייד ובמחשב לפי מדדי Google (PageSpeed Insights ו-Core Web Vitals).",
        "בעמוד תמצאו כלי בדיקה, צ'קליסט והסבר על שדרוג האתר הקיים לעומת בניית אתר חדש. התוצאות תלויות במצב האתר ובתשתית, ואין הבטחה לציון מסוים.",
        "אחרי הבדיקה: <a href=\"/שיפור-מהירות-אתר-2026-pagespeed/\">שיפור מהירות אתר</a> · <a href=\"/website-building/\">בניית אתרים לעסקים</a> · <a href=\"/seo/\">קידום אורגני</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מהו ציון PageSpeed טוב?",
          answer:
            "ציון 90 ומעלה נחשב ירוק, אבל חשוב יותר שהאתר ייטען מהר למשתמשים אמיתיים. אפשר להשתמש בציון ככלי מדידה, לא כמטרה בפני עצמה.",
        },
        {
          question: "האם אפשר להבטיח ציון 90+?",
          answer:
            "לא תמיד. התוצאה תלויה בגיל האתר, בקוד, באחסון ובתוספים. לפעמים אתר חדש משתלם יותר משדרוג.",
        },
        {
          question: "מה עושים אחרי הבדיקה?",
          answer:
            "ממיינים לפי עומס ו-LCP/CLS, מתקנים תמונות ואחסון, ואז בודקים שוב. שיפור אמיתי נמדד גם במוניטורינג שוטף.",
        },
      ]),
  },
  "/en/website-speed-test/": {
    postMarker: "elementor-21496",
    lead: () =>
      buildArticleLeadBlock("en", [
        "A website speed test shows how fast your site loads on mobile and desktop, using Google’s measurements (PageSpeed Insights and Core Web Vitals).",
        "This page includes a testing tool, a checklist, and guidance on upgrading your current site versus building a new one. Results depend on the site and its hosting; no specific score is guaranteed.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What is a good PageSpeed score?",
          answer:
            "A score of 90+ is rated green, but real-user loading experience matters more. Use the score as a diagnostic, not as the goal itself.",
        },
        {
          question: "Can a 90+ score be guaranteed?",
          answer:
            "Not always. It depends on the site’s age, code, hosting, and plugins. Sometimes a new site is more cost-effective than an upgrade.",
        },
        {
          question: "What should I do after running the test?",
          answer:
            "Prioritize LCP and CLS issues, fix images and hosting, then re-test. Ongoing monitoring matters more than a one-off score.",
        },
      ]),
  },
  "/en/google-ads-cost/": {
    postMarker: "elementor-21638",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Google Ads cost depends on your industry, keyword competition, quality of ads and landing pages, and the budget you choose — there is no single average that fits everyone.",
        "This guide explains the pricing models and how to think about a daily budget, with links to <a href=\"/en/google-ads/\">Google Ads management</a> and <a href=\"/en/google-ads-10-steps/\">10 steps to get started</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What is a realistic daily budget?",
          answer:
            "It varies by niche and competition. Choose a budget that lets the campaign gather enough clicks to learn, and review it against cost per lead.",
        },
        {
          question: "Do I pay Google if nobody clicks?",
          answer:
            "In click-based search campaigns you pay per click, not per impression. Management fees, if any, are separate from the media budget.",
        },
        {
          question: "How do I avoid wasting budget?",
          answer:
            "Track conversions, add negative keywords, match ads to landing pages, and review search terms regularly.",
        },
      ]),
  },
  "/קידום-ממומן-מול-קידום-אורגני/": {
    // Existing legacy FAQ + FAQPage schema in post — lead only.
    postMarker: "elementor-21860",
    lead: () =>
      buildArticleLeadBlock("he", [
        "קידום ממומן (PPC) נותן תוצאות מהר ועולה לפי קליק; קידום אורגני (SEO) נבנה לאורך זמן ומחזיק כשהוא מבוסס. אין ערוץ שמתאים לכולם.",
        "המאמר משווה בין השניים, מציג מתי לבחור כל אחד, ומשלב מחשבון לתקציב. ראו גם <a href=\"/google-ads/\">Google Ads</a> ו<a href=\"/seo/\">SEO</a>.",
      ]),
  },

  /* ───────────────────────── Batch 20 — ROI calculator, partial Russian audience pages ───────────────────────── */
  "/מחשבון-roi-מעודכן-2026/": {
    postMarker: "adwrks-roi-calculator-embed",
    lead: () =>
      buildArticleLeadBlock("he", [
        "ROI מראה כמה רווח נטו מניבה כל השקעה בפרסום. המחשבון כאן הוא כלי תכנון, לא תחזית או הבטחת תוצאה.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "אילו נתונים צריך להזין?",
          answer: "עלות לקליק או לליד, אחוז המרה ושווי עסקה ממוצע — ככל שהקלט מדויק יותר, ההערכה קרובה יותר.",
        },
        {
          question: "האם זו תחזית?",
          answer: "לא. זו הערכה על בסיס הנתונים שלכם; ביצועים בפועל משתנים לפי תחום, תחרות ואיכות דף הנחיתה.",
        },
        {
          question: "מתי כדאי להעריך ROI?",
          answer: "אחרי לפחות כמה שבועות של נתונים, לא אחרי ימים בודדים.",
        },
      ]),
  },
  "/en/roi-calculator-2026/": {
    postMarker: "adwrks-roi-calculator-embed",
    lead: () =>
      buildArticleLeadBlock("en", [
        "ROI shows the net profit each advertising investment returns. The calculator here is a planning tool, not a forecast or a promise of results.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What inputs does the calculator need?",
          answer: "Cost per click or lead, conversion rate, and average deal value — better inputs yield closer estimates.",
        },
        {
          question: "Is this a forecast?",
          answer: "No. It is an estimate from your inputs; real performance varies by niche, competition, and landing-page quality.",
        },
        {
          question: "When should I judge ROI?",
          answer: "After at least a few weeks of data, not after a handful of days.",
        },
      ]),
  },
  "/בניית-אתרים-ברוסית/": {
    // Partial migration; page already includes its own FAQ — lead only.
    postMarker: "elementor-22840",
    lead: () =>
      buildArticleLeadBlock("he", [
        "אתר ברוסית או דו-לשוני עברית־רוסית עוזר לעסק להופיע בחיפושים בשתי השפות ולבנות אמון אצל קהל דובר רוסית בישראל.",
        "המאמר מסביר מה נכון לבנות — התאמה תרבותית ולא רק תרגום — ואיך לשלב SEO. ראו גם <a href=\"/website-building/\">בניית אתרים</a>.",
      ]),
  },
  "/קידום-אתרים-ברוסית/": {
    // Partial migration; page already includes its own FAQ — lead only.
    postMarker: "elementor-22841",
    lead: () =>
      buildArticleLeadBlock("he", [
        "קידום אתרים ברוסית מאפשר להופיע בגוגל כשלקוחות מחפשים בביטויים ברוסית, לצד חיפושים בעברית.",
        "המדריך מפרט מחקר מילות מפתח, אופטימיזציה על הדף, SEO טכני ומקומי והתאמה לסקירות AI. ראו גם <a href=\"/seo/\">קידום אתרים</a>.",
      ]),
  },

};

const SPEED_LEAD_PATHS = new Set([
  "/בדיקת-מהירות-אתר/",
  "/en/website-speed-test/",
]);

function applyMap(
  html: string,
  path: string,
  locale: Locale,
  map: Record<string, BatchConfig>,
): string {
  const row = map[normalizePath(path)];
  if (!row) return html;
  const key = normalizePath(path);
  const leadHtml = row.lead(locale);
  let next = SPEED_LEAD_PATHS.has(key)
    ? upsertArticleLeadAfterPagespeedTool(html, leadHtml)
    : upsertArticleLead(html, leadHtml);
  if (row.faq) {
    next = upsertArticleFaq(next, row.faq(locale), row.postMarker ?? "");
  }
  return next;
}

/** Final rollout batches 16–20 — not wired into `article.ts` yet. */
export function applyArticleFinalRolloutBatch1620Enrichment2026(
  html: string,
  path: string,
  locale: Locale,
): string {
  return applyMap(html, path, locale, FINAL_ROLLOUT_BATCH16_20);
}

export const FINAL_ROLLOUT_BATCH16_20_PATHS = Object.keys(FINAL_ROLLOUT_BATCH16_20);
