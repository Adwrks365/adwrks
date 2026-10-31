import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { ServiceStartingOfferContent } from "@/lib/pages/services/types";

type ServiceStartingOfferProps = {
  offer: ServiceStartingOfferContent;
  className?: string;
};

/** Compact starting-price block — below hero, not inside H1/lead. */
export function ServiceStartingOffer({ offer, className = "" }: ServiceStartingOfferProps) {
  return (
    <section className={`sp-starting-offer ${className}`.trim()} aria-labelledby="sp-starting-offer-heading">
      <Container>
        <div className="sp-starting-offer-card">
          <p id="sp-starting-offer-heading" className="sp-starting-offer-price">
            {offer.priceLine}
          </p>
          <p className="sp-starting-offer-scope">{offer.scopeLine}</p>
          {offer.notIncluded.length > 0 && (
            <ul className="sp-starting-offer-list">
              {offer.notIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {offer.factorsLine ? <p className="sp-starting-offer-factors">{offer.factorsLine}</p> : null}
          <div className="sp-starting-offer-actions">
            <Link href={offer.pricingHref} className="sp-starting-offer-link">
              {offer.pricingLabel}
            </Link>
            <Link href={offer.ctaHref} className="sp-starting-offer-cta">
              {offer.ctaLabel}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
