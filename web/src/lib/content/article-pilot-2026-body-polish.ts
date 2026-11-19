import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";

export const PILOT_2026_BODY_MARKER = "adwrks-pilot-2026-body";

type Patch = { paths: string[]; postMarker: string; paragraphs: string[] };

const PATCHES: Patch[] = [
  {
    paths: ["/אסטרטגיות-שיווק-דיגיטלי-2025/"],
    postMarker: "elementor-21776",
    paragraphs: [
      "<strong>עדכון הקשר (2026):</strong> מגמות מ-2025 עדיין רלוונטיות, אבל בפועל רואים יותר דגש על מדידה ב-GA4 בלבד, שילוב כלים מבוססי AI בתכנון תוכן ופרסום, ויצירת נכסים (דפים, סרטונים, טפסים) שמתאימים גם לתשובות AI בחיפוש — בלי להחליף אסטרטגיה מסודרת.",
      "לפני תכנון תקציב: הגדירו יעד אחד מדיד (לידים, מכירות, מודעות), מפו ערוצים לפי כוונת קהל, וודאו שאתר, מעקב והסכמות פרטיות תקינים. כך קל יותר להשוות בין ערוצים ולא לסמוך רק על מגמה אחת.",
    ],
  },
  {
    paths: ["/עתיד-ה-seo-כך-ייראה-הקידום-האורגני-ב-2025-ומעב/"],
    postMarker: "elementor-21817",
    paragraphs: [
      "<strong>עדכון הקשר (2026):</strong> תחזיות ה-SEO מ-2025 מתממשות בחשיפות AI (כולל AI Overviews), בדגש חזק יותר על אמינות (E-E-A-T), מהירות וסריקה טכנית תקינה. מילות מפתח עדיין חשובות, אבל פחות כ«קיצור דרך» ויותר כמיפוי כוונת חיפוש.",
      "במקום לרדוף אחרי כל עדכון אלגוריתם — לבנות עמודים שעונים על שאלה אמיתית, לעדכן תאריכים ומחירים כשצריך, ולקשר בין מאמרים לעמודי שירות. למדריך מעשי על AI בחיפוש: <a href=\"/seo-2026-ai-answers/\">SEO 2026 וסקירות AI</a>.",
    ],
  },
  {
    paths: ["/שיווק-בפייסבוק-ואינסטגרם/"],
    postMarker: "elementor-21578",
    paragraphs: [
      "<strong>עדכון הקשר (2026):</strong> Meta ממשיכה לשפר אוטומציה בפרסום (למשל קמפיינים מבוססי Advantage+) ומדידה מול המרות באתר. היקף הגעה אורגני בדפים עדיין מוגבל ברוב התחומים — לכן משלבים תוכן אותנטי, מדידה ב-Events/Conversions API כשאפשר, ובדיקת קריאייטיב לפני הגדלת תקציב.",
      "לפני קמפיין: ודאו זהות עסק בעמוד, קישור לאתר/טופס ברור, ומדדי הצלחה (עלות לליד, ROAS) — בלי להבטיח תוצאה ממוצעת.",
    ],
  },
];

function buildContextBlock(paragraphs: string[]): string {
  const body = paragraphs.map((p) => `<p class="adwrks-pilot-2026-body__text">${p}</p>`).join("");
  return `<div class="adwrks-pilot-2026-body" data-adwrks-content="${PILOT_2026_BODY_MARKER}">
<p class="adwrks-pilot-2026-body__title">מה חשוב ב-2026?</p>
${body}
</div>`;
}

export function applyPilot2026BodyPolish(html: string, path: string, locale: Locale): string {
  if (locale !== "he" || html.includes(PILOT_2026_BODY_MARKER)) return html;
  const key = normalizePath(path);
  const patch = PATCHES.find((p) => p.paths.some((x) => normalizePath(x) === key));
  if (!patch || !html.includes(patch.postMarker)) return html;

  const block = buildContextBlock(patch.paragraphs);
  const leadEnd = html.indexOf("</aside>");
  if (leadEnd !== -1) {
    const insertAt = leadEnd + "</aside>".length;
    return `${html.slice(0, insertAt)}${block}${html.slice(insertAt)}`;
  }

  const needle = '<div class="elementor-widget-wrap elementor-element-populated">';
  const idx = html.indexOf(needle);
  if (idx === -1) return html;
  const insertAt = idx + needle.length;
  return `${html.slice(0, insertAt)}${block}${html.slice(insertAt)}`;
}