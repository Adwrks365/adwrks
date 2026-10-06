"use client";

import { useState } from "react";
import { PricingCalculator } from "@/components/calculators/PricingCalculator";
import { PRICING_CALCULATOR } from "@/lib/pages/pricing-content";

export function PricingCalculatorSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pp-calculator">
      {!isOpen ? (
        <div className="pp-calculator-placeholder">
          <p className="pp-calculator-placeholder-text">
            הערכת עלויות מותאמת לפי שירותים, היקף ויעדים — בלי לעזוב את המחירון.
          </p>
          <button type="button" className="btn btn-primary btn-lg pp-calculator-open" onClick={() => setIsOpen(true)}>
            {PRICING_CALCULATOR.openLabel}
          </button>
        </div>
      ) : (
        <PricingCalculator />
      )}
      <p className="pp-calculator-footnote">{PRICING_CALCULATOR.footerNote}</p>
    </div>
  );
}
