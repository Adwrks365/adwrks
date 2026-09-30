import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "./Container";

type PageHeroVariant = "split" | "centered" | "article";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
  image?: string;
  imageAlt?: string;
  compact?: boolean;
  variant?: PageHeroVariant;
  /** Article metadata row (date, etc.) */
  meta?: ReactNode;
};

export function PageHero({
  title,
  subtitle,
  eyebrow,
  children,
  image,
  imageAlt = "",
  compact,
  variant = "split",
  meta,
}: PageHeroProps) {
  const isTextOnly = !image;
  const isArticle = variant === "article";
  const isCentered = variant === "centered" || isTextOnly;

  const classes = [
    "page-hero",
    compact ? "page-hero-compact" : "",
    isTextOnly ? "page-hero--text-only" : "",
    isCentered ? "page-hero--centered" : "",
    isArticle ? "page-hero--article" : "",
    image ? "page-hero--has-image" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="page-hero-bg-decor" aria-hidden="true" />
      <Container>
        <div className={`page-hero-grid ${image ? "has-image" : ""}`}>
          <div className="page-hero-content">
            {eyebrow && <p className="page-hero-eyebrow">{eyebrow}</p>}
            {meta && <div className="page-hero-meta">{meta}</div>}
            <h1 className="page-hero-title">{title}</h1>
            {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
            {children}
          </div>
          {image && (
            <div className="page-hero-media">
              <div className="page-hero-media-frame">
                <Image
                  src={image}
                  alt={imageAlt}
                  width={640}
                  height={400}
                  className="page-hero-image"
                  priority={compact || isArticle}
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
