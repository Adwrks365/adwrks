import type { HubCopy, LocationCopy } from "./types";

export type LocationHeroPatch = {
  h1: string;
  lead: string;
  badge?: string;
};

/** Hero H1 + lead refresh (2026) — commercial, varied; URLs/meta unchanged. */
export const LOCATION_HERO_PATCHES_HE: Record<string, LocationHeroPatch> = {
  karmiel: {
    badge: "גליל • שיווק דיגיטלי",
    h1: "חברה לשיווק דיגיטלי בכרמיאל",
    lead:
      "Adwrks 365 מלווה עסקים בכרמיאל ובגליל ב-Google Ads, קידום אורגני (SEO), פרסום ב-Meta ומדידה ב-GA4. הליווי דיגיטלי מלא — בלי להציג משרד בעיר, עם התאמה לתחרות מול חיפה והמרכז.",
  },
  north: {
    h1: "שיווק דיגיטלי בצפון — סוכנות לפרסום וקידום",
    lead:
      "תיירות, תעשייה ושירותים בגליל ובצפון דורשים עונות, מסרים וערוצים שונים. אנחנו בונים מעטפת שיווק דיגיטלי: חיפוש ממומן, SEO, מדיה חברתית ודפי המרה — עם דוחות ברורים ועבודה מרחוק.",
  },
  krayot: {
    h1: "חברה לשיווק דיגיטלי בקריות",
    lead:
      "בקריות רוב הפניות מתחילות בגוגל, במפות או במודעה מקומית. אנחנו מחזקים פרופיל עסקי, SEO מקומי, Google Ads ברדיוס ו-Meta — כדי שיעברו אליכם, לא למתחרה השכנ.",
  },
  center: {
    h1: "שיווק דיגיטלי במרכז — מעטפת לעסקים בגוש דן",
    lead:
      "במרכז עלות הקליק גבוהה; חשוב לבחור ערוצים ומסר, לא «הכול בבת אחת». Adwrks 365 מספקת Google Ads, SEO, סושיאל ואופטימיזציה לדפים — עם שקיפות ומדידה, בליווי אונליין.",
  },
  sharon: {
    h1: "סוכנות שיווק דיגיטלי בשרון",
    lead:
      "הרצליה, כפר סבא, רעננה ונתניה מייצרות קהלים שונים — הייטק, משפחות, נדל״ן ומסחר. אנחנו מתאימים שיווק דיגיטלי לפי עיר וקהל: PPC, SEO, Meta ותוכן, בלי תבנית אחת לכל השרון.",
  },
  south: {
    h1: "שיווק דיגיטלי בדרום — פרסום דיגיטלי לנגב והחוף",
    lead:
      "מפעל באשדוד, שירות בבאר שבע או אירוח באשקלון — לא אותה אסטרטגיה. אנחנו מגדירים Google Ads, SEO ו-Meta לפי אזור ומטרה, עם מדידת פניות ולא רק חשיפות.",
  },
  haifa: {
    h1: "חברה לשיווק דיגיטלי בחיפה",
    lead:
      "בחיפה צריך להפריד בין B2B, שירות מקומי וקהלים שונים — מודעה אחת לא מספיקה. Adwrks 365 משלבת Google Ads, SEO, רשתות חברתיות ושיפור דפים, בליווי מרחוק ועם דגש על פניות איכותיות.",
  },
  "tel-aviv": {
    badge: "תל אביב • שיווק דיגיטלי",
    h1: "חברה לשיווק דיגיטלי בתל אביב",
    lead:
      "בתל אביב התחרות על מילות מפתח יקרה. אנחנו בונים קמפיינים בגוגל ו-Meta, קידום אורגני ודפי המרה מהירים — עם מעקב המרות ושיפור שוטף, בלי להבטיח אחוזי צמיחה קבועים.",
  },
  jerusalem: {
    h1: "חברה לשיווק דיגיטלי בירושלים",
    lead:
      "בירושלים לעיתים נדרש זמן עד לפנייה. אנחנו משלבים SEO ותוכן שבונים אמון, Google Ads לכוונה חמה ו-Meta כשזה מתאים — תמיד עם מדידה וליווי דיגיטלי מלא.",
  },
  "beer-sheva": {
    h1: "שיווק דיגיטלי בבאר שבע — סוכנות מרחוק",
    lead:
      "פארק ההייטק, שירותים עירוניים ועסקים בנגב זקוקים לנוכחות דיגיטלית שמדברת אל הקהל הנכון. Google Ads, SEO, מדיה חברתית ואנליטיקס — מאותו צוות, בלי משרד פיזי בעיר.",
  },
  netanya: {
    h1: "משרד פרסום דיגיטלי בנתניה — שיווק דיגיטלי לעסקים",
    lead:
      "נתניה מחברת חוף, נדל״ן, תיירות ומסחר. אנחנו מפרידים בין קמפיינים לתייר לבין שיווק דיגיטלי לתושב המקומי — PPC, SEO ו-Meta עם דגש על פניות מדידות.",
  },
  "ramat-gan": {
    h1: "חברה לשיווק דיגיטלי ברמת גן",
    lead:
      "רמת גן צמודה לתל אביב אך הקהל והמחירים שונים. אנחנו מתמקדים ב-SEO מקומי, Google Ads ברדיוס ומסר שמבדיל אתכם — כולל מדידה בטפסים ובשיחות.",
  },
  "petah-tikva": {
    h1: "שיווק דיגיטלי בפתח תקווה — חברה לפרסום דיגיטלי",
    lead:
      "עיר גדוּלה דורשת פילוח: תעשייה מול שירותים לשכונות. Adwrks 365 מתאימה Google Ads, SEO ו-Meta ליעד שלכם, עם דפי נחיתה שמסבירים הצעה ולא «צועקים».",
  },
  "rishon-lezion": {
    h1: "שיווק דיגיטלי בראשון לציון — מעטפת לעסקים בגוש דן",
    lead:
      "בראשון לציון אפשר לנצח מקומית בלי לבזבז על מילות מפתח של תל אביב. שיווק דיגיטלי מסודר: חיפוש ממומן, SEO, רשתות חברתיות ושיפור המרה — בליווי אונליין.",
  },
  holon: {
    h1: "שיווק דיגיטלי בחולון — פניות מהעיר והסביבה",
    lead:
      "שירותים בחולון נסגרים בחיפוש «בחולון» ובמפות. אנחנו מחזקים נוכחות מקומית, מודעות ממוקדות ודף שמבהיר מחיר וזמינות — עם Google Ads, SEO ו-Meta לפי צורך.",
  },
  "bat-yam": {
    h1: "שיווק דיגיטלי בבת ים — לעסקים בעיר ובחוף",
    lead:
      "חוף, מגורים ומסחר בבת ים משנים עונות ומסרים. אנחנו בונים שיווק דיגיטלי גמיש: קידום אורגני, פרסום ממומן ו-Meta — תמיד עם מעקב פניות, בלי הבטחות תוצאה שלא ניתן למדוד.",
  },
  akko: {
    h1: "שיווק דיגיטלי בעכו — תיירות ושירות מקומי",
    lead:
      "עכו משלבת תיירות וקהילה מקומית. אנחנו מתאימים תוכן, SEO וקמפיינים לקהל הנכון בעונה הנכונה — Google Ads, Meta ומדידה, בליווי דיגיטלי מלא.",
  },
  hadera: {
    h1: "סוכנות שיווק דיגיטלי בחדרה",
    lead:
      "חדרה בצומת שרון–צפון זקוקה לפילוח ברור בין לקוח מקומי ללקוח ארצי. מעטפת שיווק דיגיטלי: PPC, SEO, מדיה חברתית ודפים שממירים — בלי להעמיס מילות מפתח בכותרת אחת.",
  },
  afula: {
    h1: "שיווק דיגיטלי בעפולה — חברה לקידום ופרסום",
    lead:
      "בעמק יזרעאל רבים מחפשים בגוגל לפני שיחה. אנחנו מחזקים SEO מקומי, Google Ads לכוונה חמה ו-Meta כשמתאים — עם ליווי מרחוק ודוחות שקופים.",
  },
  herzliya: {
    h1: "חברה לשיווק דיגיטלי בהרצליה",
    lead:
      "הייטק ושירותים פרימיום בהרצליה דורשים מסר חד ודף מהיר. Adwrks 365 מפעילה Google Ads, SEO ותוכן מומחה — עם מדידה מלאה, בלי להבטיח לידים במספר קבוע.",
  },
  "kfar-saba": {
    h1: "שיווק דיגיטלי בכפר סבא — סוכנות דיגיטלית מרחוק",
    lead:
      "שירותים לתושבים בכפר סבא נסגרים ב-Maps, ביקורות ובחיפוש מקומי. אנחנו משלבים SEO, Google Ads ו-Meta לפי סוג העסק — עם שיפור דפים ומעקב פניות.",
  },
  raanana: {
    h1: "שיווק דיגיטלי ברעננה — סוכנות עם מדידה שקופה",
    lead:
      "קהל ברעננה מצפה לאמון לפני פנייה. שיווק דיגיטלי מבוסס תוכן, SEO, קמפיינים מדויקים ו-Meta ממוקד — מהצוות של Adwrks 365, בליווי אונליין ארצי.",
  },
  ashdod: {
    h1: "שיווק דיגיטלי באשדוד — פרסום דיגיטלי לעסקים",
    lead:
      "אשדוד משלבת נמל, תעשייה ושירותים לעיר גדולה. אנחנו מפרידים B2B מ-B2C בערוצים ובמסרים: Google Ads, SEO, רשתות חברתיות ומדידה ב-GA4.",
  },
  ashkelon: {
    h1: "שיווק דיגיטלי באשקלון — ליווי דיגיטלי מהחוף והעיר",
    lead:
      "תעשייה, חוף ושירותים באשקלון דורשים עונות וקמפיינים שונים. מעטפת שיווק דיגיטלי מ-Adwrks: חיפוש ממומן, SEO מקומי ו-Meta — בליווי מרחוק, עם דגש על פניות מדידות.",
  },
};

export const HUB_HERO_PATCH_HE: LocationHeroPatch = {
  h1: "שיווק דיגיטלי בכל הארץ — בחרו אזור שירות",
  lead:
    "Adwrks 365 מלווה עסקים בכל רחבי ישראל בשיווק דיגיטלי מקצועי: Google Ads, קידום אורגני, מדיה חברתית, דפי נחיתה ומדידה. העבודה מתבצעת אונליין — ללא פגישות במשרד בעיר שלכם.",
};

export const LOCATION_HERO_PATCHES_EN: Record<string, LocationHeroPatch> = {
  karmiel: {
    h1: "Digital marketing agency in Karmiel",
    lead:
      "Adwrks 365 helps Galilee businesses with Google Ads, SEO, Meta campaigns, and GA4 tracking. Fully remote delivery — no claim of a local office, with strategy tuned to northern competition.",
  },
  north: {
    h1: "Digital marketing in Northern Israel",
    lead:
      "Tourism, industry, and local services in the north need season-aware strategy. We run paid search, SEO, social, and landing pages with clear reporting — online end to end.",
  },
  krayot: {
    h1: "Digital marketing agency in the Krayot",
    lead:
      "Most Krayot leads start on Google, Maps, or a radius ad. We strengthen local SEO, Google Business Profile, paid search, and Meta so calls go to you — not the competitor next door.",
  },
  center: {
    h1: "Digital marketing in Central Israel",
    lead:
      "CPC is high in the center; channel choice matters. Adwrks 365 provides Google Ads, SEO, social, and page optimization with transparent measurement — no vanity metrics only.",
  },
  sharon: {
    h1: "Digital marketing agency in the Sharon",
    lead:
      "Herzliya, Kfar Saba, Raanana, and Netanya attract different buyers. We tailor PPC, SEO, and Meta by city and audience — not one swapped template for the whole region.",
  },
  south: {
    h1: "Digital marketing in the South",
    lead:
      "Ashdod industry, Beer Sheva services, and coastal hospitality need different funnels. We set up Google Ads, SEO, and Meta by area and goal, tracking leads — not clicks alone.",
  },
  haifa: {
    h1: "Digital marketing agency in Haifa",
    lead:
      "Haifa mixes B2B, local services, and diverse audiences. We combine Google Ads, SEO, social, and conversion-focused pages — remote delivery with emphasis on qualified inquiries.",
  },
  "tel-aviv": {
    h1: "Digital marketing agency in Tel Aviv",
    lead:
      "Tel Aviv keywords are expensive. We build sharp Google and Meta campaigns, organic search, and fast landing pages with conversion tracking — without promising fixed growth rates.",
  },
  jerusalem: {
    h1: "Digital marketing agency in Jerusalem",
    lead:
      "Jerusalem buyers often need trust before they call. We use SEO and content, paid search for high intent, and Meta when it fits — always measured, always remote.",
  },
  "beer-sheva": {
    h1: "Digital marketing in Beer Sheva",
    lead:
      "Hi-tech, public sector, and local businesses in the Negev need the right message. Google Ads, SEO, social, and analytics from one team — no physical office in the city.",
  },
  netanya: {
    h1: "Digital marketing in Netanya",
    lead:
      "Netanya blends coast, real estate, tourism, and local trade. We separate tourist campaigns from resident-focused digital marketing — PPC, SEO, and Meta with lead tracking.",
  },
  "ramat-gan": {
    h1: "Digital marketing agency in Ramat Gan",
    lead:
      "Next to Tel Aviv but not the same CPC or audience. Local SEO, radius ads, and a differentiated offer — plus forms and call tracking.",
  },
  "petah-tikva": {
    h1: "Digital marketing in Petah Tikva",
    lead:
      "A large city needs split messaging: industry vs neighborhoods. Adwrks 365 aligns Google Ads, SEO, and Meta to your target customer.",
  },
  "rishon-lezion": {
    h1: "Digital marketing agency in Rishon LeZion",
    lead:
      "Win locally without bidding only on Tel Aviv terms. Paid search, SEO, social, and conversion improvements — delivered online.",
  },
  holon: {
    h1: "Digital marketing in Holon",
    lead:
      "Local services win on «in Holon» searches and Maps. We strengthen local presence, targeted ads, and pages that explain price and availability.",
  },
  "bat-yam": {
    h1: "Digital marketing agency in Bat Yam",
    lead:
      "Coast, residents, and retail shift by season. Flexible digital marketing: SEO, paid channels, and Meta with lead measurement — no unverifiable promises.",
  },
  akko: {
    h1: "Digital marketing in Akko",
    lead:
      "Tourism and local community need different campaigns. Content, SEO, and paid media timed to the right audience — remote delivery from Adwrks 365.",
  },
  hadera: {
    h1: "Digital marketing in Hadera",
    lead:
      "Between Sharon and the north — local vs national buyers need clear funnels. PPC, SEO, social, and converting pages.",
  },
  afula: {
    h1: "Digital marketing in Afula",
    lead:
      "Jezreel Valley searches often precede a phone call. Local SEO, focused Google Ads, and Meta when relevant — transparent reporting, remote team.",
  },
  herzliya: {
    h1: "Digital marketing agency in Herzliya",
    lead:
      "Hi-tech and premium services need sharp copy and fast pages. Google Ads, expert SEO, and tracking — without guaranteed lead counts.",
  },
  "kfar-saba": {
    h1: "Digital marketing in Kfar Saba",
    lead:
      "Local services convert on Maps, reviews, and «near me» search. SEO, Google Ads, Meta, and page improvements with inquiry tracking.",
  },
  raanana: {
    h1: "Digital marketing agency in Raanana",
    lead:
      "A demanding audience expects trust first. Content, SEO, precise ads, and focused Meta — nationwide delivery from Adwrks 365.",
  },
  ashdod: {
    h1: "Digital marketing in Ashdod",
    lead:
      "Port, industry, and city services need separate B2B and B2C paths. Google Ads, SEO, social, and GA4 measurement.",
  },
  ashkelon: {
    h1: "Digital marketing agency in Ashkelon",
    lead:
      "Industry, coast, and services shift by season. Paid search, local SEO, and Meta — remote delivery with measurable inquiries.",
  },
};

export const HUB_HERO_PATCH_EN: LocationHeroPatch = {
  h1: "Digital marketing across Israel — pick your area",
  lead:
    "Adwrks 365 supports businesses nationwide with Google Ads, SEO, social, landing pages, and analytics. Work is fully online — we do not present a storefront in your city.",
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

/** For QA / rollout report — snapshot before deploy uses git; runtime truth is patched copy. */
export const LOCATION_PAGE_IDS = Object.keys(LOCATION_HERO_PATCHES_HE);