"use client";

import { useState } from "react";
import { PricingCalculator } from "@/components/calculators/PricingCalculator";
import type { LocaleProps } from "@/lib/locale-props";
import { getPricingPageContent } from "@/lib/pages/get-pricing-content";

export function PricingCalculatorSection({ locale = "he" }: LocaleProps) {
  const c = getPricingPageContent(locale);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pp-calculator">
      {!isOpen ? (
        <div className="pp-calculator-placeholder">
          <p className="pp-calculator-placeholder-text">
            {locale === "en"
              ? "Cost estimate tailored to services, scope, and goals — without leaving the pricing page."
              : "הערכת עלויות מותאמת לפי שירותים, היקף ויעדים — בלי לעזוב את המחירון."}
          </p>
          <button type="button" className="btn btn-primary btn-lg pp-calculator-open" onClick={() => setIsOpen(true)}>
            {c.PRICING_CALCULATOR.openLabel}
          </button>
        </div>
      ) : (
        <PricingCalculator />
      )}
      <p className="pp-calculator-footnote">{c.PRICING_CALCULATOR.footerNote}</p>
    </div>
  );
}
