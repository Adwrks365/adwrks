import type { LocationCopy } from "./types";
import { FAQ_BUDGET_ROI_HE } from "./copy-shared-he";
import { FAQ_BUDGET_ROI_EN } from "./copy-shared-en";

export type SectionRewritePatch = Partial<LocationCopy>;

function serviceFaqHe(place: string): { q: string; a: string } {
  const inPlace =
    place === "שרון" ? "באזור השרון" : place.startsWith("ב") ? place : `ב${place}`;
  return {
    q: `האם אתם מספקים שירותי שיווק דיגיטלי לעסקים ${inPlace}?`,
    a: "כן. הליווי מתבצע אונליין בפריסה ארצית — אסטרטגיה, הפעלה ודוחות מרחוק. התוכן בעמוד מותאם לקהל ובהקשר המקומי, בלי תלות במשרד פיזי בעיר.",
  };
}

function serviceFaqEn(place: string): { q: string; a: string } {
  const inPlace = place === "the Sharon" ? "in the Sharon area" : `in ${place}`;
  return {
    q: `Do you provide digital marketing services for businesses ${inPlace}?`,
    a: "Yes. Strategy, campaigns, and reporting are fully online nationwide. This page reflects local audience context — we do not present a physical office in your city.",
  };
}

/** Budget FAQ + one local Q&A + service-scope Q. */
function faqHe(place: string, extra: { q: string; a: string }): LocationCopy["faq"] {
  return [...FAQ_BUDGET_ROI_HE, extra, serviceFaqHe(place)];
}

function faqEn(place: string, extra: { q: string; a: string }): LocationCopy["faq"] {
  return [...FAQ_BUDGET_ROI_EN, extra, serviceFaqEn(place)];
}

/** Visible section copy (2026 fundamental rewrite) — applied after hero, before UX CTAs. */
export const LOCATION_SECTION_REWRITE_HE: Record<string, SectionRewritePatch> = {
  karmiel: {
    challengesTitle: "איך העסק שלכם יכול להתבלט מול המתחרים?",
    servicesIntro:
      "פרסום בגוגל, קידום אורגני, פרסום בפייסבוק ובאינסטגרם, בניית אתרים ודפי נחיתה, ואסטרטגיה שיווקית — לפי סוג העסק והתקציב בגליל.",
  },
  north: {
    servicesIntro:
      "מודעות בגוגל, קידום אורגני, פרסום ב-Meta, בניית דפי נחיתה, שיפור ביצועי אתר וליווי שיווקי — עם פילוח לפי עיר, קהל ועונה בצפון.",
    challengesPoints: [
      "תיירות ואירוח — ביקושים בעלי שיא; צריך תזמון מודעות ומסרים",
      "תעשייה ו-B2B — מחזור מכירה ארוך; תוכן וקידום אורגני ללקוחות שמשווים לאורך זמן",
      "שירותים ליישובים מרוחקים — חשיבות לחיפוש מקומי ולמפות גוגל",
      "מודעות שלא מפרידות בין קהל גלילי לקהל ארצי",
    ],
  },
  krayot: {
    challengesTitle: "איך מביאים פניות מהאזור שבאמת משרתים אתכם?",
    servicesIntro:
      "קידום מקומי בגוגל, מודעות ממוקדות, פרסום בפייסבוק ובאינסטגרם, שיפור פרופיל עסקי ודפי המרה — לשירותים שסוגרים בטלפון ובטופס.",
  },
  center: {
    challengesTitle: "תחרות גבוהה במרכז — איך בוחרים ערוץ ומסר נכונים?",
    servicesIntro:
      "Google Ads, SEO, Meta, דפי נחיתה, בניית אתרים ואסטרטגיה — עם דגש על מדידת פניות ולא על חשיפה בלבד בגוש דן.",
  },
  sharon: {
    challengesIntro:
      "בשרון יש הייטק בהרצליה, משפחות בכפר סבא ורעננה, ותיירות ונדל״ן בנתניה. קמפיין אחד «לכל האזור» מביא הרבה פעמים פניות מחוץ לרדיוס שאתם באמת משרתים.",
    servicesIntro:
      "פרסום בגוגל לפי עיר וקהל, קידום אורגני, פרסום ב-Meta, דפי נחיתה ובניית אתרים — לפי סוג הלקוח בכל יישוב.",
    faq: faqHe("שרון", {
      q: "מה ההבדל בין עמוד נתניה לעמוד השרון?",
      a: "עמוד נתניה מתמקד בעיר עצמה. עמוד השרון מתאים לעסקים שפועלים במספר יישובי השרון ורוצים פילוח ברור בין קהלים.",
    }),
    midCtaBody: "נפריד בין קהלים שונים ונמדוד תוצאות לפי עיר — בלי לבזבז תקציב על גולשים לא רלוונטיים.",
    finalCtaBody: "ספרו באילו ערים אתם פעילים — נחזור עם כיוון ראשוני לערוצים ולתקציב.",
  },
  south: {
    audienceTitle: "עסקים בדרום שרוצים פניות מדידות",
    servicesIntro:
      "פרסום בגוגל, קידום מקומי, פרסום ב-Meta, דפי נחיתה ובניית אתרים — עם הפרדה ברורה בין לקוח מקומי, תעשייה ותיירות בחוף.",
    midCtaBody: "תוכנית מרחוק עם יעדים ומדידת פניות ברורה — לפי העיר והתחום שלכם.",
    finalCtaBody: "ספרו באילו ערים אתם פעילים — נחזור אליכם עם כיוון ראשוני.",
  },
  haifa: {
    servicesIntro:
      "Google Ads, SEO, פרסום בפייסבוק ובאינסטגרם, דפי נחיתה, בניית אתרים וליווי אסטרטגי — לפי קהל B2B, שירות מקומי או מסחר בחיפה.",
  },
  "tel-aviv": {
    servicesIntro:
      "פרסום ממוקד בגוגל וב-Meta, קידום אורגני, בניית אתרים ודפי נחיתה, ושיפור מעקב אחרי פניות — עם התאמה למטרות העסק בתל אביב.",
    faq: [
      ...FAQ_BUDGET_ROI_HE,
      {
        q: "מתאים לסטארטאפ בשלב מוקדם?",
        a: "כשיש התאמה ברורה בין המוצר לקהל ויעד מדיד — כן. נגדיר קמפיין התחלתי למבחן ונמדוד לפני שמרחיבים תקציב.",
      },
    ],
  },
  jerusalem: {
    servicesIntro:
      "תוכן וקידום אורגני, פרסום בגוגל לכוונה גבוהה, פרסום ב-Meta כשמתאים, דפי נחיתה ובניית אתרים — לעסקים שמדברים לתושבים, תיירים ומוסדות.",
    challengesPoints: [
      "מחזור מכירה ארוך — תוכן שיווקי ופרסום חוזר לגולשים שכבר הכירו אתכם",
      "תיירות ומלונות — עונות ושפות",
      "שירותים מקצועיים — מוניטין ותוכן",
      "קהילות שונות — מסרים מותאמים",
    ],
  },
  "beer-sheva": {
    servicesIntro:
      "Google Ads, SEO מקומי, Meta, דפי נחיתה, בניית אתרים ואסטרטגיה — להייטק, שירותים עירוניים ועסקים בנגב.",
  },
  netanya: {
    challengesTitle: "חוף, נדל״ן ומסחר — איך מפרידים בין קהלים?",
    servicesIntro:
      "מודעות מותאמות לעונה, קידום מקומי בגוגל, פרסום ב-Meta עם תוכן ויזואלי, ובניית דפי נחיתה לפי סוג לקוח בנתניה.",
    faq: [
      ...FAQ_BUDGET_ROI_HE,
      {
        q: "האם אפשר לפרסם גם בנתניה וגם בערים נוספות בשרון?",
        a: "כן, כשהעסק פעיל במספר יישובים. נפריד קמפיינים, מסרים ומדידה לפי עיר, כדי שלא יתערבבו קהלים שונים באותו תקציב.",
      },
      serviceFaqHe("נתניה"),
    ],
  },
  "ramat-gan": {
    challengesTitle: "ליד תל אביב — איך בולטים בלי לבזבז תקציב?",
    servicesIntro:
      "פרסום בחיפוש בגוגל, קידום מקומי, פרסום ב-Meta, דפי נחיתה ובניית אתרים — עם מסר שמבדיל אתכם ממתחרים בגוש דן.",
    midCtaBody: "נבדוק יחד מדידת פניות, דף נחיתה ומודעות — ונכוון לקהל שבאמת נסגר אצלכם.",
    finalCtaBody: "ספרו על העסק והקהל שאתם מחפשים — נחזור עם כיוון ראשוני.",
  },
  "petah-tikva": {
    servicesIntro:
      "פרסום בגוגל לכוונה גבוהה, קידום אורגני לטווח ארוך, פרסום ב-Meta, דפי נחיתה ובניית אתרים — לפי שכונה, תעשייה או קהל ארצי.",
  },
  "rishon-lezion": {
    challengesTitle: "איך העסק שלכם יכול להתבלט מול המתחרים?",
    challengesIntro:
      "גולשים בראשון לציון ובסביבה משווים בין מספר ספקים לפני פנייה. ביטויי חיפוש שמציינים את העיר, יחד עם דף ותוכן ברורים, עוזרים להביא פניות שמתאימות לקהל המקומי — בלי להסתמך רק על ביטויים של גוש דן.",
    servicesIntro:
      "קידום אורגני ופרסום בגוגל יחד, פרסום ב-Meta, שיפור דפים ובניית אתרים — להתמקדות בקהל המקומי.",
  },
  holon: {
    challengesTitle: "שירותים מקומיים — איך מופיעים כשמחפשים «בחולון»?",
    servicesIntro:
      "קידום מקומי, מודעות בגוגל, פרסום ב-Meta, דפי נחיתה ובניית אתרים — לשירותים שסוגרים במפות, בטלפון ובטופס.",
  },
  "bat-yam": {
    servicesIntro:
      "קידום אורגני, פרסום בגוגל וב-Meta, דפי נחיתה, בניית אתרים ואסטרטגיה — עם התאמה לעונות, לחוף ולמגורים בעיר.",
  },
  akko: {
    servicesIntro:
      "תוכן וקידום אורגני, מודעות בגוגל וב-Meta, דפי נחיתה ובניית אתרים — לתיירות ולקהל המקומי בעכו.",
  },
  hadera: {
    challengesTitle: "בין שרון לצפון — למי אתם באמת פונים?",
    servicesIntro:
      "פרסום בגוגל, קידום אורגני, Meta, דפי נחיתה ובניית אתרים — עם פילוח ברור בין לקוח מקומי ללקוח ארצי.",
  },
  afula: {
    servicesIntro:
      "קידום מקומי בגוגל, מודעות ממוקדות, פרסום ב-Meta, דפי נחיתה ובניית אתרים — לעסקים בעמק יזרעאל.",
  },
  herzliya: {
    servicesIntro:
      "פרסום בגוגל, קידום אורגני, פרסום בפייסבוק ובאינסטגרם, בניית אתרים ודפי נחיתה, וליווי שיווקי עם מדידת פניות — להייטק ולשירותים בהרצליה.",
    faq: faqHe("הרצליה", {
      q: "מה חשוב לעסקים בהרצליה לפני שמתחילים לפרסם?",
      a: "מסר ברור, דף מהיר שמסביר את ההצעה, ומדידה של טפסים ושיחות. בשיחה הראשונה נבין יחד מה המטרה ומה תקציב הגיוני להתחלה.",
    }),
  },
  "kfar-saba": {
    challengesTitle: "שירותים לתושבים — איך מגיעים לראש תוצאות החיפוש?",
    servicesIntro:
      "קידום מקומי, מודעות בגוגל, פרסום ב-Meta, שיפור דפים ובניית אתרים — לעסקים שסוגרים ביקורות, במפות ובחיפוש מקומי.",
  },
  raanana: {
    challengesTitle: "קהל שמחפש אמון — איך בונים נוכחות דיגיטלית?",
    servicesIntro:
      "תוכן וקידום אורגני, פרסום ממוקד בגוגל וב-Meta, דפי נחיתה ובניית אתרים — לעסקים ברעננה שמוכרים שירות איכותי.",
  },
  ashdod: {
    challengesTitle: "תעשייה, נמל ושירותים עירוניים — איך מפרידים בין קהלים?",
    servicesIntro:
      "פרסום B2B וב-B2C בגוגל, קידום אורגני, Meta, דפי נחיתה ובניית אתרים — עם מסלולים נפרדים לפי סוג הלקוח באשדוד.",
  },
  ashkelon: {
    servicesIntro:
      "מודעות בגוגל, קידום מקומי, פרסום ב-Meta, דפי נחיתה ובניית אתרים — לתעשייה, לחוף ולשירותים בעיר.",
  },
};

export const LOCATION_SECTION_REWRITE_EN: Record<string, SectionRewritePatch> = {
  karmiel: {
    challengesTitle: "How can your business stand out from local competitors?",
    servicesIntro:
      "Google Ads, SEO, Meta ads, websites and landing pages, plus marketing strategy — tuned to your Galilee business and budget.",
  },
  north: {
    servicesIntro:
      "Paid search, SEO, social ads, landing pages, site performance, and ongoing strategy — split by city, audience, and season in the north.",
  },
  krayot: {
    challengesTitle: "How do you win inquiries in the neighborhoods you actually serve?",
    servicesIntro:
      "Local SEO, radius ads on Google, Meta campaigns, Business Profile optimization, and conversion-focused pages.",
  },
  center: {
    challengesTitle: "Heavy competition in the center — how do you pick the right channel?",
    servicesIntro:
      "Google Ads, SEO, Meta, landing pages, websites, and strategy — focused on qualified inquiries in Gush Dan.",
  },
  sharon: {
    servicesIntro:
      "Google Ads by city and audience, SEO, Meta, landing pages, and websites — for hi-tech, families, and coastal buyers across the Sharon.",
    faq: faqEn("the Sharon", {
      q: "What is the difference between the Netanya page and the Sharon region page?",
      a: "The Netanya page focuses on the city. The Sharon page is for businesses active across several Sharon towns and need clear audience splits.",
    }),
  },
  south: {
    audienceTitle: "Businesses in the south that want measurable inquiries",
    servicesIntro:
      "Google Ads, local SEO, Meta, landing pages, and websites — with separate paths for local services, industry, and coastal tourism.",
  },
  haifa: {
    servicesIntro:
      "Google Ads, SEO, Meta, landing pages, websites, and strategy — for B2B, local services, and retail in Haifa.",
  },
  "tel-aviv": {
    servicesIntro:
      "Paid search and Meta, SEO, landing pages, websites, and inquiry tracking — aligned with your Tel Aviv business goals.",
  },
  jerusalem: {
    servicesIntro:
      "Content and SEO, Google Ads for high intent, Meta when relevant, landing pages and websites — for residents, visitors, and institutions.",
  },
  "beer-sheva": {
    servicesIntro:
      "Google Ads, local SEO, Meta, landing pages, websites, and strategy — for hi-tech, city services, and Negev businesses.",
  },
  netanya: {
    challengesTitle: "Coast, real estate, and trade — how do you split audiences?",
    servicesIntro:
      "Seasonal campaigns, local SEO, visual Meta ads, and landing pages built for each customer type in Netanya.",
    faq: [
      ...FAQ_BUDGET_ROI_EN,
      {
        q: "Can we advertise in Netanya and other Sharon cities too?",
        a: "Yes, when you serve several towns. We split campaigns, messaging, and measurement by city so different audiences do not mix in one budget.",
      },
      serviceFaqEn("Netanya"),
    ],
  },
  "ramat-gan": {
    challengesTitle: "Next to Tel Aviv — how do you stand out without wasted spend?",
    servicesIntro:
      "Google search ads, local SEO, Meta, landing pages, and websites — with messaging that differentiates you in Gush Dan.",
  },
  "petah-tikva": {
    servicesIntro:
      "Google Ads for high intent, long-term SEO, Meta, landing pages, and websites — by neighborhood, industry, or national buyers.",
  },
  "rishon-lezion": {
    challengesTitle: "How can your business stand out from local competitors?",
    challengesIntro:
      "Shoppers in Rishon LeZion and nearby areas often compare several providers before they inquire. City-focused search terms, clear pages, and relevant content help you reach local buyers without relying only on Gush Dan wording.",
    servicesIntro:
      "SEO plus Google Ads, Meta, page improvements, and websites — focused on the local audience in Rishon LeZion.",
  },
  herzliya: {
    servicesIntro:
      "Google Ads, SEO, Facebook and Instagram ads, websites and landing pages, and ongoing marketing support with lead tracking.",
    faq: faqEn("Herzliya", {
      q: "What should Herzliya businesses prepare before running ads?",
      a: "Clear messaging, a fast page that explains the offer, and measurement on forms and calls. In the first call we align on goals and a sensible starting budget.",
    }),
  },
  holon: {
    challengesTitle: "Local services — how do you show up for «in Holon» searches?",
    servicesIntro:
      "Local SEO, Google ads, Meta, landing pages, and websites — for businesses that close on Maps, phone, and forms.",
  },
  "bat-yam": {
    servicesIntro:
      "SEO, Google and Meta ads, landing pages, websites, and strategy — adapted to seasons, the coast, and city retail.",
  },
  akko: {
    servicesIntro:
      "Content and SEO, Google and Meta ads, landing pages, and websites — for tourism and the local community in Akko.",
  },
  hadera: {
    challengesTitle: "Between Sharon and the north — who are you really targeting?",
    servicesIntro:
      "Google Ads, SEO, Meta, landing pages, and websites — with clear splits between local and nationwide buyers.",
  },
  afula: {
    servicesIntro:
      "Local SEO, Google Ads, Meta, landing pages, and websites — for businesses in the Jezreel Valley.",
  },
  "kfar-saba": {
    challengesTitle: "Home services — how do you reach the top of local search?",
    servicesIntro:
      "Local SEO, Google Ads, Meta, page improvements, and websites — for businesses that win on reviews and Maps.",
  },
  raanana: {
    challengesTitle: "Buyers who need trust — how do you build digital presence?",
    servicesIntro:
      "Content and SEO, focused Google and Meta ads, landing pages, and websites — for quality-led businesses in Raanana.",
  },
  ashdod: {
    challengesTitle: "Industry, port, and city services — how do you split audiences?",
    servicesIntro:
      "B2B and B2C Google campaigns, SEO, Meta, landing pages, and websites — with separate funnels in Ashdod.",
  },
  ashkelon: {
    servicesIntro:
      "Google Ads, local SEO, Meta, landing pages, and websites — for industry, the coast, and city services.",
  },
};

function mergeSectionPatch(copy: LocationCopy, patch: SectionRewritePatch): void {
  for (const [key, val] of Object.entries(patch)) {
    if (val === undefined) continue;
    (copy as Record<string, unknown>)[key] = val;
  }
}

export function applyLocationSectionRewriteHe(table: Record<string, LocationCopy>): void {
  for (const [id, patch] of Object.entries(LOCATION_SECTION_REWRITE_HE)) {
    const row = table[id];
    if (!row) continue;
    mergeSectionPatch(row, patch);
  }
}

export function applyLocationSectionRewriteEn(table: Record<string, LocationCopy>): void {
  for (const [id, patch] of Object.entries(LOCATION_SECTION_REWRITE_EN)) {
    const row = table[id];
    if (!row) continue;
    mergeSectionPatch(row, patch);
  }
}