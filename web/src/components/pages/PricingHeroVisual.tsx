import { PRICING_MARKETING_CARDS, PRICING_WEBSITE_CARDS } from "@/lib/pages/pricing-content";

const HERO_SAMPLES = [
  PRICING_MARKETING_CARDS[0],
  PRICING_MARKETING_CARDS[3],
  PRICING_WEBSITE_CARDS[0],
] as const;

export function PricingHeroVisual() {
  return (
    <div className="pp-hero-visual" aria-hidden="true">
      <div className="pp-hero-visual-panel">
        <p className="pp-hero-visual-label">מחירי התחלה</p>
        <ul className="pp-hero-visual-tiers">
          {HERO_SAMPLES.map((card) => (
            <li key={card.id} className="pp-hero-visual-tier">
              <span className="pp-hero-visual-tier-name">{card.title.split("(")[0]?.trim() ?? card.title}</span>
              <span className="pp-hero-visual-tier-price" dir="ltr">
                {card.priceAmount.toLocaleString("he-IL")} ₪
                {card.billingPeriod ? ` / ${card.billingPeriod}` : ""}
              </span>
            </li>
          ))}
        </ul>
        <div className="pp-hero-visual-chips">
          <span>Google Ads</span>
          <span>SEO</span>
          <span>אתרים</span>
          <span>סושיאל</span>
        </div>
      </div>
    </div>
  );
}
