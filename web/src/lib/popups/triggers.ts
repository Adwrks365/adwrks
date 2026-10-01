import type { PopupAudience } from "@/lib/popups/types";

/** Documented trigger thresholds for Phase 5D. */
export const POPUP_TRIGGERS = {
  service: {
    scrollDepth: 0.5,
    timeOnPageMs: 40_000,
  },
  article: {
    scrollDepth: 0.6,
    timeOnPageMs: 55_000,
  },
} as const;

export function getTriggerConfig(audience: PopupAudience) {
  return POPUP_TRIGGERS[audience];
}

export function getScrollDepth(): number {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop;
  const viewport = window.innerHeight;
  const total = Math.max(doc.scrollHeight - viewport, 1);
  return scrollTop / total;
}

export function isUserInteractingWithForm(): boolean {
  const active = document.activeElement;
  if (!active) return false;
  return Boolean(
    active.closest(
      ".contact-form, .article-sidebar-contact-form, .contextual-popup-form, [role='dialog']",
    ),
  );
}

export function isAnotherModalOpen(): boolean {
  return Boolean(document.querySelector(".a11y-panel"));
}
