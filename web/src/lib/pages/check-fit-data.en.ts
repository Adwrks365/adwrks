export type { CheckFitQuestion, CheckFitResult } from "./check-fit-data";

export const CHECK_FIT_HERO = {
  titleLine1: "A good partnership starts with",
  titleHighlight: "the right fit",
  subtitle: [
    "Even the best coach is not right for every team.",
    "To deliver results over time, it starts with the right fit.",
  ],
  badges: ["⏱️ Just 30 seconds", "✓ No obligation"],
  cta: "Start fit assessment",
} as const;

export const CHECK_FIT_QUESTIONS = [
  {
    id: "business-type",
    title: "What type of business do you have?",
    options: [
      "Service provider / freelancer",
      "Local business",
      "B2B company",
      "Online store",
      "Other",
    ],
  },
  {
    id: "industry",
    title: "What industry is your business in?",
    options: [
      "Services / professionals",
      "Healthcare / clinics",
      "B2B",
      "Online store",
      "Dropshipping",
      "Gambling",
      "Spirituality / mysticism",
      "Other",
    ],
  },
  {
    id: "budget",
    title: "What is your monthly advertising budget?",
    options: ["Up to ₪1,500", "₪1,500–3,000", "₪3,000–7,000", "₪7,000+"],
  },
  {
    id: "website",
    title: "Do you have a website or landing page?",
    options: ["Yes", "No", "Under construction"],
  },
] as const;

/** Immediate disqualifiers on question 2 (industry). */
export const CHECK_FIT_FILTERED_INDUSTRIES = new Set([
  "Dropshipping",
  "Gambling",
  "Spirituality / mysticism",
]);

export const CHECK_FIT_FILTERED_RESULT = {
  icon: "🟥",
  title: "Not the best fit right now",
  text: "We work with a limited number of businesses that match our work model to maintain quality and results.",
  showWhatsapp: false,
};

export const CHECK_FIT_TRUST_LINES = [
  "✓ Google Partner",
  "✓ Meta Business Partner",
  "✓ Supporting businesses since 2018",
  "✓ Personal support and measurable results",
] as const;

export const CHECK_FIT_PRIVACY =
  "🔒 Your details are kept for contact purposes only and are not shared with third parties.";

export const CHECK_FIT_WHATSAPP_NUMBER = "972512402213";

export function buildCheckFitWhatsappUrl(answers: readonly string[]): string {
  const lines = ["Hello, I completed the fit assessment:", "", ...answers];
  return `https://wa.me/${CHECK_FIT_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Final result after all 4 questions — mirrors legacy WordPress logic. */
export function computeCheckFitResult(answers: readonly string[]): import("./check-fit-data").CheckFitResult {
  const budget = answers[2];
  const website = answers[3];

  if (budget === "Up to ₪1,500") {
    return {
      icon: "🟨",
      title: "There may be a gradual way to start",
      text: "It looks like a slightly broader budget may be needed to deliver quality results over time. In some cases there are smart starting options — we would be happy to explore what is right for your business together.",
      showWhatsapp: true,
    };
  }

  if (website === "No") {
    return {
      icon: "🟨",
      title: "A good foundation to start",
      text: "We would recommend building the right digital infrastructure first to get more from advertising. We can offer a solution tailored to your business.",
      showWhatsapp: true,
    };
  }

  return {
    icon: "🟩",
    title: "Looks like an excellent fit",
    text: "It looks like there is a solid foundation to start generating results and building a long-term growth process.",
    showWhatsapp: true,
  };
}
