import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";

export type CommercialMidCtaProps = {
  eyebrow?: string;
  title: string;
  body: string;
  children: ReactNode;
  className?: string;
};

export function CommercialMidCta({
  eyebrow,
  title,
  body,
  children,
  className = "",
}: CommercialMidCtaProps) {
  return (
    <Section tone="gradient" align="start" className={`commercial-mid-cta-section ${className}`.trim()}>
      <div className="commercial-mid-cta-panel">
        {eyebrow && <p className="commercial-mid-cta-eyebrow">{eyebrow}</p>}
        <h2 className="commercial-mid-cta-title">{title}</h2>
        <p className="commercial-mid-cta-text">{body}</p>
        {children}
      </div>
    </Section>
  );
}
