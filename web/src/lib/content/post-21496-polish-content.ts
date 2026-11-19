import { PAGESPEED_INSIGHTS_EMBED_SLOT } from "@/lib/pagespeed/pagespeed-insights-data";

const POST_MARKER = "elementor-21496";
const LINKS_MARKER = "adwrks-speed-links-2026-11";

const LINK_BLOCK = `<section class="elementor-section elementor-top-section adwrks-speed-cross-links" data-adwrks-content="${LINKS_MARKER}"><div class="elementor-element elementor-widget elementor-widget-text-editor">
<p><strong>מהירות היא חלק מ-SEO:</strong> LCP (זמן טעינת התוכן הראשי), INP (תגובתיות לאינטראקציה) ו-CLS (יציבות פריסה) משפיעים על דירוג ועל חוויית המשתמש. אחרי הבדיקה בכלי למעלה, אם צריך ליווי מקצועי — <a href="/website-building/">שדרוג או בניית אתר</a>, <a href="/hosting-plans/">אחסון ותחזוקה</a>, או <a href="/seo/">קידום אורגני (SEO)</a> שמשלב גם אופטימיזציה טכנית.</p>
</div></section>`;

/** Non-invasive cross-links immediately after the PageSpeed tool embed. */
export function injectPageSpeedCrossLinks(html: string): string {
  if (!html.includes(POST_MARKER) || html.includes(LINKS_MARKER)) {
    return html;
  }

  const slotIndex = html.indexOf(PAGESPEED_INSIGHTS_EMBED_SLOT);
  if (slotIndex === -1) {
    const marker = 'data-adwrks-pagespeed-insights"></div>';
    const markerIndex = html.indexOf(marker);
    if (markerIndex === -1) return html;
    const insertAt = markerIndex + marker.length;
    return `${html.slice(0, insertAt)}${LINK_BLOCK}${html.slice(insertAt)}`;
  }

  const insertAt = slotIndex + PAGESPEED_INSIGHTS_EMBED_SLOT.length;
  return `${html.slice(0, insertAt)}${LINK_BLOCK}${html.slice(insertAt)}`;
}