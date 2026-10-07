export const CONTACT_HERO = {
  eyebrow: "Contact",
  lead: "Tell us your goal — we will review your inquiry, talk, and figure out together what direction fits your business.",
  primaryCta: "Tell us about your business",
} as const;

export const CONTACT_CONVERSION = {
  title: "Let's talk about your business",
  formIntro: "Have a question or need advice? We look forward to hearing from you!",
  formContextHeading: "We got the direction",
  submitLabel: "Send inquiry",
  directPrompt: "Prefer to talk directly?",
} as const;

export const CONTACT_PLANNER = {
  kicker: "What's your goal?",
  title: "Helps us understand what you're looking for",
  step1Label: "What is your main goal?",
  step2Label: "What do you already have today?",
  step2Optional: "Optional",
  summaryHeading: "Great, we understand the direction",
  summaryGoalLabel: "Goal",
  summaryExistingLabel: "Existing today",
  continueLabel: "Continue to leave details",
  clearLabel: "Clear selection",
  messageGoalLabel: "Inquiry goal",
  messageExistingLabel: "Existing today",
  goals: [
    "Get more leads",
    "Increase sales",
    "Improve Google presence",
    "Promote an existing website",
    "Build a new website",
    "Strengthen social media",
    "Not sure — we'd love to advise",
  ],
  existing: [
    "Active website",
    "Google Ads",
    "SEO",
    "Facebook / Instagram",
    "Haven't started yet",
    "Other",
  ],
} as const;

export const CONTACT_PROCESS = {
  title: "What happens after you leave your details?",
  steps: [
    { title: "Submit details", text: "Fill out the form or contact us directly." },
    { title: "We review your inquiry", text: "We examine what you shared and the business need." },
    { title: "We talk and understand", text: "A short conversation to understand goals and context." },
    { title: "We match direction", text: "We suggest the combination and services that fit." },
  ],
} as const;

/** Verified quotes reused from homepage testimonials — inlined to keep client bundles free of server-only media helpers. */
export const CONTACT_TESTIMONIALS = {
  title: "What our clients say",
  items: [
    {
      name: "Elad Shabtai",
      title: "Kamri & Shabtai Shilobitzky Law Firm",
      content:
        "Highly recommended! A serious company that strives for excellence. They did quality work that produced results immediately.",
      image: "/wp-content/uploads/19388777_10211736809509377_8947026352501099299_o-150x150.webp",
    },
    {
      name: "Danny Ben Atar",
      title: "Danny Computers",
      content:
        "The only promotion that works!!!\nGreat guys and professionals led by Sergey\nAt a fair price with excellent, caring, and attentive service\nSimply champions 🏆🏆🏆🙏",
      image: "/wp-content/uploads/204687284_4055670721208389_2009856386006580434_n-150x150.webp",
    },
    {
      name: "Amir Aslam",
      title: "Amir Electrical & Auto Diagnostics",
      content:
        "I recommend them because first and foremost they are human beings, and their marketing and advertising raised awareness among many people about my business — who I am and what services I provide. Warmly recommended — they deliver value beyond what they charge.",
      image: "/wp-content/uploads/23334247_1577479552307221_1915736016569884908_o-150x150.webp",
    },
  ],
} as const;

export const CONTACT_TRUST = {
  since: "Since 2018",
} as const;
