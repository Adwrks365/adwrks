import type { LocationCopy } from "./types";

export type LocalContentPatch = Partial<LocationCopy>;

function ctaHe(placeLabel: string, contactIn = placeLabel): LocalContentPatch {
  return {
    midCtaEyebrow: "ייעוץ שיווקי",
    finalCtaEyebrow: "ייעוץ שיווקי",
    popupCta: "ייעוץ שיווקי",
    contactTitle: `ייעוץ שיווקי לעסקים ב${contactIn}`,
    contactIntro: `ספרו על העסק והמטרות ב${placeLabel}. נחזור עם כיוון ראשוני לערוצים ולתקציב — בלי התחייבות.`,
    finalCtaTitle: "נתאים יחד את התוכנית לעסק שלכם",
    finalCtaBody: "ספרו בקצרה על העסק והקהל שאתם מחפשים — נחזור אליכם עם המלצה מעשית.",
    popupHeadline: `רוצים לחזק את השיווק הדיגיטלי ב${placeLabel}?`,
    popupDescription: "ספרו על העסק, הקהל והמטרות. נדבר על ערוצים הגיוניים ומה כדאי למדוד.",
  };
}

function ctaEn(placeLabel: string, contactIn = placeLabel): LocalContentPatch {
  return {
    midCtaEyebrow: "Marketing consultation",
    finalCtaEyebrow: "Marketing consultation",
    popupCta: "Marketing consultation",
    contactTitle: `Digital marketing consultation for businesses in ${contactIn}`,
    contactIntro: `Tell us about your business and goals in ${placeLabel}. We will reply with an initial direction on channels and budget — no obligation.`,
    finalCtaTitle: "Let's shape a plan that fits your business",
    finalCtaBody: "Briefly describe your business and ideal customers — we will follow up with practical next steps.",
    popupHeadline: `Want stronger digital marketing in ${placeLabel}?`,
    popupDescription: "Tell us about your business, audience, and goals. We will discuss sensible channels and what to measure.",
  };
}

/** Per-page content fixes — CTAs + challenges + card text (display layer). */
const LOCAL_HE: Record<string, LocalContentPatch> = {
  karmiel: {
    ...ctaHe("כרמיאל"),
    cardText: "שיווק דיגיטלי לעסקים בכרמיאל והגליל — שירותים, תעשייה ומסחר מקומי.",
  },
  north: { ...ctaHe("צפון הארץ", "צפון"), cardText: "מעטפת שיווק דיגיטלי לעסקים בגליל ובצפון — לפי עיר, קהל ועונה." },
  krayot: { ...ctaHe("קריות"), cardText: "שיווק דיגיטלי לעסקים בקריות — שירותים מקומיים ומסחר בשכונות." },
  center: { ...ctaHe("מרכז", "גוש דן"), cardText: "שיווק דיגיטלי לעסקים במרכז — מגוון ערוצים ומסרים לפי סוג עסק." },
  sharon: { ...ctaHe("שרון"), cardText: "שיווק דיגיטלי לעסקים בשרון — פילוח לפי עיר וקהל." },
  south: { ...ctaHe("דרום", "הדרום"), cardText: "שיווק דיגיטלי לעסקים בדרום — תעשייה, שירותים ואירוח בחוף." },
  haifa: {
    ...ctaHe("חיפה"),
    cardText: "שיווק דיגיטלי לעסקים בחיפה — B2B, שירותים מקומיים ומסחר.",
    challengesIntro:
      "בחיפה עסקים רבים פונים ליותר מסוג קהל אחד. חשוב שכל ערוץ ודף יסביר בבירור מה מציעים ולמי.",
  },
  "tel-aviv": { ...ctaHe("תל אביב"), cardText: "שיווק דיגיטלי לעסקים בתל אביב — מגוון ערוצים לפי מטרה ותקציב." },
  jerusalem: { ...ctaHe("ירושלים"), cardText: "שיווק דיגיטלי לעסקים בירושלים — תוכן, פרסום ומדידת פניות." },
  afula: {
    ...ctaHe("עפולה"),
    cardText: "שיווק דיגיטלי לעסקים בעפולה והעמק — שירותים, מסחר, בריאות ותעשייה.",
    challengesTitle: "איך מגיעים ליותר לקוחות בעפולה והסביבה?",
    challengesIntro:
      "בעמק יזרעאל יש עסקים שמשרתים תושבים מקומיים ויש כאלה שמגיעים מלקוחות בכל הארץ. חשוב שהאתר והקמפיינים יסבירו במהירות מה אתם מציעים, למי ואיפה אתם פעילים.",
    challengesPoints: [
      "קידום האתר בחיפושים רלוונטיים לעפולה ולאזור השירות",
      "הפרדה בין מסר ללקוח מקומי לבין מסר ללקוח ארצי",
      "דפים ותוכן שמסבירים הצעה ברורה",
      "מדידת פניות כדי לראות מה באמת מביא תוצאות",
    ],
    servicesIntro:
      "קידום מקומי בגוגל, פרסום ממוקד, פרסום ב-Meta, דפי נחיתה ואתרים — לפי קהל מקומי או ארצי.",
  },
  herzliya: {
    ...ctaHe("הרצליה"),
    cardText: "שיווק דיגיטלי לעסקים בהרצליה — טכנולוגיה, שירותים ומסחר מקומי.",
    challengesTitle: "איך מעבירים מסר ברור לקהל תובעני?",
    challengesIntro:
      "בהרצליה גולשים לרוב משווים בין כמה אפשרויות לפני פנייה. הצעה ברורה, דף מהיר ותוכן שמסביר ערך — עוזרים להעביר אמון.",
    challengesPoints: [
      "מסר שיווקי חד שלא נשען על סיסמאות כלליות",
      "דפי נחיתה ואתר שמסבירים מחיר, תהליך והבדלה",
      "תוכן וקידום אורגני לשאלות לפני קנייה",
      "מדידת טפסים ושיחות כדי לשפר באופן שוטף",
    ],
  },
  "rishon-lezion": {
    ...ctaHe("ראשון לציון"),
    cardText: "שיווק דיגיטלי לעסקים בראשון לציון — מסחר, שירותים ותעשייה קלה.",
    midCtaTitle: "רוצים יותר פניות מקומיות בראשון לציון?",
  },
  "ramat-gan": { ...ctaHe("רמת גן"), cardText: "שיווק דיגיטלי לעסקים ברמת גן — שירותים, B2B ומסחר ליד גוש דן." },
  netanya: { ...ctaHe("נתניה"), cardText: "שיווק דיגיטלי לעסקים בנתניה — מקומי, נדל״ן, מסחר ואירוח ליד הים." },
  hadera: { ...ctaHe("חדרה"), cardText: "שיווק דיגיטלי לעסקים בחדרה — לקוחות מקומיים ולקוחות ארציים." },
  "beer-sheva": { ...ctaHe("באר שבע"), cardText: "שיווק דיגיטלי לעסקים בבאר שבע והנגב — שירותים, הייטק ומסחר." },
  ashdod: { ...ctaHe("אשדוד"), cardText: "שיווק דיגיטלי לעסקים באשדוד — נמל, תעשייה ושירותים עירוניים." },
  ashkelon: {
    ...ctaHe("אשקלון"),
    cardText: "שיווק דיגיטלי לעסקים באשקלון — חוף, תעשייה ושירותים מקומיים.",
    challengesTitle: "חוף, תעשייה ושירותים — איך בוחרים ערוץ נכון?",
    challengesIntro:
      "באשקלון פועלים עסקי חוף, מפעלים ושירותים לתושבים. לכל סוג עסק יש מסלול שיווקי אחר — עדיף לא לערבב הכל באותו מסר.",
  },
  "petah-tikva": {
    ...ctaHe("פתח תקווה"),
    cardText: "שיווק דיגיטלי לעסקים בפתח תקווה — פילוח לפי שכונה ותחום.",
    challengesTitle: "איך מגיעים לפניות מהאזורים שבאמת משרתים אתכם?",
    challengesIntro:
      "פתח תקווה משלבת אזורי תעשייה, שכונות מגורים ומסחר. מודעות ותוכן שלא מציינים לאן אתם פונים מביאים פניות שלא מתאימות.",
  },
  holon: { ...ctaHe("חולון"), cardText: "שיווק דיגיטלי לעסקים בחולון — שירותים מקומיים ומסחר." },
  "bat-yam": {
    ...ctaHe("בת ים"),
    cardText: "שיווק דיגיטלי לעסקים בבת ים — חוף, מגורים ומסחר.",
    challengesTitle: "חוף ועיר — איך מתאימים את השיווק לקהל שלכם?",
    challengesIntro:
      "בבת ים יש עסקים שמסתמכים על קהל חופי ועסקים שפונים לתושבים קבועים. כדאי להפריד מסרים, עונות ומדידה.",
  },
  akko: {
    ...ctaHe("עכו"),
    cardText: "שיווק דיגיטלי לעסקים בעכו — תיירות ושירותים לקהל המקומי.",
    challengesTitle: "תיירות וקהילה מקומית — איך מפרידים בין מסרים?",
    challengesIntro:
      "עסקים בעכו לעיתים פונים גם לתיירים וגם לתושבים. אתר וקמפיינים צריכים להיות ברורים בשפה, בהצעה ובאזור השירות.",
  },
  "kfar-saba": {
    ...ctaHe("כפר סבא"),
    cardText: "שיווק דיגיטלי לעסקים בכפר סבא — שירותים לתושבים ומסחר מקומי.",
    challengesTitle: "איך מגיעים ללקוחות שמחפשים שירות בכפר סבא?",
    challengesPoints: [
      "נוכחות בגוגל מפות ובחיפוש מקומי",
      "ביקורות ודף שמסביר מחיר וזמינות",
      "מודעות ממוקדות באזור השירות",
      "אתר נוח לשימוש בנייד",
    ],
  },
  raanana: { ...ctaHe("רעננה"), cardText: "שיווק דיגיטלי לעסקים ברעננה — שירותים איכותיים ומסחר מקומי." },
};

const LOCAL_EN: Record<string, LocalContentPatch> = {
  karmiel: { ...ctaEn("Karmiel"), cardText: "Digital marketing for businesses in Karmiel and the Galilee." },
  north: { ...ctaEn("Northern Israel", "the north"), cardText: "Digital marketing for businesses across the Galilee and north." },
  krayot: { ...ctaEn("the Krayot"), cardText: "Digital marketing for businesses in the Krayot — local services and retail." },
  center: { ...ctaEn("Central Israel", "Gush Dan"), cardText: "Digital marketing for businesses in central Israel." },
  sharon: { ...ctaEn("the Sharon"), cardText: "Digital marketing for Sharon businesses — split by town and audience." },
  south: { ...ctaEn("the south", "southern Israel"), cardText: "Digital marketing for businesses in the south — industry, services, and coast." },
  haifa: {
    ...ctaEn("Haifa"),
    cardText: "Digital marketing for Haifa businesses — B2B, local services, and retail.",
    challengesIntro:
      "In Haifa, many businesses speak to more than one audience. Each channel and page should state clearly what you offer and for whom.",
  },
  "tel-aviv": { ...ctaEn("Tel Aviv"), cardText: "Digital marketing for Tel Aviv businesses — channels matched to goals." },
  jerusalem: { ...ctaEn("Jerusalem"), cardText: "Digital marketing for Jerusalem businesses — content, ads, and measurement." },
  afula: {
    ...ctaEn("Afula"),
    cardText: "Digital marketing for businesses in Afula and the Jezreel Valley.",
    challengesTitle: "How do you reach more customers in Afula and nearby?",
    challengesIntro:
      "In the Jezreel Valley, some businesses serve local residents and others sell nationwide. Your site and campaigns should spell out what you offer, for whom, and where you operate.",
    challengesPoints: [
      "SEO for searches that matter in Afula and your service area",
      "Separate messaging for local vs nationwide buyers",
      "Pages that explain the offer clearly",
      "Lead measurement so you know what works",
    ],
    servicesIntro:
      "Local SEO, focused Google Ads, Meta, landing pages, and websites — for local or nationwide audiences.",
  },
  herzliya: {
    ...ctaEn("Herzliya"),
    cardText: "Digital marketing for Herzliya businesses — tech, services, and local trade.",
    challengesTitle: "How do you deliver a clear message to a demanding audience?",
    challengesIntro:
      "In Herzliya, buyers often compare several options before they inquire. A clear offer, fast pages, and credible content help build trust.",
    challengesPoints: [
      "Sharp copy instead of generic slogans",
      "Landing pages that explain price, process, and differentiation",
      "Content and SEO for pre-sale questions",
      "Form and call tracking for steady improvement",
    ],
  },
  "rishon-lezion": { ...ctaEn("Rishon LeZion"), cardText: "Digital marketing for businesses in Rishon LeZion." },
  "ramat-gan": { ...ctaEn("Ramat Gan"), cardText: "Digital marketing for Ramat Gan businesses near Gush Dan." },
  netanya: { ...ctaEn("Netanya"), cardText: "Digital marketing for Netanya businesses — local trade, real estate, and hospitality." },
  hadera: { ...ctaEn("Hadera"), cardText: "Digital marketing for Hadera businesses — local and nationwide buyers." },
  "beer-sheva": { ...ctaEn("Beer Sheva"), cardText: "Digital marketing for Beer Sheva and Negev businesses." },
  ashdod: { ...ctaEn("Ashdod"), cardText: "Digital marketing for Ashdod businesses — port, industry, and city services." },
  ashkelon: {
    ...ctaEn("Ashkelon"),
    cardText: "Digital marketing for Ashkelon businesses — coast, industry, and services.",
    challengesTitle: "Coast, industry, and services — how do you pick the right channel?",
    challengesIntro:
      "Ashkelon has coastal businesses, plants, and home services. Each needs a different marketing path — mixing everything into one message rarely works.",
  },
  "petah-tikva": {
    ...ctaEn("Petah Tikva"),
    cardText: "Digital marketing for Petah Tikva businesses.",
    challengesTitle: "How do you win inquiries in the neighborhoods you actually serve?",
    challengesIntro:
      "Petah Tikva mixes industrial zones, residential neighborhoods, and retail. Ads and content that do not say who you serve attract the wrong leads.",
  },
  holon: { ...ctaEn("Holon"), cardText: "Digital marketing for Holon local services and retail." },
  "bat-yam": {
    ...ctaEn("Bat Yam"),
    cardText: "Digital marketing for Bat Yam businesses — coast and city retail.",
    challengesTitle: "Coast and city — how do you match marketing to your audience?",
    challengesIntro:
      "Some Bat Yam businesses rely on beach-season traffic; others serve year-round residents. Separate messaging, seasons, and measurement help.",
  },
  akko: {
    ...ctaEn("Akko"),
    cardText: "Digital marketing for Akko — tourism and local services.",
    challengesTitle: "Tourism and local community — how do you split messaging?",
    challengesIntro:
      "Akko businesses often speak to visitors and residents. Your site and campaigns should be clear in language, offer, and service area.",
  },
  "kfar-saba": {
    ...ctaEn("Kfar Saba"),
    cardText: "Digital marketing for Kfar Saba home services and local retail.",
    challengesTitle: "How do you reach customers searching in Kfar Saba?",
    challengesPoints: [
      "Google Maps and local search presence",
      "Reviews and pages that explain price and availability",
      "Ads focused on your service area",
      "Mobile-friendly site experience",
    ],
  },
  raanana: { ...ctaEn("Ra'anana"), cardText: "Digital marketing for Ra'anana quality-led businesses." },
};

function mergeLocal(copy: LocationCopy, patch: LocalContentPatch): void {
  for (const [key, val] of Object.entries(patch)) {
    if (val === undefined) continue;
    (copy as Record<string, unknown>)[key] = val;
  }
}

export function applyLocationLocalContent2026He(table: Record<string, LocationCopy>): void {
  for (const [id, patch] of Object.entries(LOCAL_HE)) {
    const row = table[id];
    if (!row) continue;
    mergeLocal(row, patch);
  }
}

export function applyLocationLocalContent2026En(table: Record<string, LocationCopy>): void {
  for (const [id, patch] of Object.entries(LOCAL_EN)) {
    const row = table[id];
    if (!row) continue;
    mergeLocal(row, patch);
  }
}