import type { LocaleProps } from "@/lib/locale-props";
import { getPricingPageContent } from "@/lib/pages/get-pricing-content";

export function PricingHeroVisual({ locale = "he" }: LocaleProps) {
  const c = getPricingPageContent(locale);
  const heroSamples = [
    c.PRICING_MARKETING_CARDS[0],
    c.PRICING_MARKETING_CARDS[3],
    c.PRICING_WEBSITE_CARDS[0],
  ] as const;

  return (
    <div className="pp-hero-visual" aria-hidden="true">
      <div className="pp-hero-visual-panel">
        <p className="pp-hero-visual-label">{locale === "en" ? "Starting prices" : "מחירי התחלה"}</p>
        <ul className="pp-hero-visual-tiers">
          {heroSamples.map((card) => (
            <li key={card.id} className="pp-hero-visual-tier">
              <span className="pp-hero-visual-tier-name">{card.title.split("(")[0]?.trim() ?? card.title}</span>
              <span className="pp-hero-visual-tier-price" dir="ltr">
                {card.priceAmount.toLocaleString(locale === "en" ? "en-US" : "he-IL")} ₪
                {"billingPeriod" in card && card.billingPeriod ? ` / ${card.billingPeriod}` : ""}
              </span>
            </li>
          ))}
        </ul>
        <div className="pp-hero-visual-chips">
          <span>Google Ads</span>
          <span>SEO</span>
          <span>{locale === "en" ? "Websites" : "אתרים"}</span>
          <span>{locale === "en" ? "Social" : "סושיאל"}</span>
        </div>
      </div>
    </div>
  );
}
