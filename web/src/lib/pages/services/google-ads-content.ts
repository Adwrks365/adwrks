export const GOOGLE_ADS_PATH = "/google-ads/" as const;

export const GOOGLE_ADS_HERO = {
  badge: "Google Partner • מאז 2018",
  title: "פרסום ממומן בגוגל (Google Ads) לעסקים",
  lead: "פרסום ממומן בגוגל (Google Ads) הוא הדרך המהירה ביותר להביא לקוחות לעסק בדיוק ברגע שהם מחפשים שירות או מוצר. Adwrks 365 מנהלת קמפיינים ממומנים בגוגל לעסקים בישראל, עם דגש על החזר השקעה (ROI), איכות לידים וניהול תקציב חכם – לא רק קליקים.",
};

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
  items: [
    { title: "Search", text: "קמפיינים בחיפוש – מילות מפתח עם כוונת רכישה גבוהה.", icon: "search" as const },
    { title: "Display", text: "קמפיינים ברשת התצוגה – חשיפה ורימarketing.", icon: "display" as const },
    { title: "YouTube", text: "וידאו ומודעות ממוקדות ב-YouTube.", icon: "youtube" as const },
    { title: "Shopping", text: "Google Shopping – למוצרים וחנויות אונליין.", icon: "shopping" as const },
    { title: "Local", text: "קמפיינים מקומיים – Google Maps ו-Local Services.", icon: "local" as const },
    { title: "אופטימיזציה", text: "A/B testing, דוחות ROI ושיפור מתמשך.", icon: "optimize" as const },
  ],
};

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
    { title: "ניסיון מאז 2018", text: "ניהול קמפיינים לעסקים מכל התחומים בישראל." },
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

export const GOOGLE_ADS_MID_CTA = {
  eyebrow: "לפני שמתחילים",
  title: "רוצים לדעת אם Google Ads מתאים לעסק שלכם?",
  body: "נבדוק יחד את הפוטנציאל, התקציב והכיוון הנכון לפרסום ממומן – ללא התחייבות.",
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
