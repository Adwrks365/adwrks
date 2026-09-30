"use client";

import { FormEvent, useState } from "react";
import { PrivacyConsent } from "@/components/forms/PrivacyConsent";
import { submitContactForm } from "@/lib/forms/submit-contact-form";

type FormStatus = "idle" | "submitting" | "success" | "error";

type ArticleSidebarContactFormProps = {
  pageTitle: string;
  pagePath: string;
};

export function ArticleSidebarContactForm({ pageTitle, pagePath }: ArticleSidebarContactFormProps) {
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
      setFeedback(result.message || "ההודעה נשלחה בהצלחה.");
      form.reset();
    } catch {
      setStatus("error");
      setFeedback("לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר.");
    }
  }

  return (
    <div className="article-sidebar-card article-sidebar-contact">
      <h2 className="article-sidebar-title">רוצים שנעזור לכם לקדם את העסק?</h2>
      <p className="article-sidebar-contact-note">השאירו פרטים ונחזור אליכם בהקדם.</p>
      <form className="article-sidebar-contact-form" onSubmit={onSubmit} noValidate>
        <label className="article-sidebar-contact-field">
          <span>שם *</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label className="article-sidebar-contact-field">
          <span>טלפון *</span>
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>
        <label className="article-sidebar-contact-field">
          <span>אימייל</span>
          <input name="email" type="email" autoComplete="email" />
        </label>
        <PrivacyConsent id="article-sidebar-privacy" />
        <input name="message" type="hidden" value="פנייה מטופס צד מאמר" />
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
          {status === "submitting" ? "שולח..." : "שליחה"}
        </button>
      </form>
    </div>
  );
}
