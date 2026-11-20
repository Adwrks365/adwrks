/** Nearby area cards + section titles — single source for registry and copy sync. */

export const REGION_IDS = new Set(["north", "krayot", "center", "sharon", "south"]);

export type NearbyMode = "cities" | "areas";

export type NearbyConfig = {
  ids: readonly string[];
  mode: NearbyMode;
  titleHe: string;
  titleEn: string;
  introHe: string;
  introEn: string;
};

export const NEARBY_BY_PAGE: Record<string, NearbyConfig> = {
  karmiel: {
    ids: ["haifa", "afula", "hadera"],
    mode: "cities",
    titleHe: "ערים נוספות בגליל והצפון",
    titleEn: "More cities in the Galilee and north",
    introHe: "חיפה, עפולה וחדרה — ערים עם קהלים שונים; לכל אחת עמוד שיווק דיגיטלי נפרד.",
    introEn: "Haifa, Afula, and Hadera — each has a separate local marketing page and audience.",
  },
  north: {
    ids: ["karmiel", "haifa", "afula"],
    mode: "cities",
    titleHe: "ערים נוספות בצפון",
    titleEn: "More cities in the north",
    introHe: "בחרו עיר ספציפית לפרטים על קהל, אתגרים וערוצי שיווק — כל עמוד מותאם למקום.",
    introEn: "Pick a city for audience, challenges, and channels — each page is tailored to that location.",
  },
  krayot: {
    ids: ["haifa", "akko", "karmiel"],
    mode: "cities",
    titleHe: "ערים סמוכות לקריות",
    titleEn: "Cities near the Krayot",
    introHe: "עסקים בקריות משרתים לעיתים גם גולשים מחיפה, עכו או כרמיאל — לכל עיר יש עמוד נפרד.",
    introEn: "Krayot businesses often serve searchers from Haifa, Akko, or Karmiel — each city has its own page.",
  },
  center: {
    ids: ["tel-aviv", "ramat-gan", "petah-tikva"],
    mode: "cities",
    titleHe: "ערים נוספות במרכז",
    titleEn: "More cities in the center",
    introHe: "גוש דן מחולק לערים עם קהל שונה — בחרו את העיר הרלוונטית לכם.",
    introEn: "Gush Dan is split by city and audience — choose the page that fits your business.",
  },
  sharon: {
    ids: ["netanya", "herzliya", "kfar-saba"],
    mode: "cities",
    titleHe: "ערים נוספות בשרון",
    titleEn: "More cities in the Sharon",
    introHe: "השרון כולל ערים עם פרופיל עסקי שונה — עברו לעמוד העיר שבה אתם פועלים.",
    introEn: "Sharon towns differ by business profile — open the city page where you operate.",
  },
  south: {
    ids: ["beer-sheva", "ashdod", "ashkelon"],
    mode: "cities",
    titleHe: "ערים נוספות בדרום",
    titleEn: "More cities in the south",
    introHe: "נגב והחוף הדרומי — עמוד נפרד לכל עיר מרכזית באזור.",
    introEn: "Negev and the southern coast — a dedicated page for each major city.",
  },
  haifa: {
    ids: ["akko", "karmiel", "hadera"],
    mode: "cities",
    titleHe: "ערים סמוכות לחיפה",
    titleEn: "Cities near Haifa",
    introHe: "עכו, כרמיאל וחדרה — עמודים לערים סמוכות; לחיפה והקריות יש גם עמוד הקריות נפרד.",
    introEn: "Akko, Karmiel, and Hadera — nearby city pages; the Krayot also have a dedicated area page.",
  },
  "tel-aviv": {
    ids: ["ramat-gan", "holon", "petah-tikva"],
    mode: "cities",
    titleHe: "ערים סמוכות לתל אביב",
    titleEn: "Cities near Tel Aviv",
    introHe: "עסקים בתל אביב פונים לעיתים גם ללקוחות מגוש דן — אלה עמודים של ערים סמוכות.",
    introEn: "Tel Aviv businesses sometimes also serve buyers across Gush Dan — these are nearby city pages.",
  },
  "ramat-gan": {
    ids: ["tel-aviv", "petah-tikva", "rishon-lezion"],
    mode: "cities",
    titleHe: "ערים סמוכות לרמת גן",
    titleEn: "Cities near Ramat Gan",
    introHe: "רמת גן צמודה לתל אביב, לפתח תקווה ולראשון לציון — עמודים נפרדים לכל קהל.",
    introEn: "Ramat Gan sits next to Tel Aviv, Petah Tikva, and Rishon LeZion — separate pages per audience.",
  },
  "petah-tikva": {
    ids: ["ramat-gan", "rishon-lezion", "tel-aviv"],
    mode: "cities",
    titleHe: "ערים סמוכות לפתח תקווה",
    titleEn: "Cities near Petah Tikva",
    introHe: "פתח תקווה משלבת תעשייה, מסחר ושכונות — קישורים לערים שכנות בגוש דן.",
    introEn: "Petah Tikva mixes industry, retail, and neighborhoods — links to neighboring Gush Dan cities.",
  },
  "rishon-lezion": {
    ids: ["holon", "bat-yam", "petah-tikva"],
    mode: "cities",
    titleHe: "ערים סמוכות לראשון לציון",
    titleEn: "Cities near Rishon LeZion",
    introHe: "ראשון לציון, חולון, בת ים ופתח תקווה — עמודים נפרדים לפי עיר וקהל.",
    introEn: "Rishon LeZion, Holon, Bat Yam, and Petah Tikva — separate pages by city and audience.",
  },
  holon: {
    ids: ["bat-yam", "rishon-lezion", "tel-aviv"],
    mode: "cities",
    titleHe: "ערים סמוכות לחולון",
    titleEn: "Cities near Holon",
    introHe: "שירותים בחולון מגיעים גם מגולשים בבת ים, בראשון לציון ובתל אביב.",
    introEn: "Holon service businesses also reach searchers in Bat Yam, Rishon LeZion, and Tel Aviv.",
  },
  "bat-yam": {
    ids: ["holon", "rishon-lezion", "tel-aviv"],
    mode: "cities",
    titleHe: "ערים סמוכות לבת ים",
    titleEn: "Cities near Bat Yam",
    introHe: "בת ים, חולון וראשון לציון — קהלים קרובים עם צרכים שיווקיים שונים.",
    introEn: "Bat Yam, Holon, and Rishon LeZion — close audiences with different marketing needs.",
  },
  akko: {
    ids: ["haifa", "karmiel", "hadera"],
    mode: "cities",
    titleHe: "ערים סמוכות לעכו",
    titleEn: "Cities near Akko",
    introHe: "חיפה, כרמיאל וחדרה — קישורים לערים סמוכות בעיר הצפון.",
    introEn: "Haifa, Karmiel, and Hadera — nearby cities in the north.",
  },
  hadera: {
    ids: ["netanya", "herzliya", "haifa"],
    mode: "cities",
    titleHe: "ערים סמוכות לחדרה",
    titleEn: "Cities near Hadera",
    introHe: "חדרה בין השרון לצפון — נתניה, הרצליה וחיפה הן עמודים סמוכים נפוצים.",
    introEn: "Hadera sits between the Sharon and the north — Netanya, Herzliya, and Haifa are common next pages.",
  },
  afula: {
    ids: ["karmiel", "haifa", "hadera"],
    mode: "cities",
    titleHe: "ערים סמוכות לעפולה",
    titleEn: "Cities near Afula",
    introHe: "עפולה בעמק יזרעאל — כרמיאל, חיפה וחדרה הן נקודות מעבר טבעיות לקהלים סמוכים.",
    introEn: "Afula in the Jezreel Valley — Karmiel, Haifa, and Hadera are natural nearby audiences.",
  },
  herzliya: {
    ids: ["raanana", "kfar-saba", "netanya"],
    mode: "cities",
    titleHe: "ערים סמוכות להרצליה",
    titleEn: "Cities near Herzliya",
    introHe: "רעננה, כפר סבא ונתניה — ערים שכנות עם קהלים דומים לחלק מהעסקים בהרצליה.",
    introEn: "Raanana, Kfar Saba, and Netanya — neighboring towns with overlapping audiences for some Herzliya businesses.",
  },
  "kfar-saba": {
    ids: ["raanana", "herzliya", "netanya"],
    mode: "cities",
    titleHe: "ערים סמוכות לכפר סבא",
    titleEn: "Cities near Kfar Saba",
    introHe: "רעננה, הרצליה ונתניה — ערים שכנות בשרון עם עמודי תוכן נפרדים.",
    introEn: "Raanana, Herzliya, and Netanya — neighboring Sharon cities, each with its own page.",
  },
  raanana: {
    ids: ["kfar-saba", "herzliya", "netanya"],
    mode: "cities",
    titleHe: "ערים סמוכות לרעננה",
    titleEn: "Cities near Raanana",
    introHe: "רעננה בין כפר סבא, הרצליה לנתניה — עמודים נפרדים לכל עיר בשרון.",
    introEn: "Raanana between Kfar Saba, Herzliya, and Netanya — a separate page for each Sharon city.",
  },
  netanya: {
    ids: ["hadera", "herzliya", "kfar-saba"],
    mode: "cities",
    titleHe: "ערים סמוכות לנתניה",
    titleEn: "Cities near Netanya",
    introHe: "נתניה, חדרה, הרצליה וכפר סבא — עמודים לעסקים בשרון והחוף.",
    introEn: "Netanya, Hadera, Herzliya, and Kfar Saba — pages for Sharon and coastal businesses.",
  },
  jerusalem: {
    ids: ["center", "sharon", "south"],
    mode: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "עסקים בירושלים לעיתים פונים ארצה — אלה עמודי אזור עם סקירה רחבה יותר, לא ערים סמוכות.",
    introEn: "Jerusalem businesses often reach buyers nationwide — these regional pages are broader, not “next-door” cities.",
  },
  "beer-sheva": {
    ids: ["ashdod", "ashkelon"],
    mode: "cities",
    titleHe: "ערים נוספות בדרום",
    titleEn: "More cities in the south",
    introHe: "באר שבע קרובה לאשדוד ולאשקלון — שני עמודים נוספים לעסקים בדרום.",
    introEn: "Beer Sheva is close to Ashdod and Ashkelon — two more pages for southern businesses.",
  },
  ashdod: {
    ids: ["ashkelon", "beer-sheva"],
    mode: "cities",
    titleHe: "ערים נוספות בדרום",
    titleEn: "More cities in the south",
    introHe: "אשדוד קרובה לאשקלון ולבאר שבע — שתי עמודים נוספים לעסקים באזור הדרומי.",
    introEn: "Ashdod is close to Ashkelon and Beer Sheva — two more pages for southern businesses.",
  },
  ashkelon: {
    ids: ["ashdod", "beer-sheva"],
    mode: "cities",
    titleHe: "ערים נוספות בדרום",
    titleEn: "More cities in the south",
    introHe: "אשקלון, אשדוד ובאר שבע — שיווק דיגיטלי מותאם לכל עיר בנפרד.",
    introEn: "Ashkelon, Ashdod, and Beer Sheva — digital marketing tailored per city.",
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