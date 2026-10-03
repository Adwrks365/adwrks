import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { ReactNode } from "react";

type ServiceHeroProps = {
  badge?: string;
  title: string;
  lead: string;
  proofImage?: { src: string; alt: string };
  visual?: ReactNode;
  actions: ReactNode;
  className?: string;
};

export function ServiceHero({ badge, title, lead, proofImage, visual, actions, className = "" }: ServiceHeroProps) {
  const hasVisualColumn = Boolean(visual || proofImage);

  return (
    <header className={`sp-hero ${className}`.trim()}>
      <div className="sp-hero-bg" aria-hidden="true" />
      <Container>
        <div
          className={`sp-hero-shell${hasVisualColumn ? " sp-hero-shell--split" : ""}${proofImage && !visual ? " sp-hero-shell--with-proof" : ""}`.trim()}
        >
          <div className="sp-hero-copy">
            {badge && <p className="sp-hero-badge">{badge}</p>}
            <h1 className="sp-hero-title">{title}</h1>
            <p className="sp-hero-lead">{lead}</p>
            <div className="sp-hero-actions">{actions}</div>
            {proofImage && visual && (
              <div className="sp-hero-proof sp-hero-proof--inline">
                <Image
                  src={proofImage.src}
                  alt={proofImage.alt}
                  width={140}
                  height={140}
                  className="sp-hero-proof-image"
                  sizes="120px"
                  loading="lazy"
                />
              </div>
            )}
          </div>
          {visual && <div className="sp-hero-visual">{visual}</div>}
          {proofImage && !visual && (
            <div className="sp-hero-proof" aria-hidden={proofImage.alt === ""}>
              <Image
                src={proofImage.src}
                alt={proofImage.alt}
                width={180}
                height={180}
                className="sp-hero-proof-image"
                sizes="(min-width: 768px) 140px, 0px"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
