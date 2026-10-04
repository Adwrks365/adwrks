"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { CONTACT_CONVERSION } from "@/lib/pages/contact-content";
import { SITE } from "@/lib/site";
import { ContactPlanner } from "./ContactPlanner";

const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((m) => m.ContactForm),
  { loading: () => <p className="cp-form-loading">טוען טופס...</p> },
);

type ContactConversionSectionProps = {
  pageTitle: string;
  privacyNote?: string;
};

export function ContactConversionSection({ pageTitle, privacyNote }: ContactConversionSectionProps) {
  const [plannerSummary, setPlannerSummary] = useState("");

  return (
    <section id="contact-form" className="cp-conversion">
      <Container>
        <h2 className="cp-conversion-title">{CONTACT_CONVERSION.title}</h2>
        <div className="cp-conversion-grid">
          <ContactPlanner onSummaryChange={setPlannerSummary} />
          <div className="cp-form-card">
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
