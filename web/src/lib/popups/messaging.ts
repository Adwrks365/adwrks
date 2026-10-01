import type { PopupContextKey, PopupMessaging } from "@/lib/popups/types";
import { POPUP_CONTEXT_LABELS } from "@/lib/popups/context-labels";

const MESSAGING: Record<PopupContextKey, Omit<PopupMessaging, "popupContext" | "contextLabel">> = {
  "google-ads": {
    headline: "רוצים לבדוק את הקמפיינים בגוגל?",
    description:
      "ספרו לנו על העסק ונבחן יחד איך פרסום ממומן בגוגל יכול להתאים ליעדים שלכם — בלי התחייבות.",
    ctaLabel: "בקשת ייעוץ Google Ads",
  },
  seo: {
    headline: "רוצים לחזק את הנראות האורגנית בגוגל?",
    description:
      "נבדוק יחד את מצב הקידום האורגני שלכם ונציע כיווני פעולה מותאמים לעסק — בצורה ברורה ומעשית.",
    ctaLabel: "בקשת ייעוץ SEO",
  },
  "meta-ads": {
    headline: "רוצים לייעל את הפרסום בפייסבוק ואינסטגרם?",
    description:
      "נשמח לשוחח על הקמפיינים שלכם ב-Meta ולבדוק איך אפשר לשפר חשיפה, פניות ותוצאות.",
    ctaLabel: "בקשת ייעוץ Meta Ads",
  },
  website: {
    headline: "רוצים אתר או דף נחיתה שמביא פניות?",
    description:
      "ספרו לנו על הפרויקט ונבחן יחד איך בניית אתר מותאמת יכולה לתמוך בשיווק ובצמיחה של העסק.",
    ctaLabel: "בקשת ייעוץ לבניית אתר",
  },
  hosting: {
    headline: "צריכים שקט נפשי לגבי האתר?",
    description:
      "נשמח לבדוק יחד את צרכי האחסון והתחזוקה שלכם ולהציע חבילה שמתאימה לעומס וליעדים של העסק.",
    ctaLabel: "בקשת ייעוץ אחסון",
  },
  "google-maps": {
    headline: "רוצים לשפר את הנראות המקומית בגוגל?",
    description:
      "נבדוק יחד את הנוכחות שלכם בגוגל מפות ובפרופיל העסקי ונציע כיוונים לשיפור החשיפה המקומית.",
    ctaLabel: "בקשת ייעוץ גוגל מפות",
  },
  "digital-marketing": {
    headline: "רוצים מעטפת שיווק דיגיטלי מותאמת?",
    description:
      "ספרו לנו על העסק ונבחן יחד אילו ערוצי שיווק יכולים להתאים ליעדים שלכם — בגישה מעשית ושקופה.",
    ctaLabel: "בואו נדבר",
  },
  pricing: {
    headline: "רוצים להבין מה מתאים לתקציב שלכם?",
    description:
      "השאירו פרטים ונחזור אליכם עם כיוון ברור לשירותי השיווק שמתאימים לעסק — לפי הצרכים והיעדים.",
    ctaLabel: "קבלת כיוון מותאם",
  },
  general: {
    headline: "רוצים להפוך את השיווק הדיגיטלי למדויק יותר?",
    description:
      "ספרו לנו מה אתם רוצים לקדם ונבדוק יחד איזה ערוץ שיווק יכול להתאים לעסק שלכם.",
    ctaLabel: "בואו נדבר",
  },
};

export function getPopupMessaging(context: PopupContextKey): PopupMessaging {
  const copy = MESSAGING[context];
  return {
    popupContext: context,
    contextLabel: POPUP_CONTEXT_LABELS[context],
    ...copy,
  };
}
