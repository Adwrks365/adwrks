/** Content polish for post 19792 — WordPress website cost guide (HE). */

const POST_MARKER = "elementor-19792";

const OLD_HEADING = "כמה עולה לבנות אתר אינטרנט ותחזוקה? | מחירון 2026";
const NEW_HEADING = "כמה עולה לבנות אתר אינטרנט ולתחזק אותו.";

const INTRO_OLD =
  "וורדפרס היא מערכת ניהול תוכן (CMS) גמישה וחינמית, שמאפשרת לכל אחד להקים אתר. היא מפעילה למעלה מ-40% מהאתרים באינטרנט, בזכות היכולת שלה להתאים לכל מטרה – החל מאתרי תדמית פשוטים ועד חנויות וירטואליות מורכבות.";

const INTRO_NEW =
  "וורדפרס היא מערכת ניהול תוכן (CMS) גמישה וחינמית, שמתאימה גם ב-2026 לאתרי תדמית, חנויות ומגזינים. היא מפעילה למעלה מ-43% מהאתרים בעולם — מאתר ביקור ועד חנות עם סליקה ומלאי.";

const LEAD_OLD =
  "אז כמה עולה לבנות אתר אינטרנט בוורדפרס? חשוב לזכור שעל אף שהמערכת עצמה חינמית, בניית אתר מקצועי כרוכה בעלויות שונות. המחיר הסופי משתנה בהתאם למספר גורמים, ולכן חשוב להבין אותם לפני שמתחילים:";

const LEAD_NEW =
  "אז כמה עולה לבנות אתר אינטרנט בוורדפרס? המערכת עצמה חינמית, אבל אתר עסקי מקצועי דורש דומיין, אחסון, עיצוב, תוכן ולעיתים פיתוח. ב-2026 גם נגישות, אבטחה, מהירות (Core Web Vitals) ותחזוקת תוספים משפיעים על המחיר — ועל מה שמנועי חיפוש וכלי AI רואים באתר שלכם. לפני שמתחילים, כדאי להבין את הגורמים העיקריים:";

function removeTopLevelSectionsMatching(html: string, test: (section: string) => boolean): string {
  const sectionPattern =
    /<section\s[^>]*class="[^"]*elementor-top-section[^"]*"[^>]*>[\s\S]*?<\/section>/gi;
  return html.replace(sectionPattern, (section) => (test(section) ? "" : section));
}

function stripLegacyLeadFormSection(html: string): string {
  return removeTopLevelSectionsMatching(
    html,
    (section) =>
      section.includes("זקוקים לשירותי אחסון אתרים") ||
      section.includes("חייגו עכשיו או מלאו טופס יצירת קשר מהיר"),
  );
}

function markPricingGridSections(html: string): string {
  return html.replace(
    /<section([^>]*class=")([^"]*elementor-top-section[^"]*)(")([^>]*>[\s\S]*?elementor-widget-price-table[\s\S]*?<\/section>)/gi,
    '<section$1$2 article-pricing-grid-section$3$4',
  );
}

export function polishWordPressCostArticleHtml(html: string): string {
  if (!html.includes(POST_MARKER)) {
    return html;
  }

  let result = html;
  result = result.split(OLD_HEADING).join(NEW_HEADING);
  result = result.split(INTRO_OLD).join(INTRO_NEW);
  result = result.split(LEAD_OLD).join(LEAD_NEW);
  result = result.replace(
    /<div class="elementor-element[^"]*elementor-widget-heading[^"]*"[^>]*>\s*<h2 class="elementor-heading-title elementor-size-default">\s*מחירון בניית אתרים - Adwrks 365\s*<\/h2>\s*<\/div>/gi,
    "",
  );
  result = result.replace(
    /עלות בניית אתר אינטרנט ב-Adwrks 365/g,
    "מחירון בניית אתרים — טווחי מחיר 2026",
  );
  result = result.replace(
    /<p>חברת Adwrks 365 מציעה שירותי בניית אתרים בוורדפרס במחירים אטרקטיביים\. להלן הצעת המחיר של החברה:<\/p>/,
    "<p>להלן טווחי מחיר לבניית אתרי וורדפרס (מחירון Adwrks 365):</p>",
  );
  result = result.replace(
    /תוכלו להזמין שירותי בניית אתרים מחברה כמו Adwrks 365 המתמחה בבניית אתרים\./,
    "תוכלו להזמין שירותי בניית אתרים מספק מקצועי המתמחה בוורדפרס ופתרונות מותאמים.",
  );
  result = result.replace(
    /למעבר לרמה הבאה בפיתוח אתרים, Adwrks 365 מציעה גם פיתוח מותאם אישית ב-React ו-Next\.js/,
    "למעבר לרמה הבאה בפיתוח אתרים, ניתן גם לבחור פיתוח מותאם אישית ב-React ו-Next.js",
  );
  result = result.replace(
    /בניית אתר וורדפרס היא דרך מצוינת[\s\S]*?כפי שפירטנו במאמר\./,
    "בניית אתר וורדפרס היא דרך מצוינת להקים נוכחות מקוונת לעסק במחיר אטרקטיבי — מדף נחיתה ועד חנות מלאה.",
  );
  result = result.replace(
    /חברת Adwrks 365 מציעה שירותים איכותיים במחירים אטרקטיביים, תוך התחייבות לזמינות גבוהה ועמידה בלוחות זמנים, והיא מספקת פתרונות דיגיטליים מלאים לעסקים מכל הסוגים\./,
    "אפשר לשלב בנייה עם אחסון, תחזוקה, SEO ופרסום — כך שהאתר לא נשאר \"על המדף\" אלא תומך בצמיחה.",
  );
  result = result.replace(
    "elementor-element-67252df elementor-widget elementor-widget-text-editor",
    "elementor-element-67252df elementor-widget elementor-widget-text-editor article-pricing-summary-block",
  );
  result = result.replace(
    /\* המחירים המפורטים כאן מעודכן נכון למעודכן לשנת 2026\./,
    "* המחירים המפורטים כאן מעודכנים נכון לשנת 2026.",
  );
  result = result.replace(/שירותי אחסון ואחזקה/g, "שירותי אחסון ותחזוקה");
  result = result.replace(/זהו אלמנט טקסט/g, "");
  result = result.replace(
    /בעידן שבו למעלה מ-60% מהגלישה מגיעה ממובייל/,
    "בעידן שבו רוב הגלישה (למעלה מ-65%) מגיעה ממובייל",
  );
  result = result.replace(
    /PageSpeed של 95-100/,
    "ציוני PageSpeed גבוהים (לרוב 90+ במובייל)",
  );
  result = result.replace(
    /ביצועי PageSpeed 95-100/,
    "ביצועים גבוהים ו-LCP מהיר",
  );
  result = markPricingGridSections(result);
  result = stripLegacyLeadFormSection(result);

  return result;
}
