/** Appended to lead notes when visibility results are mock/demo — keep in sync with email detection. */
export const VISIBILITY_DEMO_MARKER_HE = "(נתוני דוגמה — לא דירוג חי)";
export const VISIBILITY_DEMO_MARKER_EN = "(Demo data — not live Google rankings)";

export function messageIncludesVisibilityDemoData(message: string | undefined): boolean {
  if (!message?.trim()) return false;
  return message.includes(VISIBILITY_DEMO_MARKER_HE) || message.includes(VISIBILITY_DEMO_MARKER_EN);
}