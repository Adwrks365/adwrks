import type { HubCopy, LocationCopy } from "./types";

export type SeoMetaPatch = { seoTitle: string; seoDescription: string };

/** Title + meta refresh — URLs, H1 (PR #12), schema shape unchanged. Brand: Adwrks 365 */
export const HUB_SEO_META_HE: SeoMetaPatch = {
  seoTitle: "שירותי שיווק דיגיטלי בארץ | אזורי פעילות | Adwrks 365",
  seoDescription:
    "מפת אזורי השירות של Adwrks 365: שיווק דיגיטלי לעסקים בצפון, במרכז, בדרום, בשרון ובירושלים. Google Ads, SEO ו-Meta — ליווי מרחוק.",
};

export const HUB_SEO_META_EN: SeoMetaPatch = {
  seoTitle: "Digital marketing service areas in Israel | Adwrks 365",
  seoDescription:
    "Browse Adwrks 365 service areas: digital marketing for businesses across Israel. Google Ads, SEO, Meta, and landing pages with transparent remote guidance.",
};

export const LOCATION_SEO_META_HE: Record<string, SeoMetaPatch> = {
  karmiel: {
    seoTitle: "חברה לשיווק דיגיטלי בכרמיאל | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בכרמיאל והגליל: Google Ads, SEO, Meta ודפי המרה. ליווי מרחוק, מדידת פניות ושקיפות בדוחות — Adwrks 365.",
  },
  north: {
    seoTitle: "שיווק דיגיטלי בצפון | סוכנות לפרסום | Adwrks 365",
    seoDescription:
      "חברה לשיווק דיגיטלי לעסקים בגליל ובצפון: עונות תיירות, B2B ושירות מקומי. PPC, SEO ו-Meta עם אסטרטגיה מותאמת — Adwrks 365.",
  },
  krayot: {
    seoTitle: "חברה לשיווק דיגיטלי בקריות | Adwrks 365",
    seoDescription:
      "פרסום דיגיטלי בקריות: SEO מקומי, Google Maps, מודעות ברדיוס ודפים שממירים. יותר שיחות מהשכונות שסביבכם — Adwrks 365.",
  },
  center: {
    seoTitle: "משרד פרסום דיגיטלי במרכז | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בגוש דן ובמרכז: Google Ads, SEO ו-Meta כשהתחרות יקרה. מיקוד תקציב, מסר חד ודוחות ROI — Adwrks 365.",
  },
  sharon: {
    seoTitle: "סוכנות שיווק דיגיטלי בשרון | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בשרון לעסקים בנתניה, הרצליה והסביבה: PPC, SEO, תוכן ו-Meta לפי קהל ועיר. ליווי אונליין — Adwrks 365.",
  },
  south: {
    seoTitle: "שיווק דיגיטלי בדרום | חברה לפרסום | Adwrks 365",
    seoDescription:
      "חברה לשיווק דיגיטלי לעסקים בנגב ובחוף הדרומי: באר שבע, אשדוד, אשקלון ועוד. Google Ads, SEO ו-Meta — Adwrks 365.",
  },
  haifa: {
    seoTitle: "חברה לשיווק דיגיטלי בחיפה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בחיפה: הייטק, שירותים מקומיים ופילוח קהלים. Google Ads, SEO, מדיה חברתית ואופטימיזציית המרות — Adwrks 365.",
  },
  "tel-aviv": {
    seoTitle: "סוכנות שיווק דיגיטלי בתל אביב | Adwrks 365",
    seoDescription:
      "משרד פרסום דיגיטלי לעסקים בתל אביב: PPC תחרותי, SEO, Meta ודפי נחיתה. מדידה ב-GA4 וליווי מרחוק — Adwrks 365.",
  },
  "ramat-gan": {
    seoTitle: "שיווק דיגיטלי ברמת גן | Google Ads ו-SEO | Adwrks 365",
    seoDescription:
      "פרסום דיגיטלי לעסקים ברמת גן ובגוש דן: מיקוד לידים ממודעות, קידום אורגני ושיפור דפים. שקיפות מלאה — Adwrks 365.",
  },
  "petah-tikva": {
    seoTitle: "חברה לשיווק דיגיטלי בפתח תקווה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בפתח תקווה לשירותים, מסחר ו-B2B: Google Ads, SEO ו-Meta עם מדידת פניות. ייעוץ ללא התחייבות — Adwrks 365.",
  },
  "rishon-lezion": {
    seoTitle: "משרד פרסום דיגיטלי בראשון לציון | Adwrks 365",
    seoDescription:
      "סוכנות שיווק דיגיטלי לעסקים בראשון לציון: קמפיינים ממומנים, SEO מקומי ודפי המרה. עבודה מרחוק עם דוחות ברורים — Adwrks 365.",
  },
  holon: {
    seoTitle: "שיווק דיגיטלי בחולון | חברה לפרסום | Adwrks 365",
    seoDescription:
      "פרסום דיגיטלי בחולון לעסקים מקומיים: חיפוש בגוגל, מודעות ברדיוס ו-Meta. התאמה למובייל ולשיחות — Adwrks 365.",
  },
  "bat-yam": {
    seoTitle: "חברה לשיווק דיגיטלי בבת ים | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בבת ים: לידים מהעיר והחוף, Google Ads, SEO ונוכחות מקומית בגוגל. ליווי Adwrks 365 מרחוק.",
  },
  akko: {
    seoTitle: "שיווק דיגיטלי בעכו | פרסום מקומי | Adwrks 365",
    seoDescription:
      "משרד פרסום דיגיטלי לעסקים בעכו: תיירות, מסחר ושירות. SEO מקומי, מודעות ודפים שמביאים פניות — Adwrks 365.",
  },
  hadera: {
    seoTitle: "סוכנות שיווק דיגיטלי בחדרה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בחדרה ובחוף הכרמל: Google Ads, SEO ו-Meta לעסקים שפועלים מקומית וארצית. דגש על ROI — Adwrks 365.",
  },
  afula: {
    seoTitle: "שיווק דיגיטלי בעפולה והעמק | Adwrks 365",
    seoDescription:
      "חברה לשיווק דיגיטלי לעסקים בעפולה ובעמק יזרעאל: PPC, SEO ותוכן. חיבור ללידים מהגליל — Adwrks 365.",
  },
  herzliya: {
    seoTitle: "חברה לשיווק דיגיטלי בהרצליה | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי בהרצליה לעסקי הייטק, B2B ושירותים: Google Ads, SEO ודפי נחיתה ממוקדי המרה. ליווי מרחוק — Adwrks 365.",
  },
  "kfar-saba": {
    seoTitle: "שיווק דיגיטלי בכפר סבא | SEO מקומי | Adwrks 365",
    seoDescription:
      "פרסום דיגיטלי בכפר סבא: חיפוש מקומי, מודעות ו-Meta לעסקים בעיר. שילוב PPC ו-SEO לפי יעד — Adwrks 365.",
  },
  raanana: {
    seoTitle: "משרד פרסום דיגיטלי ברעננה | Adwrks 365",
    seoDescription:
      "סוכנות שיווק דיגיטלי לעסקים ברעננה: שקיפות בדוחות, אופטימיזציית קמפיינים ו-SEO. Google Ads ו-Meta — Adwrks 365.",
  },
  netanya: {
    seoTitle: "שיווק דיגיטלי בנתניה | חברה לפרסום | Adwrks 365",
    seoDescription:
      "חברה לשיווק דיגיטלי בנתניה: תיירות, נדל״ן ומסחר. Google Ads, SEO מקומי ודפי המרה — Adwrks 365.",
  },
  jerusalem: {
    seoTitle: "חברה לשיווק דיגיטלי בירושלים | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים בירושלים: קהלים מגוונים, מסרים מדויקים ומדידה. PPC, SEO, Meta וייעוץ אסטרטגי — Adwrks 365.",
  },
  "beer-sheva": {
    seoTitle: "שיווק דיגיטלי בבאר שבע | Adwrks 365",
    seoDescription:
      "פרסום דיגיטלי בבאר שבע והנגב: לידים מעסקים ואקדמיה, Google Ads, SEO ו-Meta. ליווי מרחוק עם דוחות — Adwrks 365.",
  },
  ashdod: {
    seoTitle: "סוכנות שיווק דיגיטלי באשדוד | Adwrks 365",
    seoDescription:
      "שיווק דיגיטלי לעסקים באשדוד: יצוא, שירות ומסחר. מיקוד תקציב, SEO וקמפיינים ממומנים — Adwrks 365.",
  },
  ashkelon: {
    seoTitle: "שיווק דיגיטלי באשקלון | Adwrks 365",
    seoDescription:
      "חברה לשיווק דיגיטלי באשקלון ובחוף הדרום: Google Ads, SEO מקומי ו-Meta לפניות איכותיות. שקיפות — Adwrks 365.",
  },
};

export const LOCATION_SEO_META_EN: Record<string, SeoMetaPatch> = {
  karmiel: {
    seoTitle: "Digital marketing agency in Karmiel | Adwrks 365",
    seoDescription:
      "Adwrks 365 supports businesses in Karmiel and the Galilee: Google Ads, SEO, Meta, and conversion pages. Remote guidance, clear reporting, and lead tracking.",
  },
  north: {
    seoTitle: "Digital marketing in Northern Israel | Adwrks 365",
    seoDescription:
      "Digital marketing for the Galilee and Northern Israel — tourism seasons, B2B, and local services. PPC, SEO, and Meta with a tailored plan from Adwrks 365.",
  },
  krayot: {
    seoTitle: "Digital marketing agency in Krayot | Adwrks 365",
    seoDescription:
      "Local digital marketing in Krayot: Google Maps, radius ads, SEO, and landing pages that convert. More calls from nearby neighborhoods — Adwrks 365.",
  },
  center: {
    seoTitle: "Digital marketing in Central Israel | Adwrks 365",
    seoDescription:
      "PPC and SEO for businesses in Gush Dan when competition is costly. Focused budgets, sharp messaging, and ROI reports — Adwrks 365.",
  },
  sharon: {
    seoTitle: "Digital marketing agency in Sharon | Adwrks 365",
    seoDescription:
      "Digital marketing across Sharon — Netanya, Herzliya, and the coast. Google Ads, SEO, and Meta matched to audience and city. Online delivery by Adwrks 365.",
  },
  south: {
    seoTitle: "Digital marketing in Southern Israel | Adwrks 365",
    seoDescription:
      "Marketing for businesses in the Negev and southern coast: Beer Sheva, Ashdod, Ashkelon, and more. Google Ads, SEO, and Meta — Adwrks 365.",
  },
  haifa: {
    seoTitle: "Digital marketing agency in Haifa | Adwrks 365",
    seoDescription:
      "Haifa digital marketing for tech, services, and mixed audiences. Google Ads, SEO, social, and conversion optimization — remote team Adwrks 365.",
  },
  "tel-aviv": {
    seoTitle: "Digital marketing agency in Tel Aviv | Adwrks 365",
    seoDescription:
      "Competitive PPC, SEO, Meta, and landing pages for Tel Aviv businesses. GA4 measurement and transparent reporting — Adwrks 365.",
  },
  "ramat-gan": {
    seoTitle: "Digital marketing in Ramat Gan | Adwrks 365",
    seoDescription:
      "Lead-focused Google Ads and organic SEO for Ramat Gan and Gush Dan. Page optimization and channel mix — Adwrks 365.",
  },
  "petah-tikva": {
    seoTitle: "Digital marketing agency in Petah Tikva | Adwrks 365",
    seoDescription:
      "Digital marketing in Petah Tikva for services, retail, and B2B. PPC, SEO, Meta, and measurable inquiries — intro call with Adwrks 365.",
  },
  "rishon-lezion": {
    seoTitle: "PPC & SEO for Rishon LeZion | Adwrks 365",
    seoDescription:
      "Paid search, local SEO, and landing pages for Rishon LeZion businesses. Nationwide remote service with clear performance updates — Adwrks 365.",
  },
  holon: {
    seoTitle: "Digital marketing in Holon | Adwrks 365",
    seoDescription:
      "Local digital advertising in Holon: Google search, radius campaigns, and Meta tuned for mobile calls. Guidance from Adwrks 365.",
  },
  "bat-yam": {
    seoTitle: "Digital marketing agency in Bat Yam | Adwrks 365",
    seoDescription:
      "Marketing for Bat Yam businesses along the coast: local SEO, Google Ads, and social ads that drive calls. Adwrks 365 works with you remotely.",
  },
  akko: {
    seoTitle: "Digital marketing in Akko (Acre) | Adwrks 365",
    seoDescription:
      "Digital promotion for tourism, retail, and services in Akko. Local SEO, ads, and pages built to convert visitors — Adwrks 365.",
  },
  hadera: {
    seoTitle: "Digital marketing agency in Hadera | Adwrks 365",
    seoDescription:
      "Google Ads, SEO, and Meta for Hadera and the Carmel coast. For teams that sell locally and nationwide — Adwrks 365.",
  },
  afula: {
    seoTitle: "Digital marketing in Afula & Jezreel Valley | Adwrks 365",
    seoDescription:
      "PPC, SEO, and content for businesses in Afula and the valley. Connect with leads across the north — Adwrks 365.",
  },
  herzliya: {
    seoTitle: "B2B digital marketing in Herzliya | Adwrks 365",
    seoDescription:
      "Google Ads and SEO for Herzliya tech, B2B, and professional services. Landing pages and reporting you can audit — Adwrks 365.",
  },
  "kfar-saba": {
    seoTitle: "Local SEO & PPC in Kfar Saba | Adwrks 365",
    seoDescription:
      "Digital marketing in Kfar Saba: local search, paid campaigns, and Meta for city-based businesses. Channel mix by goal — Adwrks 365.",
  },
  raanana: {
    seoTitle: "Digital marketing agency in Ra'anana | Adwrks 365",
    seoDescription:
      "Campaign optimization and SEO for Ra'anana companies that want transparent metrics. Google Ads and Meta — Adwrks 365.",
  },
  netanya: {
    seoTitle: "Digital marketing in Netanya | Adwrks 365",
    seoDescription:
      "Tourism, real estate, and retail marketing in Netanya. Google Ads, local SEO, and landing pages — Adwrks 365.",
  },
  jerusalem: {
    seoTitle: "Digital marketing agency in Jerusalem | Adwrks 365",
    seoDescription:
      "Jerusalem businesses need precise audiences and messaging. PPC, SEO, Meta, and strategy with measurement — Adwrks 365.",
  },
  "beer-sheva": {
    seoTitle: "Digital marketing in Beer Sheva | Adwrks 365",
    seoDescription:
      "Lead generation for Beer Sheva and the Negev: Google Ads, SEO, and social campaigns. Remote delivery and reporting — Adwrks 365.",
  },
  ashdod: {
    seoTitle: "Digital marketing agency in Ashdod | Adwrks 365",
    seoDescription:
      "Ashdod digital marketing for port, services, and trade businesses. Budget focus, SEO, and paid search — Adwrks 365.",
  },
  ashkelon: {
    seoTitle: "Digital marketing in Ashkelon | Adwrks 365",
    seoDescription:
      "Local Google Ads, SEO, and Meta for Ashkelon and the southern coast. Qualified inquiries, not vanity clicks — Adwrks 365.",
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