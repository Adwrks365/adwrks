"use client";

import { useMemo } from "react";
import { PricingCalculator } from "@/components/calculators/PricingCalculator";
import { RoiCalculator } from "@/components/calculators/RoiCalculator";
import type { Locale } from "@/i18n/routing";
import { splitArticleEmbedSegments } from "@/lib/calculators/article-embed-slots";

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

  const segments = useMemo(() => splitArticleEmbedSegments(html), [html]);

  if (!segments) {
    if (!html) return null;
    return <div className={rootClass} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div className={rootClass}>
      {segments.map((segment, index) => {
        if (segment.kind === "html") {
          if (!segment.content.trim()) return null;
          return (
            <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: segment.content }} />
          );
        }
        if (segment.kind === "roi") {
          return <RoiCalculator key={`roi-${index}`} locale={locale} />;
        }
        return <PricingCalculator key={`pricing-${index}`} locale={locale} />;
      })}
    </div>
  );
}
