const POST_MARKER = "elementor-21496";
const LINKS_MARKER = "adwrks-speed-links-2026-11";

const LINK_BLOCK = `<div class="elementor-element elementor-widget elementor-widget-text-editor" data-adwrks-content="${LINKS_MARKER}">
<p><strong>מהירות היא חלק מ-SEO:</strong> LCP (זמן טעינת התוכן הראשי), INP (תגובתיות לאינטראקציה) ו-CLS (יציבות פריסה) משפיעים על דירוג ועל חוויית המשתמש. אחרי הבדיקה בכלי למעלה, אם צריך ליווי מקצועי — <a href="/website-building/">שדרוג או בניית אתר</a>, <a href="/hosting-plans/">אחסון ותחזוקה</a>, או <a href="/seo/">קידום אורגני (SEO)</a> שמשלב גם אופטימיזציה טכנית.</p>
</div>`;

/** Non-invasive cross-links and CTA after PSI explainer when missing. */
export function injectPageSpeedCrossLinks(html: string): string {
  if (!html.includes(POST_MARKER) || html.includes(LINKS_MARKER)) {
    return html;
  }

  const anchor = "איך לפרש את דוח PSI";
  const idx = html.indexOf(anchor);
  if (idx === -1) return html;

  const sectionClose = html.indexOf("</section>", idx);
  if (sectionClose === -1) return html;

  return `${html.slice(0, sectionClose)}${LINK_BLOCK}${html.slice(sectionClose)}`;
}