import type { HubCopy, LocationCopy } from "./types";

export type LocationHeroPatch = {
  h1: string;
  lead: string;
  badge?: string;
};

/** Hero H1 + opening paragraph (2026 fundamental rewrite). URLs and SEO meta unchanged. */
export const LOCATION_HERO_PATCHES_HE: Record<string, LocationHeroPatch> = {
  karmiel: {
    badge: "גליל • שיווק דיגיטלי",
    h1: "חברה לשיווק דיגיטלי בכרמיאל",
    lead:
      "מחפשים דרך להביא יותר לקוחות לעסק בכרמיאל והגליל? Adwrks 365 מציעה שירותי שיווק דיגיטלי לעסקים: פרסום בגוגל, קידום אורגני, פרסום בפייסבוק ובאינסטגרם, בניית אתרים ודפי נחיתה, וליווי אסטרטגי. אנחנו מתאימים את הפעילות לצורכי העסק, לקהל היעד ולתקציב — בליווי אונליין מלא ומעקב אחר פניות.",
  },
  north: {
    h1: "שיווק דיגיטלי בצפון — סוכנות לפרסום וקידום",
    lead:
      "עסקים בצפון פועלים לעיתים עם עונות, קהלים מגוונים וביקוש שמשתנה לפי אזור. Adwrks 365 בונה מעטפת שיווק דיגיטלי: פרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה, ומעקב אחרי פניות — עם התאמה לפי עיר ותחום, בליווי אונליין מלא.",
  },
  krayot: {
    h1: "חברה לשיווק דיגיטלי בקריות",
    lead:
      "לקוחות רבים בקריות מחפשים בגוגל, במפות או דרך מודעה מקומית לפני שפונים לעסק. Adwrks 365 מסייעת לעסקים בקידום אורגני, פרסום בגוגל, פרסום בפייסבוק ובאינסטגרם, שיפור פרופיל עסקי, בניית דפי נחיתה ואתרים — כדי שהשיחה והטופס יגיעו אליכם, לא למתחרה הסמוך.",
  },
  center: {
    h1: "שיווק דיגיטלי במרכז — מעטפת לעסקים בגוש דן",
    lead:
      "במרכז חשוב לבחור ערוץ ומסר נכון לפני שמוציאים תקציב. Adwrks 365 מלווה עסקים בפרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה, אסטרטגיה ומדידת פניות — עם שקיפות ועבודה מרחוק לכל הארץ.",
  },
  sharon: {
    h1: "סוכנות שיווק דיגיטלי בשרון",
    lead:
      "הרצליה, נתניה, חדרה, כפר סבא ורעננה — כל עיר עם קהל שונה. Adwrks 365 מתאימה פרסום בגוגל, קידום אורגני, פרסום בפייסבוק ובאינסטגרם, בניית אתרים ודפי נחיתה לפי היישוב והמטרה, עם ליווי אישי ומעקב אחר תוצאות.",
  },
  south: {
    h1: "שיווק דיגיטלי בדרום — פרסום דיגיטלי לנגב והחוף",
    lead:
      "מפעל באשדוד, שירות בבאר שבע או אירוח באשקלון דורשים גישה שונה בשיווק. Adwrks 365 מגדירה פרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה לפי אזור ומטרה — ומודדת פניות, לא רק חשיפות.",
  },
  haifa: {
    h1: "חברה לשיווק דיגיטלי בחיפה",
    lead:
      "בחיפה עסק אחד לפעמים פונה לכמה סוגי לקוחות — B2B, שירות מקומי וקמעונאות. Adwrks 365 משלבת פרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה, וליווי שיווקי אונליין עם דגש על פניות רלוונטיות.",
  },
  "tel-aviv": {
    badge: "תל אביב • שיווק דיגיטלי",
    h1: "חברה לשיווק דיגיטלי בתל אביב",
    lead:
      "מחפשים יותר לקוחות לעסק בתל אביב? Adwrks 365 בונה קמפיינים בגוגל וב-Meta, קידום אורגני, בניית אתרים ודפי נחיתה, ושיפור מעקב אחרי פניות — עם התאמה למטרות העסק ולתקציב שלכם, בלי הבטחות שלא ניתן למדוד.",
  },
  jerusalem: {
    h1: "חברה לשיווק דיגיטלי בירושלים",
    lead:
      "לקוחות בירושלים לעיתים צריכים זמן וביטחון לפני פנייה. Adwrks 365 משלבת תוכן וקידום אורגני, פרסום בגוגל לכוונה גבוהה, פרסום ב-Meta כשזה מתאים, בניית אתרים ודפי נחיתה — תמיד עם מדידה וליווי דיגיטלי מרחוק.",
  },
  "beer-sheva": {
    h1: "שיווק דיגיטלי בבאר שבע — סוכנות מרחוק",
    lead:
      "עסקים בבאר שבע והנגב זקוקים לנוכחות דיגיטלית שמדברת לקהל הנכון. Adwrks 365 מציעה פרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה, אסטרטגיה ומעקב פניות — מהצוות שלנו אונליין, בלי משרד פיזי בעיר.",
  },
  netanya: {
    h1: "משרד פרסום דיגיטלי בנתניה — שיווק דיגיטלי לעסקים",
    lead:
      "מחפשים להביא יותר פניות לעסק בנתניה? בעיר פועלים מסעדות, חנויות, קליניקות, נדל״ן ועסקי אירוח ליד הים — ולעיתים נדרש מסר שונה לתושבים ולאורחים. Adwrks 365 מסייעת בפרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה, עם ליווי ומעקב אחר פניות.",
  },
  "ramat-gan": {
    h1: "חברה לשיווק דיגיטלי ברמת גן",
    lead:
      "רמת גן צמודה לתל אביב, אך קהל היעד והמסר העסקי שונים. Adwrks 365 מתמקדת בקידום מקומי, פרסום בגוגל בשטח רלוונטי, פרסום ב-Meta, בניית אתרים ודפי נחיתה — עם מסר שמבדיל אתכם ומדידה של טפסים ושיחות.",
  },
  "petah-tikva": {
    h1: "שיווק דיגיטלי בפתח תקווה — חברה לפרסום דיגיטלי",
    lead:
      "עיר גדולה דורשת פילוח בין תעשייה, מסחר ושירותים לשכונות. Adwrks 365 מתאימה פרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה למטרות שלכם — עם ליווי אונליין ודגש על פניות שמתאימות לקהל.",
  },
  "rishon-lezion": {
    h1: "שיווק דיגיטלי בראשון לציון — מעטפת לעסקים בגוש דן",
    lead:
      "מחפשים לחזק את הנוכחות הדיגיטלית בראשון לציון? Adwrks 365 מספקת פרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה, ושיפור המרות — עם התמקדות בקהל מקומי ובתקציב הגיוני, בליווי מרחוק.",
  },
  holon: {
    h1: "שיווק דיגיטלי בחולון — פניות מהעיר והסביבה",
    lead:
      "שירותים בחולון נסגרים בחיפוש מקומי ובמפות. Adwrks 365 מחזקת נוכחות בגוגל, פרסום ממוקד, פרסום ב-Meta, בניית אתרים ודפי נחיתה שמסבירים מחיר וזמינות — עם מעקב אחר פניות מהאזור.",
  },
  "bat-yam": {
    h1: "שיווק דיגיטלי בבת ים — לעסקים בעיר ובחוף",
    lead:
      "בת ים משלבת חוף, מגורים ומסחר עם שינויי עונה. Adwrks 365 בונה שיווק דיגיטלי גמיש: קידום אורגני, פרסום בגוגל וב-Meta, בניית אתרים ודפי נחיתה — עם מעקב פניות וליווי אישי, בלי הבטחות שלא ניתן למדוד.",
  },
  akko: {
    h1: "שיווק דיגיטלי בעכו — תיירות ושירות מקומי",
    lead:
      "עכו משלבת תיירות וקהילה מקומית. Adwrks 365 מתאימה תוכן, קידום אורגני, פרסום בגוגל וב-Meta, בניית אתרים ודפי נחיתה לקהל הנכון בעונה הנכונה — בליווי דיגיטלי מלא.",
  },
  hadera: {
    h1: "סוכנות שיווק דיגיטלי בחדרה",
    lead:
      "חדרה בצומת שרון–צפון — חשוב לדעת אם פונים ללקוח מקומי או ארצי. Adwrks 365 בונה מעטפת של פרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה, עם אסטרטגיה ומדידת פניות לפי הקהל שלכם.",
  },
  afula: {
    h1: "שיווק דיגיטלי בעפולה — חברה לקידום ופרסום",
    lead:
      "בעמק יזרעאל רבים מחפשים בגוגל לפני שיחה. Adwrks 365 מחזקת קידום מקומי, פרסום בגוגל לכוונה גבוהה, פרסום ב-Meta, בניית אתרים ודפי נחיתה — עם ליווי מרחוק ודוחות שקופים.",
  },
  herzliya: {
    h1: "חברה לשיווק דיגיטלי בהרצליה",
    lead:
      "מחפשים דרך להביא יותר לקוחות לעסק בהרצליה? Adwrks 365 מציעה שירותי שיווק דיגיטלי לעסקים, כולל פרסום בגוגל, קידום אורגני, פרסום בפייסבוק ובאינסטגרם, בניית אתרים ודפי נחיתה. אנחנו מתאימים את הפעילות לצורכי העסק, לקהל היעד ולתקציב, עם ליווי אישי ומעקב אחר התוצאות.",
  },
  "kfar-saba": {
    h1: "שיווק דיגיטלי בכפר סבא — סוכנות דיגיטלית מרחוק",
    lead:
      "שירותים בכפר סבא נסגרים במפות, ביקורות ובחיפוש מקומי. Adwrks 365 משלבת קידום אורגני, פרסום בגוגל, פרסום ב-Meta, שיפור אתרים ודפי נחיתה — עם מעקב אחר פניות לפי סוג העסק.",
  },
  raanana: {
    h1: "שיווק דיגיטלי ברעננה — סוכנות עם מדידה שקופה",
    lead:
      "קהל ברעננה מחפש אמון לפני פנייה. Adwrks 365 בונה תוכן, קידום אורגני, קמפיינים מדויקים בגוגל וב-Meta, אתרים ודפי נחיתה — בליווי אונליין ארצי עם מדידה ברורה.",
  },
  ashdod: {
    h1: "שיווק דיגיטלי באשדוד — פרסום דיגיטלי לעסקים",
    lead:
      "אשדוד משלב נמל, תעשייה ושירותים עירוניים. Adwrks 365 מפרידה בין מסלולי B2B ו-B2C עם פרסום בגוגל, קידום אורגני, פרסום ב-Meta, בניית אתרים ודפי נחיתה, ומעקב בנתוני פניות.",
  },
  ashkelon: {
    h1: "שיווק דיגיטלי באשקלון — ליווי דיגיטלי מהחוף והעיר",
    lead:
      "תעשייה, חוף ושירותים באשקלון משתנים לפי עונה. Adwrks 365 מציעה פרסום בגוגל, קידום מקומי, פרסום ב-Meta, בניית אתרים ודפי נחיתה — בליווי מרחוק, עם דגש על פניות מדידות.",
  },
};

export const HUB_HERO_PATCH_HE: LocationHeroPatch = {
  h1: "שיווק דיגיטלי בכל הארץ — בחרו אזור שירות",
  lead:
    "Adwrks 365 מלווה עסקים בכל רחבי ישראל בשיווק דיגיטלי: פרסום בגוגל, קידום אורגני, פרסום בפייסבוק ובאינסטגרם, בניית אתרים ודפי נחיתה, אסטרטגיה ומעקב אחר פניות. העבודה מתבצעת אונליין — בחרו אזור לפרטים מקומיים או צרו קשר לייעוץ כללי.",
};

export const LOCATION_HERO_PATCHES_EN: Record<string, LocationHeroPatch> = {
  karmiel: {
    h1: "Digital marketing agency in Karmiel",
    lead:
      "Looking for more customers for your business in Karmiel and the Galilee? Adwrks 365 provides Google Ads, SEO, Facebook and Instagram ads, websites and landing pages, and ongoing marketing strategy. We align channels, audience, and budget — with full remote support and lead tracking.",
  },
  north: {
    h1: "Digital marketing in Northern Israel",
    lead:
      "Northern businesses often deal with seasons, varied audiences, and demand that shifts by area. Adwrks 365 builds a digital marketing mix: Google Ads, SEO, Meta, websites and landing pages, and inquiry tracking — tuned by city and industry, fully online.",
  },
  krayot: {
    h1: "Digital marketing agency in the Krayot",
    lead:
      "Many customers in the Krayot search on Google, Maps, or a local ad before they call a business. Adwrks 365 helps with local SEO, Google Ads, Meta, Business Profile, landing pages, and websites — so inquiries reach you, not the shop next door.",
  },
  center: {
    h1: "Digital marketing in Central Israel",
    lead:
      "In the center, channel and message matter before budget goes live. Adwrks 365 supports businesses with Google Ads, SEO, Meta, websites and landing pages, strategy, and lead measurement — transparent remote work nationwide.",
  },
  sharon: {
    h1: "Digital marketing agency in the Sharon",
    lead:
      "Herzliya, Netanya, Hadera, Kfar Saba, and Raanana each attract different buyers. Adwrks 365 tailors Google Ads, SEO, Meta, websites, and landing pages per town and goal — with personal guidance and results tracking.",
  },
  south: {
    h1: "Digital marketing in the South",
    lead:
      "Industry in Ashdod, services in Beer Sheva, and coastal hospitality in Ashkelon need different marketing paths. Adwrks 365 sets up Google Ads, SEO, Meta, websites, and landing pages by area and goal — measuring inquiries, not vanity views.",
  },
  haifa: {
    h1: "Digital marketing agency in Haifa",
    lead:
      "Haifa often mixes B2B, local services, and retail in one business. Adwrks 365 combines Google Ads, SEO, Meta, websites and landing pages, and marketing guidance with a focus on qualified inquiries — fully remote.",
  },
  "tel-aviv": {
    h1: "Digital marketing agency in Tel Aviv",
    lead:
      "Need more customers in Tel Aviv? Adwrks 365 builds Google and Meta campaigns, SEO, websites and landing pages, and clearer inquiry tracking — aligned with your goals and budget, without unmeasurable promises.",
  },
  jerusalem: {
    h1: "Digital marketing agency in Jerusalem",
    lead:
      "Jerusalem buyers often need trust before they reach out. Adwrks 365 blends content and SEO, high-intent Google Ads, Meta when relevant, websites and landing pages — always measured, always remote.",
  },
  "beer-sheva": {
    h1: "Digital marketing in Beer Sheva",
    lead:
      "Beer Sheva and Negev businesses need messaging that fits the right audience. Adwrks 365 offers Google Ads, SEO, Meta, websites and landing pages, strategy, and inquiry tracking — online from our team, with no city office.",
  },
  netanya: {
    h1: "Digital marketing in Netanya",
    lead:
      "Looking for more inquiries in Netanya? The city has restaurants, shops, clinics, real estate, and hospitality by the sea — and you may need different messaging for residents versus visitors. Adwrks 365 provides Google Ads, SEO, Meta, websites, and landing pages, with guidance and lead tracking.",
  },
  "ramat-gan": {
    h1: "Digital marketing agency in Ramat Gan",
    lead:
      "Ramat Gan sits next to Tel Aviv but the audience and positioning differ. Adwrks 365 focuses on local SEO, relevant Google Ads, Meta, websites and landing pages — clear messaging plus form and call measurement.",
  },
  "petah-tikva": {
    h1: "Digital marketing in Petah Tikva",
    lead:
      "A large city needs separate paths for industry, retail, and neighborhood services. Adwrks 365 aligns Google Ads, SEO, Meta, websites, and landing pages to your goals — remote support with audience-fit inquiries.",
  },
  "rishon-lezion": {
    h1: "Digital marketing agency in Rishon LeZion",
    lead:
      "Want a stronger digital presence in Rishon LeZion? Adwrks 365 delivers Google Ads, SEO, Meta, websites and landing pages, and conversion improvements — focused on local buyers and sensible budgets, remotely.",
  },
  holon: {
    h1: "Digital marketing in Holon",
    lead:
      "Holon services close on local search and Maps. Adwrks 365 strengthens Google presence, targeted ads, Meta, websites and landing pages that explain price and availability — with area lead tracking.",
  },
  "bat-yam": {
    h1: "Digital marketing agency in Bat Yam",
    lead:
      "Bat Yam mixes coast, housing, and retail with seasonal swings. Adwrks 365 builds flexible digital marketing: SEO, Google and Meta ads, websites and landing pages — with inquiry tracking and personal guidance.",
  },
  akko: {
    h1: "Digital marketing in Akko",
    lead:
      "Akko blends tourism and a local community. Adwrks 365 adapts content, SEO, Google and Meta ads, websites and landing pages to the right audience in the right season — full remote delivery.",
  },
  hadera: {
    h1: "Digital marketing in Hadera",
    lead:
      "Hadera sits between the Sharon and the north — local and national buyers need different funnels. Adwrks 365 provides Google Ads, SEO, Meta, websites and landing pages, strategy, and lead measurement for your audience.",
  },
  afula: {
    h1: "Digital marketing in Afula",
    lead:
      "In the Jezreel Valley, many buyers search on Google before they call. Adwrks 365 strengthens local SEO, focused Google Ads, Meta, websites and landing pages — remote team, transparent reporting.",
  },
  herzliya: {
    h1: "Digital marketing agency in Herzliya",
    lead:
      "Looking for more customers in Herzliya? Adwrks 365 offers Google Ads, SEO, Facebook and Instagram ads, websites and landing pages, and marketing strategy. We match activity to your business, audience, and budget — with personal guidance and results tracking.",
  },
  "kfar-saba": {
    h1: "Digital marketing in Kfar Saba",
    lead:
      "Kfar Saba services close on Maps, reviews, and local search. Adwrks 365 combines SEO, Google Ads, Meta, site and landing page improvements — with inquiry tracking by business type.",
  },
  raanana: {
    h1: "Digital marketing agency in Raanana",
    lead:
      "Raanana buyers look for trust before they inquire. Adwrks 365 builds content, SEO, precise Google and Meta campaigns, websites and landing pages — nationwide remote delivery with clear measurement.",
  },
  ashdod: {
    h1: "Digital marketing in Ashdod",
    lead:
      "Ashdod combines port activity, industry, and city services. Adwrks 365 separates B2B and B2C paths with Google Ads, SEO, Meta, websites and landing pages, and analytics on inquiries.",
  },
  ashkelon: {
    h1: "Digital marketing agency in Ashkelon",
    lead:
      "Industry, coast, and city services in Ashkelon shift by season. Adwrks 365 offers Google Ads, local SEO, Meta, websites and landing pages — remote delivery focused on measurable inquiries.",
  },
};

export const HUB_HERO_PATCH_EN: LocationHeroPatch = {
  h1: "Digital marketing across Israel — pick your area",
  lead:
    "Adwrks 365 supports businesses nationwide with Google Ads, SEO, social ads, websites and landing pages, strategy, and lead tracking. Work is fully online — choose an area for local detail or contact us for general guidance.",
};

export function applyLocationHeroPatchesHe(table: Record<string, LocationCopy>): void {
  for (const [id, patch] of Object.entries(LOCATION_HERO_PATCHES_HE)) {
    const row = table[id];
    if (!row) continue;
    row.h1 = patch.h1;
    row.lead = patch.lead;
    if (patch.badge) row.badge = patch.badge;
  }
}

export function applyLocationHeroPatchesEn(table: Record<string, LocationCopy>): void {
  for (const [id, patch] of Object.entries(LOCATION_HERO_PATCHES_EN)) {
    const row = table[id];
    if (!row) continue;
    row.h1 = patch.h1;
    row.lead = patch.lead;
    if (patch.badge) row.badge = patch.badge;
  }
}

export function applyHubHeroPatchHe(hub: HubCopy): void {
  hub.h1 = HUB_HERO_PATCH_HE.h1;
  hub.lead = HUB_HERO_PATCH_HE.lead;
}

export function applyHubHeroPatchEn(hub: HubCopy): void {
  hub.h1 = HUB_HERO_PATCH_EN.h1;
  hub.lead = HUB_HERO_PATCH_EN.lead;
}

/** For QA / rollout report — runtime truth is patched copy. */
export const LOCATION_PAGE_IDS = Object.keys(LOCATION_HERO_PATCHES_HE);