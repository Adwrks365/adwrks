"use client";

import { useEffect, useState } from "react";
import type { LocaleProps } from "@/lib/locale-props";
import { getContactPageContent } from "@/lib/pages/get-contact-content";

export type PlannerContext = {
  goal: string | null;
  existing: string[];
};

type ContactPlannerProps = {
  onSummaryChange: (summary: string) => void;
  onContextChange: (context: PlannerContext) => void;
  onContinue: () => void;
};

export function ContactPlanner({
  onSummaryChange,
  onContextChange,
  onContinue,
  locale = "he",
}: ContactPlannerProps & LocaleProps) {
  const c = getContactPageContent(locale);
  const [goal, setGoal] = useState<string | null>(null);
  const [existing, setExisting] = useState<string[]>([]);

  useEffect(() => {
    onContextChange({ goal, existing });

    const lines: string[] = [];
    if (goal) lines.push(`${c.CONTACT_PLANNER.messageGoalLabel}: ${goal}`);
    if (existing.length > 0) {
      lines.push(`${c.CONTACT_PLANNER.messageExistingLabel}: ${existing.join(", ")}`);
    }
    onSummaryChange(lines.length > 0 ? lines.join("\n") : "");
  }, [goal, existing, onSummaryChange, onContextChange, c.CONTACT_PLANNER]);

  function toggleExisting(option: string) {
    setExisting((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  }

  function clearSelections() {
    setGoal(null);
    setExisting([]);
  }

  const hasSelections = goal !== null || existing.length > 0;
  const existingSummary = existing.join(", ");

  return (
    <div className="cp-planner">
      <p className="cp-planner-kicker">{c.CONTACT_PLANNER.kicker}</p>
      <h3 className="cp-planner-title">{c.CONTACT_PLANNER.title}</h3>

      <div className="cp-planner-step">
        <p className="cp-planner-step-label">{c.CONTACT_PLANNER.step1Label}</p>
        <div className="cp-planner-options" role="group" aria-label={c.CONTACT_PLANNER.step1Label}>
          {c.CONTACT_PLANNER.goals.map((option) => {
            const selected = goal === option;
            return (
              <button
                key={option}
                type="button"
                className={`cp-planner-chip ${selected ? "is-selected" : ""}`}
                aria-pressed={selected}
                onClick={() => setGoal((current) => (current === option ? null : option))}
              >
                {selected && (
                  <span className="cp-planner-chip-check" aria-hidden="true">
                    ✓
                  </span>
                )}
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="cp-planner-step">
        <p className="cp-planner-step-label">
          {c.CONTACT_PLANNER.step2Label}
          <span className="cp-planner-optional"> ({c.CONTACT_PLANNER.step2Optional})</span>
        </p>
        <div className="cp-planner-options" role="group" aria-label={c.CONTACT_PLANNER.step2Label}>
          {c.CONTACT_PLANNER.existing.map((option) => {
            const selected = existing.includes(option);
            return (
              <button
                key={option}
                type="button"
                className={`cp-planner-chip ${selected ? "is-selected" : ""}`}
                aria-pressed={selected}
                onClick={() => toggleExisting(option)}
              >
                {selected && (
                  <span className="cp-planner-chip-check" aria-hidden="true">
                    ✓
                  </span>
                )}
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {goal && (
        <div className="cp-planner-summary" role="status" aria-live="polite">
          <p className="cp-planner-summary-heading">{c.CONTACT_PLANNER.summaryHeading}</p>
          <p className="cp-planner-summary-line">
            <span className="cp-planner-summary-label">{c.CONTACT_PLANNER.summaryGoalLabel}:</span> {goal}
          </p>
          {existing.length > 0 && (
            <p className="cp-planner-summary-line">
              <span className="cp-planner-summary-label">{c.CONTACT_PLANNER.summaryExistingLabel}:</span>{" "}
              {existingSummary}
            </p>
          )}
          <button type="button" className="cp-planner-continue" onClick={onContinue}>
            {c.CONTACT_PLANNER.continueLabel}
          </button>
        </div>
      )}

      {hasSelections && (
        <button type="button" className="cp-planner-clear" onClick={clearSelections}>
          {c.CONTACT_PLANNER.clearLabel}
        </button>
      )}
    </div>
  );
}
