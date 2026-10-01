const SESSION_SUPPRESS_KEY = "adwrks_popup_session_suppressed";
const PAGE_SHOWN_PREFIX = "adwrks_popup_shown_";

export function isPopupSessionSuppressed(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SESSION_SUPPRESS_KEY) === "1";
}

export function suppressPopupSession(): void {
  sessionStorage.setItem(SESSION_SUPPRESS_KEY, "1");
}

export function hasPopupShownOnPage(pagePath: string): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(`${PAGE_SHOWN_PREFIX}${pagePath}`) === "1";
}

export function markPopupShownOnPage(pagePath: string): void {
  sessionStorage.setItem(`${PAGE_SHOWN_PREFIX}${pagePath}`, "1");
}
