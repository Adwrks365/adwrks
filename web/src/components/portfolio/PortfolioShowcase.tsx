"use client";

import Link from "next/link";
import { Carousel } from "@/components/ui/Carousel";
import { Button } from "@/components/ui/Button";
import { getPortfolioProjectsForVariant } from "@/lib/portfolio/projects";
import type { PortfolioShowcaseVariant } from "@/lib/portfolio/types";
import { PortfolioBrowserCard } from "./PortfolioBrowserCard";

type PortfolioShowcaseProps = {
  variant: PortfolioShowcaseVariant;
  className?: string;
};

export function PortfolioShowcase({ variant, className = "" }: PortfolioShowcaseProps) {
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
          <Link href="/website-building/#portfolio">לכל דוגמאות האתרים שלנו ←</Link>
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
