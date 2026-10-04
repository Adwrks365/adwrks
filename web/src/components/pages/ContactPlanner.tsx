"use client";

import { useEffect, useState } from "react";
import { CONTACT_PLANNER } from "@/lib/pages/contact-content";

type ContactPlannerProps = {
  onSummaryChange: (summary: string) => void;
};

export function ContactPlanner({ onSummaryChange }: ContactPlannerProps) {
  const [goal, setGoal] = useState<string | null>(null);
  const [existing, setExisting] = useState<string[]>([]);

  useEffect(() => {
    const lines: string[] = [];
    if (goal) lines.push(`מטרה: ${goal}`);
    if (existing.length > 0) lines.push(`קיים היום: ${existing.join(" + ")}`);
    onSummaryChange(lines.length > 0 ? `${CONTACT_PLANNER.summaryPrefix}\n${lines.join("\n")}` : "");
  }, [goal, existing, onSummaryChange]);

  function toggleExisting(option: string) {
    setExisting((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  }

  return (
    <div className="cp-planner">
      <p className="cp-planner-kicker">{CONTACT_PLANNER.kicker}</p>
      <h3 className="cp-planner-title">{CONTACT_PLANNER.title}</h3>

      <div className="cp-planner-step">
        <p className="cp-planner-step-label">{CONTACT_PLANNER.step1Label}</p>
        <div className="cp-planner-options" role="group" aria-label={CONTACT_PLANNER.step1Label}>
          {CONTACT_PLANNER.goals.map((option) => (
            <button
              key={option}
              type="button"
              className={`cp-planner-chip ${goal === option ? "is-selected" : ""}`}
              aria-pressed={goal === option}
              onClick={() => setGoal((current) => (current === option ? null : option))}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="cp-planner-step">
        <p className="cp-planner-step-label">
          {CONTACT_PLANNER.step2Label}
          <span className="cp-planner-optional"> ({CONTACT_PLANNER.step2Optional})</span>
        </p>
        <div className="cp-planner-options" role="group" aria-label={CONTACT_PLANNER.step2Label}>
          {CONTACT_PLANNER.existing.map((option) => (
            <button
              key={option}
              type="button"
              className={`cp-planner-chip ${existing.includes(option) ? "is-selected" : ""}`}
              aria-pressed={existing.includes(option)}
              onClick={() => toggleExisting(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
