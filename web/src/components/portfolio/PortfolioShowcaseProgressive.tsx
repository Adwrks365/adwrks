"use client";

import { useCallback, useState } from "react";
import { Carousel } from "@/components/ui/Carousel";
import { PORTFOLIO_PROJECTS } from "@/lib/portfolio/projects";
import { PortfolioBrowserCard } from "./PortfolioBrowserCard";

const INITIAL_MOUNT = 2;
const MOUNT_BUFFER = 1;

type PortfolioShowcaseProgressiveProps = {
  className?: string;
};

/**
 * Rich portfolio carousel with progressive card mounting.
 * All 22 projects are navigable; images mount only for active window.
 */
export function PortfolioShowcaseProgressive({ className = "" }: PortfolioShowcaseProgressiveProps) {
  const projects = PORTFOLIO_PROJECTS;
  const [mountedThrough, setMountedThrough] = useState(INITIAL_MOUNT);

  const handleActiveIndexChange = useCallback((index: number) => {
    setMountedThrough((prev) => Math.max(prev, index + MOUNT_BUFFER + 1));
  }, []);

  return (
    <div className={`portfolio-showcase portfolio-showcase--rich portfolio-showcase--progressive ${className}`.trim()}>
      <Carousel
        ariaLabel="דוגמאות לאתרים שבנינו"
        itemCount={projects.length}
        className="carousel-portfolio carousel-portfolio-rich"
        onActiveIndexChange={handleActiveIndexChange}
      >
        {projects.map((project, index) =>
          index < mountedThrough ? (
            <PortfolioBrowserCard key={project.id} project={project} density="rich" />
          ) : (
            <div
              key={project.id}
              className="portfolio-showcase-card portfolio-showcase-card--rich portfolio-showcase-card--placeholder"
              aria-hidden="true"
            />
          ),
        )}
      </Carousel>
      <p className="portfolio-showcase-rich-note" aria-live="polite">
        {projects.length} פרויקטים — גללו לצפייה בכל העבודות
      </p>
    </div>
  );
}
