/** Structured pricing data — mapped from verified legacy /מחירון-שיווק-דיגיטלי/ content only. */

export const PRICING_PATH = "/מחירון-שיווק-דיגיטלי/" as const;

export const PRICING_HERO = {
  eyebrow: "מחירון • סוכנות שיווק דיגיטלי",
  /** Visible Hero H1 (Phase 5I.1B) — SEO title/meta unchanged in seo.json */
  h1: "מחירון שיווק דיגיטלי לעסקים",
  /** Popup / legacy page title reference — not used for document title */
  seoPageTitle: "מחירון שיווק דיגיטלי - מחשבון עלויות אינטראקטיבי",
  lead: "מחירי התחלה לשירותי פרסום, SEO, רשתות חברתיות ובניית אתרים, לצד מחשבון עלויות אינטראקטיבי לקבלת הערכה ראשונית. המחיר הסופי נקבע לפי היקף, תחרות וצרכי העסק.",
  primaryCta: "קבלת הצעה מותאמת לעסק",
} as const;

export const PRICING_INTRO = {
  text: "מחירון שיווק דיגיטלי שקוף, מדויק ומותאם לתקציב העסק שלך. בחרו את השירותים המבוקשים במחשבון למטה וקבלו הערכת מחיר מיידית.",
  disclaimer:
    "המחירים המוצגים הם מחירי התחלה בש\"ח לפני מע\"מ, והמחיר הסופי נקבע בהתאם לצרכים הספציפיים של העסק.",
} as const;

export type PricingCardModel = "monthly-management" | "one-time-project";

export type PricingCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
  priceAmount: number;
  pricePrefix: string;
  billingPeriod?: string;
  model: PricingCardModel;
  features: readonly string[];
  serviceHref?: string;
  serviceCta?: string;
  /** Clarifies management fee vs media budget where applicable */
  priceNote?: string;
};

/** Monthly digital-marketing services — verified legacy price mapping */
export const PRICING_MARKETING_CARDS: readonly PricingCard[] = [
  {
    id: "google-ads",
    icon: "🔍",
    title: "פרסום ממומן בגוגל (Google Ads)",
    description:
      "ניהול קמפיינים מלא, מחקר מילות מפתח, אופטימיזציה שבועית ודוחות ביצועים חודשיים. אידיאלי לעסקים שרוצים לידים מהר ולמקסום החזר השקעה.",
    priceAmount: 850,
    pricePrefix: "החל מ־",
    billingPeriod: "לחודש",
    model: "monthly-management",
    features: [
      "מחקר מילות מפתח",
      "ניהול קמפיינים",
      "אופטימיזציה שבועית",
      "דוחות ביצועים חודשיים",
    ],
    serviceHref: "/google-ads/",
    serviceCta: "לעמוד Google Ads",
    priceNote: "מחיר ניהול חודשי — לא כולל תקציב פרסום בגוגל",
  },
  {
    id: "social-media",
    icon: "📱",
    title: "שיווק במדיה החברתית",
    description:
      "ניהול קמפיינים בפייסבוק ואינסטגרם, יצירת קריאייטיב, פילוח קהלים מתקדם ורימרקטינג. מצוין למוצרים ויזואליים, מותגי אופנה ואירועים.",
    priceAmount: 1050,
    pricePrefix: "החל מ־",
    billingPeriod: "לחודש",
    model: "monthly-management",
    features: ["ניהול קמפיינים", "יצירת קריאייטיב", "פילוח קהלים", "רימרקטינג"],
    serviceHref: "/social-media-management/",
    serviceCta: "לעמוד ניהול סושיאל",
    priceNote: "מחיר ניהול חודשי — לא כולל תקציב פרסום ב-Meta",
  },
  {
    id: "google-maps",
    icon: "📍",
    title: "קידום בגוגל מפות",
    description:
      "אופטימיזציה של Google Business Profile, ניהול ביקורות, תמונות ופוסטים, והגברת נראות מקומית. קריטי לעסקים מקומיים.",
    priceAmount: 400,
    pricePrefix: "החל מ־",
    billingPeriod: "לחודש",
    model: "monthly-management",
    features: ["אופטימיזציה של GBP", "ניהול ביקורות", "תמונות ופוסטים", "נראות מקומית"],
    serviceHref: "/google-business-profile/",
    serviceCta: "למידע נוסף",
  },
  {
    id: "seo",
    icon: "📈",
    title: "קידום אורגני (SEO) + AI",
    description:
      "קידום אתרים בתוצאות האורגניות של גוגל, תוכן ממוקד AI, בניית סמכות ולינקבילדינג. השקעה לטווח ארוך.",
    priceAmount: 2500,
    pricePrefix: "החל מ־",
    billingPeriod: "לחודש",
    model: "monthly-management",
    features: ["קידום אורגני", "תוכן ממוקד AI", "בניית סמכות", "לינקבילדינג"],
    serviceHref: "/seo/",
    serviceCta: "לעמוד SEO",
  },
] as const;

/** One-time website projects — verified legacy price mapping */
export const PRICING_WEBSITE_CARDS: readonly PricingCard[] = [
  {
    id: "landing-page",
    icon: "📝",
    title: "דף נחיתה",
    description:
      "עיצוב ופיתוח דף נחיתה ממיר עם התאמה מלאה למובייל, חיבור לטפסים ומהירות טעינה גבוהה.",
    priceAmount: 1200,
    pricePrefix: "החל מ־",
    model: "one-time-project",
    features: ["עיצוב ופיתוח", "התאמה למובייל", "חיבור לטפסים", "מהירות טעינה גבוהה"],
    serviceHref: "/website-building/",
    serviceCta: "לעמוד בניית אתרים",
  },
  {
    id: "one-page",
    icon: "🌐",
    title: "אתר בעמוד אחד (One Page)",
    description: "אתר מקצועי בעמוד אחד עם כל המידע החיוני, עיצוב מותאם אישית, SSL ואבטחה.",
    priceAmount: 1800,
    pricePrefix: "החל מ־",
    model: "one-time-project",
    features: ["עמוד אחד מקצועי", "עיצוב מותאם", "SSL ואבטחה", "כל המידע החיוני"],
    serviceHref: "/website-building/",
    serviceCta: "לעמוד בניית אתרים",
  },
  {
    id: "corporate",
    icon: "🏢",
    title: "אתר תדמית (עד 5 עמודים)",
    description:
      "אתר תדמית מקצועי הכולל עד 5 עמודים, עיצוב ברנדינג ייחודי, בלוג/חדשות וניהול תוכן קל.",
    priceAmount: 3000,
    pricePrefix: "החל מ־",
    model: "one-time-project",
    features: ["עד 5 עמודים", "עיצוב ברנדינג", "בלוג/חדשות", "ניהול תוכן קל"],
    serviceHref: "/website-building/",
    serviceCta: "לעמוד בניית אתרים",
  },
] as const;

export const PRICING_PACKAGES_INTRO = {
  title: "חבילות שיווק דיגיטלי – פירוט מלא",
  text: "ב-Adwrks 365 אנו מציעים מגוון שירותי שיווק דיגיטלי לעסקים מכל התחומים והגדלים. כל חבילה מותאמת אישית לצרכי העסק וכוללת ליווי אישי, דוחות ביצועים ואופטימיזציה מתמדת.",
  websiteSectionTitle: "בניית אתרים ודפי נחיתה",
} as const;

export const PRICING_FACTORS = {
  title: "מה משפיע על מחירי השיווק הדיגיטלי?",
  intro:
    "מחיר שיווק דיגיטלי אינו מחיר אחיד, אלא נגזרת של מספר פרמטרים מרכזיים בעסק שלך. הבנת הפרמטרים האלה תעזור לך לקבל החלטה מושכלת ולבחור את החבילה המתאימה ביותר לצרכים שלך:",
  items: [
    {
      title: "רמת התחרות בתחום",
      text: "תחומים תחרותיים כמו עורכי דין, נדל\"ן, ביטוח, פיננסים ורפואה דורשים השקעה גדולה יותר בבניית סמכות",
    },
    {
      title: "מצב האתר הנוכחי",
      text: "אתר חדש דורש תשתית טכנית, שיפור מהירות ובניית סמכות (DR) מהבסיס",
    },
    {
      title: "היקף העבודה והמטרות",
      text: "כמה מילות מפתח, כמה שירותים, האם נדרש גם תוכן, קישורים ועבודה טכנית",
    },
    {
      title: "יעדי העסק",
      text: "האם מדובר בקמפיין בודד או באסטרטגיית 360° המשולבת מספר ערוצים",
    },
  ],
} as const;

export const PRICING_TRANSPARENCY = {
  text: "אנחנו ב-Adwrks 365 מאמינים בשקיפות מלאה – ללא אותיות קטנות וללא הצעות מחיר מנופחות. כל הצעת מחיר מותאמת אישית לצרכי העסק, עם פירוט מלא של העבודה, לוחות הזמנים והתוצאות הצפויות.",
  checkFitHref: "/check-fit/",
  checkFitLabel: "לבדיקת התאמה חינם",
} as const;

export const PRICING_WHY_INVEST = {
  title: "למה כדאי להשקיע בשיווק דיגיטלי?",
  intro:
    "בעידן הדיגיטלי, נוכחות אונליין חזקה היא לא מותרות אלא הכרח. עסקים שמשקיעים בשיווק דיגיטלי נהנים מיתרונות משמעותיים שמשפיעים ישירות על השורה התחתונה:",
  benefits: [
    { title: "חשיפה ממוקדת", text: "הגעה לקהל יעד מדויק בזמן שהוא מחפש את השירות שלך" },
    { title: "מדידה מדויקת", text: "כל שקל מושקע ניתן למדידה ואופטימיזציה, עם נתונים בזמן אמת" },
    { title: "גמישות תקציבית", text: "התחלה עם תקציב קטן והגדלה בהתאם לתוצאות" },
    { title: "יתרון תחרותי", text: "בניית מותג חזק ונוכחות מקצועית אונליין שמבדלת אתכם מהמתחרים" },
  ],
  roiNote:
    "לפי נתוני Google, עסקים שמשקיעים בשיווק דיגיטלי רואים בממוצע ROI של 200%-400% על ההשקעה שלהם. המפתח להצלחה הוא בחירת האסטרטגיה הנכונה והעבודה עם מומחים שיודעים למקסם את התוצאות.",
  roiCalculatorHref: "/מחשבון-roi-מעודכן-2026/",
  roiCalculatorLabel: "חשבו את ה-ROI הצפוי שלכם עם מחשבון ה-ROI שלנו",
} as const;

export const PRICING_CHANNELS = {
  title: "איך בוחרים ערוץ שיווק מתאים?",
  intro:
    "בחירת ערוץ השיווק הנכון תלויה במספר גורמים: סוג העסק, קהל היעד, התקציב והמטרות. הנה המלצות כלליות:",
  items: [
    {
      title: "Google Ads",
      text: "מתאים לעסקים עם שירותים שאנשים מחפשים אקטיבית בגוגל – שרברבים, עורכי דין, רופאים, חנויות.",
      href: "/כמה-עולה-פרסום-בגוגל/",
      linkLabel: "כמה עולה פרסום בגוגל?",
    },
    {
      title: "פייסבוק ואינסטגרם",
      text: "מצוין למוצרים ויזואליים, מותגי אופנה, מסעדות, אירועים וכל דבר שאפשר \"להראות\"",
    },
    {
      title: "קידום אורגני (SEO)",
      text: "השקעה לטווח ארוך שמתאימה לכל עסק שרוצה לבנות נכס דיגיטלי יציב.",
      href: "/קידום-ממומן-מול-קידום-אורגני/",
      linkLabel: "קידום ממומן מול אורגני",
    },
    {
      title: "גוגל מפות (GBP)",
      text: "קריטי לעסקים מקומיים עם מיקום פיזי – מסעדות, קליניקות, חנויות, מוסכים ובעלי מקצוע",
    },
  ],
} as const;

export const PRICING_TRUST = {
  badge: "Google Partner · Meta Business Partner",
  since: "סוכנות שיווק דיגיטלי מאז 2018",
  supporting:
    "ליווי אישי, שקיפות מלאה ומחירי התחלה ברורים — כדי שתדעו מה מצפה לכם לפני שמתחילים.",
} as const;

/** Matches seo.json FAQPage — visible FAQ must stay in parity */
export const PRICING_FAQ = [
  {
    q: "מה ההבדל העיקרי בין קידום אורגני לממומן?",
    a: "קידום ממומן (PPC) מספק תוצאות מיידיות באמצעות תשלום עבור כל קליק. קידום אורגני (SEO) הוא השקעה לטווח ארוך שמביאה תנועה חינמית. השילוב האופטימלי הוא להתחיל עם PPC ובמקביל לבנות נוכחות אורגנית.",
  },
  {
    q: "כמה זמן לוקח לראות תוצאות בקידום אורגני?",
    a: "תוצאות ראשוניות מתחילות להופיע תוך 2-4 חודשים, אך התוצאות המשמעותיות מגיעות לאחר 6-12 חודשים של עבודה עקבית. SEO הוא מרתון ולא ספרינט.",
  },
  {
    q: "מה משפיע על מחיר קידום האתר?",
    a: "מספר גורמים משפיעים: רמת התחרות בתחום, מצב האתר הנוכחי, היקף המטרות, והאם נדרש גם תוכן, קישורים ועבודה טכנית.",
  },
  {
    q: "מה זה מדד DR ואיך הוא קשור למחיר?",
    a: "DR (Domain Rating) הוא מדד של Ahrefs שמודד את סמכות האתר בסולם 0-100. אתר עם DR גבוה יותר מדורג טוב יותר בגוגל.",
  },
  {
    q: "האם השילוב בין אורגני לממומן באמת הכרחי?",
    a: "לא הכרחי, אך מומלץ מאוד. עסקים שמשלבים את שתי האסטרטגיות רואים תוצאות טובות יותר: PPC מספק לידים מיידיים, בעוד SEO בונה נכס דיגיטלי לטווח ארוך.",
  },
] as const;

export const PRICING_RELATED_SERVICES = [
  {
    href: "/google-ads/",
    title: "פרסום ממומן בגוגל",
    text: "ניהול קמפיינים, מדידה ואופטימיזציה שוטפת",
  },
  {
    href: "/seo/",
    title: "קידום אתרים (SEO)",
    text: "נכס אורגני לטווח ארוך עם תוכן ו-AI",
  },
  {
    href: "/social-media-management/",
    title: "ניהול רשתות חברתיות",
    text: "תוכן, קמפיינים וחיזוק מותג",
  },
  {
    href: "/website-building/",
    title: "בניית אתרים",
    text: "אתרים ודפי נחיתה שמחוברים לשיווק",
  },
  {
    href: "/hosting-plans/",
    title: "אחסון ותחזוקה",
    text: "יציבות, אבטחה ותחזוקה שוטפת",
  },
  {
    href: "/שירותי-שיווק-דיגיטלי/",
    title: "שירותי שיווק דיגיטלי",
    text: "מעטפת מלאה תחת קורת גג אחת",
  },
] as const;

export const PRICING_FINAL_CTA = {
  title: "רוצה הצעת מחיר מדויקת ומותאמת אישית?",
  text: "השאירו פרטים ונחזור אליכם תוך שעות עם הצעת מחיר מפורטת – ללא התחייבות.",
  contactLabel: "צרו קשר עכשיו",
  whatsappLabel: "דברו איתנו בוואטסאפ",
} as const;

export const PRICING_CALCULATOR = {
  sectionTitle: "מחשבון עלויות אינטראקטיבי",
  sectionIntro:
    "כלי משלים להערכת עלויות — בחרו שירותים וקבלו הערכת מחיר מיידית. המחירון למעלה מציג את מחירי ההתחלה המאומתים שלנו.",
  openLabel: "פתחו מחשבון עלויות",
  iframeTitle: "מחשבון מחירי שיווק דיגיטלי",
  iframeSrc:
    "https://a2f55361-9e5b-4902-aac9-a41086cfeb54-krtyyh.sticklight.app/pricing-calculator",
  footerNote: "מחשבון זה פותח על ידי סוכנות Adwrks 365 • פרסום דיגיטלי מבוסס ביצועים",
} as const;
