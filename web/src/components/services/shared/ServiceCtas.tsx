"use client";

import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Button } from "@/components/ui/Button";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

type ServicePrimaryCtaProps = {
  label: string;
  className?: string;
};

export function ServicePrimaryCta({ label, className = "btn btn-primary btn-lg" }: ServicePrimaryCtaProps) {
  return <ContextualPopupTrigger className={className}>{label}</ContextualPopupTrigger>;
}

type ServiceCtaRowProps = {
  primaryLabel: string;
  tone?: "dark" | "light";
  secondary?: ReactNode;
  tertiary?: ReactNode;
};

export function ServiceCtaRow({ primaryLabel, tone = "light", secondary, tertiary }: ServiceCtaRowProps) {
  return (
    <div className={`sp-cta-row sp-cta-row--${tone}`}>
      <ServicePrimaryCta label={primaryLabel} className="btn btn-primary btn-lg sp-cta-primary" />
      {secondary}
      {tertiary}
    </div>
  );
}

export function ServicePhoneLink({ tone = "light" }: { tone?: "dark" | "light" }) {
  return (
    <a
      href="tel:0795599449"
      className={`sp-phone-link sp-phone-link--on-${tone}`}
    >
      079-559-9449
    </a>
  );
}

export function ServiceContactButton() {
  const locale = useLocale();
  const href = locale === "en" ? "/en/contact-us/" : "/contact-us/";
  const label = locale === "en" ? "Contact us" : "צרו קשר";

  return (
    <Button href={href} variant="outline" size="lg" className="sp-cta-tertiary">
      {label}
    </Button>
  );
}
