import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/site";

export type CommercialFinalCtaProps = {
  eyebrow?: string;
  title: string;
  body: string;
  primaryLabel?: string;
  note?: string;
  showWhatsApp?: boolean;
  whatsappLabel?: string;
  showEmail?: boolean;
  footer?: ReactNode;
  className?: string;
};

export function CommercialFinalCta({
  eyebrow,
  title,
  body,
  primaryLabel = "צרו קשר",
  note,
  showWhatsApp = false,
  whatsappLabel = "דברו איתנו בוואטסאפ",
  showEmail = false,
  footer,
  className = "",
}: CommercialFinalCtaProps) {
  return (
    <Section tone="dark" align="center" className={`commercial-final-cta-section ${className}`.trim()}>
      <div className="commercial-final-cta">
        {eyebrow && <p className="commercial-final-cta-eyebrow">{eyebrow}</p>}
        <h2 className="commercial-final-cta-title">{title}</h2>
        <p className="commercial-final-cta-body">{body}</p>
        {note && (
          <p className="commercial-final-cta-note">
            <em>{note}</em>
          </p>
        )}
        <div className="commercial-final-cta-actions">
          <Button href="/contact-us/" variant="primary" size="lg" className="commercial-final-cta-primary">
            {primaryLabel}
          </Button>
          <a href={SITE.phoneTel} className="commercial-final-cta-phone">
            {SITE.phoneDisplay}
          </a>
          {showWhatsApp && (
            <a
              href={SITE.whatsapp}
              className="commercial-final-cta-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              {whatsappLabel}
            </a>
          )}
        </div>
        {showEmail && (
          <p className="commercial-final-cta-email">
            או כתבו לנו ב-
            <Link href={`mailto:${SITE.email}`}>{SITE.email}</Link>
          </p>
        )}
        {footer}
      </div>
    </Section>
  );
}
