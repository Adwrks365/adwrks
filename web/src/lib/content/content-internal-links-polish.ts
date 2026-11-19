/** Idempotent internal-link sentences for SEO week 2026-11-19 */

const MARKER_21161 = "adwrks-internal-link-google-seo-guide";
const MARKER_21638 = "adwrks-internal-link-google-ads-guide";

const SNIPPET_21161 = `<p data-adwrks-content="${MARKER_21161}">רוצים להבין את התהליך לפני שמתמקדים במחיר? קראו גם את המדריך <a href="/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/">קידום אתרים בגוגל</a>, או <a href="/contact-us/">בקשו ייעוץ</a> לתכנון מותאם.</p>`;

const SNIPPET_21638 = `<p data-adwrks-content="${MARKER_21638}">פרסום ממומן עובד טוב יחד עם נראות אורגנית — לעומק ב<a href="/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/">קידום אתרים בגוגל</a> וב<a href="/seo/">שירות SEO</a> שלנו.</p>`;

export function polishContentInternalLinks(html: string): string {
  let result = html;

  if (html.includes("elementor-21161") && !html.includes(MARKER_21161)) {
    const anchor = "סיכום";
    const idx = result.indexOf(anchor);
    if (idx !== -1) {
      const sectionOpen = result.lastIndexOf("<section", idx);
      if (sectionOpen !== -1) {
        result = `${result.slice(0, sectionOpen)}${SNIPPET_21161}${result.slice(sectionOpen)}`;
      }
    }
  }

  if (html.includes("elementor-21638") && !html.includes(MARKER_21638)) {
    const anchor = "קידום אורגני (SEO)";
    const idx = result.indexOf(anchor);
    if (idx !== -1) {
      const sectionClose = result.indexOf("</section>", idx);
      if (sectionClose !== -1) {
        result = `${result.slice(0, sectionClose)}${SNIPPET_21638}${result.slice(sectionClose)}`;
      }
    }
  }

  return result;
}