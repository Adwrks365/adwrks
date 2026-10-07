"use client";

import { FormEvent, useState } from "react";
import { PrivacyConsent } from "@/components/forms/PrivacyConsent";
import { trackPopupEvent } from "@/lib/analytics/popup-events";
import type { PopupConfig } from "@/lib/popups/types";
import { submitContactForm } from "@/lib/forms/submit-contact-form";

type FormStatus = "idle" | "submitting" | "success" | "error";

type ContextualLeadPopupFormProps = {
  config: PopupConfig;
  onSubmitted: () => void;
};

export function ContextualLeadPopupForm({ config, onSubmitted }: ContextualLeadPopupFormProps) {
  const locale = config.locale ?? "he";
  const isEn = locale === "en";
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
        formId: "contextual-popup",
        popupContext: config.popupContext,
        pageTitle: config.pageTitle,
        pagePath: config.pagePath,
        message: isEn
          ? `Popup inquiry – ${config.contextLabel}`
          : `פנייה מפופאפ – ${config.contextLabel}`,
      });

      if (!result.ok) {
        setStatus("error");
        setFeedback(result.message);
        return;
      }

      trackPopupEvent("popup_submit", {
        popup_id: config.popupId,
        popup_context: config.popupContext,
        page_path: config.pagePath,
      });

      setStatus("success");
      setFeedback(result.message || (isEn ? "Your message was sent successfully." : "ההודעה נשלחה בהצלחה."));
      form.reset();
      onSubmitted();
    } catch {
      setStatus("error");
      setFeedback(
        isEn
          ? "Unable to submit the form right now. Please try again later."
          : "לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר.",
      );
    }
  }

  return (
    <form className="contextual-popup-form" onSubmit={onSubmit} noValidate>
      <label className="contextual-popup-field">
        <span>{isEn ? "Full name *" : "שם מלא *"}</span>
        <input name="name" type="text" required autoComplete="name" />
      </label>
      <label className="contextual-popup-field">
        <span>{isEn ? "Phone *" : "טלפון *"}</span>
        <input name="phone" type="tel" required autoComplete="tel" />
      </label>
      <label className="contextual-popup-field">
        <span>{isEn ? "Email" : "אימייל"}</span>
        <input name="email" type="email" autoComplete="email" />
      </label>
      <PrivacyConsent id={`contextual-popup-privacy-${config.popupId}`} locale={locale} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`contextual-popup-website-${config.popupId}`}>Website</label>
        <input
          id={`contextual-popup-website-${config.popupId}`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {status === "error" && (
        <p className="contextual-popup-feedback is-error" role="alert">
          {feedback}
        </p>
      )}
      {status === "success" && (
        <p className="contextual-popup-feedback is-success" role="status">
          {feedback}
        </p>
      )}
      <button type="submit" disabled={status === "submitting"} className="contextual-popup-submit">
        {status === "submitting" ? (isEn ? "Sending..." : "שולח...") : config.ctaLabel}
      </button>
    </form>
  );
}
