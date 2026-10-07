"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { PrivacyConsent } from "@/components/forms/PrivacyConsent";
import { pushLeadSubmitEvent } from "@/components/GoogleTags";
import type { Locale } from "@/i18n/routing";
import type { ContactFormId } from "@/lib/email/contact-form-ids";
import { submitContactForm } from "@/lib/forms/submit-contact-form";

type FormStatus = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  variant?: "default" | "compact";
  formId: ContactFormId;
  pageTitle: string;
  pagePath: string;
  submitLabel?: string;
  appendToMessage?: string;
  locale?: Locale;
};

export function ContactForm({
  variant = "default",
  formId,
  pageTitle,
  pagePath,
  submitLabel,
  appendToMessage,
  locale = "he",
}: ContactFormProps) {
  const t = useTranslations("Forms");
  const resolvedSubmitLabel = submitLabel ?? t("submit");
  const compact = variant === "compact";
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const userMessage = typeof data.message === "string" ? data.message.trim() : "";
    const message = appendToMessage
      ? userMessage
        ? `${appendToMessage}\n\n${userMessage}`
        : appendToMessage
      : userMessage;

    try {
      const result = await submitContactForm({
        ...data,
        message,
        formId,
        pageTitle,
        pagePath,
      });
      if (!result.ok) {
        setStatus("error");
        setFeedback(result.message);
        return;
      }
      setStatus("success");
      setFeedback(result.message || t("success"));
      pushLeadSubmitEvent(locale, formId);
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(t("error"));
    }
  }

  return (
    <form
      className={`contact-form ${compact ? "contact-form-compact" : "mx-auto max-w-xl space-y-4"}`}
      onSubmit={onSubmit}
      noValidate
    >
      <div className={`grid gap-4 sm:grid-cols-2 ${compact ? "contact-form-row" : ""}`}>
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-slate-700">
            {t("fullName")}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-slate-700">
            {t("phone")}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-slate-700">
          {t("email")}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-slate-700">
          {t("message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={compact ? 3 : 4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <PrivacyConsent id="contact-privacy" locale={locale} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {feedback}
        </p>
      )}
      {status === "success" && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
          {feedback}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className={`contact-form-submit inline-flex items-center justify-center rounded-md bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${compact ? "w-full py-2.5" : "w-full py-2.5 sm:w-auto"}`}
      >
        {status === "submitting" ? t("submitting") : resolvedSubmitLabel}
      </button>
    </form>
  );
}
