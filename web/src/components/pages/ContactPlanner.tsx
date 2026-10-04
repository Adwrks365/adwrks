"use client";

import { useEffect, useState } from "react";
import { CONTACT_PLANNER } from "@/lib/pages/contact-content";

export type PlannerContext = {
  goal: string | null;
  existing: string[];
};

type ContactPlannerProps = {
  onSummaryChange: (summary: string) => void;
  onContextChange: (context: PlannerContext) => void;
  onContinue: () => void;
};

export function ContactPlanner({ onSummaryChange, onContextChange, onContinue }: ContactPlannerProps) {
  const [goal, setGoal] = useState<string | null>(null);
  const [existing, setExisting] = useState<string[]>([]);

  useEffect(() => {
    onContextChange({ goal, existing });

    const lines: string[] = [];
    if (goal) lines.push(`${CONTACT_PLANNER.messageGoalLabel}: ${goal}`);
    if (existing.length > 0) {
      lines.push(`${CONTACT_PLANNER.messageExistingLabel}: ${existing.join(", ")}`);
    }
    onSummaryChange(lines.length > 0 ? lines.join("\n") : "");
  }, [goal, existing, onSummaryChange, onContextChange]);

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
      <p className="cp-planner-kicker">{CONTACT_PLANNER.kicker}</p>
      <h3 className="cp-planner-title">{CONTACT_PLANNER.title}</h3>

      <div className="cp-planner-step">
        <p className="cp-planner-step-label">{CONTACT_PLANNER.step1Label}</p>
        <div className="cp-planner-options" role="group" aria-label={CONTACT_PLANNER.step1Label}>
          {CONTACT_PLANNER.goals.map((option) => {
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
          {CONTACT_PLANNER.step2Label}
          <span className="cp-planner-optional"> ({CONTACT_PLANNER.step2Optional})</span>
        </p>
        <div className="cp-planner-options" role="group" aria-label={CONTACT_PLANNER.step2Label}>
          {CONTACT_PLANNER.existing.map((option) => {
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
          <p className="cp-planner-summary-heading">{CONTACT_PLANNER.summaryHeading}</p>
          <p className="cp-planner-summary-line">
            <span className="cp-planner-summary-label">{CONTACT_PLANNER.summaryGoalLabel}:</span> {goal}
          </p>
          {existing.length > 0 && (
            <p className="cp-planner-summary-line">
              <span className="cp-planner-summary-label">{CONTACT_PLANNER.summaryExistingLabel}:</span>{" "}
              {existingSummary}
            </p>
          )}
          <button type="button" className="cp-planner-continue" onClick={onContinue}>
            {CONTACT_PLANNER.continueLabel}
          </button>
        </div>
      )}

      {hasSelections && (
        <button type="button" className="cp-planner-clear" onClick={clearSelections}>
          {CONTACT_PLANNER.clearLabel}
        </button>
      )}
    </div>
  );
}
