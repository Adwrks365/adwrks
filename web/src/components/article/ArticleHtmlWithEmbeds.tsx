"use client";

import { useMemo } from "react";
import { PricingCalculator } from "@/components/calculators/PricingCalculator";
import { PRICING_CALCULATOR_EMBED_SLOT } from "@/lib/calculators/pricing-calculator-data";

type ArticleHtmlWithEmbedsProps = {
  html: string;
  className?: string;
};

/** Renders article HTML and mounts native React embeds at server-inserted slots. */
export function ArticleHtmlWithEmbeds({ html, className = "" }: ArticleHtmlWithEmbedsProps) {
  const parts = useMemo(() => {
    if (!html.includes("data-adwrks-pricing-calculator")) {
      return null;
    }

    const [before, ...rest] = html.split(PRICING_CALCULATOR_EMBED_SLOT);
    return {
      before,
      after: rest.join(PRICING_CALCULATOR_EMBED_SLOT),
    };
  }, [html]);

  if (!parts) {
    if (!html) return null;
    return (
      <div
        className={`content-html ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={`content-html ${className}`.trim()}>
      {parts.before ? <div dangerouslySetInnerHTML={{ __html: parts.before }} /> : null}
      <PricingCalculator />
      {parts.after ? <div dangerouslySetInnerHTML={{ __html: parts.after }} /> : null}
    </div>
  );
}
