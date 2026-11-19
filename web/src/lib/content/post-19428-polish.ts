const POST_MARKER = "elementor-19428";
const CONTENT_MARKER = "adwrks-google-seo-guide-2026-11";

function guideSection(inner: string): string {
  return `<section class="elementor-section elementor-top-section elementor-element adwrks-article-guide-section" data-adwrks-content="${CONTENT_MARKER}" data-element_type="section">
<div class="elementor-container elementor-column-gap-default">
<div class="elementor-column elementor-col-100">
<div class="elementor-widget-wrap elementor-element-populated">
${inner}
</div></div></div></section>`;
}

const ENRICHMENT = guideSection(`
<div class="elementor-element elementor-widget elementor-widget-heading"><h2 class="elementor-heading-title elementor-size-default">מדריך מקיף: קידום אתרים בגוגל ב-2026</h2></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<p><strong>קידום אתרים בגוגל</strong> (SEO) הוא תהליך שוטף שמטרתו להביא תנועה איכותית מתוצאות החיפוש האורגניות — לא רק «להיות בגוגל», אלא להופיע כשהלקוח מוכן לפעולה. המדריך הבא משלים את היסודות שבמאמר ומסביר איך עובדים נכון עם סוכנות, כלי מדידה ותכנון תקציב.</p>
</div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">1. מחקר מילות מפתח וכוונת חיפוש</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<p>מתחילים ממה שאנשים באמת מקלידים: שירות + עיר, שאלות («כמה עולה…»), השוואות ומונחים מקצועיים. מפרידים בין מילות מפתח עם כוונה מסחרית (לידים) לבין מידע (מודעות). בוחנים נפח חיפוש, תחרות ודירוג נוכחי ב-Search Console.</p>
<ul>
<li>מיפוי עמודי שירות מול כוונות חיפוש</li>
<li>תוכן מדריך למילות מפתח ארוכות (long-tail)</li>
<li>עדכון שוטף לפי שאילתות אמיתיות מהאתר</li>
</ul>
</div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">2. SEO טכני: תשתית שגוגל יכול לסרוק</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<p>בלי בסיס טכני תקין, תוכן מעולה לא מנצח. וודאו אינדוקס נכון (sitemap, canonical), מהירות (Core Web Vitals), מובייל, HTTPS, מבנה כותרות H1–H3 ונתונים מובנים (Schema) בעמודים חשובים.</p>
<p>לשיפור מהירות: <a href="/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/">בדיקת מהירות אתר חינם</a> ו-<a href="/hosting-plans/">אחסון ותחזוקה מנוהלים</a> כשהאתר איטי מסיבות שרת או תוספים.</p>
</div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">3. תוכן, E-E-A-T וקישורים פנימיים</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<p>תוכן שמדרג טוב עונה על שאלה אמיתית, מציג ניסיון (מחירים שקופים, תהליך, צוות) ומקושר בצורה הגיונית לעמודים נוספים באתר. <strong>קישורים פנימיים</strong> מחלקים סמכות בין מאמרים לעמודי שירות — למשל מכאן ל-<a href="/seo/">שירות קידום אתרים (SEO)</a> של Adwrks 365, ול<a href="/%d7%9e%d7%97%d7%99%d7%a8-%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d/">מחירון קידום אתרים</a> כשצריך לתכנן תקציב.</p>
<p>שילוב עם <a href="/google-ads/">Google Ads</a> נכון כשצריך לידים מהר ובמקביל לבנות נכס אורגני.</p>
</div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">4. מדידה: מה בודקים כל חודש</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<ul>
<li>דירוגים וחשיפות לשאילתות מרכזיות ב-Search Console</li>
<li>תנועה אורגנית, המרות ועלות לליד ב-GA4</li>
<li>דפים עם ירידה ב-CTR — שיפור כותרת ותיאור</li>
<li>בדיקת קישורים שבורים ושגיאות סריקה</li>
</ul>
</div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">שאלות נפוצות על קידום אתרים בגוגל</h3></div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">כמה זמן לוקח לראות תוצאות SEO?</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor"><p>לרוב חודשים 3–6 לסימנים משמעותיים; תלוי בתחרות, גיל הדומיין ואיכות האתר. SEO הוא השקעה לטווח ארוך לצד ערוצים מהירים יותר.</p></div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">מתי כדאי סוכנות קידום אתרים?</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor"><p>כשאין זמן פנימי לתוכן, טכני ודוחות, או כשהתחרות דורשת אסטרטגיה מרובת ערוצים. סוכנות טובה שקופה בדוחות — לא מבטיחה מקום ראשון.</p></div>
`);

export function polishGoogleSeoArticleHtml(html: string): string {
  if (!html.includes(POST_MARKER) || html.includes(CONTENT_MARKER)) {
    return html;
  }

  const anchor = "עבודה עם סוכנות פרסום לעסקים Adwrks 365";
  const anchorIndex = html.indexOf(anchor);
  if (anchorIndex === -1) {
    const close = html.lastIndexOf("</section>");
    if (close === -1) return html + ENRICHMENT;
    return `${html.slice(0, close)}${ENRICHMENT}${html.slice(close)}`;
  }

  const sectionOpen = html.lastIndexOf("<section", anchorIndex);
  if (sectionOpen === -1) return html.replace(anchor, `${ENRICHMENT}${anchor}`);

  return `${html.slice(0, sectionOpen)}${ENRICHMENT}${html.slice(sectionOpen)}`;
}