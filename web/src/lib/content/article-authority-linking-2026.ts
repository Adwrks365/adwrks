import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";

const MARKER = "adwrks-authority-link-2026";

type LinkLine = { href: string; label: string };

type LinkPatch = {
  /** Root elementor post id in migrated HTML */
  postMarker: string;
  intro: string;
  links: LinkLine[];
};

const PATCHES: Record<string, LinkPatch> = {
  "/קידום-אתרים-מדריך-למתחילים/": {
    postMarker: "elementor-21115",
    intro: "לפני יישום — כדאי לדעת גם על ערוץ ממומן:",
    links: [
      { href: "/google-ads/", label: "פרסום בגוגל לעסקים" },
      { href: "/שירותי-שיווק-דיגיטלי/", label: "שירותי שיווק דיגיטלי" },
    ],
  },
  "/קידום-אתרים-בגוגל/": {
    postMarker: "elementor-19428",
    intro: "מעבר לגוגל כמנוע — תכנון שיווק רחב יותר:",
    links: [{ href: "/שירותי-שיווק-דיגיטלי/", label: "שירותי שיווק דיגיטלי" }],
  },
  "/צמיחה-עסקית-באמצעות-קידום-באינטרנט/": {
    postMarker: "elementor-19100",
    intro: "צמיחה ברוב המקרים משלבת ערוצים:",
    links: [
      { href: "/שירותי-שיווק-דיגיטלי/", label: "מעטפת שיווק דיגיטלי" },
      { href: "/google-ads/", label: "Google Ads" },
    ],
  },
  "/קידום-ממומן-מול-קידום-אורגני/": {
    postMarker: "elementor-21860",
    intro: "אחרי שבוחרים מודל — תמחור ותכנון:",
    links: [
      { href: "/מחיר-קידום-אתרים/", label: "מחיר קידום אתרים" },
      { href: "/שירותי-שיווק-דיגיטלי/", label: "מפת שירותים" },
    ],
  },
  "/כמה-עולה-פרסום-בגוגל/": {
    postMarker: "elementor-21638",
    intro: "לצד תקציב קמפיין — תכנון שיווק רחב:",
    links: [
      { href: "/מחירון-שיווק-דיגיטלי/", label: "מחירון שיווק דיגיטלי" },
      { href: "/שירותי-שיווק-דיגיטלי/", label: "מפת שירותים" },
    ],
  },
  "/פרסום-בגוגל-7-אסטרטגיות/": {
    postMarker: "elementor-20897",
    intro: "ליישום אסטרטגיה בפועל:",
    links: [
      { href: "/google-ads/", label: "שירות Google Ads" },
      { href: "/כמה-עולה-פרסום-בגוגל/", label: "מדריך עלויות" },
    ],
  },
  "/פרסום-בגוגל-אדס-10-שלבים-פשוטים/": {
    postMarker: "elementor-20919",
    intro: "אחרי ההקמה הבסיסית — המשך מקצועי:",
    links: [
      { href: "/שירותי-שיווק-דיגיטלי/", label: "שירותי שיווק דיגיטלי" },
      { href: "/כמה-עולה-פרסום-בגוגל/", label: "מדריך עלויות" },
    ],
  },
  "/פלטפורמה-בניית-אתר/": {
    postMarker: "elementor-21317",
    intro: "לאחר בחירת פלטפורמה — ערוץ אורגני:",
    links: [
      { href: "/seo/", label: "קידום אתרים" },
      { href: "/בדיקת-מהירות-אתר/", label: "בדיקת מהירות" },
    ],
  },
  "/כמה-עולה-לבנות-אתר-מחירון-מחשבון/": {
    postMarker: "elementor-21189",
    intro: "להשוואת מחשבון מול הצעת מחיר:",
    links: [
      { href: "/website-building/", label: "בניית אתרים" },
      { href: "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/", label: "מחירון וורדפרס" },
    ],
  },
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/": {
    postMarker: "elementor-19792",
    intro: "כשמסיימים את המחירון — הצעד הבא:",
    links: [
      { href: "/website-building/", label: "ייעוץ לבניית אתר מקצועית" },
      { href: "/בדיקת-מהירות-אתר/", label: "בדיקת מהירות לפני השקה" },
    ],
  },
  "/יועץ-שיווק-באינטרנט/": {
    postMarker: "elementor-20081",
    intro: "ייעוץ כחלק ממעטפת סוכנות:",
    links: [
      { href: "/שירותי-שיווק-דיגיטלי/", label: "שירותי שיווק דיגיטלי" },
      { href: "/about-us/", label: "אודות Adwrks 365" },
    ],
  },
  "/חברה-לשיווק-דיגיטלי/": {
    postMarker: "elementor-20803",
    intro: "להשוואת מבנה שירות בפועל:",
    links: [
      { href: "/שירותי-שיווק-דיגיטלי/", label: "מפת שירותים" },
      { href: "/about-us/", label: "מי אנחנו" },
    ],
  },
  "/אסטרטגיות-שיווק-דיגיטלי-2025/": {
    postMarker: "elementor-21776",
    intro: "מתרגמים אסטרטגיה לביצוע:",
    links: [
      { href: "/מחיר-קידום-אתרים/", label: "מחיר קידום אתרים" },
      { href: "/בדיקת-מהירות-אתר/", label: "בדיקת מהירות אתר" },
    ],
  },
  "/שיפור-מהירות-אתר-2026-pagespeed/": {
    postMarker: "elementor-22310",
    intro: "מדידה לפני שינוי:",
    links: [
      { href: "/בדיקת-מהירות-אתר/", label: "בדיקת מהירות אתר" },
      { href: "/website-building/", label: "בניית אתרים" },
    ],
  },
  "/יועץ-דיגיטל-הוא-השותף-שלך-להצלחה/": {
    postMarker: "elementor-20092",
    intro: "ליווי שוטף בסוכנות:",
    links: [
      { href: "/about-us/", label: "מי אנחנו" },
      { href: "/שירותי-שיווק-דיגיטלי/", label: "שירותים" },
    ],
  },
  "/משרד-פרסום-דיגיטלי/": {
    postMarker: "elementor-10369",
    intro: "בחירת ספק מול הגדרות מקצועיות:",
    links: [
      { href: "/about-us/", label: "אודות הסוכנות" },
      { href: "/שירותי-שיווק-דיגיטלי/", label: "מפת שירותים" },
    ],
  },
  "/פרסום-עסק-חינם/": {
    postMarker: "elementor-20969",
    intro: "כשעוברים מפרסום חינמי לממומן ממוקד:",
    links: [
      { href: "/google-ads/", label: "פרסום בגוגל" },
      { href: "/seo/", label: "קידום אורגני" },
    ],
  },
  "/שיווק-מקצועי-לקהל-דובר-רוסית/": {
    postMarker: "elementor-20388",
    intro: "שיווק לקהל דובר רוסית משלב לוקליזציה ו-SEO:",
    links: [
      { href: "/קידום-אתרים-ברוסית/", label: "קידום אתרים ברוסית" },
      { href: "/seo/", label: "שירותי SEO" },
    ],
  },
  "/סוכנות-שיווק-דיגיטלי/": {
    postMarker: "elementor-20403",
    intro: "בחירת סוכנות — תחילה מבינים את מפת השירות:",
    links: [
      { href: "/שירותי-שיווק-דיגיטלי/", label: "שירותי שיווק דיגיטלי" },
      { href: "/about-us/", label: "אודות Adwrks" },
    ],
  },
  "/מהו-שיווק-באינטרנט/": {
    postMarker: "elementor-21051",
    intro: "מהתיאוריה לשירותים מעשיים:",
    links: [
      { href: "/שירותי-שיווק-דיגיטלי/", label: "שירותי שיווק דיגיטלי" },
      { href: "/seo/", label: "קידום אתרים" },
    ],
  },
  "/רימרקטינג-מה-זה-איך-ולמה/": {
    postMarker: "elementor-21272",
    intro: "רימרקטינג לרוב יושב לצד קמפיינים ממומנים:",
    links: [{ href: "/google-ads/", label: "ניהול Google Ads" }],
  },
  "/קידום-אתרים-ברוסית/": {
    postMarker: "elementor-22841",
    intro: "SEO רב-לשוני דורש גם תשתית עברית:",
    links: [
      { href: "/seo/", label: "קידום אתרים בעברית" },
      { href: "/מחיר-קידום-אתרים/", label: "מחיר קידום אתרים" },
    ],
  },
};

function articleLeadHtml(html: string): string {
  const close = html.indexOf("</aside>");
  return close === -1 ? html.slice(0, 6000) : html.slice(0, close);
}

function hasHrefInLead(html: string, href: string): boolean {
  const lead = articleLeadHtml(html);
  return lead.includes(`href="${href}"`) || lead.includes(`href='${href}'`);
}

function buildSentence(patch: LinkPatch, html: string): string | null {
  const lines = patch.links.filter((l) => !hasHrefInLead(html, l.href));
  if (lines.length === 0) return null;
  const anchors = lines.map((l) => `<a href="${l.href}">${l.label}</a>`).join(" · ");
  return `${patch.intro} ${anchors}.`;
}

/** One contextual service link paragraph per article — idempotent. */
export function applyArticleAuthorityLinking2026(html: string, pagePath: string, locale: Locale): string {
  if (locale !== "he") return html;
  const key = normalizePath(pagePath);
  const patch = PATCHES[key];
  if (!patch) return html;
  if (!html.includes(patch.postMarker)) return html;
  if (html.includes(MARKER) && html.includes(`data-adwrks-authority="${key}"`)) return html;

  const sentence = buildSentence(patch, html);
  if (!sentence) return html;

  const block = `<p class="adwrks-authority-service-link" data-adwrks-content="${MARKER}" data-adwrks-authority="${key}">${sentence}</p>`;
  const leadClose = html.indexOf("</aside>");
  if (leadClose !== -1) {
    return `${html.slice(0, leadClose)}<p class="adwrks-article-lead__text" data-adwrks-content="${MARKER}">${sentence}</p>${html.slice(leadClose)}`;
  }
  const wrap = '<div class="elementor-widget-wrap elementor-element-populated">';
  const at = html.indexOf(wrap);
  if (at === -1) return html;
  const insertAt = at + wrap.length;
  return `${html.slice(0, insertAt)}${block}${html.slice(insertAt)}`;
}

export const AUTHORITY_LINKING_PATHS = Object.keys(PATCHES);