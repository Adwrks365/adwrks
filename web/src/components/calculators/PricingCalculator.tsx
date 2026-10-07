"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { getPricingCalculatorData } from "@/lib/calculators/get-pricing-calculator-data";
import type { PricingService } from "@/lib/calculators/pricing-calculator-data";
import { PricingCalculatorIcon } from "@/components/calculators/PricingCalculatorIcons";

type ServiceCardProps = {
  service: PricingService;
  isSelected: boolean;
  onToggle: () => void;
  popularLabel: string;
  fromPrefix: string;
};

function ServiceCard({ service, isSelected, onToggle, popularLabel, fromPrefix }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSelected}
      className={`pcalc-card${isSelected ? " is-selected" : ""}`}
    >
      {service.popular ? <span className="pcalc-popular">{popularLabel}</span> : null}

      <span className={`pcalc-checkbox${isSelected ? " is-checked" : ""}`} aria-hidden="true">
        {isSelected ? <PricingCalculatorIcon name="check" className="pcalc-checkbox-icon" /> : null}
      </span>

      <span className="pcalc-card-body">
        <span className="pcalc-icon-wrap" style={{ backgroundColor: `${service.color}20` }}>
          <PricingCalculatorIcon
            name={service.icon}
            className="pcalc-service-icon"
            style={{ color: service.color }}
          />
        </span>

        <span className="pcalc-card-copy">
          <span className="pcalc-card-title">{service.name}</span>
          <span className="pcalc-card-desc">{service.description}</span>
          <span className="pcalc-card-price">
            {fromPrefix}
            {service.priceLabel}
          </span>
        </span>
      </span>
    </button>
  );
}

type PricingCalculatorProps = {
  locale?: Locale;
};

/** Interactive pricing calculator — monthly + one-time service selection. */
export function PricingCalculator({ locale = "he" }: PricingCalculatorProps) {
  const data = getPricingCalculatorData(locale);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { monthlyTotal, oneTimeTotal } = useMemo(() => {
    const selectedList = data.allServices.filter((service) => selectedServices.has(service.id));
    return {
      monthlyTotal: selectedList
        .filter((service) => service.priceType === "monthly")
        .reduce((sum, service) => sum + service.price, 0),
      oneTimeTotal: selectedList
        .filter((service) => service.priceType === "oneTime")
        .reduce((sum, service) => sum + service.price, 0),
    };
  }, [data.allServices, selectedServices]);

  const { labels } = data;

  return (
    <div className="pricing-calculator-root" dir={data.dir}>
      <div className="pcalc-shell">
        <section className="pcalc-section">
          <div className="pcalc-section-head">
            <span className="pcalc-section-icon pcalc-section-icon--cyan">
              <PricingCalculatorIcon name="clock" className="pcalc-section-icon-svg" />
            </span>
            <h2 className="pcalc-section-title">{labels.monthlySection}</h2>
          </div>
          <div className="pcalc-grid pcalc-grid--monthly">
            {data.monthlyServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServices.has(service.id)}
                onToggle={() => toggleService(service.id)}
                popularLabel={labels.popular}
                fromPrefix={labels.fromPrefix}
              />
            ))}
          </div>
        </section>

        <section className="pcalc-section">
          <div className="pcalc-section-head">
            <span className="pcalc-section-icon pcalc-section-icon--purple">
              <PricingCalculatorIcon name="zap" className="pcalc-section-icon-svg" />
            </span>
            <h2 className="pcalc-section-title">{labels.onetimeSection}</h2>
          </div>
          <div className="pcalc-grid pcalc-grid--onetime">
            {data.onetimeServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServices.has(service.id)}
                onToggle={() => toggleService(service.id)}
                popularLabel={labels.popular}
                fromPrefix={labels.fromPrefix}
              />
            ))}
          </div>
        </section>

        <section className="pcalc-results">
          <div className="pcalc-results-inner">
            <h3 className="pcalc-results-title">{labels.resultsTitle}</h3>

            {selectedServices.size === 0 ? (
              <p className="pcalc-results-empty">{labels.resultsEmpty}</p>
            ) : (
              <div className="pcalc-results-totals">
                {monthlyTotal > 0 ? (
                  <p className="pcalc-total-line">
                    <span className="pcalc-total-label">{labels.monthlyTotal}</span>{" "}
                    <span className="pcalc-total-value pcalc-total-value--monthly">
                      ₪{monthlyTotal.toLocaleString(data.numberLocale)}
                    </span>
                    <span className="pcalc-total-suffix">{labels.monthlySuffix}</span>
                  </p>
                ) : null}
                {oneTimeTotal > 0 ? (
                  <p className="pcalc-total-line">
                    <span className="pcalc-total-label">{labels.onetimeTotal}</span>{" "}
                    <span className="pcalc-total-value pcalc-total-value--onetime">
                      ₪{oneTimeTotal.toLocaleString(data.numberLocale)}
                    </span>
                  </p>
                ) : null}
              </div>
            )}

            <div className="pcalc-actions">
              <a
                href={data.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pcalc-btn pcalc-btn--whatsapp"
              >
                <PricingCalculatorIcon name="message" className="pcalc-btn-icon" />
                <span>{labels.whatsapp}</span>
              </a>
              <a href={data.contactPath} className="pcalc-btn pcalc-btn--contact">
                <PricingCalculatorIcon name="phone" className="pcalc-btn-icon" />
                <span>{labels.contact}</span>
              </a>
            </div>
          </div>
        </section>

        <p className="pcalc-disclaimer">{labels.disclaimer}</p>
      </div>
    </div>
  );
}
