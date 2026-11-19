const POST_MARKER = "elementor-20350";
const CONTENT_MARKER = "adwrks-ru-digital-2026-11";

const RU_WEBSITE = "/%d7%91%d7%a0%d7%99%d7%99%d7%aa-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/";
const RU_SEO = "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/";

function guideSection(inner: string): string {
  return `<section class="elementor-section elementor-top-section adwrks-article-guide-section" data-adwrks-content="${CONTENT_MARKER}" data-element_type="section">
<div class="elementor-container elementor-column-gap-default">
<div class="elementor-column elementor-col-100">
<div class="elementor-widget-wrap elementor-element-populated">
${inner}
</div></div></div></section>`;
}

const ENRICHMENT = guideSection(`
<div class="elementor-element elementor-widget elementor-widget-heading"><h2 class="elementor-heading-title elementor-size-default">פרסום ברוסית ושיווק דיגיטלי למגזר הרוסי — המשך הדרך</h2></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<p>מאמר זה מתמקד ב<strong>פרסום דיגיטלי בשפה הרוסית</strong> וב<strong>שיווק למגזר הרוסי</strong> בישראל. כדי שהקמפיין יניב פניות, חשוב לחבר בין הערוצים לבין התשתית באתר — בשפה ובתרבות שהקהל מכיר.</p>
</div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">התאמה תרבותית, לא רק תרגום</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<p>מסרים ברוסית צריכים להתאים לאזור (חיפה, קריות, המרכז), לטון אמין ולערוצי הגלישה שהקהל משתמש בהם. קריאייה לפעולה, הצעות מחיר ושעות פעילות — עדיף בשפה טבעית עם עורך דובר רוסית.</p>
<ul>
<li>עמודי נחיתה דו-לשוניים או ברוסית בלבד לפי הקמפיין</li>
<li>מודעות Google / Meta עם טקסט ברוסית תואם לדף הנחיתה</li>
<li>מדידת לידים לפי שפה ב-GA4 — לא רק סה״כ קליקים</li>
</ul>
</div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">תשתית דיגיטלית: אתר וקידום ברוסית</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<p>בלי אתר או דף נחיתה מותאם, גם קמפיין מצוין מאבד המרות. שני מדריכים משלימים את המאמר הזה בלי לשכפל אותו:</p>
<ul>
<li><a href="${RU_WEBSITE}">בניית אתרים ברוסית בישראל</a> — דו-לשוניות, UX ותשתית לשיווק</li>
<li><a href="${RU_SEO}">קידום אתרים ברוסית</a> — SEO, AEO ו-GEO לחשיפה אורגנית ולכלי AI</li>
</ul>
<p>למעטפת שירותים מלאה (SEO, Ads, סושיאל, אתרים): <a href="/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/">שירותי שיווק דיגיטלי</a> של Adwrks 365.</p>
</div>
<div class="elementor-element elementor-widget elementor-widget-heading"><h3 class="elementor-heading-title elementor-size-default">שאלה נפוצה: האם כדאי לפרסם רק ברוסית?</h3></div>
<div class="elementor-element elementor-widget elementor-widget-text-editor">
<p>תלוי בקהל. עסקים שפונים בעיקר לדוברי רוסית יכולים להתמקד ברוסית בערוצים ובדפי נחיתה, עם אזכור עברית בדפים משפטיים ובשירות לקוחות. עסק דו-לשוני לרוב מרוויח מנוכחות בשתי השפות בחיפוש.</p>
</div>
`);

export function polishRussianDigitalArticleHtml(html: string): string {
  if (!html.includes(POST_MARKER) || html.includes(CONTENT_MARKER)) {
    return html;
  }

  const anchor = "כוח הקנייה הרוסי: איך לכבוש את השוק עם פרסום דיגיטלי מותאם";
  const anchorIndex = html.indexOf(anchor);
  if (anchorIndex === -1) {
    return html.replace(
      /(<div data-elementor-type="wp-post"[^>]*>)/i,
      `$1${ENRICHMENT}`,
    );
  }

  const sectionClose = html.indexOf("</section>", anchorIndex);
  if (sectionClose === -1) return html;
  const insertAt = sectionClose + "</section>".length;

  return `${html.slice(0, insertAt)}${ENRICHMENT}${html.slice(insertAt)}`;
}