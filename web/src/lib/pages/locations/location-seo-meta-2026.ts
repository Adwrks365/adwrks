import type { HubCopy, LocationCopy } from "./types";

export type SeoMetaPatch = { seoTitle: string; seoDescription: string };

/** Title + meta refresh — URLs, H1 (PR #12), schema shape unchanged. Brand: Adwrks 365 */
export const HUB_SEO_META_HE: SeoMetaPatch = {
  seoTitle: "שירותי שיווק דיגיטלי בארץ | אזורי פעילות | Adwrks 365",
  seoDescription:
    "אזורי השירות של Adwrks 365: שיווק דיגיטלי לעסקים בצפון, במרכז, בדרום, בשרון ובירושלים. Google Ads, SEO ו-Meta בליווי מרחוק.",
};

export const HUB_SEO_META_EN: SeoMetaPatch = {
  seoTitle: "Digital marketing service areas in Israel | Adwrks 365",
  seoDescription:
    "Adwrks 365 service areas across Israel. Google Ads, SEO, Meta, and landing pages with clear reporting. Remote guidance for businesses nationwide.",
};

export const LOCATION_SEO_META_HE: Record<string, SeoMetaPatch> = {
  karmiel: {
    seoTitle: "חברה לשיווק דיגיטלי בכרמיאל | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בכרמיאל והגליל: Google Ads, SEO, Meta ודפי נחיתה. ליווי מרחוק ודוחות ביצועים ברורים. Adwrks 365.",
  },
  north: {
    seoTitle: "חברה לשיווק דיגיטלי בצפון | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בגליל ובצפון, כולל תיירות, תעשייה ושירותים מקומיים. PPC, SEO ו-Meta לפי עונה ויעד. Adwrks 365.",
  },
  krayot: {
    seoTitle: "חברה לשיווק דיגיטלי בקריות | Adwrks 365",
    seoDescription:
      "קידום מקומי בקריות: Google Maps, מודעות ברדיוס, SEO ודפי המרה שמובילים לשיחה. ליווי דיגיטלי מרחוק. Adwrks 365.",
  },
  center: {
    seoTitle: "משרד פרסום דיגיטלי במרכז | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים במרכז ובגוש דן: Google Ads, SEO ו-Meta כשהתחרות גבוהה. תכנון תקציב ומדידה שוטפת. Adwrks 365.",
  },
  sharon: {
    seoTitle: "סוכנות שיווק דיגיטלי בשרון | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בשרון לעסקים בנתניה, בהרצליה ובערי החוף. Google Ads, SEO ו-Meta מותאמים לקהל ולעיר. Adwrks 365.",
  },
  south: {
    seoTitle: "חברה לשיווק דיגיטלי בדרום | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בנגב, באשדוד, באשקלון ובאר שבע: Google Ads, SEO ו-Meta. אסטרטגיה לפי אזור ומטרה. Adwrks 365.",
  },
  haifa: {
    seoTitle: "חברה לשיווק דיגיטלי בחיפה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בחיפה לעסקי הייטק, שירות מקומי ו-B2B. Google Ads, SEO, רשתות חברתיות ושיפור דפי המרה. Adwrks 365.",
  },
  "tel-aviv": {
    seoTitle: "סוכנות שיווק דיגיטלי בתל אביב | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בתל אביב: קמפיינים בגוגל, SEO, Meta ודפי נחיתה. מדידה ב-GA4 וליווי מרחוק. Adwrks 365.",
  },
  "ramat-gan": {
    seoTitle: "חברה לשיווק דיגיטלי ברמת גן | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים ברמת גן ובגוש דן: Google Ads, SEO מקומי ושיפור המרות באתר. דוחות שוטפים וליווי מרחוק. Adwrks 365.",
  },
  "petah-tikva": {
    seoTitle: "חברה לשיווק דיגיטלי בפתח תקווה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בפתח תקווה לעסקי שירות, מסחר ו-B2B. Google Ads, SEO ו-Meta עם מעקב אחרי פניות. Adwrks 365.",
  },
  "rishon-lezion": {
    seoTitle: "משרד פרסום דיגיטלי בראשון לציון | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בראשון לציון: חיפוש ממומן, SEO ודפי המרה. עבודה מרחוק עם דגש על ביצועים. Adwrks 365.",
  },
  holon: {
    seoTitle: "חברה לשיווק דיגיטלי בחולון | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בחולון ובסביבה: חיפוש בגוגל, מודעות מקומיות ו-Meta. התאמה למובייל ולשיחות מלקוחות. Adwrks 365.",
  },
  "bat-yam": {
    seoTitle: "חברה לשיווק דיגיטלי בבת ים | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בבת ים: Google Ads, SEO מקומי ופרסום ב-Meta. נוכחות בגוגל שמביאה פניות מהעיר והחוף. Adwrks 365.",
  },
  akko: {
    seoTitle: "חברה לשיווק דיגיטלי בעכו | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בעכו: תיירות, מסחר ושירותים. SEO מקומי, מודעות ודפים שמסבירים את ההצעה. Adwrks 365.",
  },
  hadera: {
    seoTitle: "סוכנות שיווק דיגיטלי בחדרה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בחדרה ובחוף הכרמל: Google Ads, SEO ו-Meta לעסקים מקומיים וארציים. ליווי מרחוק. Adwrks 365.",
  },
  afula: {
    seoTitle: "חברה לשיווק דיגיטלי בעפולה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בעפולה ובעמק יזרעאל: PPC, SEO ותוכן שמחזק נראות בגוגל. Adwrks 365.",
  },
  herzliya: {
    seoTitle: "חברה לשיווק דיגיטלי בהרצליה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בהרצליה לעסקי הייטק, B2B ושירותים: Google Ads, SEO ודפי נחיתה ממוקדי המרה. Adwrks 365.",
  },
  "kfar-saba": {
    seoTitle: "חברה לשיווק דיגיטלי בכפר סבא | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בכפר סבא: קידום מקומי בגוגל, מודעות ב-Meta ושילוב PPC עם SEO לפי יעד העסק. Adwrks 365.",
  },
  raanana: {
    seoTitle: "משרד פרסום דיגיטלי ברעננה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים ברעננה: ניהול קמפיינים, SEO ודוחות ביצועים שקופים. Google Ads ו-Meta. Adwrks 365.",
  },
  netanya: {
    seoTitle: "חברה לשיווק דיגיטלי בנתניה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בנתניה לתיירות, נדל״ן ומסחר: Google Ads, SEO מקומי ודפי נחיתה. ליווי מרחוק. Adwrks 365.",
  },
  jerusalem: {
    seoTitle: "חברה לשיווק דיגיטלי בירושלים | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בירושלים: פילוח קהלים, Google Ads, SEO ו-Meta עם מדידה שוטפת. Adwrks 365.",
  },
  "beer-sheva": {
    seoTitle: "חברה לשיווק דיגיטלי בבאר שבע | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בבאר שבע והנגב: Google Ads, SEO ו-Meta לעסקים, שירותים ומוסדות באזור. Adwrks 365.",
  },
  ashdod: {
    seoTitle: "סוכנות שיווק דיגיטלי באשדוד | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים באשדוד: שירות, מסחר ותעשייה. תכנון קמפיינים, SEO ומדידת תוצאות. Adwrks 365.",
  },
  ashkelon: {
    seoTitle: "חברה לשיווק דיגיטלי באשקלון | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי באשקלון ובחוף הדרום: Google Ads, SEO מקומי ו-Meta לפניות מעסקים מקומיים. Adwrks 365.",
  },
};

export const LOCATION_SEO_META_EN: Record<string, SeoMetaPatch> = {
  karmiel: {
    seoTitle: "Digital marketing agency in Karmiel | Adwrks 365",
    seoDescription:
      "Google Ads, SEO, Meta, and landing pages for businesses in Karmiel and the Galilee. Remote guidance and clear reporting from Adwrks 365.",
  },
  north: {
    seoTitle: "Digital marketing agency in Northern Israel | Adwrks 365",
    seoDescription:
      "Digital marketing for the Galilee and the north: tourism, industry, and local services. PPC, SEO, and Meta planned by season and goal. Adwrks 365.",
  },
  krayot: {
    seoTitle: "Digital marketing agency in Krayot | Adwrks 365",
    seoDescription:
      "Local marketing in Krayot: Google Maps, radius ads, SEO, and pages that lead to calls. Remote support from Adwrks 365.",
  },
  center: {
    seoTitle: "Digital marketing agency in Central Israel | Adwrks 365",
    seoDescription:
      "Google Ads, SEO, and Meta for businesses in Gush Dan when competition is strong. Budget planning and ongoing measurement. Adwrks 365.",
  },
  sharon: {
    seoTitle: "Digital marketing agency in Sharon | Adwrks 365",
    seoDescription:
      "Digital marketing in Sharon for Netanya, Herzliya, and the coast. Google Ads, SEO, and Meta matched to audience and city. Adwrks 365.",
  },
  south: {
    seoTitle: "Digital marketing agency in Southern Israel | Adwrks 365",
    seoDescription:
      "Marketing for businesses in the Negev and southern coast, including Beer Sheva, Ashdod, and Ashkelon. Google Ads, SEO, and Meta. Adwrks 365.",
  },
  haifa: {
    seoTitle: "Digital marketing agency in Haifa | Adwrks 365",
    seoDescription:
      "Digital marketing in Haifa for tech, local services, and B2B. Google Ads, SEO, social, and conversion-focused pages. Adwrks 365.",
  },
  "tel-aviv": {
    seoTitle: "Digital marketing agency in Tel Aviv | Adwrks 365",
    seoDescription:
      "Google Ads, SEO, Meta, and landing pages for Tel Aviv businesses. GA4 tracking and remote guidance from Adwrks 365.",
  },
  "ramat-gan": {
    seoTitle: "Digital marketing agency in Ramat Gan | Adwrks 365",
    seoDescription:
      "Google Ads, local SEO, and site improvements for businesses in Ramat Gan and Gush Dan. Regular reports and remote support. Adwrks 365.",
  },
  "petah-tikva": {
    seoTitle: "Digital marketing agency in Petah Tikva | Adwrks 365",
    seoDescription:
      "Digital marketing in Petah Tikva for services, retail, and B2B. PPC, SEO, Meta, and inquiry tracking. Adwrks 365.",
  },
  "rishon-lezion": {
    seoTitle: "Digital marketing agency in Rishon LeZion | Adwrks 365",
    seoDescription:
      "Paid search, SEO, and landing pages for Rishon LeZion businesses. Remote delivery with focus on performance. Adwrks 365.",
  },
  holon: {
    seoTitle: "Digital marketing agency in Holon | Adwrks 365",
    seoDescription:
      "Local Google Ads, search, and Meta for Holon businesses. Campaigns tuned for mobile calls and nearby customers. Adwrks 365.",
  },
  "bat-yam": {
    seoTitle: "Digital marketing agency in Bat Yam | Adwrks 365",
    seoDescription:
      "Google Ads, local SEO, and Meta for Bat Yam businesses. Build visibility in Google that brings inquiries from the city and coast. Adwrks 365.",
  },
  akko: {
    seoTitle: "Digital marketing agency in Akko (Acre) | Adwrks 365",
    seoDescription:
      "Marketing for tourism, retail, and services in Akko. Local SEO, ads, and pages that explain your offer clearly. Adwrks 365.",
  },
  hadera: {
    seoTitle: "Digital marketing agency in Hadera | Adwrks 365",
    seoDescription:
      "Google Ads, SEO, and Meta for Hadera and the Carmel coast. For businesses that sell locally and nationwide. Adwrks 365.",
  },
  afula: {
    seoTitle: "Digital marketing agency in Afula | Adwrks 365",
    seoDescription:
      "PPC, SEO, and content for businesses in Afula and the Jezreel Valley. Adwrks 365.",
  },
  herzliya: {
    seoTitle: "Digital marketing agency in Herzliya | Adwrks 365",
    seoDescription:
      "Google Ads and SEO for Herzliya tech, B2B, and professional services. Landing pages and reporting you can review. Adwrks 365.",
  },
  "kfar-saba": {
    seoTitle: "Digital marketing agency in Kfar Saba | Adwrks 365",
    seoDescription:
      "Local Google visibility, paid ads, and Meta for Kfar Saba businesses. PPC and SEO aligned to your goals. Adwrks 365.",
  },
  raanana: {
    seoTitle: "Digital marketing agency in Ra'anana | Adwrks 365",
    seoDescription:
      "Campaign management, SEO, and clear performance reports for Ra'anana businesses. Google Ads and Meta. Adwrks 365.",
  },
  netanya: {
    seoTitle: "Digital marketing agency in Netanya | Adwrks 365",
    seoDescription:
      "Google Ads, local SEO, and landing pages for tourism, real estate, and retail in Netanya. Remote guidance. Adwrks 365.",
  },
  jerusalem: {
    seoTitle: "Digital marketing agency in Jerusalem | Adwrks 365",
    seoDescription:
      "Audience targeting, Google Ads, SEO, and Meta for Jerusalem businesses with ongoing measurement. Adwrks 365.",
  },
  "beer-sheva": {
    seoTitle: "Digital marketing agency in Beer Sheva | Adwrks 365",
    seoDescription:
      "Google Ads, SEO, and Meta for businesses, services, and institutions in Beer Sheva and the Negev. Adwrks 365.",
  },
  ashdod: {
    seoTitle: "Digital marketing agency in Ashdod | Adwrks 365",
    seoDescription:
      "Campaign planning, SEO, and results tracking for service, trade, and industrial businesses in Ashdod. Adwrks 365.",
  },
  ashkelon: {
    seoTitle: "Digital marketing agency in Ashkelon | Adwrks 365",
    seoDescription:
      "Local Google Ads, SEO, and Meta for Ashkelon and the southern coast. Focus on relevant inquiries from nearby customers. Adwrks 365.",
  },
};

function applyPatch<T extends { seoTitle: string; seoDescription: string }>(
  target: T,
  patch: SeoMetaPatch | undefined,
): void {
  if (!patch) return;
  target.seoTitle = patch.seoTitle;
  target.seoDescription = patch.seoDescription;
}

export function applyHubSeoMeta2026He(hub: HubCopy): void {
  applyPatch(hub, HUB_SEO_META_HE);
}

export function applyHubSeoMeta2026En(hub: HubCopy): void {
  applyPatch(hub, HUB_SEO_META_EN);
}

export function applyLocationSeoMeta2026He(locations: Record<string, LocationCopy>): void {
  for (const [id, patch] of Object.entries(LOCATION_SEO_META_HE)) {
    const row = locations[id];
    if (row) applyPatch(row, patch);
  }
}

export function applyLocationSeoMeta2026En(locations: Record<string, LocationCopy>): void {
  for (const [id, patch] of Object.entries(LOCATION_SEO_META_EN)) {
    const row = locations[id];
    if (row) applyPatch(row, patch);
  }
}