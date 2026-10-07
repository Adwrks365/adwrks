"use client";

import { useEffect, useId, useRef } from "react";
import { ContextualLeadPopupForm } from "@/components/popups/ContextualLeadPopupForm";
import { trackPopupEvent, type PopupOpenMethod } from "@/lib/analytics/popup-events";
import type { PopupConfig } from "@/lib/popups/types";

type ContextualLeadPopupProps = {
  config: PopupConfig;
  openMethod: PopupOpenMethod;
  onClose: () => void;
  onDismiss: () => void;
};

export function ContextualLeadPopup({
  config,
  openMethod,
  onClose,
  onDismiss,
}: ContextualLeadPopupProps) {
  const locale = config.locale ?? "he";
  const isEn = locale === "en";
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    trackPopupEvent("popup_view", {
      popup_id: config.popupId,
      popup_context: config.popupContext,
      page_path: config.pagePath,
      open_method: openMethod,
    });

    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        trackPopupEvent("popup_close", {
          popup_id: config.popupId,
          popup_context: config.popupContext,
          page_path: config.pagePath,
        });
        onDismiss();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("contextual-popup-open");

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("contextual-popup-open");
      previousFocus?.focus?.();
    };
  }, [config, onDismiss, openMethod]);

  function handleClose() {
    trackPopupEvent("popup_close", {
      popup_id: config.popupId,
      popup_context: config.popupContext,
      page_path: config.pagePath,
    });
    onDismiss();
  }

  return (
    <div className="contextual-popup-root" role="presentation">
      <button
        type="button"
        className="contextual-popup-backdrop"
        aria-label={isEn ? "Close dialog" : "סגירת חלון"}
        onClick={handleClose}
      />
      <div
        ref={dialogRef}
        className="contextual-popup-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="contextual-popup-header">
          <p className="contextual-popup-brand">Adwrks 365</p>
          <button
            ref={closeRef}
            type="button"
            className="contextual-popup-close"
            aria-label={isEn ? "Close" : "סגירה"}
            onClick={handleClose}
          >
            ×
          </button>
        </div>
        <h2 id={titleId} className="contextual-popup-title">
          {config.headline}
        </h2>
        <p id={descId} className="contextual-popup-description">
          {config.description}
        </p>
        <ContextualLeadPopupForm
          config={config}
          onSubmitted={() => {
            onClose();
          }}
        />
      </div>
    </div>
  );
}
