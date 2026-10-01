"use client";

import Image from "next/image";
import type { PortfolioProject } from "@/lib/portfolio/types";

const CARD_WIDTH = 420;
const CARD_HEIGHT = 525;

type PortfolioBrowserCardProps = {
  project: PortfolioProject;
  showTitle?: boolean;
  density?: "compact" | "rich" | "inline";
};

/** Cap hover travel so tall screenshots don't "scroll" excessively. */
function revealOffset(project: PortfolioProject): string {
  const viewportRatio = CARD_HEIGHT / CARD_WIDTH;
  const imageRatio = project.screenshotHeight / project.screenshotWidth;
  if (imageRatio <= viewportRatio + 0.15) return "0%";
  const excess = imageRatio - viewportRatio;
  const capped = Math.min(excess * 18, 14);
  return `${capped.toFixed(1)}%`;
}

export function PortfolioBrowserCard({
  project,
  showTitle = true,
  density = "compact",
}: PortfolioBrowserCardProps) {
  const displayCaption = showTitle && project.showCaption !== false;

  return (
    <figure
      className={`portfolio-showcase-card portfolio-showcase-card--${density}`}
      style={{ ["--portfolio-reveal" as string]: revealOffset(project) }}
    >
      <div className="portfolio-showcase-frame">
        <div className="portfolio-showcase-chrome" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="portfolio-showcase-screen">
          <div className="portfolio-showcase-shot-wrap">
            <Image
              src={project.screenshot}
              alt={project.screenshotAlt}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              sizes={
                density === "inline"
                  ? "(max-width: 768px) 100vw, 280px"
                  : "(max-width: 768px) 88vw, (max-width: 1280px) 42vw, 360px"
              }
              loading="lazy"
              className="portfolio-showcase-screenshot"
            />
          </div>
          <div className="portfolio-showcase-continuity" aria-hidden="true" />
        </div>
      </div>
      {displayCaption ? (
        <figcaption className="portfolio-showcase-caption">
          <span className="portfolio-showcase-caption-title">{project.title}</span>
          {project.captionSubtitle ? (
            <span className="portfolio-showcase-caption-sub">{project.captionSubtitle}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
