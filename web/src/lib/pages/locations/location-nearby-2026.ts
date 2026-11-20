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
    introHe: "פועלים מהגליל ורוצים להרחיב את השיווק? הכירו את עמודי השירות בחיפה ובעפולה.",
    introEn: "Based in the Galilee and growing your marketing? Explore service pages for Haifa and Afula.",
  },
  north: {
    ids: ["karmiel", "haifa", "afula"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות בצפון",
    titleEn: "More city pages in the north",
    introHe: "בחרו את העיר הרלוונטית לכם — קהל, אתגרים וערוצי שיווק מותאמים לכל מיקום בצפון.",
    introEn: "Choose the city that fits your business — audience, challenges, and channels for each northern location.",
  },
  krayot: {
    ids: ["haifa", "akko"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לקריות",
    titleEn: "Cities near the Krayot",
    introHe: "משרתים לקוחות גם מחוץ לקריות? לכל עיר עמוד שיווק דיגיטלי עם תוכן מקומי.",
    introEn: "Serving clients beyond the Krayot? Each linked city has a local digital marketing page.",
  },
  center: {
    ids: ["tel-aviv", "ramat-gan", "petah-tikva"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות במרכז",
    titleEn: "More city pages in the center",
    introHe: "פועלים בגוש דן? עברו לעמוד העיר שבה אתם מתמקדים — תל אביב, רמת גן או פתח תקווה.",
    introEn: "Active in Gush Dan? Open the city page you focus on — Tel Aviv, Ramat Gan, or Petah Tikva.",
  },
  sharon: {
    ids: ["netanya", "herzliya", "kfar-saba"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות בשרון",
    titleEn: "More city pages in the Sharon",
    introHe: "עסק בשרון? בחרו עמוד לפי העיר שבה אתם פועלים — נתניה, הרצליה או כפר סבא.",
    introEn: "Running a business in the Sharon? Pick the page for your town — Netanya, Herzliya, or Kfar Saba.",
  },
  south: {
    ids: ["beer-sheva", "ashdod", "ashkelon"],
    titleKind: "more_cities",
    titleHe: "עמודי שירות בערים נוספות בדרום",
    titleEn: "More city pages in the south",
    introHe: "משרתים לקוחות בדרום? עמודי שירות נפרדים לבאר שבע, אשדוד ואשקלון.",
    introEn: "Serving clients in the south? Dedicated service pages for Beer Sheva, Ashdod, and Ashkelon.",
  },
  haifa: {
    ids: ["akko", "krayot"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "מפעילים עסק בחיפה או משרתים לקוחות גם באזור הקריות ועכו? הכירו את עמודי השירות באזורים האלה.",
    introEn: "Based in Haifa or serving clients in the Krayot and Akko? Explore those regional service pages.",
  },
  "tel-aviv": {
    ids: ["ramat-gan", "holon", "bat-yam"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לתל אביב",
    titleEn: "Cities near Tel Aviv",
    introHe: "פונים גם ללקוחות מערים סמוכות? עמודי שירות לרמת גן, חולון ובת ים.",
    introEn: "Reaching buyers in nearby cities? Service pages for Ramat Gan, Holon, and Bat Yam.",
  },
  "ramat-gan": {
    ids: ["tel-aviv", "petah-tikva", "holon"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לרמת גן",
    titleEn: "Cities near Ramat Gan",
    introHe: "עסק ברמת גן שפונה גם לגוש דן? הכירו את עמודי השירות בתל אביב, בפתח תקווה ובחולון.",
    introEn: "A Ramat Gan business serving Gush Dan? Explore pages for Tel Aviv, Petah Tikva, and Holon.",
  },
  "petah-tikva": {
    ids: ["ramat-gan", "tel-aviv", "center"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "פעילים בפתח תקווה ובסביבה? עמודים נוספים לרמת גן, תל אביב ולמעטפת המרכז.",
    introEn: "Active in Petah Tikva and nearby? More pages for Ramat Gan, Tel Aviv, and the central region.",
  },
  "rishon-lezion": {
    ids: ["holon", "bat-yam"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לראשון לציון",
    titleEn: "Cities near Rishon LeZion",
    introHe: "מגיעים גם ללקוחות מחולון ומבת ים? לכל עיר עמוד שיווק דיגיטלי מקומי.",
    introEn: "Also reaching buyers in Holon and Bat Yam? Each city has its own local marketing page.",
  },
  holon: {
    ids: ["bat-yam", "tel-aviv", "rishon-lezion"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לחולון",
    titleEn: "Cities near Holon",
    introHe: "שירותים בחולון עם קהל רחב יותר? עמודים לבת ים, תל אביב וראשון לציון.",
    introEn: "Holon-based services with a wider audience? Pages for Bat Yam, Tel Aviv, and Rishon LeZion.",
  },
  "bat-yam": {
    ids: ["holon", "rishon-lezion", "tel-aviv"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לבת ים",
    titleEn: "Cities near Bat Yam",
    introHe: "עסק בבת ים שפונה ללקוחות בגוש דן הדרומי? הכירו עמודים לחולון, ראשון לציון ותל אביב.",
    introEn: "A Bat Yam business reaching southern Gush Dan? See pages for Holon, Rishon LeZion, and Tel Aviv.",
  },
  akko: {
    ids: ["haifa", "krayot"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "פועלים בעכו או משרתים את אזור חיפה והקריות? עמודי שירות מותאמים לאזורים האלה.",
    introEn: "Based in Akko or serving Haifa and the Krayot? Service pages tailored to those areas.",
  },
  hadera: {
    ids: ["netanya", "sharon"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "עסק בחדרה שפונה גם לשרון ולחוף? עמודים לנתניה ולמעטפת השרון.",
    introEn: "A Hadera business also targeting the Sharon and coast? Pages for Netanya and the Sharon region.",
  },
  afula: {
    ids: ["north", "karmiel"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "מעניקים שירות גם מחוץ לעפולה? תוכלו להכיר את אפשרויות השיווק הדיגיטלי שלנו בצפון ובכרמיאל.",
    introEn: "Serving clients beyond Afula? Explore our digital marketing pages for the north region and Karmiel.",
  },
  herzliya: {
    ids: ["raanana", "kfar-saba", "netanya"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות להרצליה",
    titleEn: "Cities near Herzliya",
    introHe: "פעילים בהרצליה ובערי השרון הסמוכות? עמודים לרעננה, כפר סבא ונתניה.",
    introEn: "Active in Herzliya and nearby Sharon towns? Pages for Raanana, Kfar Saba, and Netanya.",
  },
  "kfar-saba": {
    ids: ["raanana", "herzliya", "netanya"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לכפר סבא",
    titleEn: "Cities near Kfar Saba",
    introHe: "משרתים לקוחות בכפר סבא ובסביבה? עמודי שיווק דיגיטלי לרעננה, הרצליה ונתניה.",
    introEn: "Serving clients in Kfar Saba and the area? Digital marketing pages for Raanana, Herzliya, and Netanya.",
  },
  raanana: {
    ids: ["kfar-saba", "herzliya", "netanya"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לרעננה",
    titleEn: "Cities near Raanana",
    introHe: "עסק ברעננה שפונה גם לשרון? הכירו עמודים לכפר סבא, הרצליה ונתניה.",
    introEn: "A Raanana business also reaching Sharon buyers? Pages for Kfar Saba, Herzliya, and Netanya.",
  },
  netanya: {
    ids: ["hadera", "herzliya", "kfar-saba"],
    titleKind: "nearby",
    titleHe: "ערים סמוכות לנתניה",
    titleEn: "Cities near Netanya",
    introHe: "פעילים בנתניה ובערי השרון והחוף? עמודים לחדרה, הרצליה וכפר סבא.",
    introEn: "Active in Netanya and Sharon coastal towns? Pages for Hadera, Herzliya, and Kfar Saba.",
  },
  jerusalem: {
    ids: ["center", "sharon", "south"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "עסק בירושלים שפונה גם לשאר הארץ? עמודי מרכז, שרון ודרום לפי אזור הפעילות שלכם.",
    introEn: "A Jerusalem business serving clients across Israel? Central, Sharon, and south pages for where you operate.",
  },
  "beer-sheva": {
    ids: ["south", "ashkelon"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "פועלים בנגב או על החוף? עמוד אזור הדרום ועמוד אשקלון עם תוכן מותאם.",
    introEn: "Working in the Negev or on the coast? The south region page and Ashkelon page with tailored content.",
  },
  ashdod: {
    ids: ["ashkelon", "south"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "עסק באשדוד שמגיע גם ללקוחות בדרום? עמוד אשקלון ועמוד מעטפת הדרום.",
    introEn: "An Ashdod business reaching buyers across the south? The Ashkelon page and south region overview.",
  },
  ashkelon: {
    ids: ["ashdod", "south"],
    titleKind: "areas",
    titleHe: "אזורי שירות נוספים",
    titleEn: "More service areas",
    introHe: "פעילים באשקלון או בשאר הדרום? עמוד אשדוד ועמוד אזור הדרום לפי הצורך.",
    introEn: "Active in Ashkelon or wider southern markets? The Ashdod page and south region page as needed.",
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