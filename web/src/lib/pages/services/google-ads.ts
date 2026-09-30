import type { ServicePageContent } from "./types";

export const googleAdsPage: ServicePageContent = {
  path: "/google-ads/",
  slug: "google-ads",
  title: "פרסום ממומן בגוגל (Google Ads) לעסקים",
  hero: {
    title: "פרסום ממומן בגוגל (Google Ads) לעסקים",
    subtitle:
      "פרסום ממומן בגוגל (Google Ads) הוא הדרך המהירה ביותר להביא לקוחות לעסק בדיוק ברגע שהם מחפשים שירות או מוצר. Adwrks 365 מנהלת קמפיינים ממומנים בגוגל לעסקים בישראל, עם דגש על החזר השקעה (ROI), איכות לידים וניהול תקציב חכם – לא רק קליקים.",
    image: {
      src: "https://adwrks.co.il/wp-content/uploads/gogle-artner-badge-1.png",
      alt: "Google Partner",
    },
    ctas: [
      { text: "דברו עם מומחה עכשיו", href: "tel:0795599449", variant: "primary" },
      { text: "צרו קשר לייעוץ", href: "/contact-us/", variant: "outline" },
    ],
  },
  sections: [
    {
      eyebrow: "שותפים מוסמכים של Google",
      heading: "מה זה פרסום ממומן בגוגל (Google Ads)?",
      html: `<p>פרסום ממומן בגוגל מאפשר לעסקים להופיע בראש תוצאות החיפוש באמצעות מודעות בתשלום. התשלום מתבצע לפי קליק, והקמפיינים מנוהלים לפי מילות מפתח, קהלים, מיקומים ונתונים.</p><p><strong>היתרון המרכזי הוא שליטה מלאה בתקציב, במסר ובקצב התוצאות.</strong></p>`,
      image: {
        src: "https://adwrks.co.il/wp-content/uploads/1-3.png",
        alt: "פרסום ממומן בגוגל",
      },
      layout: "split",
    },
    {
      eyebrow: "שירות אישי וצוות מקצועי",
      heading: "שירותי Google Ads שאנו מנהלים",
      list: [
        "קמפיינים בחיפוש (Search) – מילות מפתח עם כוונת רכישה",
        "קמפיינים ברשת התצוגה (Display) – חשיפה ורימarketing",
        "קמפיינים ב-YouTube – וידאו ומודעות ממוקדות",
        "Google Shopping – למוצרים וחנויות אונליין",
        "קמפיינים מקומיים – Google Maps ו-Local Services",
        "אופטימיזציה שוטפת, A/B testing ודוחות ROI",
      ],
      layout: "list-only",
    },
    {
      eyebrow: "ניסיון, אסטרטגיה וניהול קמפיינים מבוססי תוצאות",
      heading: "למי מתאים פרסום ממומן בגוגל?",
      paragraphs: [
        "פרסום ממומן בגוגל מתאים לעסקים שרוצים תוצאות מהירות, שליטה בתקציב והגעה לקהל עם כוונת רכישה גבוהה.",
        "השירות מתאים במיוחד לעסקים מקומיים, נותני שירותים, חנויות אונליין וחברות המעוניינות להגדיל לידים ומכירות בטווח הקצר והבינוני.",
      ],
      image: {
        src: "https://adwrks.co.il/wp-content/uploads/google-ads-ppc.png",
        alt: "פרסום בגוגל אדס",
      },
      layout: "split",
    },
    {
      heading: "למה לבחור ב-Adwrks 365 לניהול פרסום בגוגל?",
      cards: [
        { title: "ניהול מבוסס ROI", text: "מיקוד בתוצאות עסקיות – לידים, שיחות ומכירות – ולא רק בקליקים." },
        { title: "שקיפות מלאה", text: "דוחות ברורים, גישה לנתונים והסברים על כל שינוי בקמפיין." },
        { title: "ניסיון מאז 2018", text: "ניהול קמפיינים לעסקים מכל התחומים בישראל." },
        { title: "שילוב עם SEO ואתרים", text: "חיבור בין פרסום ממומן, דפי נחיתה ואופטימיזציה להמרות." },
      ],
      layout: "cards",
    },
  ],
  finalCta: {
    heading: "רוצים לדעת אם Google Ads מתאים לעסק שלכם?",
    html: `<p>השאירו פרטים ונשמח לבדוק יחד את הפוטנציאל, התקציב והכיוון הנכון לפרסום ממומן – ללא התחייבות.</p>`,
    ctas: [
      { text: "דברו עם מומחה עכשיו", href: "tel:0795599449", variant: "primary" },
      { text: "צרו קשר", href: "/contact-us/", variant: "outline" },
    ],
  },
};
