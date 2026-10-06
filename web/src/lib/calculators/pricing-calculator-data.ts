import type { CalculatorIconName } from "@/components/calculators/PricingCalculatorIcons";

export type PricingService = {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: "monthly" | "oneTime";
  priceLabel: string;
  icon: CalculatorIconName;
  features: readonly string[];
  popular?: boolean;
  color: string;
};

export const MONTHLY_SERVICES: readonly PricingService[] = [
  {
    id: "google-ads",
    name: "פרסום ממומן בגוגל",
    description: "ניהול קמפיינים ב-Google Ads",
    price: 850,
    priceType: "monthly",
    priceLabel: "₪850 / חודש",
    icon: "search",
    features: ["ניהול מלא", "אופטימיזציה שבועית", "דוחות ביצועים"],
    popular: true,
    color: "#4285F4",
  },
  {
    id: "social-media",
    name: "שיווק במדיה החברתית",
    description: "פייסבוק ואינסטגרם",
    price: 1050,
    priceType: "monthly",
    priceLabel: "₪1,050 / חודש",
    icon: "share",
    features: ["פייסבוק + אינסטגרם", "קריאייטיב", "רימרקטינג"],
    color: "#E4405F",
  },
  {
    id: "google-maps",
    name: "קידום בגוגל מפות",
    description: "Google Business Profile",
    price: 400,
    priceType: "monthly",
    priceLabel: "₪400 / חודש",
    icon: "map-pin",
    features: ["אופטימיזציה", "ניהול ביקורות", "דירוג משופר"],
    color: "#34A853",
  },
  {
    id: "seo",
    name: "קידום אורגני + AI",
    description: "SEO ותוכן ממוקד",
    price: 2500,
    priceType: "monthly",
    priceLabel: "₪2,500 / חודש",
    icon: "trending-up",
    features: ["מחקר מילות מפתח", "תוכן ממוקד", "בניית קישורים"],
    color: "#8b5cf6",
  },
];

export const ONETIME_SERVICES: readonly PricingService[] = [
  {
    id: "landing-page",
    name: "דף נחיתה",
    description: "דף ממיר מותאם למובייל",
    price: 1200,
    priceType: "oneTime",
    priceLabel: "₪1,200",
    icon: "layout",
    features: ["עיצוב ממיר", "מותאם למובייל", "טפסים"],
    color: "#00D4FF",
  },
  {
    id: "one-page",
    name: "אתר בעמוד אחד",
    description: "אתר מקצועי מלא",
    price: 1800,
    priceType: "oneTime",
    priceLabel: "₪1,800",
    icon: "globe",
    features: ["עיצוב אישי", "SEO", "SSL"],
    popular: true,
    color: "#10b981",
  },
  {
    id: "branding-site",
    name: "אתר תדמית (עד 5 עמודים)",
    description: "אתר תדמית מקצועי",
    price: 3000,
    priceType: "oneTime",
    priceLabel: "₪3,000",
    icon: "building",
    features: ["עד 5 עמודים", "עיצוב ברנדינג", "בלוג"],
    color: "#f59e0b",
  },
];

export const ALL_PRICING_SERVICES = [...MONTHLY_SERVICES, ...ONETIME_SERVICES] as const;

export const PRICING_CALCULATOR_WHATSAPP =
  "https://wa.me/972512402213?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8%20%D7%9C%D7%A9%D7%99%D7%95%D7%95%D7%A7%20%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99";

export const PRICING_CALCULATOR_CONTACT = "/contact-us/";

/** Placeholder inserted server-side where legacy Sticklight iframes lived. */
export const PRICING_CALCULATOR_EMBED_SLOT =
  '<div class="adwrks-pricing-calculator-embed" data-adwrks-pricing-calculator></div>';
