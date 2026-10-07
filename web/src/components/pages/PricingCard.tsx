import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { linkWithArrow } from "@/i18n/ui-arrows";
import type { PricingCard as PricingCardData } from "@/lib/pages/pricing-content";
import { PricingPrice } from "./PricingPrice";

type PricingCardProps = {
  card: PricingCardData;
  locale?: Locale;
};

export function PricingCard({ card, locale = "he" }: PricingCardProps) {
  return (
    <article className={`pp-card pp-card--${card.model}`}>
      <div className="pp-card-head">
        <span className="pp-card-icon" aria-hidden="true">
          {card.icon}
        </span>
        <h3 className="pp-card-title">{card.title}</h3>
      </div>
      <PricingPrice
        amount={card.priceAmount}
        prefix={card.pricePrefix}
        period={card.billingPeriod}
        locale={locale}
      />
      {card.priceNote && <p className="pp-card-price-note">{card.priceNote}</p>}
      <p className="pp-card-desc">{card.description}</p>
      <ul className="pp-card-features">
        {card.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      {card.serviceHref && card.serviceCta && (
        <Link href={card.serviceHref} className="pp-card-link">
          {linkWithArrow(locale, card.serviceCta)}
        </Link>
      )}
    </article>
  );
}
