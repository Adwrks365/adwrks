import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  buildArticleFaqBlock,
  buildArticleLeadBlock,
  upsertArticleFaq,
  upsertArticleLead,
} from "@/lib/content/article-content-blocks";

/**
 * Final rollout queue (post ids 19143–20506), batches 10–15.
 * `needs-content` rows have lead + FAQ; `needs-partial` rows (lead only) omit `faq`.
 */
type BatchConfig = {
  postMarker: string;
  lead: (locale: Locale) => string;
  /** Omitted for `needs-partial` posts: only the lead block is upserted. */
  faq?: (locale: Locale) => string;
};

const BATCH10_15: Record<string, BatchConfig> = {
  // ───────────────────────── 19143 — What is a digital agency (EN)
  "/en/what-is-digital-agency/": {
    postMarker: "elementor-19143",
    lead: () =>
      buildArticleLeadBlock("en", [
        "A digital agency is a team that plans, builds, and runs online marketing work — search, paid media, social, content, and measurement — so a business does not have to recruit and coordinate each specialist on its own.",
        "This article explains what agencies actually do, how they differ from freelancers and in-house hires, and when it makes sense to bring one in. For the range of work involved, see <a href=\"/en/digital-marketing-services/\">digital marketing services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What does a digital agency do day to day?",
          answer:
            "It sets strategy with you, builds or improves assets such as landing pages and ad creatives, manages campaigns, and reports on results. The exact mix depends on which channels your business needs.",
        },
        {
          question: "How is an agency different from a freelancer?",
          answer:
            "A freelancer often covers one skill deeply; an agency brings several disciplines under one process. The better fit depends on how many channels you run and how much coordination you want to outsource.",
        },
        {
          question: "Do all digital agencies offer the same services?",
          answer:
            "No. Some focus on one channel, others cover search, social, and web together. Ask for a clear scope and examples of the type of work you need, such as <a href=\"/en/seo/\">SEO</a> or <a href=\"/en/google-ads/\">Google Ads</a>.",
        },
        {
          question: "What should we prepare before the first conversation?",
          answer:
            "A short description of your offer, your target customers, current channels, and one business goal you want to move. Access to existing ad and analytics accounts speeds up an honest assessment.",
        },
      ]),
  },

  // ───────────────────────── 19281 — Importance of a digital advertising agency (EN)
  "/en/digital-advertising-agency-importance/": {
    postMarker: "elementor-19281",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Advertising platforms change constantly, and running campaigns well takes testing, creative work, and careful budget control. An advertising agency exists to carry that workload with specialists who do it every day.",
        "Here we look at where an agency adds value — specialization, tailored strategy, tooling, and transparent reporting — and where you should stay involved. Related services: <a href=\"/en/google-ads/\">Google Ads</a> and <a href=\"/en/social-media-management/\">social media management</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Why use an agency instead of boosting posts ourselves?",
          answer:
            "Boosting a post is a single quick action. An agency defines audiences, offers, tracking, and a testing plan, then optimizes over time. Simple boosts can work for tiny budgets, but they rarely build a measurable system.",
        },
        {
          question: "What does an advertising agency do beyond setting up campaigns?",
          answer:
            "It handles creative direction, landing-page recommendations, conversion tracking, budget pacing, and regular reporting, with recommendations for what to change next.",
        },
        {
          question: "How can we tell whether the agency is adding value?",
          answer:
            "Look for agreed goals, access to your own ad accounts, clear reports showing leads or sales rather than only clicks, and a record of tests and decisions. No agency can promise a specific result in advance.",
        },
        {
          question: "Does an agency replace our internal marketing person?",
          answer:
            "Not necessarily. Many businesses keep someone in-house who knows the product and customers, while the agency supplies channel expertise and execution capacity.",
        },
      ]),
  },

  // ───────────────────────── 19398 — Advertising in tough times (HE)
  "/השקעה-בפרסום-גם-בזמנים-קשים/": {
    postMarker: "elementor-19398",
    lead: () =>
      buildArticleLeadBlock("he", [
        "כשהשוק מתקשה, הפרסום הוא לרוב סעיף התקציב הראשון שנחתך. אבל עסק שנעלם מהעין עלול לגלות שהלקוחות עברו למתחרים שנשארו נוכחים — ובנייה מחדש של תודעה עולה זמן ומאמץ.",
        "המאמר מסביר איך להמשיך להיות גלויים גם בתקציב זהיר: לשמור על קשר עם קהל קיים, לבחור ערוצים שאפשר למדוד, ולהתאים מסר לתקופה. אפשר להתחיל מ־<a href=\"/google-ads/\">Google Ads</a> או לראות את מכלול <a href=\"/שירותי-שיווק-דיגיטלי/\">שירותי השיווק הדיגיטלי</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "האם כדאי לקצץ בפרסום כשיש האטה בעסקים?",
          answer:
            "אין תשובה אחת לכולם. מומלץ לבדוק מה מביא פניות היום, לצמצם ערוצים חלשים ולהשאיר נוכחות מינימלית בערוצים שעובדים, במקום להפסיק הכול בבת אחת.",
        },
        {
          question: "איך ממשיכים לפרסם בתקציב קטן יותר?",
          answer:
            "ממקדים בקהל ובשירות הרווחי ביותר, מצמצמים אזורי פרסום ומילות מפתח רחבות, ומודדים פניות אמיתיות. תקציב קטן ממוקד עדיף על פיזור דק בהרבה ערוצים.",
        },
        {
          question: "איזה ערוץ מתאים כשצריך תוצאות מהר?",
          answer:
            "קמפיין חיפוש ממומן מאפשר להגיע ללקוחות שמחפשים כבר עכשיו ולמדוד מהר. הוא לא מבטיח תוצאה, אך נותן נתונים מוקדם יחסית. בטווח ארוך משלבים גם קידום אורגני.",
        },
        {
          question: "איך יודעים אם הפרסום עדיין משתלם?",
          answer:
            "משווים עלות לפנייה ולעסקה מול הרווח מכל לקוח. אם אין מעקב אחר טלפונים וטפסים, מתחילים בהקמת מדידה לפני שמחליטים להגדיל או לקצץ.",
        },
      ]),
  },

  // ───────────────────────── 19398 — Advertising in tough times (EN)
  "/en/advertising-investment-tough-times/": {
    postMarker: "elementor-19398",
    lead: () =>
      buildArticleLeadBlock("en", [
        "When budgets tighten, advertising is often the first line to go. Yet pulling out of the market entirely can leave a gap that competitors fill, and rebuilding awareness later usually costs more effort than keeping a steady presence.",
        "This piece looks at how to stay visible through an uncertain period: protect trust with existing customers, favor channels you can measure, and adjust messaging to what buyers care about now. Start with <a href=\"/en/google-ads/\">Google Ads</a> or browse the full range of <a href=\"/en/digital-marketing-services/\">digital marketing services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Should we cut advertising during a slowdown?",
          answer:
            "It depends on your numbers. Review which channels produce real inquiries, trim the weak ones, and keep a lean presence where results are clear rather than switching everything off.",
        },
        {
          question: "How do we keep advertising on a smaller budget?",
          answer:
            "Narrow the audience and geography, focus on your most profitable offer, and track actual leads. A tight campaign usually beats a thin spread across many platforms.",
        },
        {
          question: "Which channel suits businesses that need leads quickly?",
          answer:
            "Paid search reaches people already looking for your service and gives early data. It carries no guarantee of results, and it works best alongside <a href=\"/en/seo/\">SEO</a> for the longer term.",
        },
        {
          question: "How do we know advertising is still worth the spend?",
          answer:
            "Compare cost per inquiry and per sale with the profit each customer brings. If calls and forms are not tracked, set up measurement first, then decide whether to scale or reduce.",
        },
      ]),
  },

  // ───────────────────────── 19428 — Google SEO: why invest in organic search (EN)
  "/en/google-seo/": {
    postMarker: "elementor-19428",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Search results come in two forms: organic listings earned through relevance and quality, and paid ads that appear while you fund them. Choosing where to put effort starts with understanding how each one behaves over time.",
        "This article weighs organic SEO against paid search, explains when investing in <a href=\"/en/seo/\">SEO</a> is likely to pay off, and shares practical tips for improving how your site performs in Google — without promising a position. For the paid side, see <a href=\"/en/google-ads/\">Google Ads</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Is it worth investing in organic search?",
          answer:
            "For many businesses, yes — useful pages can keep attracting visitors without paying per click. Results take time and depend on competition, so treat it as a long-term asset rather than a quick fix.",
        },
        {
          question: "How is SEO different from Google Ads?",
          answer:
            "SEO earns visibility through content, technical quality, and trust signals. Google Ads buys visibility immediately and stops when the budget stops. Many sites use both, based on goals and timeline.",
        },
        {
          question: "Can anyone guarantee the first place on Google?",
          answer:
            "No. Rankings depend on many factors outside any provider’s control, including competitors and algorithm updates. Be cautious of anyone who promises a specific position.",
        },
        {
          question: "What are the first steps to improve our site in search?",
          answer:
            "Make sure pages load properly on mobile, write clear titles and descriptions for each service, answer the questions customers actually ask, and track visits and inquiries in analytics.",
        },
      ]),
  },

  // ───────────────────────── 19548 — Hosting & maintenance: why it matters (EN)
  "/en/why-hosting-maintenance-matters/": {
    postMarker: "elementor-19548",
    lead: () =>
      buildArticleLeadBlock("en", [
        "A website is not a one-time purchase. If hosting is slow or unmaintained, visitors leave, updates pile up, and a small problem can turn into hours of downtime at the worst moment.",
        "This article explains what hosting and ongoing maintenance protect — speed, security patches, backups, and availability — and how to think about them as part of running your business online. To compare options, see <a href=\"/en/hosting-plans/\">hosting plans</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Why does a website need ongoing maintenance?",
          answer:
            "Software, plugins, and browsers keep changing. Regular updates, backups, and checks reduce the risk of broken pages, security gaps, and slow performance.",
        },
        {
          question: "What does hosting affect besides uptime?",
          answer:
            "Server quality influences loading speed, how well the site handles traffic spikes, and how quickly problems can be restored from a backup.",
        },
        {
          question: "Can we skip maintenance if the site rarely changes?",
          answer:
            "A site that rarely changes still depends on software that gets outdated. Even a simple brochure site benefits from periodic updates and a verified backup.",
        },
        {
          question: "Who should be responsible for maintenance?",
          answer:
            "Someone must own it explicitly — your team, a freelancer, or a provider under a clear service scope. The risk is usually that nobody is responsible. Details are in <a href=\"/en/hosting-plans/\">hosting plans</a>.",
        },
      ]),
  },

  // ───────────────────────── 19644 — WordPress hosting & maintenance (HE)
  "/אחסון-אתרי-וורדפרס-ותחזוקתם/": {
    postMarker: "elementor-19644",
    lead: () =>
      buildArticleLeadBlock("he", [
        "אתר וורדפרס מורכב מליבה, תבנית ותוספים, וכל אחד מהם מתעדכן בקצב משלו. בלי טיפול שוטף, עדכון אחד שלא נבדק יכול לשבור עמוד חשוב או לפתוח פרצת אבטחה.",
        "המאמר מסביר מה כולל שירות אחסון ותחזוקה מקצועי לוורדפרס — עדכונים, גיבויים, ניטור ותגובה לתקלות — ולמה כדאי לדעת מי אחראי על האתר שלכם. לפרטי שירות והשוואת מסלולים: <a href=\"/hosting-plans/\">חבילות אחסון ותחזוקה</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה בדרך כלל כוללת תחזוקת אתר וורדפרס?",
          answer:
            "עדכוני ליבה, תבנית ותוספים, גיבויים, בדיקות תקינות וטיפול בתקלות. היקף השירות משתנה בין ספקים, ולכן כדאי לוודא מה כלול בכתב.",
        },
        {
          question: "למה עדכון תוספים יכול לגרום לבעיה?",
          answer:
            "תוספים ותבניות נכתבים על ידי גורמים שונים, ועדכון עלול ליצור אי־תאימות. לכן מקצוענים בודקים לפני עדכון ושומרים גיבוי שאפשר לחזור אליו.",
        },
        {
          question: "האם אפשר לתחזק אתר וורדפרס בעצמנו?",
          answer:
            "אפשר, אם יש זמן וידע בסיסי. עסקים רבים מעדיפים להעביר זאת לספק כדי לא להסתכן בעדכון שגוי או בגיבוי שלא נבדק.",
        },
        {
          question: "איך בוחרים ספק אחסון ותחזוקה?",
          answer:
            "בודקים מה כלול בשירות, איפה נשמרים הגיבויים, איך מדווחים על תקלות וכמה מהר מגיבים. כדאי לשמור בעלות על הדומיין ועל גישת הניהול לאתר.",
        },
      ]),
  },

  // ───────────────────────── 19644 — WordPress hosting & maintenance (EN)
  "/en/wordpress-hosting-maintenance/": {
    postMarker: "elementor-19644",
    lead: () =>
      buildArticleLeadBlock("en", [
        "WordPress powers a large share of business websites, but the platform depends on core software, a theme, and plugins that each need regular care. Skipped updates are one of the most common reasons sites slow down or break.",
        "This article covers what professional WordPress hosting and maintenance typically include — updates, backups, monitoring, and support when something goes wrong — and what to confirm before you hand your site to a provider. See <a href=\"/en/hosting-plans/\">hosting plans</a> for how this can be organized.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What does WordPress maintenance usually include?",
          answer:
            "Updates to core, theme, and plugins; scheduled backups; uptime and security checks; and help fixing issues. Scope differs by provider, so ask for it in writing.",
        },
        {
          question: "Why can a plugin update break a site?",
          answer:
            "Plugins and themes come from different developers, so an update can clash with other code. Careful providers test changes and keep a backup ready to restore.",
        },
        {
          question: "Can we maintain a WordPress site ourselves?",
          answer:
            "Yes, if someone has the time and technical comfort. Many businesses outsource it to avoid downtime and to make sure backups actually work.",
        },
        {
          question: "What should we keep control of when using a provider?",
          answer:
            "Your domain registration, admin access, and a copy of your backups. That way you can move or change providers without losing the site.",
        },
      ]),
  },

  // ───────────────────────── 19758 — Hosting & maintenance: complete guide (HE)
  "/אחסון-ותחזוקת-אתרים-המדריך/": {
    postMarker: "elementor-19758",
    lead: () =>
      buildArticleLeadBlock("he", [
        "בחירת אחסון נראית טכנית, אבל היא משפיעה ישירות על מהירות האתר, על היציבות בשעות עומס ועל מה שקורה כשמשהו נתקע. סוגי האחסון — SSD, ענן, שרת בארץ או בחו״ל — מתאימים לצרכים שונים.",
        "המדריך עובר על ההבדלים בין סוגי האחסון, על שיקולי מיקום השרת ועל תחזוקה שוטפת של אתרי וורדפרס, כדי שתוכלו לשאול את השאלות הנכונות. להשוואה בין מסלולים: <a href=\"/hosting-plans/\">חבילות אחסון</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין אחסון SSD לאחסון ענן?",
          answer:
            "SSD מתייחס לסוג הכונן ומשפר זמני קריאה וכתיבה. אחסון ענן מפזר את האתר על כמה שרתים וגמיש יותר בעומסים. לפעמים משלבים את שניהם, והבחירה תלויה בגודל האתר ובתנועה.",
        },
        {
          question: "האם עדיף אחסון בארץ או בחו״ל?",
          answer:
            "שרת קרוב לקהל היעד יכול לשפר זמני תגובה, ויש גם שיקולי שפה ותמיכה. אין כלל אחד — מומלץ לבדוק איפה רוב המבקרים שלכם ואיך הספק מטפל בגיבוי ובתקלות.",
        },
        {
          question: "מתי צריך לעבור לאחסון חזק יותר?",
          answer:
            "כשהאתר מאט בעומס, מתרחשות נפילות חוזרות או שהתנועה והתוכן גדלו. בודקים קודם אם הבעיה באתר עצמו, כמו תמונות כבדות ותוספים מיותרים.",
        },
        {
          question: "האם אחסון זול מספיק לאתר עסקי?",
          answer:
            "לאתר קטן לפעמים כן, אבל כדאי לבדוק גיבויים, זמינות ותמיכה, לא רק מחיר. נפילה בשעת קמפיין עלולה לעלות יותר מההפרש בעלות האחסון.",
        },
      ]),
  },

  // ───────────────────────── 19758 — Hosting & maintenance: complete guide (EN)
  "/en/hosting-maintenance-guide/": {
    postMarker: "elementor-19758",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Hosting choices can look like jargon — shared, SSD, cloud, local or overseas servers — yet they shape load speed, stability during traffic peaks, and how quickly a problem gets fixed.",
        "This guide explains the main hosting types, what server location means for your visitors, and what ongoing WordPress maintenance involves, so you can compare providers on substance. When you are ready to compare, visit <a href=\"/en/hosting-plans/\">hosting plans</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What is the difference between SSD and cloud hosting?",
          answer:
            "SSD describes the type of storage drive and generally helps with speed. Cloud hosting spreads a site across multiple servers and scales more flexibly. Some plans combine both.",
        },
        {
          question: "Should our server be in Israel or abroad?",
          answer:
            "A server near your main audience can reduce response time, and local support may be easier to reach. Check where your visitors are and how the provider handles backups and incident response.",
        },
        {
          question: "How do we know it is time to upgrade hosting?",
          answer:
            "Warning signs include slow pages under load, repeated outages, or growth in traffic or content. Rule out heavy images and unused plugins first.",
        },
        {
          question: "Is the cheapest hosting enough for a business site?",
          answer:
            "Sometimes for a very small site, but compare backups, uptime commitments, and support rather than price alone. Downtime during a campaign can cost more than the savings.",
        },
      ]),
  },

  // ───────────────────────── 19781 — Hosting & maintenance cost (HE)
  "/כמה-עולים-שירותי-אחסון-ותחזוקת-אתרים/": {
    postMarker: "elementor-19781",
    lead: () =>
      buildArticleLeadBlock("he", [
        "עלות אחסון ותחזוקה אינה מספר קבוע — היא תלויה בגודל האתר, בכמות התנועה, ברמת התמיכה ובשאלה אם מדובר רק בשרת או גם בטיפול שוטף באתר.",
        "המאמר מפרט מה משפיע על המחיר, איך להשוות הצעות שונות בלי להתבלבל בין שרת לבין שירות, ומתי השקעה בתחזוקה חוסכת בעיות יקרות. מסלולים ותנאים עדכניים מופיעים ב־<a href=\"/hosting-plans/\">חבילות האחסון</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה משפיע על עלות אחסון אתר?",
          answer:
            "סוג השרת, משאבים כמו נפח ומעבד, כמות התנועה, גיבויים ורמת התמיכה. אחסון פשוט לאתר תדמית שונה מאחסון לחנות עם הרבה גולשים.",
        },
        {
          question: "מה ההבדל בין מחיר אחסון לעלות תחזוקה?",
          answer:
            "אחסון הוא התשתית שבה האתר רץ. תחזוקה היא עבודה שוטפת — עדכונים, גיבויים ובדיקות. חלק מהספקים כוללים את שניהם וחלק גובים בנפרד, ולכן חשוב להשוות מה כלול.",
        },
        {
          question: "איך משווים הצעות אחסון ותחזוקה?",
          answer:
            "מבקשים פירוט כתוב: מה מגובה ובאיזו תדירות, מי מטפל בתקלות, מה זמן התגובה, ומה קורה אם רוצים לעבור ספק. הצעה זולה בלי פירוט אינה בהכרח משתלמת.",
        },
        {
          question: "האם כדאי לשלם על תחזוקה אם האתר עובד?",
          answer:
            "תחזוקה נועדה למנוע תקלות לפני שהן קורות. לאתר שמביא פניות, עלות של השבתה או פריצה גבוהה בדרך כלל יותר ממה שחוסכים על טיפול מונע.",
        },
      ]),
  },

  // ───────────────────────── 19781 — Hosting & maintenance cost (EN)
  "/en/hosting-maintenance-cost/": {
    postMarker: "elementor-19781",
    lead: () =>
      buildArticleLeadBlock("en", [
        "There is no single price for hosting and maintenance. Cost follows site size, traffic, support level, and whether you are buying only server space or ongoing care for the whole site.",
        "This article breaks down what drives the price, how to compare quotes that bundle different things, and when preventive maintenance is cheaper than fixing problems after the fact. Current plan details are on the <a href=\"/en/hosting-plans/\">hosting plans</a> page.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What affects the cost of website hosting?",
          answer:
            "Server type, storage and processing resources, traffic volume, backup frequency, and the level of support. A brochure site and a busy online store have very different needs.",
        },
        {
          question: "How is hosting different from maintenance?",
          answer:
            "Hosting is the infrastructure your site runs on. Maintenance is the recurring work — updates, backups, and checks. Some providers bundle them, others charge separately, so compare what is actually included.",
        },
        {
          question: "How do we compare hosting and maintenance quotes fairly?",
          answer:
            "Ask for a written scope: what is backed up and how often, who fixes issues, response times, and how you can leave. A low price without detail is hard to evaluate.",
        },
        {
          question: "Is maintenance worth paying for if the site works fine?",
          answer:
            "Maintenance aims to prevent problems before they happen. For a site that brings in inquiries, the cost of downtime or a security incident usually outweighs routine care.",
        },
      ]),
  },

  // ───────────────────────── 19792 — WordPress website cost (EN) — needs-partial: lead only
  "/en/wordpress-website-cost/": {
    postMarker: "elementor-19792",
    lead: () =>
      buildArticleLeadBlock("en", [
        "The cost of a WordPress website depends on scope far more than on the platform itself: number of pages, design depth, integrations, content, and who does the work all change the total. Published ranges are best read as orientation, not a quote.",
        "This guide walks through the factors that move the budget, the trade-offs between a DIY build and a professional team, and the ongoing costs people forget. For the service itself, see <a href=\"/en/website-building/\">website building</a> and <a href=\"/en/hosting-plans/\">hosting plans</a>.",
      ]),
  },

  // ───────────────────────── 19933 — Managed website hosting (EN)
  "/en/managed-website-hosting/": {
    postMarker: "elementor-19933",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Managed hosting means the provider handles much of the technical upkeep for you — server configuration, updates, backups, and monitoring — instead of leaving you with an empty server and a to-do list.",
        "The article explains what managed hosting offers, the situations where it pays off, and how to choose a service without paying for features you will never use. You can see how this fits together in our <a href=\"/en/hosting-plans/\">hosting plans</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What does managed hosting mean?",
          answer:
            "The provider takes responsibility for server setup, security updates, backups, and monitoring, so you can focus on content and customers instead of technical maintenance.",
        },
        {
          question: "Who benefits most from managed hosting?",
          answer:
            "Businesses without in-house technical staff, and sites where downtime directly costs leads or sales. Technical teams who want full control may prefer unmanaged servers.",
        },
        {
          question: "What should we check before choosing a managed service?",
          answer:
            "Which tasks are included, where backups are stored, how issues are reported and resolved, and whether you keep admin access and domain ownership.",
        },
        {
          question: "Does managed hosting also cover website content updates?",
          answer:
            "Not always. Infrastructure care and content changes are often separate. Confirm whether edits, design changes, or new pages are part of the plan.",
        },
      ]),
  },

  // ───────────────────────── 20029 — Internet consultant (EN)
  "/en/internet-consultant/": {
    postMarker: "elementor-20029",
    lead: () =>
      buildArticleLeadBlock("en", [
        "An internet consultant helps you make sense of the online options in front of you: which channels fit your business, what to build first, and what to leave for later. The value is often in avoiding costly detours.",
        "This article describes when a consultant is worth bringing in, what you should expect from the engagement, and how to choose someone whose advice you can verify. For hands-on execution across channels, see <a href=\"/en/digital-marketing-services/\">digital marketing services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What does an internet consultant do?",
          answer:
            "They review your current online presence, identify gaps and priorities, and recommend a plan for channels like search, ads, social, and your website. Some also help oversee execution.",
        },
        {
          question: "When does it make sense to hire a consultant?",
          answer:
            "When you are launching online, planning a redesign, comparing agencies, or spending on marketing without clear results. An outside view helps set direction.",
        },
        {
          question: "How is a consultant different from an agency?",
          answer:
            "A consultant mainly advises and plans; an agency also builds and runs campaigns. Some businesses start with advice, then hire execution separately or together.",
        },
        {
          question: "How do we evaluate a consultant’s recommendations?",
          answer:
            "Ask for the reasoning behind each priority, the data used, and how success will be measured. Avoid anyone who guarantees rankings or specific revenue.",
        },
      ]),
  },

  // ───────────────────────── 20081 — Internet marketing consultant (EN)
  "/en/internet-marketing-consultant/": {
    postMarker: "elementor-20081",
    lead: () =>
      buildArticleLeadBlock("en", [
        "An internet marketing consultant focuses on the marketing side of your online presence — positioning, channel mix, budgets, and the numbers that show whether campaigns are working.",
        "Here we explain what the role involves, when it helps to bring one in, and how to pick a consultant who sets measurable goals instead of selling a fixed package. Channels typically discussed include <a href=\"/en/seo/\">SEO</a>, <a href=\"/en/google-ads/\">Google Ads</a>, and <a href=\"/en/social-media-management/\">social media</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What does an internet marketing consultant do?",
          answer:
            "They assess your market and current campaigns, recommend where to invest, define KPIs, and review results. The work centers on strategy and decision-making, sometimes alongside execution.",
        },
        {
          question: "What should we bring to the first meeting?",
          answer:
            "Your goals, current marketing spend, access to analytics and ad accounts, and a clear picture of your best customers. This lets the consultant give specific advice.",
        },
        {
          question: "Can a consultant guarantee more leads?",
          answer:
            "No. A professional can improve the odds with a sound plan and testing, but results depend on market conditions, offer, and execution. Be wary of firm promises.",
        },
        {
          question: "How do we choose between channels with a limited budget?",
          answer:
            "Start from one measurable goal, look at where customers search or spend time, and test one primary channel first. Expand only when you can read the results.",
        },
      ]),
  },

  // ───────────────────────── 20092 — Digital consultant as partner (EN)
  "/en/digital-consultant-partner/": {
    postMarker: "elementor-20092",
    lead: () =>
      buildArticleLeadBlock("en", [
        "The best results from a digital consultant tend to come from an ongoing working relationship rather than a single report: regular reviews, shared goals, and someone who knows your business context.",
        "This article looks at the consultant’s role, how to structure the collaboration, and the habits that make it productive — clear owners, decision rhythms, and honest reporting. If you want to compare how an agency team would plug in, see <a href=\"/en/digital-marketing-services/\">digital marketing services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What is the role of a digital consultant?",
          answer:
            "To translate business goals into a digital plan, prioritize actions, and review results with you over time. They may advise across websites, search, ads, and measurement.",
        },
        {
          question: "How often should we meet with a consultant?",
          answer:
            "A steady cadence works best — for example a regular review of results and next steps. The right frequency depends on how active your campaigns are.",
        },
        {
          question: "How can we make the collaboration effective?",
          answer:
            "Share access and data openly, name one decision-maker, agree on KPIs up front, and document what you test and learn.",
        },
        {
          question: "Should the consultant have access to our accounts?",
          answer:
            "Typically yes, with appropriate permission levels, so they can review real data. Keep ownership of your ad, analytics, and domain accounts on your side.",
        },
      ]),
  },

  // ───────────────────────── 20155 — Google Maps advertising / Business Profile (EN)
  "/en/google-maps-advertising/": {
    postMarker: "elementor-20155",
    lead: () =>
      buildArticleLeadBlock("en", [
        "When people search for a nearby service, Google Maps often shows them businesses before they ever visit a website. Your Business Profile — hours, photos, reviews, and contact options — is what they see first.",
        "This guide explains how to set up and keep the profile accurate, why verification and reviews matter, and how paid placement differs from your free listing, without any promise of a specific map position. Related reading: <a href=\"/en/google-business-profile/\">Google Business Profile</a> and <a href=\"/en/google-business-promotion-guide/\">promoting your business on Google</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Is a Google Business Profile the same as Google Maps advertising?",
          answer:
            "Not exactly. The profile is your free business listing. Paid ads in Maps and Search are a separate option managed through <a href=\"/en/google-ads/\">Google Ads</a>.",
        },
        {
          question: "What should we complete first in a business profile?",
          answer:
            "Verification, accurate name, address, phone, categories, opening hours, and real photos. A complete, consistent profile is the base for everything else.",
        },
        {
          question: "How do reviews affect a map listing?",
          answer:
            "Reviews influence customer trust and are one of several local signals. Ask real customers for feedback and respond politely to criticism; never buy or fake reviews.",
        },
        {
          question: "Can we guarantee a top position on Google Maps?",
          answer:
            "No. Local results depend on proximity, relevance, and prominence, among other factors. You can improve your profile steadily but cannot guarantee a ranking.",
        },
      ]),
  },

  // ───────────────────────── 20230 — Google reviews: what changed (HE)
  "/ביקורות-גוגל-לא-עובד-❌-זו-הסיבה-למה/": {
    postMarker: "elementor-20230",
    lead: () =>
      buildArticleLeadBlock("he", [
        "עסקים רבים שמים לב שביקורות בגוגל לא מוצגות או לא מתנהגות כפי שציפו: ביקורת נעלמת, דירוג לא מתעדכן או שהזמנה ללקוח לא מניבה תוצאה. לפני שמסיקים שמשהו שבור, כדאי להבין איך גוגל מסננת ומציגה ביקורות.",
        "המאמר מתמקד במה שאפשר לעשות בפועל — לבקש ביקורות אמיתיות בדרך תקינה, להגיב נכון, ולבנות אמון גם בערוצים נוספים. מידע נוסף על חשיבות ההמלצות: <a href=\"/כוחם-של-ביקורות-והמלצות/\">כוחם של ביקורות והמלצות</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "למה ביקורת בגוגל לא מופיעה מיד?",
          answer:
            "גוגל בודקת ביקורות באופן אוטומטי ולעיתים גם ידני, וחלקן מושהות או מוסרות אם נראות חשודות או מפרות מדיניות. אין דרך להבטיח הצגה מיידית.",
        },
        {
          question: "האם מותר לתת ללקוחות תמורה על ביקורת?",
          answer:
            "לא. הצעת תמורה או כתיבת ביקורות מזויפות מפרה את הכללים ועלולה לפגוע בפרופיל. מבקשים משוב כן מלקוחות שקיבלו שירות.",
        },
        {
          question: "איך מגיבים לביקורת שלילית?",
          answer:
            "בנימוס, בעניין ובלי להתעמת. מציעים להמשיך את השיחה בערוץ ישיר ומראים לגולשים אחרים שהעסק מקשיב. אפשר לדווח לגוגל רק על ביקורת שמפרה את המדיניות.",
        },
        {
          question: "מה עוד אפשר לעשות כדי לבנות אמון?",
          answer:
            "לעדכן את פרופיל העסק, להציג המלצות ותיקי עבודות באתר ולשמור על מידע עקבי בכל הערוצים. ראו גם <a href=\"/seo/\">קידום אתרים</a> לחיזוק הנוכחות בחיפוש.",
        },
      ]),
  },

  // ───────────────────────── 20230 — Google reviews: what changed (EN)
  "/en/google-reviews-not-working/": {
    postMarker: "elementor-20230",
    lead: () =>
      buildArticleLeadBlock("en", [
        "If your Google reviews seem to vanish, load slowly, or do not show up after a customer posts them, you are not alone. Before assuming something is broken, it helps to understand how Google filters and displays reviews.",
        "This article focuses on practical steps: how to request genuine reviews within the rules, respond professionally, and support trust through other channels as well. See also <a href=\"/en/power-of-reviews/\">the power of reviews</a> and <a href=\"/en/google-business-profile/\">Google Business Profile</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Why does a Google review not appear right away?",
          answer:
            "Google screens reviews automatically and sometimes manually. Some are delayed or removed if they look suspicious or break policy, so immediate display cannot be guaranteed.",
        },
        {
          question: "Can we offer something in exchange for reviews?",
          answer:
            "No. Incentivized or fake reviews violate Google’s rules and can harm your profile. Ask real customers for honest feedback after the service.",
        },
        {
          question: "How should we reply to a negative review?",
          answer:
            "Stay calm and factual, acknowledge the issue, and offer to continue the conversation privately. Replies are visible to future customers, so tone matters. Report only reviews that violate policy.",
        },
        {
          question: "What else builds trust besides Google reviews?",
          answer:
            "A complete Business Profile, testimonials and case examples on your website, and consistent business details everywhere. <a href=\"/en/seo/\">SEO</a> content also helps customers find you.",
        },
      ]),
  },

  // ───────────────────────── 20350 — Russian-language digital advertising (EN)
  "/en/russian-language-digital-advertising/": {
    postMarker: "elementor-20350",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Russian speakers are a sizable audience in Israel, and many prefer to search, compare, and buy in their own language. Ads written natively, not translated word for word, usually feel more credible to them.",
        "This article covers what makes a Russian-language campaign work: audience targeting, culturally aware messaging, the right platforms, and measurement. It also shows how it connects with <a href=\"/en/google-ads/\">Google Ads</a> and <a href=\"/en/social-media-management/\">social media</a> work.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Why advertise separately in Russian?",
          answer:
            "Language shapes trust and search behavior. A campaign built for Russian speakers can use their keywords, tone, and channels instead of relying on a translated Hebrew version.",
        },
        {
          question: "Is a literal translation of our Hebrew ads enough?",
          answer:
            "Usually not. Phrasing, idioms, and what customers care about differ. Native copywriting and a quick review by a Russian speaker prevent awkward or off-tone messages.",
        },
        {
          question: "Which channels work for Russian-speaking audiences?",
          answer:
            "Search ads, social platforms, and local business listings are common starting points. Choose by where your customers spend time and test before scaling.",
        },
        {
          question: "How do we measure a Russian-language campaign?",
          answer:
            "Use separate campaigns or tracking labels so you can see leads and costs for this audience on its own, then compare with your Hebrew results.",
        },
      ]),
  },

  // ───────────────────────── 20388 — Professional marketing for Russian speakers (HE)
  "/שיווק-מקצועי-לקהל-דובר-רוסית/": {
    postMarker: "elementor-20388",
    lead: () =>
      buildArticleLeadBlock("he", [
        "קהל דובר רוסית בישראל מחפש, משווה ומחליט בשפה שלו. עסק שמדבר אליו ברוסית טבעית — לא בתרגום מילולי מעברית — מקבל סיכוי טוב יותר להיתפס כאמין.",
        "המאמר סוקר שלושה מעגלים של נוכחות ברוסית: פרסום ממומן, בניית אתר וקידום אורגני. לפירוט כל אחד: <a href=\"/בניית-אתרים-ברוסית/\">בניית אתרים ברוסית</a>, <a href=\"/קידום-אתרים-ברוסית/\">קידום אתרים ברוסית</a> ו<a href=\"/פרסום-דיגיטלי-בשפה-הרוסית/\">פרסום דיגיטלי בשפה הרוסית</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "למה לשווק בנפרד לקהל דובר רוסית?",
          answer:
            "כי ההרגלים, מילות החיפוש והטון שונים. שיווק ברוסית מאפשר להתאים מסר לקהל במקום להסתפק בגרסה מתורגמת של הקמפיין העברי.",
        },
        {
          question: "מאיפה כדאי להתחיל — אתר, פרסום או קידום?",
          answer:
            "תלוי במה שקיים. אם אין עמודי שירות ברוסית, מתחילים בהם. כשיש בסיס, אפשר לבדוק פרסום ממומן לצורך נתונים מהירים ולבנות במקביל קידום אורגני.",
        },
        {
          question: "האם תרגום האתר העברי מספיק?",
          answer:
            "לרוב לא. כדאי לכתוב עמודים בגישה מקומית, עם ניסוח טבעי, ולבדוק שהמבנה והכותרות מתאימים לחיפוש ברוסית.",
        },
        {
          question: "איך מודדים הצלחה בשיווק ברוסית?",
          answer:
            "בעזרת מעקב נפרד אחר פניות, שיחות וטפסים מהקהל הזה, והשוואה לעלות ולאיכות הפניות בקמפיינים בעברית.",
        },
      ]),
  },

  // ───────────────────────── 20388 — Professional marketing for Russian speakers (EN)
  "/en/russian-speaking-audience-marketing/": {
    postMarker: "elementor-20388",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Reaching Russian-speaking customers in Israel works best when your presence feels native from the first click: the ad, the landing page, and the search listing should all speak the same language, literally and culturally.",
        "This overview covers three building blocks — paid advertising, a Russian-language website, and organic search — and how they work together. Related guides: <a href=\"/en/russian-language-digital-advertising/\">Russian-language digital advertising</a> and <a href=\"/en/seo/\">SEO</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Why target Russian-speaking customers specifically?",
          answer:
            "Many prefer to research services in Russian. A business that speaks to them directly tends to stand out from competitors who only market in Hebrew or English.",
        },
        {
          question: "Where should we start: ads, a website, or SEO?",
          answer:
            "Start with what is missing. Without Russian service pages, begin there. With a base in place, paid campaigns can bring quick data while organic content builds over time.",
        },
        {
          question: "Is translating our existing site enough?",
          answer:
            "Rarely. Pages should be written naturally for the audience and structured around how Russian speakers search, not only mirrored word for word.",
        },
        {
          question: "How do we know the Russian-language effort is working?",
          answer:
            "Track leads from this audience separately — calls, forms, and messages — and compare cost and quality with your other campaigns.",
        },
      ]),
  },

  // ───────────────────────── 20403 — Digital marketing agency that moves business forward (HE)
  "/סוכנות-שיווק-דיגיטלי/": {
    postMarker: "elementor-20403",
    lead: () =>
      buildArticleLeadBlock("he", [
        "בחירת סוכנות שיווק דיגיטלי היא בחירה של שותף לעבודה שוטפת, לא רק של ספק שמפעיל קמפיין. מה שקובע הוא הבנה של העסק, שקיפות בדיווח וסדר עדיפויות שמתאים לתקציב.",
        "המאמר מראה מה כדאי לצפות לו מסוכנות שמלווה עסקים, כולל שילוב בין ערוצים ופעילות בכמה שפות. להיכרות עם התחומים: <a href=\"/seo/\">קידום אתרים</a>, <a href=\"/google-ads/\">Google Ads</a> ו<a href=\"/שירותי-שיווק-דיגיטלי/\">שירותי שיווק דיגיטלי</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("he", [
        {
          question: "מה ההבדל בין סוכנות שיווק דיגיטלי לפרילנסר?",
          answer:
            "פרילנסר מתמחה בדרך כלל בתחום אחד. סוכנות מרכזת כמה מומחיות תחת תהליך אחד, מה שנוח כשצריך לתאם בין אתר, קמפיינים וקידום.",
        },
        {
          question: "איך יודעים איזה ערוץ מתאים לעסק?",
          answer:
            "מתחילים ביעד עסקי ובקהל, בודקים איפה הלקוחות מחפשים, ובוחרים ערוץ עיקרי אחד שאפשר למדוד לפני שמרחיבים.",
        },
        {
          question: "מה צריך לדרוש מסוכנות בדיווח?",
          answer:
            "גישה לחשבונות המודעות והאנליטיקס שלכם, דוחות על פניות ולא רק על קליקים, והסבר ברור מה שונה ולמה. אף סוכנות לא יכולה להבטיח תוצאה מראש.",
        },
        {
          question: "האם סוכנות יכולה לעבוד בכמה שפות?",
          answer:
            "כן, אם היא מציעה כתיבה והתאמה מקומית ולא תרגום בלבד. כדאי לוודא שיש ניסיון בשפות שהקהל שלכם משתמש בהן, כמו עברית, רוסית ואנגלית.",
        },
      ]),
  },

  // ───────────────────────── 20403 — Digital marketing agency that moves business forward (EN)
  "/en/digital-marketing-agency-leadership/": {
    postMarker: "elementor-20403",
    lead: () =>
      buildArticleLeadBlock("en", [
        "The right digital marketing agency acts less like a vendor and more like a partner that understands your business, speaks plainly about numbers, and helps you decide where effort should go next.",
        "This article sets out what to look for: integrated channels, clear reporting, and the ability to work across languages when your audience requires it. Explore related services such as <a href=\"/en/seo/\">SEO</a>, <a href=\"/en/google-ads/\">Google Ads</a>, and the wider <a href=\"/en/digital-marketing-services/\">digital marketing services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "How is a digital marketing agency different from a freelancer?",
          answer:
            "A freelancer typically specializes in one area. An agency brings several skills together under one process, which helps when your website, ads, and search work need to line up.",
        },
        {
          question: "How do we choose the right channel for our business?",
          answer:
            "Start with a business goal and your audience, check where customers look for you, and pick one main measurable channel before widening the mix.",
        },
        {
          question: "What reporting should we expect from an agency?",
          answer:
            "Access to your own ad and analytics accounts, reports on leads and sales rather than clicks alone, and plain explanations of changes. No agency can promise a specific outcome in advance.",
        },
        {
          question: "Can an agency support multiple languages?",
          answer:
            "Yes, when it offers native-quality copy and local adaptation rather than translation alone. Confirm experience in the languages your customers use.",
        },
      ]),
  },

  // ───────────────────────── 20506 — Digital marketing agency: all solutions in one place (EN)
  "/en/digital-marketing-agency/": {
    postMarker: "elementor-20506",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Running websites, paid campaigns, search optimization, social media, and local listings through separate providers often means gaps and duplicated effort. A single agency can coordinate them around one plan.",
        "This overview walks through the services such an agency covers — from landing pages and PPC to SEO, social, Google Maps, and multilingual campaigns — and how to decide which ones your business needs first. Details for each area: <a href=\"/en/seo/\">SEO</a>, <a href=\"/en/google-ads/\">Google Ads</a>, <a href=\"/en/social-media-management/\">social media management</a>, and <a href=\"/en/digital-marketing-services/\">all services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "What services does a full digital marketing agency usually offer?",
          answer:
            "Commonly websites and landing pages, paid search and social ads, SEO, content, social media management, and local profile management. The exact list varies, so ask for a clear scope.",
        },
        {
          question: "Do we need every service at once?",
          answer:
            "No. Most businesses start with one or two that match their goal, then add more as results and budget allow.",
        },
        {
          question: "What is the difference between SEM and SEO?",
          answer:
            "SEM usually refers to paid search marketing, while SEO is about earning organic visibility. They support each other, and many businesses use both over time.",
        },
        {
          question: "How do we know the agency fits our business?",
          answer:
            "Look for relevant experience, clear goals and reporting, and a plan that matches your budget. A short fit conversation, such as <a href=\"/en/check-fit/\">checking fit</a>, can clarify expectations before you commit.",
        },
      ]),
  },
};

function applyMap(
  html: string,
  path: string,
  locale: Locale,
  map: Record<string, BatchConfig>,
): string {
  const row = map[normalizePath(path)];
  if (!row) return html;
  let next = html;
  next = upsertArticleLead(next, row.lead(locale));
  if (row.faq) {
    next = upsertArticleFaq(next, row.faq(locale), row.postMarker);
  }
  return next;
}

/** Final rollout batches 10–15 — queue ids 19143–20506 (HE + EN; partial = lead only). */
export function applyArticleFinalRolloutBatch1015Enrichment2026(
  html: string,
  path: string,
  locale: Locale,
): string {
  return applyMap(html, path, locale, BATCH10_15);
}

export const FINAL_ROLLOUT_BATCH10_15_PATHS = Object.keys(BATCH10_15);
