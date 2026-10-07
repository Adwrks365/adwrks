"use client";

import { FormEvent, useState } from "react";
import { PrivacyConsent } from "@/components/forms/PrivacyConsent";
import type { Locale } from "@/i18n/routing";
import { submitContactForm } from "@/lib/forms/submit-contact-form";
import { getArticleUi } from "@/lib/i18n/article-ui";

type FormStatus = "idle" | "submitting" | "success" | "error";

type ArticleSidebarContactFormProps = {
  pageTitle: string;
  pagePath: string;
  locale?: Locale;
};

export function ArticleSidebarContactForm({
  pageTitle,
  pagePath,
  locale = "he",
}: ArticleSidebarContactFormProps) {
  const ui = getArticleUi(locale);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const result = await submitContactForm({
        ...data,
        formId: "article-sidebar",
        pageTitle,
        pagePath,
      });
      if (!result.ok) {
        setStatus("error");
        setFeedback(result.message);
        return;
      }
      setStatus("success");
      setFeedback(result.message || ui.formSuccess);
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(ui.formError);
    }
  }

  return (
    <div className="article-sidebar-card article-sidebar-contact">
      <h2 className="article-sidebar-title">{ui.sidebarContactTitle}</h2>
      <p className="article-sidebar-contact-note">{ui.sidebarContactNote}</p>
      <form className="article-sidebar-contact-form" onSubmit={onSubmit} noValidate>
        <label className="article-sidebar-contact-field">
          <span>{ui.name}</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label className="article-sidebar-contact-field">
          <span>{ui.phone}</span>
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>
        <label className="article-sidebar-contact-field">
          <span>{ui.email}</span>
          <input name="email" type="email" autoComplete="email" />
        </label>
        <PrivacyConsent id="article-sidebar-privacy" locale={locale} />
        <input name="message" type="hidden" value={ui.sidebarMessage} />
        <div className="hidden" aria-hidden="true">
          <label htmlFor="article-sidebar-website">Website</label>
          <input id="article-sidebar-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        {status === "error" && (
          <p className="article-sidebar-contact-feedback is-error" role="alert">
            {feedback}
          </p>
        )}
        {status === "success" && (
          <p className="article-sidebar-contact-feedback is-success" role="status">
            {feedback}
          </p>
        )}
        <button type="submit" disabled={status === "submitting"} className="article-sidebar-contact-submit">
          {status === "submitting" ? ui.submitting : ui.submit}
        </button>
      </form>
    </div>
  );
}
