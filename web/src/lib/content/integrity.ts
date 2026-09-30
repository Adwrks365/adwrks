/** Detect when REST HTML content does not match the page it belongs to. */

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function elementorMeta(content: string): { type: string | null; id: string | null } {
  const type = content.match(/data-elementor-post-type="([^"]+)"/)?.[1] ?? null;
  const id = content.match(/data-elementor-id="(\d+)"/)?.[1] ?? null;
  return { type, id };
}

export function hasContentMismatch(slug: string, content: string, excerpt: string): boolean {
  const meta = elementorMeta(content);
  if (meta.type === "post") return true;

  const contentText = stripHtml(content).slice(0, 400);
  const ex = stripHtml(excerpt);

  if (slug === "about-us" && contentText.includes("קידום אורגני")) return true;
  if (slug === "about-us" && contentText.includes("מה זה בכלל")) return true;
  if (ex.includes("סוכנות בוטיק") && contentText.includes("מחשבון תקציב")) return true;

  if (ex.length > 80 && slug === "about-us") {
    const excerptWords = ex.split(/\s+/).slice(0, 6).join(" ");
    if (excerptWords.length > 10 && !contentText.includes(excerptWords.slice(0, 15))) {
      if (contentText.includes("SEO") || contentText.includes("PPC")) return true;
    }
  }

  return false;
}

export function hasVisibleShortcodes(content: string): boolean {
  return /\[[a-zA-Z][\w\-]*[^\]]*\]/.test(stripHtml(content));
}
