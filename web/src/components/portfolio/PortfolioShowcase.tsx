"use client";

import Link from "next/link";
import { Carousel } from "@/components/ui/Carousel";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";
import { linkWithArrow } from "@/i18n/ui-arrows";
import { getPortfolioProjectsForVariant } from "@/lib/portfolio/projects";
import type { PortfolioShowcaseVariant } from "@/lib/portfolio/types";
import { PortfolioBrowserCard } from "./PortfolioBrowserCard";

type PortfolioShowcaseProps = {
  variant: PortfolioShowcaseVariant;
  className?: string;
  locale?: Locale;
};

export function PortfolioShowcase({ variant, className = "", locale = "he" }: PortfolioShowcaseProps) {
  const portfolioHref = locale === "en" ? "/en/website-building/#portfolio" : "/website-building/#portfolio";
  const portfolioCta =
    locale === "en" ? "View all website examples" : "לכל דוגמאות האתרים שלנו";
  const projects = getPortfolioProjectsForVariant(variant);

  if (variant === "inline") {
    return (
      <div className={`portfolio-showcase portfolio-showcase--inline ${className}`.trim()}>
        <div className="portfolio-showcase-inline-grid">
          {projects.map((project) => (
            <PortfolioBrowserCard key={project.id} project={project} density="inline" />
          ))}
        </div>
        <p className="portfolio-showcase-inline-cta">
          <Link href={portfolioHref}>{linkWithArrow(locale, portfolioCta)}</Link>
        </p>
      </div>
    );
  }

  const carouselClass =
    variant === "rich" ? "carousel-portfolio carousel-portfolio-rich" : "carousel-portfolio";

  return (
    <div className={`portfolio-showcase portfolio-showcase--${variant} ${className}`.trim()}>
      <Carousel
        ariaLabel="דוגמאות לאתרים"
        itemCount={projects.length}
        className={carouselClass}
      >
        {projects.map((project) => (
          <PortfolioBrowserCard
            key={project.id}
            project={project}
            density={variant === "rich" ? "rich" : "compact"}
          />
        ))}
      </Carousel>
      {variant === "rich" ? (
        <p className="portfolio-showcase-rich-note" aria-live="polite">
          {projects.length} פרויקטים — גללו לצפייה בכל העבודות
        </p>
      ) : null}
    </div>
  );
}

/** Standalone inline block with CTA button — for future article integration. */
export function PortfolioShowcaseInlineBlock({ className = "" }: { className?: string }) {
  return (
    <aside className={`portfolio-showcase-inline-block ${className}`.trim()} aria-label="דוגמאות אתרים">
      <PortfolioShowcase variant="inline" />
      <div className="mt-6 text-center">
        <Button href="/website-building/#portfolio" variant="secondary">
          לכל דוגמאות האתרים
        </Button>
      </div>
    </aside>
  );
}
