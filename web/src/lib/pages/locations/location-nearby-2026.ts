/** Nearby area cards + section titles — single source for registry and copy sync. */

export const REGION_IDS = new Set(["north", "krayot", "center", "sharon", "south"]);

/** Controls allowed section titles — not every link list is «ערים סמוכות». */
export type NearbyTitleKind = "nearby" | "more_cities" | "areas";

export type NearbyConfig = {
  ids: readonly string[];
  titleKind: NearbyTitleKind;
  titleHe: string;
  titleEn: string;
  introHe: string;
  introEn: string;
};

/** @deprecated use titleKind — kept for scripts that still read mode */
export type NearbyMode = "cities" | "areas";

export function nearbyLegacyMode(cfg: NearbyConfig): NearbyMode {
  return cfg.titleKind === "areas" || cfg.ids.some((id) => REGION_IDS.has(id)) ? "areas" : "cities";
}

/**
 * Pages that may use a «ערים סמוכות» title: every linked id must be in this set (cities only).
 * Conservative — when in doubt, use titleKind `more_cities` or `areas` in NEARBY_BY_PAGE.
 */
export const NEARBY_CITIES_ALLOWED: Record<string, readonly string[]> = {
  krayot: ["haifa", "akko"],
  "tel-aviv": ["ramat-gan", "holon", "bat-yam"],
  "ramat-gan": ["tel-aviv", "petah-tikva", "holon"],
  holon: ["bat-yam", "tel-aviv", "rishon-lezion"],
  "bat-yam": ["holon", "rishon-lezion", "tel-aviv"],
  "rishon-lezion": ["holon", "bat-yam", "petah-tikva"],
  netanya: ["hadera", "herzliya", "kfar-saba"],
  herzliya: ["raanana", "kfar-saba", "netanya"],
  "kfar-saba": ["raanana", "herzliya", "netanya"],
  raanana: ["kfar-saba", "herzliya", "netanya"],
  ashdod: ["ashkelon"],
  ashkelon: ["ashdod"],
};

export const NEARBY_BY_PAGE: Record<string, NearbyConfig> = {
  karmiel: {
    ids: ["haifa", "afula"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות",
    titleEn: "More city service pages",
    introHe: "חיפה ועפולה — עמודים נפרדים לקהלים שונים בצפון ובעמק; הקישורים אינם «שכנות» מרחובית.",
    introEn: "Haifa and Afula are separate pages for different audiences — links here are not street-level neighbors.",
  },
  north: {
    ids: ["karmiel", "haifa", "afula"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות בצפון",
    titleEn: "More city pages in the north",
    introHe: "בחרו עיר לפרטים על קהל, אתגרים וערוצי שיווק — כל עמוד מותאם למקום.",
    introEn: "Pick a city for audience, challenges, and channels — each page is tailored to that location.",
  },
  krayot: {
    ids: ["haifa", "akko"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לקריות",
    titleEn: "Cities near the Krayot",
    introHe: "חיפה ועכו נמצאות במרחק נסיעה קצר מהקריות — לכל עיר עמוד שיווק דיגיטלי נפרד.",
    introEn: "Haifa and Akko are a short drive from the Krayot — each has its own local marketing page.",
  },
  center: {
    ids: ["tel-aviv", "ramat-gan", "petah-tikva"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות במרכז",
    titleEn: "More city pages in the center",
    introHe: "גוש דן מחולק לערים עם קהל שונה — בחרו את העיר הרלוונטית לעסק שלכם.",
    introEn: "Gush Dan is split by city and audience — choose the page that fits your business.",
  },
  sharon: {
    ids: ["netanya", "herzliya", "kfar-saba"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות בשרון",
    titleEn: "More city pages in the Sharon",
    introHe: "השרון כולל ערים עם פרופיל עסקי שונה — עברו לעמוד העיר שבה אתם פועלים.",
    introEn: "Sharon towns differ by business profile — open the city page where you operate.",
  },
  south: {
    ids: ["beer-sheva", "ashdod", "ashkelon"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות בדרום",
    titleEn: "More city pages in the south",
    introHe: "עמודים נפרדים לערים מרכזיות בדרום — ללא הנחה שהן «שכנות» אחת לשנייה.",
    introEn: "Separate pages for major southern cities — without implying one tight geographic cluster.",
  },
  haifa: {
    ids: ["akko", "krayot"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "עכו ועמוד הקריות — אזורים שונים סביב חיפה; לא מוצגים כ«שלוש ערים סמוכות».",
    introEn: "Akko and the Krayot area page — different areas around Haifa, not a generic “three nearby cities” list.",
  },
  "tel-aviv": {
    ids: ["ramat-gan", "holon", "bat-yam"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לתל אביב",
    titleEn: "Cities near Tel Aviv",
    introHe: "רמת גן, חולון ובת ים — ערים צמודות במטרופולין; לכל אחת עמוד וקהל נפרד.",
    introEn: "Ramat Gan, Holon, and Bat Yam sit in the same metro — each has its own page and audience.",
  },
  "ramat-gan": {
    ids: ["tel-aviv", "petah-tikva", "holon"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לרמת גן",
    titleEn: "Cities near Ramat Gan",
    introHe: "תל אביב, פתח תקווה וחולון — עמודים לערים שכנות במרכז; ללא כלילת ערים רחוקות יותר.",
    introEn: "Tel Aviv, Petah Tikva, and Holon — pages for neighboring cities in the center, without stretching “next-door” claims.",
  },
  "petah-tikva": {
    ids: ["ramat-gan", "tel-aviv", "center"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "רמת גן, תל אביב ועמוד המרכז — קישורים לעמודים נוספים בגוש דן, לא רק «שכנות» צרה.",
    introEn: "Ramat Gan, Tel Aviv, and the central region page — more Gush Dan coverage without overstating distance.",
  },
  "rishon-lezion": {
    ids: ["holon", "bat-yam"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לראשון לציון",
    titleEn: "Cities near Rishon LeZion",
    introHe: "חולון ובת ים — ערים סמוכות לאורך החוף והמטרופולין הדרומית.",
    introEn: "Holon and Bat Yam — neighboring cities along the coast and southern metro.",
  },
  holon: {
    ids: ["bat-yam", "tel-aviv", "rishon-lezion"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לחולון",
    titleEn: "Cities near Holon",
    introHe: "בת ים, תל אביב וראשון לציון — עמודים לערים שכנות בשטח הבנוי.",
    introEn: "Bat Yam, Tel Aviv, and Rishon LeZion — pages for cities in the same urban fabric.",
  },
  "bat-yam": {
    ids: ["holon", "rishon-lezion", "tel-aviv"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לבת ים",
    titleEn: "Cities near Bat Yam",
    introHe: "חולון, ראשון לציון ותל אביב — קהלים שונים באותו מרחב מטרופוליני.",
    introEn: "Holon, Rishon LeZion, and Tel Aviv — different audiences in the same metro area.",
  },
  akko: {
    ids: ["haifa", "krayot"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "חיפה ועמוד הקריות — אזורים סמוכים יותר לעכו; אין כאן קישור לערים רחוקות לצפון.",
    introEn: "Haifa and the Krayot area — closer service areas for Akko; no distant “nearby city” stretch.",
  },
  hadera: {
    ids: ["netanya", "sharon"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "נתניה ועמוד השרון — המשך טבעי לעסקים בין השרון לצפון, בלי לפרוש «ערים סמוכות».",
    introEn: "Netanya and the Sharon region page — a natural next step between coast and north, without fake “nearby cities”.",
  },
  afula: {
    ids: ["north", "karmiel"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "עמוד הצפון ועמוד כרמיאל — כיוונים רחבים יותר מחוץ לעמק; לא מוצגים חיפה או חדרה כ«שכנות» לעפולה.",
    introEn: "The north region page and Karmiel — broader directions outside the valley; Haifa and Hadera are not shown as Afula neighbors.",
  },
  herzliya: {
    ids: ["raanana", "kfar-saba", "netanya"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות להרצליה",
    titleEn: "Cities near Herzliya",
    introHe: "רעננה, כפר סבא ונתניה — ערים בשרון במרחק נסיעה קצר — לכל עיר עמוד נפרד.",
    introEn: "Raanana, Kfar Saba, and Netanya — short drives in the Sharon, each with its own page.",
  },
  "kfar-saba": {
    ids: ["raanana", "herzliya", "netanya"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לכפר סבא",
    titleEn: "Cities near Kfar Saba",
    introHe: "רעננה, הרצליה ונתניה — ערים שכנות בשרון עם עמודי תוכן נפרדים.",
    introEn: "Raanana, Herzliya, and Netanya — neighboring Sharon cities, each with its own page.",
  },
  raanana: {
    ids: ["kfar-saba", "herzliya", "netanya"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לרעננה",
    titleEn: "Cities near Raanana",
    introHe: "כפר סבא, הרצליה ונתניה — שלוש ערים קרובות בשרון.",
    introEn: "Kfar Saba, Herzliya, and Netanya — three close Sharon cities.",
  },
  netanya: {
    ids: ["hadera", "herzliya", "kfar-saba"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לנתניה",
    titleEn: "Cities near Netanya",
    introHe: "חדרה, הרצליה וכפר סבא — עמודים לערים בשרון ובחוף הסמוכים לנתניה.",
    introEn: "Hadera, Herzliya, and Kfar Saba — pages for cities along the Sharon and coast near Netanya.",
  },
  jerusalem: {
    ids: ["center", "sharon", "south"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "עסקים בירושלים לעיתים פונים ארצה — אלה עמודי אזור רחבים, לא ערים «סמוכות».",
    introEn: "Jerusalem businesses often reach buyers nationwide — broad regional pages, not street-level neighbors.",
  },
  "beer-sheva": {
    ids: ["south", "ashkelon"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "עמוד הדרום ועמוד אשקלון — כיוונים נוספים לעסקים בנגב, בלי טענת קרבה לאשדוד.",
    introEn: "The south region page and Ashkelon — more directions for Negev businesses, without claiming proximity to Ashdod.",
  },
  ashdod: {
    ids: ["ashkelon", "south"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "אשקלון סמוכה לחוף ליד אשדוד; עמוד הדרום מרכז את שאר הערים בדרום — בלי טענות מרחק לבאר שבע.",
    introEn: "Ashkelon shares the southern coastal strip; the south region page covers other southern cities — without a Beer Sheva proximity claim.",
  },
  ashkelon: {
    ids: ["ashdod", "south"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "אשדוד סמוכה לאשקלון לאורך החוף; עמוד הדרום לאזור רחב יותר.",
    introEn: "Ashdod is the coastal neighbor; the south region page covers the wider area.",
  },
};

/** Registry lookup — ids only */
export const NEARBY_IDS: Record<string, readonly string[]> = Object.fromEntries(
  Object.entries(NEARBY_BY_PAGE).map(([id, cfg]) => [id, cfg.ids]),
);

export function applyLocationNearbyCopyHe(table: Record<string, { nearbyTitle: string; nearbyIntro: string }>): void {
  for (const [id, cfg] of Object.entries(NEARBY_BY_PAGE)) {
    const row = table[id];
    if (!row) continue;
    row.nearbyTitle = cfg.titleHe;
    row.nearbyIntro = cfg.introHe;
  }
}

export function applyLocationNearbyCopyEn(table: Record<string, { nearbyTitle: string; nearbyIntro: string }>): void {
  for (const [id, cfg] of Object.entries(NEARBY_BY_PAGE)) {
    const row = table[id];
    if (!row) continue;
    row.nearbyTitle = cfg.titleEn;
    row.nearbyIntro = cfg.introEn;
  }
}