"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MinimizedLeadCta } from "@/components/popups/MinimizedLeadCta";
import type { PopupOpenMethod } from "@/lib/analytics/popup-events";
import { trackPopupEvent } from "@/lib/analytics/popup-events";
import {
  isAutoPopupSuppressed,
  markAutoPopupShownThisSession,
  recordPopupDismissed,
  recordPopupSubmitted,
  shouldShowMinimizedCta,
} from "@/lib/popups/persistence";
import { hasPopupShownOnPage, markPopupShownOnPage } from "@/lib/popups/session";
import {
  getScrollDepth,
  getTriggerConfig,
  isAnotherModalOpen,
  isUserInteractingWithForm,
} from "@/lib/popups/triggers";
import type { PopupConfig } from "@/lib/popups/types";

const ContextualLeadPopup = dynamic(
  () => import("@/components/popups/ContextualLeadPopup").then((m) => m.ContextualLeadPopup),
  { ssr: false },
);

type ContextualPopupContextValue = {
  registerConfig: (config: PopupConfig | null) => void;
  openContextualPopup: (method: PopupOpenMethod) => void;
};

const ContextualPopupContext = createContext<ContextualPopupContextValue | null>(null);

export function useContextualPopupRegistrar() {
  const ctx = useContext(ContextualPopupContext);
  if (!ctx) {
    throw new Error("ContextualPopupRegistrar must be used within ContextualPopupProvider");
  }
  return ctx;
}

export function useContextualPopup() {
  const ctx = useContext(ContextualPopupContext);
  if (!ctx) {
    throw new Error("useContextualPopup must be used within ContextualPopupProvider");
  }
  return ctx;
}

export function ContextualPopupProvider({ children }: { children: ReactNode }) {
  const [activeConfig, setActiveConfig] = useState<PopupConfig | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [openMethod, setOpenMethod] = useState<PopupOpenMethod>("automatic");
  const [minimizedVisible, setMinimizedVisible] = useState(() =>
    typeof window !== "undefined" ? shouldShowMinimizedCta() : false,
  );
  const [minimizedDismissedPath, setMinimizedDismissedPath] = useState<string | null>(null);
  const autoTriggeredRef = useRef(false);
  const ctaViewTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === "adwrks_popup_dismissed_until" ||
        event.key === "adwrks_popup_submitted_until"
      ) {
        setMinimizedVisible(shouldShowMinimizedCta());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const registerConfig = useCallback((config: PopupConfig | null) => {
    setActiveConfig(config);
    autoTriggeredRef.current = false;
  }, []);

  const openPopup = useCallback(
    (method: PopupOpenMethod) => {
      if (!activeConfig) return;
      if (isAnotherModalOpen()) return;
      if (isUserInteractingWithForm()) return;
      setOpenMethod(method);
      setPopupOpen(true);
    },
    [activeConfig],
  );

  const tryAutoOpen = useCallback(() => {
    if (!activeConfig) return;
    if (autoTriggeredRef.current) return;
    if (isAutoPopupSuppressed()) return;
    if (hasPopupShownOnPage(activeConfig.pagePath)) return;
    if (isAnotherModalOpen()) return;
    if (isUserInteractingWithForm()) return;

    autoTriggeredRef.current = true;
    markPopupShownOnPage(activeConfig.pagePath);
    markAutoPopupShownThisSession();
    openPopup("automatic");
  }, [activeConfig, openPopup]);

  useEffect(() => {
    if (!activeConfig) return;
    if (isAutoPopupSuppressed() || hasPopupShownOnPage(activeConfig.pagePath)) {
      autoTriggeredRef.current = true;
      return;
    }

    const triggerConfig = getTriggerConfig(activeConfig.audience);
    const onScroll = () => {
      if (getScrollDepth() >= triggerConfig.scrollDepth) {
        tryAutoOpen();
      }
    };

    const timer = window.setTimeout(() => {
      tryAutoOpen();
    }, triggerConfig.timeOnPageMs);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeConfig, tryAutoOpen]);

  const handleDismiss = useCallback(() => {
    recordPopupDismissed();
    setPopupOpen(false);
    setMinimizedVisible(true);
  }, []);

  const handleSubmitClose = useCallback(() => {
    recordPopupSubmitted();
    setPopupOpen(false);
    setMinimizedVisible(false);
  }, []);

  const handleMinimizedClick = useCallback(() => {
    if (!activeConfig) return;
    trackPopupEvent("popup_minimized_cta_click", {
      popup_id: activeConfig.popupId,
      popup_context: activeConfig.popupContext,
      page_path: activeConfig.pagePath,
    });
    openPopup("minimized_cta");
  }, [activeConfig, openPopup]);

  const handleMinimizedDismiss = useCallback(() => {
    if (activeConfig) {
      setMinimizedDismissedPath(activeConfig.pagePath);
    }
  }, [activeConfig]);

  const showCta = Boolean(
    activeConfig &&
      minimizedVisible &&
      minimizedDismissedPath !== activeConfig.pagePath &&
      !popupOpen,
  );

  useEffect(() => {
    if (!showCta || !activeConfig) return;
    const viewKey = `${activeConfig.pagePath}:${activeConfig.popupContext}`;
    if (ctaViewTrackedRef.current === viewKey) return;
    ctaViewTrackedRef.current = viewKey;
    trackPopupEvent("popup_minimized_cta_view", {
      popup_id: activeConfig.popupId,
      popup_context: activeConfig.popupContext,
      page_path: activeConfig.pagePath,
    });
  }, [showCta, activeConfig]);

  useEffect(() => {
    if (!activeConfig) {
      ctaViewTrackedRef.current = null;
    }
  }, [activeConfig]);

  return (
    <ContextualPopupContext.Provider
      value={{ registerConfig, openContextualPopup: openPopup }}
    >
      {children}
      {showCta && (
        <MinimizedLeadCta onClick={handleMinimizedClick} onDismiss={handleMinimizedDismiss} />
      )}
      {popupOpen && activeConfig && (
        <ContextualLeadPopup
          config={activeConfig}
          openMethod={openMethod}
          onClose={handleSubmitClose}
          onDismiss={handleDismiss}
        />
      )}
    </ContextualPopupContext.Provider>
  );
}
