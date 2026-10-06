"use client";

import { useMemo, useState } from "react";
import {
  ALL_PRICING_SERVICES,
  MONTHLY_SERVICES,
  ONETIME_SERVICES,
  PRICING_CALCULATOR_CONTACT,
  PRICING_CALCULATOR_WHATSAPP,
  type PricingService,
} from "@/lib/calculators/pricing-calculator-data";
import { PricingCalculatorIcon } from "@/components/calculators/PricingCalculatorIcons";

type ServiceCardProps = {
  service: PricingService;
  isSelected: boolean;
  onToggle: () => void;
};

function ServiceCard({ service, isSelected, onToggle }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSelected}
      className={`pcalc-card${isSelected ? " is-selected" : ""}`}
    >
      {service.popular ? <span className="pcalc-popular">פופולרי</span> : null}

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
          <span className="pcalc-card-price">החל מ-{service.priceLabel}</span>
        </span>
      </span>
    </button>
  );
}

/** Interactive pricing calculator — monthly + one-time service selection. */
export function PricingCalculator() {
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
    const selectedList = ALL_PRICING_SERVICES.filter((service) => selectedServices.has(service.id));
    return {
      monthlyTotal: selectedList
        .filter((service) => service.priceType === "monthly")
        .reduce((sum, service) => sum + service.price, 0),
      oneTimeTotal: selectedList
        .filter((service) => service.priceType === "oneTime")
        .reduce((sum, service) => sum + service.price, 0),
    };
  }, [selectedServices]);

  return (
    <div className="pricing-calculator-root" dir="rtl">
      <div className="pcalc-shell">
        <section className="pcalc-section">
          <div className="pcalc-section-head">
            <span className="pcalc-section-icon pcalc-section-icon--cyan">
              <PricingCalculatorIcon name="clock" className="pcalc-section-icon-svg" />
            </span>
            <h2 className="pcalc-section-title">שירותים חודשיים</h2>
          </div>
          <div className="pcalc-grid pcalc-grid--monthly">
            {MONTHLY_SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServices.has(service.id)}
                onToggle={() => toggleService(service.id)}
              />
            ))}
          </div>
        </section>

        <section className="pcalc-section">
          <div className="pcalc-section-head">
            <span className="pcalc-section-icon pcalc-section-icon--purple">
              <PricingCalculatorIcon name="zap" className="pcalc-section-icon-svg" />
            </span>
            <h2 className="pcalc-section-title">בניית אתרים ודפי נחיתה</h2>
          </div>
          <div className="pcalc-grid pcalc-grid--onetime">
            {ONETIME_SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServices.has(service.id)}
                onToggle={() => toggleService(service.id)}
              />
            ))}
          </div>
        </section>

        <section className="pcalc-results">
          <div className="pcalc-results-inner">
            <h3 className="pcalc-results-title">סיכום הערכת מחיר</h3>

            {selectedServices.size === 0 ? (
              <p className="pcalc-results-empty">בחרו שירותים לקבלת הערכת מחיר</p>
            ) : (
              <div className="pcalc-results-totals">
                {monthlyTotal > 0 ? (
                  <p className="pcalc-total-line">
                    <span className="pcalc-total-label">חודשי:</span>{" "}
                    <span className="pcalc-total-value pcalc-total-value--monthly">
                      ₪{monthlyTotal.toLocaleString("he-IL")}
                    </span>
                    <span className="pcalc-total-suffix"> / חודש</span>
                  </p>
                ) : null}
                {oneTimeTotal > 0 ? (
                  <p className="pcalc-total-line">
                    <span className="pcalc-total-label">חד פעמי:</span>{" "}
                    <span className="pcalc-total-value pcalc-total-value--onetime">
                      ₪{oneTimeTotal.toLocaleString("he-IL")}
                    </span>
                  </p>
                ) : null}
              </div>
            )}

            <div className="pcalc-actions">
              <a
                href={PRICING_CALCULATOR_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="pcalc-btn pcalc-btn--whatsapp"
              >
                <PricingCalculatorIcon name="message" className="pcalc-btn-icon" />
                <span>שלחו בוואטסאפ</span>
              </a>
              <a href={PRICING_CALCULATOR_CONTACT} className="pcalc-btn pcalc-btn--contact">
                <PricingCalculatorIcon name="phone" className="pcalc-btn-icon" />
                <span>לקבלת הצעת מחיר</span>
              </a>
            </div>
          </div>
        </section>

        <p className="pcalc-disclaimer">* המחירים הם מחירי התחלה בש&quot;ח לפני מע&quot;מ</p>
      </div>
    </div>
  );
}
