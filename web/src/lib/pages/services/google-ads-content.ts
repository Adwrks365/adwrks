export const GOOGLE_ADS_PATH = "/google-ads/" as const;

export const GOOGLE_ADS_HERO = {
  badge: "Google Partner • מאז 2018",
  title: "פרסום ממומן בגוגל (Google Ads) לעסקים",
  lead: "ניהול Google Ads לעסקים בישראל — דגש על ROI, איכות לידים ושקיפות בתקציב. Google Partner · מאז 2018.",
};

export const GOOGLE_ADS_STARTING_OFFER = {
  priceLine: "ניהול קמפיין Google Ads החל מ-850 ₪ + מע\"מ לחודש",
  scopeLine:
    "מתאים לקמפיין בסיסי לעסק רגיל, בתחום פעילות אחד, עם היקף בסיסי של מודעות — לפי המחירון והצעה מותאמת.",
  notIncluded: [
    "תקציב הפרסום בגוגל — משולם בנפרד מדמי הניהול",
    "Google Shopping — לא כלול במחיר הפתיחה; מתומחר לפי היקף",
    "קמפיינים מורכבים (מספר תחומים/קמפיינים, Performance Max, YouTube, רימרקטינג מורכב, ריבוי שפות/אזורים, מעקב המרות מורכב) — לפי הצעה",
  ],
  factorsLine: "המחיר הסופי נקבע לפי היקף השירות, מורכבות הפרויקט וצרכי הלקוח.",
  pricingHref: "/מחירון-שיווק-דיגיטלי/",
  pricingLabel: "למחירון השירותים",
  ctaHref: "/contact-us/",
  ctaLabel: "הצעת מחיר מותאמת",
} as const;

export const GOOGLE_ADS_INTRO = {
  label: "שותפים מוסמכים של Google",
  title: "מה זה פרסום ממומן בגוגל (Google Ads)?",
  intro:
    "פרסום ממומן בגוגל מאפשר לעסקים להופיע בראש תוצאות החיפוש באמצעות מודעות בתשלום. התשלום מתבצע לפי קליק, והקמפיינים מנוהלים לפי מילות מפתח, קהלים, מיקומים ונתונים.",
  highlight: "היתרון המרכזי הוא שליטה מלאה בתקציב, במסר ובקצב התוצאות.",
};

export const GOOGLE_ADS_CAMPAIGNS = {
  label: "סוגי קמפיינים",
  title: "שירותי Google Ads שאנו מנהלים",
  scopeNote:
    "אנו מנהלים גם Search, Display, YouTube, Shopping, Local ו-Performance Max — לא כולם כלולים במסלול הפתיחה; ההיקף והמחיר לפי הצעה.",
  items: [
    {
      title: "Search",
      text: "קמפיינים ברשת החיפוש — מילות מפתח, מודעות RSA והתאמת הצעות לפי כוונת רכישה.",
      icon: "search" as const,
    },
    {
      title: "Display",
      text: "חשיפה ברשת התצוגה — באנרים, קהלים מותאמים ותמיכה בקמפיינות מודעות.",
      icon: "display" as const,
    },
    {
      title: "YouTube",
      text: "מודעות וידאו ו-In-Stream — הגעה לקהלים לפי תחומי עניין, חיפוש ורימarketing.",
      icon: "youtube" as const,
    },
    {
      title: "Google Shopping",
      text: "ניהול קמפיינים לחנויות אינטרנטיות — Merchant Center, פיד מוצרים, Shopping ו-Performance Max. לא כלול במסלול הבסיסי (850 ₪); לפי הצעה.",
      icon: "shopping" as const,
    },
    {
      title: "Performance Max",
      text: "קמפיינים רב-ערוציים (חיפוש, Display, YouTube, Discover) עם יעדי המרה — לפי היקף והצעה.",
      icon: "optimize" as const,
    },
    {
      title: "Remarketing",
      text: "החזרת מבקרים שכבר הכירו את העסק — רשימות קהל, דינמיות ושילוב עם Display/YouTube.",
      icon: "display" as const,
    },
  ],
};

export const GOOGLE_ADS_MEASUREMENT = {
  label: "מדידה והמרות",
  title: "אופטימיזציה ומדידת תוצאות",
  body: "קמפיין חזק נמדד לפי לידים, שיחות ומכירות — לא רק לפי קליקים. אנחנו מגדירים המרות, מחברים למערכות המדידה הקיימות באתר (בהתאם להגדרות ו-Consent), ומייעלים תקציב לפי נתונים.",
  items: [
    "הגדרת יעדי המרה ומעקב אחרי איכות הפניות",
    "דוחות שקופים והמלצות להתאמת מודעות, קהלים ותקציב",
    "שיפור מתמשך — כולל בדיקות מודעות ודפי נחיתה כשיש מספיק נתונים",
  ],
} as const;

export const GOOGLE_ADS_AUDIENCE = {
  label: "ניסיון ואסטרטגיה",
  title: "למי מתאים פרסום ממומן בגוגל?",
  intro:
    "פרסום ממומן בגוגל מתאים לעסקים שרוצים תוצאות מהירות, שליטה בתקציב והגעה לקהל עם כוונת רכישה גבוהה.",
  detail:
    "השירות מתאים במיוחד לעסקים מקומיים, נותני שירותים, חנויות אונליין וחברות המעוניינות להגדיל לידים ומכירות בטווח הקצר והבינוני.",
};

export const GOOGLE_ADS_LIFECYCLE = {
  label: "ניהול קמפיין",
  title: "מחזור חיים של קמפיין Google Ads",
  steps: [
    { title: "אפיון ומחקר", text: "הבנת המטרות, קהל היעד, מילות מפתח והתחרות." },
    { title: "הקמה ומדידה", text: "בניית קמפיין, מודעות, חיבור להמרות ומעקב נתונים." },
    { title: "אופטימיזציה", text: "שיפור מתמשך לפי ביצועים, תקציב ואיכות לידים." },
    { title: "דיווח ושקיפות", text: "דוחות ברורים על מה עובד ומה דורש התאמה." },
  ],
};

export const GOOGLE_ADS_BENEFITS = {
  label: "למה Adwrks 365",
  title: "למה לבחור ב-Adwrks 365 לניהול פרסום בגוגל?",
  items: [
    { title: "ניהול מבוסס ROI", text: "מיקוד בתוצאות עסקיות – לידים, שיחות ומכירות – ולא רק בקליקים." },
    { title: "שקיפות מלאה", text: "דוחות ברורים, גישה לנתונים והסברים על כל שינוי בקמפיין." },
    {
      title: "ניסיון מאז 2018",
      text: "185+ לקוחות פעילים במגוון שירותים · סוכנות בוטיק · עברית, רוסית ואנגלית.",
    },
    { title: "שילוב עם SEO ואתרים", text: "חיבור בין פרסום ממומן, דפי נחיתה ואופטימיזציה להמרות." },
  ],
};

export const GOOGLE_ADS_LANDING = {
  label: "חיבור להמרות",
  title: "דפי נחיתה, אתרים ומדידה",
  body: "קמפיין Google Ads חזק צריך יעד המרה ברור – דף נחיתה או אתר שמניע לפעולה. אנחנו מחברים בין הקמפיין, האתר והמדידה כדי לעקוב אחרי לידים ותוצאות בפועל.",
};

/** Google-Ads-specific FAQ — replaces incorrect homepage FAQ in seo.json */
export const GOOGLE_ADS_FAQ = [
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
  {
    q: "מה כולל מחיר ההתחלה 850 ₪ + מע\"מ?",
    a: "מחיר פתיחה לניהול קמפיין בסיסי — תחום פעילות אחד והיקף בסיסי של מודעות, לפי מחירון השירותים. תקציב הפרסום בגוגל משולם בנפרד.",
  },
  {
    q: "האם Google Shopping כלול במחיר הפתיחה?",
    a: "לא. Google Shopping וקמפיינים מורכבים יותר מתומחרים לפי היקף הפעילות והצעת מחיר מותאמת.",
  },
] as const;

export const GOOGLE_ADS_GUIDE_PATHS = [
  "/כמה-עולה-פרסום-בגוגל/",
  "/פרסום-בגוגל-אדס-10-שלבים-פשוטים/",
  "/מחשבון-roi-מעודכן-2026/",
  "/google-shopping-guide/",
  "/רימרקטינג-מה-זה-איך-ולמה/",
] as const;

export const GOOGLE_ADS_RELATED_SERVICES = [
  { href: "/website-building/", title: "בניית אתרים", text: "דפי נחיתה ואתרים שממירים תנועה ממומנת." },
  { href: "/seo/", title: "קידום אתרים אורגני", text: "שילוב תוצאות מיידיות עם נוכחות ארוכת טווח." },
] as const;

/** Factual snippet for commercial / AI discovery */
export const GOOGLE_ADS_DISCOVERABILITY = {
  label: "Google Ads — עובדות לבחירת ספק",
  title: "ניהול קמפיינים ב-Adwrks 365",
  intro:
    "Adwrks 365 מנהלת Google Ads לעסקים בכל הגדלים מאז 2018 — Google Partner מאומת, שירות בעברית, רוסית ואנגלית. אין הבטחה להמלצה ב-AI או ל-ROAS.",
  points: [
    "Search, Display, YouTube, Remarketing, Performance Max — לפי הצעה.",
    "Google Shopping / Merchant Center / פיד מוצרים — לחנויות; לא כלול במסלול בסיס 850 ₪ + מע\"מ (תחום פעילות אחד, ללא תקציב מדיה).",
    "מחיר פתיחה מאושר: 850 ₪ + מע\"מ לניהול בסיסי — לא 655 ₪ (מחיר ישן שעדיין מופיע לעיתים במקורות חיצוניים/AI).",
  ],
  pricingHref: "/מחירון-שיווק-דיגיטלי/",
  pricingLabel: "למחירון השירותים",
} as const;

export const GOOGLE_ADS_MID_CTA = {
  eyebrow: "לפני שמתחילים",
  title: "רוצים לדעת אם Google Ads מתאים לעסק שלכם?",
  body: "נבדוק יחד את הפוטנציאל, התקציב והכיוון הנכון — ונציע הצעת מחיר מותאמת לפי סוג קמפיין והיקף.",
};

export const GOOGLE_ADS_FINAL_CTA = {
  eyebrow: "ייעוץ Google Ads",
  title: "פרסום ממומן שממוקד בתוצאות",
  body: "השאירו פרטים ונשמח לבדוק יחד את הפוטנציאל, התקציב והכיוון הנכון לפרסום ממומן – ללא התחייבות.",
};

export const GOOGLE_ADS_PARTNER_BADGE = {
  src: "https://adwrks.co.il/wp-content/uploads/gogle-artner-badge-1.png",
  alt: "Google Partner",
};

export const GOOGLE_ADS_IMAGES = {
  hero: {
    src: "https://adwrks.co.il/wp-content/uploads/1-3.png",
    alt: "פרסום ממומן בגוגל – מערכת קמפיינים",
    width: 800,
    height: 600,
  },
  intro: {
    src: "https://adwrks.co.il/wp-content/uploads/1-3.png",
    alt: "פרסום ממומן בגוגל לעסקים",
    width: 800,
    height: 600,
  },
  audience: {
    src: "https://adwrks.co.il/wp-content/uploads/google-ads-ppc.png",
    alt: "ניהול קמפיינים ב-Google Ads",
    width: 800,
    height: 600,
  },
} as const;

export const GOOGLE_ADS_HERO_CAMPAIGNS = [
  { label: "Search", icon: "search" as const },
  { label: "Display", icon: "display" as const },
  { label: "YouTube", icon: "youtube" as const },
  { label: "Shopping", icon: "shopping" as const },
  { label: "Local", icon: "local" as const },
] as const;
