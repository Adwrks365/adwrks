"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CONTACT_CONVERSION } from "@/lib/pages/contact-content";
import { SITE } from "@/lib/site";
import { ContactPlanner, type PlannerContext } from "./ContactPlanner";

const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((m) => m.ContactForm),
  { loading: () => <p className="cp-form-loading">טוען טופס...</p> },
);

const FORM_FIELD_IDS = ["contact-name", "contact-phone", "contact-email", "contact-message"] as const;

type ContactConversionSectionProps = {
  pageTitle: string;
  privacyNote?: string;
};

export function ContactConversionSection({ pageTitle, privacyNote }: ContactConversionSectionProps) {
  const [plannerSummary, setPlannerSummary] = useState("");
  const [plannerContext, setPlannerContext] = useState<PlannerContext>({ goal: null, existing: [] });
  const formCardRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formCardRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    const focusDelay = prefersReducedMotion ? 0 : 350;
    window.setTimeout(() => {
      for (const id of FORM_FIELD_IDS) {
        const field = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
        if (field && !field.value.trim()) {
          field.focus();
          break;
        }
      }
    }, focusDelay);
  }, []);

  const formContextLine = plannerContext.goal
    ? [plannerContext.goal, ...plannerContext.existing].join(" · ")
    : null;

  return (
    <section id="contact-form" className="cp-conversion">
      <Container>
        <h2 className="cp-conversion-title">{CONTACT_CONVERSION.title}</h2>
        <div className="cp-conversion-grid">
          <ContactPlanner
            onSummaryChange={setPlannerSummary}
            onContextChange={setPlannerContext}
            onContinue={scrollToForm}
          />
          <div className="cp-form-card" ref={formCardRef}>
            {formContextLine && (
              <div className="cp-form-context" role="status" aria-live="polite">
                <p className="cp-form-context-heading">{CONTACT_CONVERSION.formContextHeading}</p>
                <p className="cp-form-context-line">{formContextLine}</p>
              </div>
            )}
            <p className="cp-form-intro">{CONTACT_CONVERSION.formIntro}</p>
            <ContactForm
              formId="contact-page"
              pageTitle={pageTitle}
              pagePath="/contact-us/"
              submitLabel={CONTACT_CONVERSION.submitLabel}
              appendToMessage={plannerSummary || undefined}
            />
            {privacyNote && <p className="cp-form-privacy">{privacyNote}</p>}
            <div className="cp-direct-inline">
              <p className="cp-direct-prompt">{CONTACT_CONVERSION.directPrompt}</p>
              <div className="cp-direct-links">
                <a href={SITE.phoneTel} className="cp-direct-link cp-direct-link--primary" dir="ltr">
                  {SITE.phoneDisplay}
                </a>
                <a
                  href={SITE.whatsapp}
                  className="cp-direct-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
                <a href={`mailto:${SITE.email}`} className="cp-direct-link cp-direct-link--tertiary" dir="ltr">
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
