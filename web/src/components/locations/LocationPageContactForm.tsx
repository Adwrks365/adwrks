"use client";

import { ContactForm } from "@/components/ContactForm";
import type { Locale } from "@/i18n/routing";

type LocationPageContactFormProps = {
  locale: Locale;
  pageTitle: string;
  pagePath: string;
};

export function LocationPageContactForm({ locale, pageTitle, pagePath }: LocationPageContactFormProps) {
  return (
    <div className="sp-contact-form-wrap">
      <ContactForm formId="contact-page" locale={locale} pageTitle={pageTitle} pagePath={pagePath} />
    </div>
  );
}
