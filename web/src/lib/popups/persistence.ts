const DISMISSED_UNTIL_KEY = "adwrks_popup_dismissed_until";
const SUBMITTED_UNTIL_KEY = "adwrks_popup_submitted_until";
const AUTO_SHOWN_SESSION_KEY = "adwrks_popup_auto_shown_session";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function readUntil(key: string): number {
  if (typeof localStorage === "undefined") return 0;
  const raw = localStorage.getItem(key);
  if (!raw) return 0;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

function isUntilActive(key: string): boolean {
  const until = readUntil(key);
  return until > Date.now();
}

export function isPopupSubmittedCooldown(): boolean {
  return isUntilActive(SUBMITTED_UNTIL_KEY);
}

export function isPopupDismissCooldown(): boolean {
  return isUntilActive(DISMISSED_UNTIL_KEY);
}

export function shouldShowMinimizedCta(): boolean {
  if (isPopupSubmittedCooldown()) return false;
  return isPopupDismissCooldown();
}

export function hasAutoPopupShownThisSession(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(AUTO_SHOWN_SESSION_KEY) === "1";
}

export function markAutoPopupShownThisSession(): void {
  sessionStorage.setItem(AUTO_SHOWN_SESSION_KEY, "1");
}

export function isAutoPopupSuppressed(): boolean {
  if (isPopupSubmittedCooldown()) return true;
  if (isPopupDismissCooldown()) return true;
  if (hasAutoPopupShownThisSession()) return true;
  return false;
}

export function recordPopupDismissed(): void {
  localStorage.setItem(DISMISSED_UNTIL_KEY, String(Date.now() + THREE_DAYS_MS));
  markAutoPopupShownThisSession();
}

export function recordPopupSubmitted(): void {
  localStorage.setItem(SUBMITTED_UNTIL_KEY, String(Date.now() + THIRTY_DAYS_MS));
  localStorage.removeItem(DISMISSED_UNTIL_KEY);
  markAutoPopupShownThisSession();
}

/** Test helpers / audit introspection — not for production UI. */
export function getPopupPersistenceState(): {
  dismissedUntil: number;
  submittedUntil: number;
  autoShownThisSession: boolean;
} {
  return {
    dismissedUntil: readUntil(DISMISSED_UNTIL_KEY),
    submittedUntil: readUntil(SUBMITTED_UNTIL_KEY),
    autoShownThisSession: hasAutoPopupShownThisSession(),
  };
}
