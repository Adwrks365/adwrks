"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PopupConfig } from "@/lib/popups/types";
import {
  hasPopupShownOnPage,
  isPopupSessionSuppressed,
  markPopupShownOnPage,
  suppressPopupSession,
} from "@/lib/popups/session";
import {
  getScrollDepth,
  getTriggerConfig,
  isAnotherModalOpen,
  isUserInteractingWithForm,
} from "@/lib/popups/triggers";

const ContextualLeadPopup = dynamic(
  () => import("@/components/popups/ContextualLeadPopup").then((m) => m.ContextualLeadPopup),
  { ssr: false },
);

type ContextualLeadPopupHostProps = {
  config: PopupConfig;
};

export function ContextualLeadPopupHost({ config }: ContextualLeadPopupHostProps) {
  const [open, setOpen] = useState(false);
  const triggeredRef = useRef(false);
  const triggerConfig = getTriggerConfig(config.audience);

  const tryOpen = useCallback(() => {
    if (triggeredRef.current) return;
    if (isPopupSessionSuppressed()) return;
    if (hasPopupShownOnPage(config.pagePath)) return;
    if (isAnotherModalOpen()) return;
    if (isUserInteractingWithForm()) return;

    triggeredRef.current = true;
    markPopupShownOnPage(config.pagePath);
    setOpen(true);
  }, [config.pagePath]);

  useEffect(() => {
    if (isPopupSessionSuppressed() || hasPopupShownOnPage(config.pagePath)) {
      triggeredRef.current = true;
      return;
    }

    const onScroll = () => {
      if (getScrollDepth() >= triggerConfig.scrollDepth) {
        tryOpen();
      }
    };

    const timer = window.setTimeout(() => {
      tryOpen();
    }, triggerConfig.timeOnPageMs);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [config.pagePath, triggerConfig.scrollDepth, triggerConfig.timeOnPageMs, tryOpen]);

  const handleDismiss = useCallback(() => {
    suppressPopupSession();
    setOpen(false);
  }, []);

  const handleCloseAfterSubmit = useCallback(() => {
    suppressPopupSession();
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <ContextualLeadPopup config={config} onClose={handleCloseAfterSubmit} onDismiss={handleDismiss} />
  );
}
