import type { HubCopy, LocationCopy } from "./types";
import { polishLocationText, polishStringFields } from "./location-content-ux-polish";

const SKIP = new Set(["seoTitle", "seoDescription", "h1", "name", "areaServedName", "imageAlt"]);

export type LocationUxPatch = Partial<
  Omit<LocationCopy, "seoTitle" | "seoDescription" | "h1" | "name" | "areaServedName" | "imageAlt">
>;

function ctaHe(place: string, variant: number, midBody?: string): LocationUxPatch {
  const midTitles = [
    `רוצים יותר פניות לעסק ב${place}?`,
    `מתחילים לחזק את הנוכחות הדיגיטלית ב${place}?`,
    `מחפשים דרך להביא לקוחות נוספים ב${place}?`,
  ];
  const finalTitles = [
    "בואו נתכנן יחד את השיווק לעסק שלכם",
    "נבדוק אילו ערוצים מתאימים לכם עכשיו",
    "קבלו כיוון ראשוני — בלי התחייבות",
  ];
  const v = variant % 3;
  return {
    audienceTitle: "למי השירות מתאים?",
    midCtaTitle: midTitles[v]!,
    midCtaBody:
      midBody ??
      "נבחן יחד את השיווק הקיים, את קהל היעד ודרכים מעשיות להגדיל פניות מהאתר ומהקמפיינים.",
    finalCtaTitle: finalTitles[v]!,
    finalCtaBody:
      "ספרו על העסק והשירותים שלכם. נעזור לבחור ערוצי פרסום שמתאימים למטרות ולתקציב.",
    contactIntro: `ספרו על העסק והקהל שאתם מחפשים באזור ${place}. נחזור עם כיוון ראשוני — בלי התחייבות.`,
    popupHeadline: `שיחה על שיווק דיגיטלי ב${place}?`,
    popupDescription: "ספרו בקצרה על העסק והמטרות. נדבר על ערוצים ותקציב הגיוניים.",
  };
}

function ctaEn(place: string, variant: number, midBody?: string): LocationUxPatch {
  const midTitles = [
    `Want more inquiries for your business in ${place}?`,
    `Ready to strengthen your digital presence in ${place}?`,
    `Looking for more customers in ${place}?`,
  ];
  const finalTitles = [
    "Let's plan your marketing together",
    "See which channels fit you today",
    "Get an initial direction — no obligation",
  ];
  const v = variant % 3;
  return {
    audienceTitle: "Who is this service for?",
    midCtaTitle: midTitles[v]!,
    midCtaBody:
      midBody ??
      "We will review your current marketing, your audience, and practical ways to increase inquiries.",
    finalCtaTitle: finalTitles[v]!,
    finalCtaBody:
      "Tell us about your business and services. We will help you pick channels that fit your goals and budget.",
    contactIntro: `Tell us about your business and the customers you want in ${place}. We will reply with an initial direction.`,
    popupHeadline: `Talk about digital marketing in ${place}?`,
    popupDescription: "Briefly describe your business and goals. We will discuss sensible channels and budget.",
  };
}

/** Region/city-specific audiences — visible copy only. */
export const LOCATION_UX_PATCHES_HE: Record<string, LocationUxPatch> = {
  karmiel: {
    ...ctaHe("כרמיאל", 0),
    audienceItems: [
      "קבלני שיפוצים, חשמלאים ואינסטלטורים בגליל",
      "מסעדות, בתי קפה ומקומות אירוח בכרמיאל והסביבה",
      "קליניקות, מטפלים ורופאים פרטיים",
      "חנויות מקומיות ונותני שירות לבית",
      "משרדי עורכי דין, יועצי עסקים ורואי חשבון",
      "מפעלים, יצרנים וספקי B2B בצפון",
    ],
    servicesIntro:
      "מודעות בגוגל לחיפושים דחופים, קידום אורגני לאורך זמן, פרסום ב-Meta כשמתאים, ודפי נחיתה שמסבירים הצעה ברורה.",
  },
  north: {
    ...ctaHe("צפון הארץ", 1),
    audienceItems: [
      "עסקי תיירות, אירוח ומסעדות בגליל",
      "מפעלים וחברות תעשייה בצפון",
      "בעלי מקצוע לבית: הובלות, איטום, מיזוג",
      "מוסדות חינוך, קורסים ונותני הדרכה",
      "קליניקות ושירותי בריאות",
      "חברות B2B שמכוונות לכל הארץ מהצפון",
    ],
    challengesTitle: "קהלים שונים באזור אחד — צריך מסרים נפרדים",
  },
  krayot: {
    ...ctaHe("קריות", 2),
    audienceItems: [
      "טכנאים, מתקינים ושירותי תחזוקה לבית",
      "מספרות, מכוני יופי וקוסמטיקה",
      "חנויות ומסחר מקומי בשכונות",
      "רופאים, קליניקות ורפואה משלימה",
      "עורכי דין ומשרדי שירותים לתושב",
      "קבלנים ושיפוצנים שעובדים ברדיוס הקריות",
    ],
  },
  center: {
    ...ctaHe("מרכז הארץ", 0, "במרכז התחרות גבוהה — נבדוק אילו ערוצים ומסרים מתאימים לתקציב ולקהל שלכם."),
    audienceItems: [
      "חברות B2B ומשרדי שירות בגוש דן",
      "יבואנים, מפיצים וסיטונאות",
      "סוכנויות נדל״ן ויזמי פרויקטים",
      "מסעדות, קייטרינג ואירועים",
      "מוסדות לימוד, הכשרות והייטק",
      "עסקים שמגיעים מלקוחות בכל הארץ",
    ],
    challengesTitle: "תחרות גבוהה — חשוב לבחור ערוץ ומסר נכון",
  },
  sharon: {
    ...ctaHe("שרון", 1),
    audienceItems: [
      "חברות טכנולוגיה ושירותים לעסקים בערי השרון",
      "נדל״ן, תיווך וליווי עסקאות",
      "מסעדות ואירוח ליד החוף",
      "קליניקות ורופאים ברעננה וכפר סבא",
      "חנויות ומותגים לקהל משפחות",
      "יצרנים ומפעלים קטנים באזור",
    ],
    servicesIntro:
      "פרסום בגוגל לפי עיר וקהל, קידום מקומי, פרסום ב-Meta עם תוכן ויזואלי, ודפי נחיתה לפי סוג לקוח.",
  },
  south: {
    ...ctaHe("דרום הארץ", 2),
    audienceItems: [
      "מפעלים, לוגיסטיקה וספקים בערי הדרום",
      "עסקי תיירות ואירוח בחוף הדרומי",
      "חברות טכנולוגיה, שירותים ועסקים בערים בנגב",
      "קבלנים, שיפוצים ושירותי בית בערים הדרומיות",
      "קליניקות, רופאים ומכוני טיפול",
      "חנויות ומסעדות בשכונות ובמרכזים מסחריים",
    ],
    challengesTitle: "עיר, תעשייה וחוף — לכל אחד שפה אחרת בשיווק",
  },
  haifa: {
    ...ctaHe("חיפה", 0),
    audienceItems: [
      "חברות טכנולוגיה ושירותים בחיפה והסביבה",
      "מפעלים, הנדסה ושירותי תחזוקה",
      "מסעדות, בתי קפה ואירוח",
      "קליניקות, רופאים ומטפלים",
      "עורכי דין, רואי חשבון ויועצים",
      "חנויות ונותני שירות לשכונות ולתושבים",
    ],
  },
  "tel-aviv": {
    ...ctaHe("תל אביב", 1, "בתל אביב חשוב לדייק במסר ובמילות מפתח — נבחן יחד מה עובד לתקציב שלכם."),
    audienceItems: [
      "סטארטאפים, סוכנויות וחברות שירות",
      "מסעדות, ברים ומסחר בתל אביב",
      "קליניקות אסתטיקה ורפואה משלימה",
      "עורכי דין, רואי חשבון ויועצי עסקים",
      "משרדי נדל״ן והשכרת נכסים",
      "מסחר מקוון ומותגים שמוכרים ארצי",
    ],
    challengesTitle: "תחרות יקרה — כל קמפיין צריך מטרה ברורה",
  },
  jerusalem: {
    ...ctaHe("ירושלים", 2),
    audienceItems: [
      "מוסדות, קהילות ועמותות",
      "קליניקות, מטפלים ובריאות",
      "מסעדות ואירוח לתיירים ולתושבים",
      "חינוך, קורסים ונותני הכשרה",
      "נדל״ן, תיווך ויזמות",
      "חנויות ושירותים בשכונות ובמרכזים",
    ],
  },
  "beer-sheva": {
    ...ctaHe("באר שבע", 0),
    audienceItems: [
      "חברות טכנולוגיה ושירותים בבאר שבע",
      "קבלנים ושירותים לתושבים",
      "מסעדות, אירועים ואירוח",
      "רופאים, קליניקות וטיפולים",
      "משרדי עורכי דין וייעוץ",
      "חברות B2B בנגב",
    ],
  },
  netanya: {
    ...ctaHe("נתניה", 1),
    audienceItems: [
      "נדל״ן, תיווך ונותני שירות לדיירים",
      "מלונות, צימרים ואירוח ליד הים",
      "מסעדות ומותגי מזון",
      "קליניקות ומכוני יופי",
      "יצרנים ומסחר מקומי",
      "עסקים שפונים גם לתיירים וגם לתושבים",
    ],
    midCtaTitle: "רוצים יותר פניות מקומיות בנתניה?",
    midCtaBody: "נפריד בין קמפיינים לתיירים לבין שיווק לתושבים, ונכוון מודעות וקידום בגוגל בהתאם.",
  },
  "ramat-gan": {
    ...ctaHe("רמת גן", 2),
    audienceItems: [
      "משרדי ייעוץ, שירותים לעסקים ו-B2B",
      "רופאים, רופאי שיניים וקליניקות",
      "עורכי דין, רואי חשבון ומנהלי חשבונות",
      "חנויות ומותגים במרכזי קניות",
      "קבלנים ושירותי בית ברמת גן ובסביבה",
      "מסעדות ומזון מהיר לעובדים ולתושבים",
    ],
    challengesTitle: "ליד תל אביב — איך בולטים בלי לבזבז תקציב",
    servicesIntro:
      "פרסום בגוגל לחיפושים רלוונטיים, קידום מקומי, פרסום חוזר לעסקים שמחפשים שותף, ודפי נחיתה שמסבירים למה דווקא אתם.",
  },
  "petah-tikva": {
    ...ctaHe("פתח תקווה", 0),
    audienceItems: [
      "מפעלים וספקים באזורי התעשייה",
      "קליניקות ושירותי בריאות",
      "חנויות ורשתות מסחר",
      "קבלני שיפוץ, חשמל ואינסטלציה",
      "משרדי ייעוץ, שירותים לעסקים ו-B2B",
      "מסעדות ואספקת אוכל לעובדים",
    ],
  },
  "rishon-lezion": {
    ...ctaHe("ראשון לציון", 1),
    audienceItems: [
      "שיפוצנים, טכנאים ושירותי בית",
      "מסעדות ומזון בעיר הגדולה",
      "קליניקות ובריאות",
      "חנויות ומסחר בשכונות",
      "משרדי נדל״ן ושירותים",
      "עסקים שרוצים להתמקד בקהל מקומי לפני ביטויי חיפוש של גוש דן",
    ],
  },
  holon: {
    ...ctaHe("חולון", 2),
    audienceItems: [
      "שירותי בית: ניקיון, מנעולנים, הדברה",
      "מספרות, יופי וטיפוח",
      "מסעדות ומזון משפחתי",
      "רופאים, קליניקות ורופאי שיניים",
      "חנויות מקומיות ושירות לתושב",
      "עסקים שמשרתים גם בת ים ובבני ברק",
    ],
  },
  "bat-yam": {
    ...ctaHe("בת ים", 0),
    audienceItems: [
      "מסעדות ואירוח ליד החוף",
      "נדל״ן והשכרה למגורים",
      "שירותי בית וקבלנים",
      "חנויות וקמעונאות",
      "קליניקות וטיפולים",
      "עסקים עם לקוחות עונתיים וקבועים",
    ],
  },
  akko: {
    ...ctaHe("עכו", 1),
    audienceItems: [
      "מסעדות ותיירות בעיר העתיקה",
      "סיורים, אירוח וחוויות",
      "חנויות מזכרות ומסחר מקומי",
      "קבלנים ושיפוצים",
      "קליניקות ושירותים לתושב",
      "עסקים דו-לשוניים לתיירים ולמקומיים",
    ],
  },
  hadera: {
    ...ctaHe("חדרה", 2),
    audienceItems: [
      "עסקים בחוף הכרמל",
      "מסעדות ואירוח",
      "נדל״ן ושירותים לדיירים",
      "מפעלים וספקים",
      "קבלנים ושירותי בית",
      "קליניקות ומכוני טיפול",
    ],
  },
  afula: {
    ...ctaHe("עפולה", 0),
    audienceItems: [
      "חקלאות, מו״פ ושירותים לחקלאים",
      "מסעדות ומסחר במרכז העיר",
      "קבלנים ושירותי בית בעמק",
      "קליניקות ורופאים",
      "חנויות ונותני שירות",
      "חברות B2B מהעמק לכל הארץ",
    ],
  },
  herzliya: {
    ...ctaHe("הרצליה", 1),
    audienceItems: [
      "סטארטאפים וחברות טכנולוגיה",
      "משרדי ייעוץ, עורכי דין ופיננסים",
      "מסעדות ומותגי מזון",
      "קליניקות ושירותי בריאות",
      "נדל״ן והשכרות למגורים ולעסקים",
      "חברות שמוכרות ללקוחות בארץ ובחו״ל",
    ],
  },
  "kfar-saba": {
    ...ctaHe("כפר סבא", 2),
    audienceItems: [
      "שירותי בית לתושבים",
      "מספרות, יופי וטיפוח",
      "רופאים, רופאי שיניים וקליניקות",
      "חנויות ומרכזים מסחריים",
      "משרדי שירותים ו-B2B",
      "מסעדות ומזון משפחתי",
    ],
  },
  raanana: {
    ...ctaHe("רעננה", 0),
    audienceItems: [
      "חברות הייטק ושירותים טכנולוגיים",
      "עורכי דין, יועצים ומשרדי מקצוע",
      "קליניקות ורפואה פרטית",
      "מסעדות ואירוח לקהל מקומי",
      "חנויות ומותגים",
      "נותני שירות מקומיים לתושבים",
    ],
  },
  ashdod: {
    ...ctaHe("אשדוד", 1),
    audienceItems: [
      "תעשייה, יבוא ויצוא סביב הנמל",
      "חברות לוגיסטיקה ומחסנים",
      "שירותי בית וקבלנים באשדוד",
      "מסעדות ומסחר עירוני",
      "קליניקות ומרפאות",
      "חברות B2B שמשרתות את כל הארץ",
    ],
  },
  ashkelon: {
    ...ctaHe("אשקלון", 2),
    audienceItems: [
      "תיירות ואירוח בחוף",
      "מפעלים ומסחר",
      "שירותי בית וקבלנים",
      "מסעדות וקמעונאות",
      "קליניקות ובריאות",
      "עסקים עם לקוחות מקומיים ובאזור",
    ],
  },
};

export const LOCATION_UX_PATCHES_EN: Record<string, LocationUxPatch> = {
  karmiel: {
    ...ctaEn("Karmiel", 0),
    audienceItems: [
      "Contractors, electricians, and plumbers in the Galilee",
      "Restaurants, cafés, and local hospitality in Karmiel",
      "Clinics, therapists, and private practices",
      "Local shops and home-service providers",
      "Law firms, accountants, and business consultants",
      "Manufacturers and B2B suppliers in the north",
    ],
    servicesIntro:
      "Google Ads for urgent searches, SEO for long-term visibility, Meta when creative reach helps, and landing pages with a clear offer.",
  },
  north: {
    ...ctaEn("Northern Israel", 1),
    audienceItems: [
      "Tourism, hospitality, and restaurants in the Galilee",
      "Industrial plants and northern manufacturers",
      "Trades and home services: moving, sealing, AC",
      "Training providers and education businesses",
      "Clinics and health services",
      "B2B companies selling nationwide from the north",
    ],
  },
  krayot: {
    ...ctaEn("the Krayot", 2),
    audienceItems: [
      "Technicians, installers, and maintenance",
      "Salons, beauty, and cosmetics studios",
      "Neighborhood shops and local retail",
      "Doctors, clinics, and allied health",
      "Lawyers and local professional offices",
      "Contractors working across the Krayot towns",
    ],
  },
  center: {
    ...ctaEn("Central Israel", 0),
    audienceItems: [
      "B2B companies and service firms in Gush Dan",
      "Importers, distributors, and wholesalers",
      "Real-estate agencies and project marketers",
      "Restaurants, catering, and events",
      "Education, training, and tech companies",
      "Businesses with customers nationwide",
    ],
  },
  sharon: {
    ...ctaEn("the Sharon", 1),
    audienceItems: [
      "Hi-tech and B2B services in Herzliya",
      "Real estate and brokerage in Netanya",
      "Coastal restaurants and hospitality",
      "Clinics and private medicine in Raanana and Kfar Saba",
      "Retail and family-focused brands",
      "Small manufacturers in the region",
    ],
  },
  south: {
    ...ctaEn("the South", 2),
    audienceItems: [
      "Industry, logistics, and port-related businesses in Ashdod",
      "Coastal tourism and hospitality in Ashkelon",
      "Hi-tech and services in Beer Sheva",
      "Trades and home services in southern cities",
      "Clinics, doctors, and treatment centers",
      "Shops and restaurants in neighborhoods and malls",
    ],
  },
  haifa: {
    ...ctaEn("Haifa", 0),
    audienceItems: [
      "Technology companies and professional services in Haifa",
      "Plants, engineering, and maintenance",
      "Restaurants, cafés, and events",
      "Clinics, doctors, and therapists",
      "Lawyers, accountants, and advisors",
      "Shops and services for residents",
    ],
  },
  "tel-aviv": {
    ...ctaEn("Tel Aviv", 1),
    audienceItems: [
      "Startups, agencies, and B2B services",
      "Restaurants, bars, and retail",
      "Aesthetic clinics and wellness",
      "Law, accounting, and business advisory",
      "Real-estate offices and rentals",
      "E-commerce and national brands",
    ],
  },
  jerusalem: {
    ...ctaEn("Jerusalem", 2),
    audienceItems: [
      "Institutions, communities, and nonprofits",
      "Clinics, therapists, and healthcare",
      "Restaurants and hospitality for visitors and residents",
      "Education, courses, and training",
      "Real estate and brokerage",
      "Shops and local services",
    ],
  },
  "beer-sheva": {
    ...ctaEn("Beer Sheva", 0),
    audienceItems: [
      "Technology and service companies in Beer Sheva",
      "Contractors and home services",
      "Restaurants, events, and hospitality",
      "Clinics and medical practices",
      "Law and consulting offices",
      "B2B companies in the Negev",
    ],
  },
  netanya: {
    ...ctaEn("Netanya", 1),
    audienceItems: [
      "Real estate, brokerage, and resident services",
      "Hotels, guesthouses, and coastal hospitality",
      "Restaurants and food brands",
      "Clinics and beauty businesses",
      "Manufacturing and local retail",
      "Businesses serving both tourists and locals",
    ],
  },
  "ramat-gan": {
    ...ctaEn("Ramat Gan", 2),
    audienceItems: [
      "B2B offices and consultants in towers",
      "Doctors, dentists, and clinics",
      "Lawyers, accountants, and bookkeeping",
      "Retail in shopping areas",
      "Trades and home services in Ramat Gan",
      "Restaurants serving workers and residents",
    ],
    servicesIntro:
      "Google Ads for relevant searches, local SEO, follow-up ads for warm audiences, and landing pages that explain your edge.",
  },
  "petah-tikva": {
    ...ctaEn("Petah Tikva", 0),
    audienceItems: [
      "Industrial suppliers and plants",
      "Clinics and healthcare",
      "Retail chains and shops",
      "Renovation, electrical, and plumbing trades",
      "B2B and professional services",
      "Restaurants and workplace catering",
    ],
  },
  "rishon-lezion": {
    ...ctaEn("Rishon LeZion", 1),
    audienceItems: [
      "Trades and home services",
      "Restaurants in a large mixed city",
      "Clinics and wellness",
      "Neighborhood retail",
      "Real-estate and services",
      "Businesses winning locally before bidding on Tel Aviv terms",
    ],
  },
  holon: {
    ...ctaEn("Holon", 2),
    audienceItems: [
      "Home services: cleaning, locksmiths, pest control",
      "Salons, beauty, and grooming",
      "Family restaurants",
      "Doctors, dentists, and clinics",
      "Local shops",
      "Businesses serving Holon, Bat Yam, and nearby",
    ],
  },
  "bat-yam": {
    ...ctaEn("Bat Yam", 0),
    audienceItems: [
      "Coastal restaurants and hospitality",
      "Residential real estate and rentals",
      "Trades and contractors",
      "Retail",
      "Clinics and treatments",
      "Businesses with seasonal and year-round clients",
    ],
  },
  akko: {
    ...ctaEn("Akko", 1),
    audienceItems: [
      "Old City restaurants and tourism",
      "Tours, hospitality, and experiences",
      "Souvenir and local retail",
      "Contractors and renovation",
      "Services for residents",
      "Bilingual businesses for visitors and locals",
    ],
  },
  hadera: {
    ...ctaEn("Hadera", 2),
    audienceItems: [
      "Coastal Carmel businesses",
      "Restaurants and events",
      "Real estate and resident services",
      "Suppliers and plants",
      "Trades and home services",
      "Clinics and treatment centers",
    ],
  },
  afula: {
    ...ctaEn("Afula", 0),
    audienceItems: [
      "Agriculture and agri-services",
      "City-center restaurants and retail",
      "Trades in the Jezreel Valley",
      "Clinics and doctors",
      "Local shops and services",
      "B2B companies from the valley nationwide",
    ],
  },
  herzliya: {
    ...ctaEn("Herzliya", 1),
    audienceItems: [
      "Startups and hi-tech",
      "Consulting, legal, and finance offices",
      "Premium food and restaurant brands",
      "Healthcare clinics",
      "Real estate in Herzliya Pituach",
      "Companies selling in Israel and abroad",
    ],
  },
  "kfar-saba": {
    ...ctaEn("Kfar Saba", 2),
    audienceItems: [
      "Home services for residents",
      "Salons and beauty",
      "Doctors, dentists, clinics",
      "Shops and malls",
      "B2B and professional offices",
      "Family restaurants",
    ],
  },
  raanana: {
    ...ctaEn("Ra'anana", 0),
    audienceItems: [
      "Tech and professional services",
      "Law, consulting, and finance",
      "Private clinics",
      "Local restaurants and events",
      "Retail brands",
      "High-quality local service providers",
    ],
  },
  ashdod: {
    ...ctaEn("Ashdod", 1),
    audienceItems: [
      "Port-related industry and import/export",
      "Logistics and warehouses",
      "Trades and home services",
      "Urban restaurants and retail",
      "Clinics and medical practices",
      "B2B selling nationwide",
    ],
  },
  ashkelon: {
    ...ctaEn("Ashkelon", 2),
    audienceItems: [
      "Coastal tourism and hospitality",
      "Industry and trade",
      "Trades and contractors",
      "Restaurants and retail",
      "Healthcare clinics",
      "Businesses with local and regional clients",
    ],
  },
};

export const HUB_UX_PATCH_HE: Partial<HubCopy> = {
  contactIntro: "ספרו באיזה אזור העסק פועל ומה חשוב לכם בשיווק — נחזור עם כיוון ראשוני, בלי התחייבות.",
  finalCtaBody: "ספרו על העסק והאזור שבו אתם פועלים. נעזור לבחור ערוצים שמתאימים למטרות ולתקציב.",
  popupDescription: "ספרו על העסק והמטרות. נבחן יחד אילו ערוצים ותקציב הגיוניים לפני התחייבות.",
  regionsIntro: "בחרו את האזור הקרוב אליכם לתובנות מקומיות, או צרו קשר לשיחת ייעוץ כללית.",
};

export const HUB_UX_PATCH_EN: Partial<HubCopy> = {
  contactIntro:
    "Tell us where your business operates and what you need from marketing — we will reply with an initial direction, no obligation.",
  finalCtaBody:
    "Tell us about your business and service area. We will help you choose channels that fit your goals and budget.",
  popupDescription:
    "Tell us about your business and goals. We will discuss sensible channels and budget before any commitment.",
  regionsIntro: "Choose your area for local insights, or contact us for general guidance.",
};

function mergePatch(copy: LocationCopy, patch: LocationUxPatch): void {
  for (const [key, val] of Object.entries(patch)) {
    if (val === undefined) continue;
    if (key === "faq" && Array.isArray(val)) {
      copy.faq = val as LocationCopy["faq"];
    } else {
      (copy as Record<string, unknown>)[key] = val;
    }
  }
}

function polishLead(copy: LocationCopy, locale: "he" | "en"): void {
  copy.lead = polishLocationText(copy.lead, locale);
}

export function applyLocationContentUx2026He(table: Record<string, LocationCopy>): void {
  for (const row of Object.values(table)) {
    polishStringFields(row, "he", SKIP);
    polishLead(row, "he");
  }
  for (const [id, patch] of Object.entries(LOCATION_UX_PATCHES_HE)) {
    const row = table[id];
    if (!row) continue;
    mergePatch(row, patch);
    polishStringFields(row, "he", SKIP);
  }
}

export function applyLocationContentUx2026En(table: Record<string, LocationCopy>): void {
  for (const row of Object.values(table)) {
    polishStringFields(row, "en", SKIP);
    polishLead(row, "en");
  }
  for (const [id, patch] of Object.entries(LOCATION_UX_PATCHES_EN)) {
    const row = table[id];
    if (!row) continue;
    mergePatch(row, patch);
    polishStringFields(row, "en", SKIP);
  }
}

export function applyHubContentUx2026He(hub: HubCopy): void {
  Object.assign(hub, HUB_UX_PATCH_HE);
  polishStringFields(hub, "he", new Set(["seoTitle", "seoDescription", "h1"]));
}

export function applyHubContentUx2026En(hub: HubCopy): void {
  Object.assign(hub, HUB_UX_PATCH_EN);
  polishStringFields(hub, "en", new Set(["seoTitle", "seoDescription", "h1"]));
}