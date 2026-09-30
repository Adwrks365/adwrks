import type { ServicePageContent } from "./types";

export const mainServicesPage: ServicePageContent = {
  path: "/שירותי-שיווק-דיגיטלי/",
  slug: "שירותי-שיווק-דיגיטלי",
  title: "שירותי שיווק דיגיטלי לעסקים",
  hero: {
    title: "Adwrks 365 שירותי שיווק דיגיטלי",
    subtitle:
      "מאז 2018 Adwrks 365 מלווה עסקים מכל התחומים ביצירת נוכחות דיגיטלית שמביאה תוצאות. אנו מספקים מעטפת שירותים מלאה – משלב האסטרטגיה ועד ביצוע, מדידה ואופטימיזציה – עם דגש על לידים איכותיים, שקיפות וחשיבה עסקית.",
    image: {
      src: "https://adwrks.co.il/wp-content/uploads/6-3.png",
      alt: "שירותי שיווק דיגיטלי",
    },
    ctas: [
      { text: "דברו עם מומחה עכשיו", href: "tel:0795599449", variant: "primary" },
      { text: "צרו קשר", href: "/contact-us/", variant: "outline" },
    ],
  },
  sections: [
    {
      eyebrow: "מומחים לפרסום ממומן בגוגל",
      heading: "פרסום ממומן בגוגל (Google Ads)",
      html: `<p>ניהול קמפיינים ממומנים בגוגל שמביאים פניות ומכירות, ולא רק קליקים. כולל מחקר מילות מפתח, כתיבת מודעות, חיבור למדידת המרות ואופטימיזציה שוטפת.</p><p><strong>מתאים לעסקים שצריכים תוצאות בטווח הקצר והבינוני.</strong></p>`,
      image: {
        src: "https://adwrks.co.il/wp-content/uploads/1-3.png",
        alt: "פרסום ממומן בגוגל",
      },
      cta: { text: "לעמוד פרסום ממומן בגוגל", href: "/google-ads/" },
      layout: "split",
    },
    {
      eyebrow: "נראות אורגנית שמביאה לקוחות",
      heading: "קידום אתרים אורגני (SEO)",
      html: `<p>בניית נכס דיגיטלי יציב לטווח ארוך באמצעות קידום אורגני בגוגל. עבודה על תוכן, מבנה אתר, חוויית משתמש והתאמה ל-AI ולחיפוש סמנטי.</p><p><strong>מתאים לעסקים שרוצים יציבות וצמיחה לאורך זמן.</strong></p>`,
      image: {
        src: "https://adwrks.co.il/wp-content/uploads/seo-1.jpg",
        alt: "קידום אתרים אורגני",
      },
      cta: { text: "לעמוד קידום אתרים אורגני", href: "/seo/" },
      layout: "split",
    },
    {
      eyebrow: "בניית נוכחות ומותג בדיגיטל",
      heading: "ניהול רשתות חברתיות",
      html: `<p>ניהול אסטרטגי של נוכחות העסק ברשתות החברתיות – תוכן, קמפיינים ממומנים, חיזוק מותג ויצירת מעורבות שמובילה לפניות.</p><p><strong>מתאים לעסקים שרוצים לבנות נראות ומותג בדיגיטל.</strong></p>`,
      image: {
        src: "https://adwrks.co.il/wp-content/uploads/8e68e316-a0b5-4c8f-92ff-77950518d1c5.webp",
        alt: "ניהול רשתות חברתיות",
      },
      cta: { text: "לעמוד ניהול רשתות חברתיות", href: "/social-media-management/" },
      layout: "split",
    },
    {
      eyebrow: "אתרים שמביאים תוצאות",
      heading: "בניית אתרים לעסקים",
      html: `<p>בניית אתרים מותאמים אישית עם דגש על חוויית משתמש, מהירות, SEO וחיבור לכל ערוצי השיווק – כדי שהאתר יהיה מנוע לידים אמיתי.</p>`,
      image: {
        src: "https://adwrks.co.il/wp-content/uploads/website-built.webp",
        alt: "בניית אתרים לעסקים",
      },
      cta: { text: "לעמוד בניית אתרים", href: "/website-building/" },
      layout: "split",
    },
  ],
  finalCta: {
    heading: "מעטפת שיווק דיגיטלי 360° לעסק שלכם",
    html: `<p>נשמח להכיר את העסק, להבין את המטרות ולהציע את השילוב הנכון של שירותים – SEO, Google Ads, סושיאל, אתרים ועוד.</p>`,
    ctas: [
      { text: "דברו עם מומחה", href: "tel:0795599449", variant: "primary" },
      { text: "צרו קשר", href: "/contact-us/", variant: "outline" },
    ],
  },
};
