export type CheckFitQuestion = {
  id: string;
  title: string;
  options: readonly string[];
};

export type CheckFitResult = {
  icon: string;
  title: string;
  text: string;
  showWhatsapp: boolean;
};

export const CHECK_FIT_HERO = {
  titleLine1: "שותפות טובה מתחילה",
  titleHighlight: "בהתאמה נכונה",
  subtitle: [
    "גם המאמן הכי טוב לא מתאים לכל קבוצה.",
    "כדי לייצר תוצאות לאורך זמן, מתחילים בהתאמה נכונה.",
  ],
  badges: ["⏱️ 30 שניות בלבד", "✓ ללא התחייבות"],
  cta: "התחילו בדיקת התאמה",
} as const;

export const CHECK_FIT_QUESTIONS: readonly CheckFitQuestion[] = [
  {
    id: "business-type",
    title: "מה סוג העסק שלך?",
    options: [
      "נותן שירות / בעל מקצוע חופשי",
      "עסק מקומי",
      "חברת B2B",
      "חנות אונליין",
      "אחר",
    ],
  },
  {
    id: "industry",
    title: "באיזה תחום העסק פועל?",
    options: [
      "שירותים / בעלי מקצוע",
      "בריאות / קליניקות",
      "B2B",
      "חנות אונליין",
      "דרופשיפינג",
      "הימורים",
      "רוחניות / מיסטיקה",
      "אחר",
    ],
  },
  {
    id: "budget",
    title: "מה תקציב הפרסום החודשי?",
    options: ["עד 1500₪", "1500–3000₪", "3000–7000₪", "7000₪+"],
  },
  {
    id: "website",
    title: "יש לך אתר או דף נחיתה?",
    options: ["כן", "לא", "בבנייה"],
  },
];

/** Immediate disqualifiers on question 2 (industry). */
export const CHECK_FIT_FILTERED_INDUSTRIES = new Set([
  "דרופשיפינג",
  "הימורים",
  "רוחניות / מיסטיקה",
]);

export const CHECK_FIT_FILTERED_RESULT: CheckFitResult = {
  icon: "🟥",
  title: "כרגע פחות מתאים",
  text: "אנחנו עובדים עם מספר מצומצם של עסקים שמתאימים למודל העבודה שלנו כדי לשמור על איכות ותוצאות.",
  showWhatsapp: false,
};

export const CHECK_FIT_TRUST_LINES = [
  "✓ Google Partner",
  "✓ Meta Business Partner",
  "✓ מלווים עסקים מאז 2018",
  "✓ ליווי אישי ותוצאות מדידות",
] as const;

export const CHECK_FIT_PRIVACY =
  "🔒 הפרטים שלך נשמרים לצורך יצירת קשר בלבד ואינם מועברים לצד שלישי.";

export const CHECK_FIT_WHATSAPP_NUMBER = "972512402213";

export function buildCheckFitWhatsappUrl(answers: readonly string[]): string {
  const lines = ["שלום, סיימתי את בדיקת ההתאמה:", "", ...answers];
  return `https://wa.me/${CHECK_FIT_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Final result after all 4 questions — mirrors legacy WordPress logic. */
export function computeCheckFitResult(answers: readonly string[]): CheckFitResult {
  const budget = answers[2];
  const website = answers[3];

  if (budget === "עד 1500₪") {
    return {
      icon: "🟨",
      title: "יש אפשרות להתחיל בצורה מדורגת",
      text: "כרגע נראה שנדרש תקציב מעט רחב יותר כדי להפיק תוצאות איכותיות לאורך זמן. במקרים מסוימים קיימות אפשרויות התחלה חכמות — נשמח לבדוק יחד מה נכון לעסק שלך.",
      showWhatsapp: true,
    };
  }

  if (website === "לא") {
    return {
      icon: "🟨",
      title: "יש בסיס טוב להתחלה",
      text: "נמליץ קודם לבנות תשתית דיגיטלית נכונה שתאפשר להפיק יותר מהפרסום. נוכל להציע פתרון מותאם לעסק שלך.",
      showWhatsapp: true,
    };
  }

  return {
    icon: "🟩",
    title: "נראה שיש התאמה מצוינת",
    text: "נראה שיש בסיס טוב להתחיל לייצר תוצאות ולבנות תהליך צמיחה לטווח ארוך.",
    showWhatsapp: true,
  };
}
