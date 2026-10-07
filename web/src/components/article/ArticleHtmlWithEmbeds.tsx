"use client";

import { useMemo } from "react";
import { PricingCalculator } from "@/components/calculators/PricingCalculator";
import type { Locale } from "@/i18n/routing";
import { PRICING_CALCULATOR_EMBED_SLOT } from "@/lib/calculators/pricing-calculator-data";

type ArticleHtmlWithEmbedsProps = {
  html: string;
  className?: string;
  locale?: Locale;
};

/** Renders article HTML and mounts native React embeds at server-inserted slots. */
export function ArticleHtmlWithEmbeds({
  html,
  className = "",
  locale = "he",
}: ArticleHtmlWithEmbedsProps) {
  const enClass = locale === "en" ? " content-html--en" : "";
  const rootClass = `content-html${enClass} ${className}`.trim();

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
    return <div className={rootClass} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div className={rootClass}>
      {parts.before ? <div dangerouslySetInnerHTML={{ __html: parts.before }} /> : null}
      <PricingCalculator locale={locale} />
      {parts.after ? <div dangerouslySetInnerHTML={{ __html: parts.after }} /> : null}
    </div>
  );
}
