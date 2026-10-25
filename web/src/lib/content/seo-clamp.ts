/** Target ~45–60 chars for titles; avoid cutting mid-word when possible. */
export function clampSeoTitle(title: string, max = 60): string {
  const t = title.trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > 32) return `${slice.slice(0, lastSpace).trim()}…`;
  return `${slice.trim()}…`;
}

/** Target ~120–155 chars for meta descriptions. */
export function clampSeoDescription(description: string, max = 155): string {
  const t = description.trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > 100) return `${slice.slice(0, lastSpace).trim()}…`;
  return `${slice.trim()}…`;
}

export function hasHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text);
}
