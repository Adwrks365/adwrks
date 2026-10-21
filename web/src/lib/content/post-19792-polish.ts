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

export function polishWordPressCostArticleHtml(html: string): string {
  if (!html.includes(POST_MARKER)) {
    return html;
  }

  let result = html;
  result = result.split(OLD_HEADING).join(NEW_HEADING);
  result = result.split(INTRO_OLD).join(INTRO_NEW);
  result = result.split(LEAD_OLD).join(LEAD_NEW);
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
  result = stripLegacyLeadFormSection(result);

  return result;
}
