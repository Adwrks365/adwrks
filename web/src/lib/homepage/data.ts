/** Homepage content sourced from production Elementor (page ID 7) — not REST body HTML. */

import { toLocalMediaUrl } from "@/lib/media/urls";

function u(filename: string): string {
  return toLocalMediaUrl(`https://adwrks.co.il/wp-content/uploads/${filename}`);
}

export const HOMEPAGE_IMAGES = {
  heroBg: u("digital-marketing-2-e1769683414846.webp"),
  heroBgAlt: "מומחית שיווק דיגיטלי עובדת על מחשב נייד - סוכנות אדוורקס 365",
  heroPhoto: u("adwrks-marketing-solutions.webp"),
  heroPhotoAlt:
    "סמארטפון המציג לקוחות מרוצים מהשיווק הדיגיטלי של סוכנות Adwrks 365",
  authorityPhoto: u("5-3.png"),
  envelopePhoto: u("7-1.png"),
  partnersOverlay: u("partners-e1769685310241.webp"),
  googlePartnerBadge:
    "https://www.gstatic.com/partners/badge/images/2025/PartnerBadgeClickable.svg",
} as const;

export type HomepageCounter = {
  target: number;
  suffix: string;
  label: string;
  ariaValue: string;
};

/** Verified production stat values — number + suffix kept LTR (8+, 500K+, etc.). */
export const HOMEPAGE_COUNTERS: readonly HomepageCounter[] = [
  { target: 8, suffix: "+", label: "שנות מוניטין", ariaValue: "8+" },
  { target: 500, suffix: "K+", label: "ניהול תקציבים", ariaValue: "500K+" },
  { target: 185, suffix: "+", label: "לקוחות מרוצים", ariaValue: "185+" },
  { target: 6, suffix: "+", label: "ליווי מומחים", ariaValue: "6+" },
] as const;

export const HOMEPAGE_SERVICE_LIST = [
  {
    text: "בניית אתרים ודפי נחיתה אפקטיביים",
    href: "/website-building/",
  },
  { text: "ניהול קמפיינים ממוקדי המרה ו- (PPC)", href: "/google-ads/" },
  { text: "קידום אורגני ואופטימיזציית AI (SEO/AIO)", href: "/seo/" },
  { text: "ניהול מודעות במנועי חיפוש (SEM/SEA)" },
  {
    text: "אסטרטגיית תוכן ושיווק ברשתות חברתיות",
    href: "/social-media-management/",
  },
  {
    text: "פרסום וקידום בגוגל מפות",
    href: "/פרסום-בגוגל-מפות/",
  },
  { text: "פרסום בשפה עברית, רוסית ואנגלית" },
  { text: "עיצוב ושיווק תכנים בהתאמה אישית" },
] as const;

export const HOMEPAGE_VALUE_CARDS = [
  {
    title: "ליווי אסטרטגי אישי",
    description:
      "תכנון אסטרטגי המותאם אישית למבנה העסק, למתחרים וליעדי הרווחיות שלכם.",
  },
  {
    title: "ביסוס סמכות ומותג",
    description:
      "בניית נכסים דיגיטליים שהופכים אתכם לאוטוריטה בתחומכם ומייצרים צמיחה יציבה.",
  },
  {
    title: "שיווק מבוסס תוצאות",
    description:
      'אופטימיזציה שוטפת לשיפור איכות הפניות במינימום עלות ע"י שימוש בטכנולוגיות AI ו-AIO.',
  },
  {
    title: "ניסיון מקצועי מוכח",
    description:
      "ניהול תיקי לקוחות בהיקפים שונים מאז 2018 – הניסיון שלנו הוא השקט הנפשי שלכם.",
  },
  {
    title: "מעטפת שיווק דיגיטלי 360°",
    description:
      "ניהול מלא של כל ערוצי השיווק (SEO, PPC, Web) בסנכרון מלא להשגת תוצאות מקסימליות.",
  },
  {
    title: "מיקוד ב-ROI ובמכירות",
    description:
      "אסטרטגיית המרה חכמה שנועדה להפוך כל גולש ללקוח משלם ולשפר את שורת הרווח.",
  },
] as const;

export const HOMEPAGE_TESTIMONIALS = [
  {
    name: "Itzik Abramov Car Detailing",
    title: "‏קוסמטיקאר שירותי דיטיילינג",
    content:
      "מומלץ מאד \nסרגיי מקצוען 👌🏼\nאלופים בשירות ושווה כל שקל 👍 \nהשקעה בטוחה לכסף שלך",
    image: u("62523404_10219424136777844_3135336502720987136_n-150x150.webp"),
  },
  {
    name: "Danny Ben Atar",
    title: "דני מחשבים",
    content:
      "הקידום היחידי שעובד!!!\nחבר'ה אלופים ומקצוענים בראשם סרגיי\nבמחיר נוח ויחס מעולה ואיכפתי וקשוב\nפשוט אלופים🏆🏆🏆🙏",
    image: u("204687284_4055670721208389_2009856386006580434_n-150x150.webp"),
  },
  {
    name: "דויד אשטה",
    title: "אק-סום שרותי נדל''ן",
    content:
      "כמו שאני אוהב💛 סופר מקצועים יכולת מצויינת לזהות צרכים של לקוחות .שירות אדיב מחר הקשבה .ממליץ לכל אחד",
    image: u("131454395_4207174812630257_820089504248676407_n-150x150.webp"),
  },
  {
    name: "אמיר אמסלם",
    title: "אמיר חשמל ודיאגנוסטיקה לרכב",
    content:
      "אני ממליץ עליהם כי קודם כל הם בני אדם לפני הכל ושיווק ופרסום שלהם העלה את המודעות אצל הרבה אנשים לגבי העסק שלי מי עסק שלי ואיזה שירותים אני נותן . ממליץ בחום נותנים תמורה מעבר לתשלום שהם גובים .",
    image: u("23334247_1577479552307221_1915736016569884908_o-150x150.webp"),
  },
  {
    name: "אלעד שבתאי",
    title: "קמרי את שבתאי שילוביצקי ושות' - משרד עורכי דין",
    content:
      "מאוד מומלצים! חברה רצינית ששואפת לשלמות. עשו עבודה איכותית הניבה תוצאות באופן מיידי.",
    image: u("19388777_10211736809509377_8947026352501099299_o-150x150.webp"),
  },
] as const;

/** Verified homepage "התוצאות מדברות בעד עצמן" quotes from the migrated WordPress page. */
export const HOMEPAGE_RESULT_QUOTES = [
  {
    name: "שחר טיירי",
    content:
      "שירות מצוין ומקצועי! Adwrks 365 עושים עבודה נהדרת בניהול וקידום האתר שלי, כמו גם בפרסום בפייסבוק ובאינסטגרם. בזכותם החשיפה שלי גדלה משמעותית, והלקוחות החדשים זורמים באופן קבוע. הצוות מקצועי, זמין תמיד לכל שאלה, ומספק פתרונות יצירתיים שמביאים תוצאות בשטח. ממליץ בחום לכל מי שמחפש חברת פרסום שיודעת להביא תוצאות!",
  },
  {
    name: "טל שינה",
    highlight: "תוצאה בולטת",
    content:
      "מאז שאני מפרסם אצלם העבודה עלתה לי ב־350%, כמובן בשילוב מחירים הוגנים ויחס אישי צמוד בכל שעה. לא הכרתי את Adwrks 365 לפני כן ומעולם לא ראיתי אותם – אבל אני מאוד ממליץ עליהם.",
  },
  {
    name: "רביב ברגר",
    content: "שירות מדהים, איש מקצוע מעולה. ממליץ בחום על סרגי – עובד איתנו בפרויקט גדול. תודה על הכל.",
  },
] as const;

/** @deprecated Use PORTFOLIO_PROJECTS from @/lib/portfolio/projects */
export { LEGACY_HOMEPAGE_PORTFOLIO_URLS as HOMEPAGE_PORTFOLIO } from "@/lib/portfolio/projects";

/** Marketing channels first, then creation/CMS/AI tools — verified local assets. */
export const HOMEPAGE_PLATFORM_LOGOS = [
  { src: u("googlelogo.png"), alt: "Google", group: "channel" },
  { src: u("facebook-logo.png"), alt: "Facebook", group: "channel" },
  { src: u("instagram.png"), alt: "Instagram", group: "channel" },
  { src: u("youtube-logo.png"), alt: "YouTube", group: "channel" },
  { src: u("WordPress_logo_removebg.png"), alt: "WordPress", group: "tool" },
  { src: u("canva-removebg.png"), alt: "Canva", group: "tool" },
  { src: u("chat-gpt-removebg.png"), alt: "ChatGPT", group: "tool" },
  { src: u("gemini-removebg.png"), alt: "Gemini", group: "tool" },
] as const;

export const HOMEPAGE_FAQ = [
  {
    question: "אילו שירותי שיווק דיגיטלי אתם מציעים?",
    answer:
      "Adwrks 365 היא סוכנות שיווק דיגיטלי המספקת מעטפת מלאה לעסקים מכל התחומים. השירותים כוללים בניית אתרים, קידום אורגני (SEO), קידום מבוסס AI, פרסום ממומן בגוגל וברשתות החברתיות, ניהול סושיאל ואסטרטגיה דיגיטלית.",
  },
  {
    question: "איך שיווק דיגיטלי יכול לעזור לעסק שלי לצמוח?",
    answer:
      "שיווק דיגיטלי מאפשר לעסקים להגיע ללקוחות בדיוק ברגע שהם מחפשים פתרון. שילוב נכון של SEO, פרסום ממומן ותוכן איכותי מאפשר להגדיל חשיפה, לידים ומכירות בצורה מדידה.",
  },
  {
    question: "מה ההבדל בין קידום אורגני, פרסום ממומן וקידום מבוסס AI?",
    answer:
      "קידום אורגני בונה נוכחות ארוכת טווח, פרסום ממומן מייצר תוצאות מיידיות, וקידום מבוסס AI מתאים את האתר לעולמות חיפוש מתקדמים כמו AI Overviews וחיפוש סמנטי. השילוב ביניהם יוצר אסטרטגיה יציבה ואפקטיבית.",
  },
  {
    question: "למי השירותים של Adwrks 365 מתאימים?",
    answer:
      "השירותים מתאימים לעסקים קטנים, בינוניים וגדולים מכל התחומים – אתרי תדמית, חנויות אונליין, נותני שירותים וארגונים, עם התאמה אישית לפי מטרות ותקציב.",
  },
  {
    question: "תוך כמה זמן ניתן לראות תוצאות?",
    answer:
      "פרסום ממומן יכול להניב תוצאות תוך ימים, בעוד קידום אורגני ותהליכי AI דורשים מספר חודשים. בכל מקרה התהליך מלווה במדידה, אופטימיזציה ושקיפות.",
  },
  {
    question: "האם אתם בונים אתרים כחלק מהשירות?",
    answer:
      "כן. אנו בונים אתרים עם דגש על חוויית משתמש, מהירות, SEO, התאמה ל-AI והנעה לפעולה – כבסיס לכל פעילות שיווקית מוצלחת.",
  },
] as const;

export const HOMEPAGE_FAQ_AUTHORITY =
  "התשובות מבוססות על ניסיון מעשי בשיווק דיגיטלי, קידום אתרים, ניהול קמפיינים ממומנים וליווי עסקים מכל התחומים בישראל.";

/** Post thumbnail URLs from production homepage (seo audit). */
export const RECENT_POST_IMAGES: Record<string, string> = {
  "/שיפור-מהירות-אתר-2026-pagespeed/": u("website-pagespeed-300x200.webp"),
  "/מחשבון-roi-מעודכן-2026/": u("Image-Jun-12-2026-10_50_18-AM-300x169.webp"),
  "/seo-2026-ai-answers/": u("seo-future-1-300x158.webp"),
};
