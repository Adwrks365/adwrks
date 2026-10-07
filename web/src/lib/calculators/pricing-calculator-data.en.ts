import type { CalculatorIconName } from "@/components/calculators/PricingCalculatorIcons";
import type { PricingService } from "./pricing-calculator-data";

export const MONTHLY_SERVICES_EN: readonly PricingService[] = [
  {
    id: "google-ads",
    name: "Google Ads (Paid Search)",
    description: "Google Ads campaign management",
    price: 850,
    priceType: "monthly",
    priceLabel: "₪850 / month",
    icon: "search",
    features: ["Full management", "Weekly optimization", "Performance reports"],
    popular: true,
    color: "#4285F4",
  },
  {
    id: "social-media",
    name: "Social Media Marketing",
    description: "Facebook & Instagram",
    price: 1050,
    priceType: "monthly",
    priceLabel: "₪1,050 / month",
    icon: "share",
    features: ["Facebook + Instagram", "Creative", "Remarketing"],
    color: "#E4405F",
  },
  {
    id: "google-maps",
    name: "Google Maps Promotion",
    description: "Google Business Profile",
    price: 400,
    priceType: "monthly",
    priceLabel: "₪400 / month",
    icon: "map-pin",
    features: ["Optimization", "Review management", "Better local ranking"],
    color: "#34A853",
  },
  {
    id: "seo",
    name: "Organic SEO + AI",
    description: "SEO & focused content",
    price: 2500,
    priceType: "monthly",
    priceLabel: "₪2,500 / month",
    icon: "trending-up",
    features: ["Keyword research", "Focused content", "Link building"],
    color: "#8b5cf6",
  },
];

export const ONETIME_SERVICES_EN: readonly PricingService[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Mobile-optimized converting page",
    price: 1200,
    priceType: "oneTime",
    priceLabel: "₪1,200",
    icon: "layout",
    features: ["Converting design", "Mobile-ready", "Forms"],
    color: "#00D4FF",
  },
  {
    id: "one-page",
    name: "One-Page Website",
    description: "Full professional site",
    price: 1800,
    priceType: "oneTime",
    priceLabel: "₪1,800",
    icon: "globe",
    features: ["Custom design", "SEO", "SSL"],
    popular: true,
    color: "#10b981",
  },
  {
    id: "branding-site",
    name: "Corporate Site (up to 5 pages)",
    description: "Professional business website",
    price: 3000,
    priceType: "oneTime",
    priceLabel: "₪3,000",
    icon: "building",
    features: ["Up to 5 pages", "Branding design", "Blog"],
    color: "#f59e0b",
  },
];

export const PRICING_CALCULATOR_WHATSAPP_EN =
  "https://wa.me/972512402213?text=Hi%2C%20I%27d%20like%20a%20digital%20marketing%20price%20quote";

export const PRICING_CALCULATOR_CONTACT_EN = "/en/contact-us/";

export const PRICING_CALCULATOR_LABELS_EN = {
  popular: "Popular",
  fromPrefix: "From ",
  monthlySection: "Monthly services",
  onetimeSection: "Websites & landing pages",
  resultsTitle: "Price estimate summary",
  resultsEmpty: "Select services to get a price estimate",
  monthlyTotal: "Monthly:",
  monthlySuffix: " / month",
  onetimeTotal: "One-time:",
  whatsapp: "Send on WhatsApp",
  contact: "Get a quote",
  disclaimer: "* Prices are starting rates in ILS before VAT",
} as const;
