import type { Locale } from "@/i18n/routing";
import { SITE_CHECK_EN_PATH, SITE_CHECK_HE_PATH } from "./paths";

export type SiteCheckPillar = {
  title: string;
  text: string;
  icon: "search" | "layout" | "contact";
};

export type SiteCheckCopy = {
  path: string;
  seoTitle: string;
  seoDescription: string;
  badge: string;
  title: string;
  seoFocusTitle: string;
  lead: string;
  urlLabel: string;
  urlPlaceholder: string;
  submit: string;
  runningActive: string;
  immediateNote: string;
  demoLabel: string;
  demoLine: string;
  resultsTitle: string;
  scopeHeading: string;
  metricContent: string;
  metricFindings: string;
  metricBroken: string;
  speedCardTitle: string;
  speedUnavailableConfig: string;
  speedUpstreamError: string;
  whyLabel: string;
  impactLabel: string;
  checkedHeading: string;
  pagesFailedLabel: string;
  noFindingsTitle: string;
  positiveHeading: string;
  formTitle: string;
  formTitleClear: string;
  formTitleFailure: string;
  formBody: string;
  formBodyClear: string;
  formSubmit: string;
  speedButton: string;
  speedRunning: string;
  speedScoreLabel: string;
  speedLabNote: string;
  speedTipGeneric: string;
  speedUnavailable: string;
  speedLimit: string;
  speedError: string;
  formNote: string;
  callLabel: string;
  nameLabel: string;
  phoneLabel: string;
  success: string;
  errorInvalid: string;
  errorLimit: string;
  errorUnread: string;
  errorDns: string;
  errorTimeout: string;
  errorBlocked: string;
  errorHttp: string;
  errorNotHtml: string;
  errorEmpty: string;
  errorGeneric: string;
  errorService: string;
  errorRateLimited: string;
  retryScan: string;
  pillarsTitle: string;
  pillars: readonly SiteCheckPillar[];
  faqTitle: string;
  faq: readonly { q: string; a: string }[];
};

const HE: SiteCheckCopy = {
  path: SITE_CHECK_HE_PATH,
  seoTitle: "בדיקת אתר לעסק | Adwrks 365",
  seoDescription:
    "בדיקה ראשונית לאתר עסקי: כותרות, עמודים שנפתחו ודרכי פנייה. עד שלושה ממצאים מיד, בלי להשאיר פרטים. אחר כך שיחה והצעה לשיפור ולקידום.",
  badge: "כלי בדיקה · בלי התחייבות",
  title: "מה כדאי לשפר באתר שלכם קודם?",
  seoFocusTitle: "מה כדאי לשפר בקידום האתר שלכם בגוגל קודם?",
  lead: "הדביקו את כתובת האתר ונבדוק כמה מהעמודים החשובים בו. נראה אם קל להבין מה אתם מציעים, למצוא את השירות המתאים וליצור איתכם קשר. אם נמצא משהו שכדאי לשפר, נציג אותו ונראה באיזה עמוד הוא נמצא.",
  urlLabel: "כתובת האתר",
  urlPlaceholder: "example.co.il",
  submit: "בדקו את האתר שלי",
  runningActive: "בודקים את האתר…",
  immediateNote: "תוצאות ראשוניות ללא השארת פרטים",
  demoLabel: "דוגמה לתוצאה",
  demoLine: "עמוד יצירת קשר · מספר הטלפון באתר אינו לחיץ",
  resultsTitle: "תוצאות הבדיקה",
  scopeHeading: "מה נבדק",
  metricContent: "עמודי תוכן שנבדקו",
  metricFindings: "ממצאים חשובים",
  metricBroken: "קישורים שבורים שאומתו",
  speedCardTitle: "מהירות במובייל",
  speedUnavailableConfig: "בדיקת המהירות לא זמינה כרגע. אפשר לנסות שוב מאוחר יותר.",
  speedUpstreamError: "ממשק PageSpeed לא החזיר תוצאה כרגע. נסו שוב מאוחר יותר.",
  whyLabel: "למה זה חשוב",
  impactLabel: "מה זה אומר למבקרים",
  checkedHeading: "עמודים שנבדקו",
  pagesFailedLabel: "עמודים שלא נטענו",
  noFindingsTitle: "לא נמצא ממצא בולט",
  positiveHeading: "מה בדקנו ונראה תקין",
  formTitle: "רוצים שנעבור איתכם על התוצאות ונציע מה לשפר?",
  formTitleClear: "רוצים לתכנן את הצעד הבא?",
  formTitleFailure: "רוצים שנבדוק את האתר ונחזור אליכם?",
  formBody: "",
  formBodyClear:
    "בדיקה מקיפה יכולה לעזור לזהות אילו עמודים כדאי לקדם, אילו חיפושים רלוונטיים לעסק שלכם ואיך לשפר את הנראות בגוגל ובתשובות AI.",
  formSubmit: "חזרו אליי לשיחת ייעוץ",
  speedButton: "בדקו מהירות",
  speedRunning: "בודקים מהירות במובייל…",
  speedScoreLabel: "ציון ביצועים (מובייל)",
  speedLabNote: "מדידת מעבדה לדף הבית שנבדק — לא בהכרח כמו מכשיר אמיתי ברשת סלולרית.",
  speedTipGeneric: "כדאי לצמצם משקל תמונות ולדחות סקריפטים שאינם חיוניים בטעינה הראשונית.",
  speedUnavailable: "בדיקת המהירות אינה זמינה כרגע.",
  speedLimit: "הגעתם למכסה היומית של בדיקות המהירות. נסו שוב מחר.",
  speedError: "בדיקת המהירות לא הושלמה. נסו שוב מאוחר יותר.",
  formNote: "שיחת היכרות ללא התחייבות.",
  callLabel: "מעדיפים להתקשר?",
  nameLabel: "שם",
  phoneLabel: "טלפון",
  success: "קיבלנו את הפרטים. נחזור אליכם לשיחת ייעוץ קצרה.",
  errorInvalid: "כתובת לא תקינה. אפשר דומיין בלי https (למשל example.co.il) או כתובת מלאה עם https:// או http://.",
  errorLimit: "הגעתם למכסה היומית של הבדיקות. נסו שוב מחר, או השאירו פרטים ונחזור אליכם.",
  errorUnread: "לא הצלחנו לקרוא את האתר. בדקו את הכתובת, או השאירו פרטים ונבדוק אותו בשיחה.",
  errorDns: "לא מצאנו את הדומיין ברשת. בדקו שהכתובת נכונה ונסו שוב, או השאירו פרטים ונבדוק ידנית.",
  errorTimeout: "האתר לא הגיב בזמן. ייתכן שהוא איטי או לא זמין כרגע — נסו שוב או השאירו פרטים.",
  errorBlocked: "לא ניתן לבדוק את האתר אוטומטית מרחוק. אפשר להשאיר פרטים ונחזור אליכם אחרי בדיקה ידנית.",
  errorHttp: "השרת של האתר החזיר שגיאה. נסו שוב מאוחר יותר או השאירו פרטים.",
  errorNotHtml: "הכתובת לא החזירה דף אינטרנט שניתן לקרוא.",
  errorEmpty: "דף הבית נראה ריק או חסום לקריאה אוטומטית.",
  errorGeneric: "לא ניתן להשלים את הבדיקה כרגע. נסו שוב בעוד רגע.",
  errorService: "שירות הבדיקה לא זמין כרגע בשרת. נסו שוב מאוחר יותר, או השאירו פרטים.",
  errorRateLimited:
    "האתר הגביל בקשות רגעית (429). לא סימנו את זה כקישור שבור — נסו שוב בעוד דקה או השאירו פרטים.",
  retryScan: "נסו שוב",
  pillarsTitle: "מה הבדיקה בודקת",
  pillars: [
    {
      icon: "search",
      title: "נראות בגוגל",
      text: "כותרת עמוד, תיאור מטא, סימון אינדוקס וכותרת ראשית בעמודים שנפתחו.",
    },
    {
      icon: "layout",
      title: "מבנה וכותרות",
      text: "האם לעמודים יש כותרת ברורה, והאם יש כפילויות בין עמודי שירות.",
    },
    {
      icon: "contact",
      title: "דרכי יצירת קשר",
      text: "קישור חיוג, וואטסאפ, טופס וניווט ליצירת קשר — במיוחד במובייל.",
    },
  ],
  faqTitle: "שאלות נפוצות על בדיקת האתר",
  faq: [
    {
      q: "האם הבדיקה עולה כסף?",
      a: "לא. התוצאה מוצגת מיד, בלי השארת פרטים ובלי התחייבות.",
    },
    {
      q: "מה בדיוק נסרק?",
      a: "הכלי פותח את דף הבית ועד שלושה עמודים פנימיים שהאתר מקשר אליהם — למשל שירות או יצירת קשר. נבדוק כותרות, תיאורי עמוד, כותרות בתוך העמוד ודרכים ליצור קשר (טלפון, טופס, ניווט). מוצגים עד שלושה ממצאים לפי סדר חשיבות.",
    },
    {
      q: "מה הבדיקה לא כוללת?",
      a: "אין דירוג או מיקום בגוגל, אין מחקר מילות מפתח, ניתוח מתחרים או תכנית עבודה מלאה. הסריקה קוראת את ה-HTML שהאתר מחזיר; אתר שנטען רק אחרי פעולה בדפדפן עלול להיראות חלקי.",
    },
    {
      q: "האם אראה את כל הבעיות באתר?",
      a: "לא. זו בדיקה ראשונית — עד שלושה ממצאים, לא דוח מלא.",
    },
    {
      q: "מה נשלח אם משאירים שם וטלפון?",
      a: "לצוות נשלחים השם, הטלפון, כתובת האתר, העמודים שנבדקו והממצאים מהמסך — כדי לחזור אליכם לשיחת ייעוץ.",
    },
  ],
};

const EN: SiteCheckCopy = {
  path: SITE_CHECK_EN_PATH,
  seoTitle: "Business website check | Adwrks 365",
  seoDescription:
    "A first look at a business website: titles, pages opened, and ways to get in touch. Up to three findings immediately, before you leave your details.",
  badge: "Site check tool · no commitment",
  title: "What should you improve on your site first?",
  seoFocusTitle: "What should you improve in your site's Google visibility first?",
  lead: "Paste your website address and we'll open some of the pages that matter most. We'll see whether visitors can understand your offer, find the right service, and get in touch. If we spot something worth fixing, we'll show it and which page it's on.",
  urlLabel: "Website address",
  urlPlaceholder: "example.com",
  submit: "Check my site",
  runningActive: "Checking the site…",
  immediateNote: "First results without leaving your details",
  demoLabel: "Sample result",
  demoLine: "Contact page · The phone number on the site isn't tappable",
  resultsTitle: "Check results",
  scopeHeading: "What we checked",
  metricContent: "Content pages opened",
  metricFindings: "Priority findings",
  metricBroken: "Broken links verified",
  speedCardTitle: "Mobile speed",
  speedUnavailableConfig: "Speed check isn't available right now. You can try again later.",
  speedUpstreamError: "The PageSpeed API did not return a result right now. Try again later.",
  whyLabel: "Why it matters",
  impactLabel: "What this means for visitors",
  checkedHeading: "Pages checked",
  pagesFailedLabel: "Pages that didn't load",
  noFindingsTitle: "No standout finding",
  positiveHeading: "What looked fine in this check",
  formTitle: "Want us to walk through the results and suggest what to fix?",
  formTitleClear: "Want to plan the next step?",
  formTitleFailure: "Want us to check the site and get back to you?",
  formBody: "",
  formBodyClear:
    "A deeper review can show which pages to prioritize, which searches matter for your business, and how to improve visibility in Google and AI answers.",
  formSubmit: "Call me back for a consult",
  speedButton: "Check speed",
  speedRunning: "Checking mobile speed…",
  speedScoreLabel: "Performance score (mobile)",
  speedLabNote: "Lab measurement for the homepage we checked — not necessarily the same as a real phone on mobile data.",
  speedTipGeneric: "Consider trimming image weight and deferring scripts that are not needed on first load.",
  speedUnavailable: "Speed check is not available right now.",
  speedLimit: "You've reached today's speed check limit. Try again tomorrow.",
  speedError: "The speed check did not complete. Try again later.",
  formNote: "An introductory call, with no commitment.",
  callLabel: "Prefer to call?",
  nameLabel: "Name",
  phoneLabel: "Phone",
  success: "Got it. We'll call you back for a short consult.",
  errorInvalid:
    "Invalid address. Use a domain without https (e.g. example.com) or a full URL with https:// or http://.",
  errorLimit: "You've reached today's check limit. Try again tomorrow, or leave your details and we'll call.",
  errorUnread: "We couldn't read that site. Check the address, or leave your details and we'll look at it on the call.",
  errorDns: "We couldn't find that domain. Check the spelling and try again, or leave your details for a manual review.",
  errorTimeout: "The site didn't respond in time. It may be slow or down — try again or leave your details.",
  errorBlocked: "We can't run an automatic check on this site from here. Leave your details and we'll follow up manually.",
  errorHttp: "The site's server returned an error. Try again later or leave your details.",
  errorNotHtml: "That address didn't return a readable web page.",
  errorEmpty: "The homepage looks empty or blocked for automatic reading.",
  errorGeneric: "The check couldn't be completed just now. Try again in a moment.",
  errorService: "The check service isn't available on the server right now. Try again later or leave your details.",
  errorRateLimited:
    "The site briefly limited requests (429). We didn't treat that as a broken link — try again in a minute or leave your details.",
  retryScan: "Try again",
  pillarsTitle: "What the check looks at",
  pillars: [
    {
      icon: "search",
      title: "Google visibility",
      text: "Page title, meta description, index flags, and main headings on opened pages.",
    },
    {
      icon: "layout",
      title: "Structure and headings",
      text: "Whether pages have a clear title and whether service pages duplicate each other.",
    },
    {
      icon: "contact",
      title: "Ways to get in touch",
      text: "Call links, WhatsApp, forms, and contact navigation — especially on mobile.",
    },
  ],
  faqTitle: "Website check questions",
  faq: [
    {
      q: "Does the check cost money?",
      a: "No. You see results right away, with no details required and no commitment.",
    },
    {
      q: "What exactly is scanned?",
      a: "The tool opens your homepage and up to three inner pages your site links to — for example a service or contact page. We look at titles, meta descriptions, headings, and ways to get in touch (phone, form, navigation). You get up to three priority findings.",
    },
    {
      q: "What does the check leave out?",
      a: "No Google rankings or positions, keyword research, competitor analysis, or a full work plan. The scan reads the HTML your site returns; client-rendered sites may look incomplete.",
    },
    {
      q: "Will I see every issue on the site?",
      a: "No. This is a first look — up to three findings, not a full audit.",
    },
    {
      q: "What is sent if I leave my name and phone?",
      a: "Our team gets your name, phone, the site address, the pages checked, and the findings on screen — so we can call you back for a consult.",
    },
  ],
};

export function getSiteCheckCopy(locale: Locale): SiteCheckCopy {
  return locale === "en" ? EN : HE;
}