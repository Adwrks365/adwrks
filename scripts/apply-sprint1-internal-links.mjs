/**
 * Append Sprint 1 internal-link CTAs to Hebrew posts (GO #1–7, #9).
 * Idempotent: skips if data-sprint1 marker already present.
 */
import fs from "node:fs";
import path from "node:path";

const MARKER = "adwrks-guide-service-cta";

/** @type {Record<number, string>} */
const SNIPPETS = {
  21638: `<div class="${MARKER}" data-sprint1="21638" style="margin:28px 0;padding:20px;border-radius:12px;background:#eff6ff;border:1px solid #bfdbfe;"><p><strong>מעבר מהתיאוריה לניהול בפועל?</strong> <a href="/google-ads/">ניהול מקצועי של קמפיינים Google Ads</a> — מדידה, אופטימיזציה והצעת מחיר מותאמת לפי היקף.</p></div>`,
  17923: `<div class="${MARKER}" data-sprint1="17923" style="margin:28px 0;padding:20px;border-radius:12px;background:#eff6ff;border:1px solid #bfdbfe;"><p>לקמפיינים מורכבים יותר ב-Google Shopping: <a href="/google-ads/">ניהול Google Shopping Ads</a> כחלק ממעטפת Google Ads מקצועית.</p></div>`,
  21161: `<div class="${MARKER}" data-sprint1="21161" style="margin:28px 0;padding:20px;border-radius:12px;background:#ecfdf5;border:1px solid #a7f3d0;"><p><strong>מחפשים ליווי חודשי?</strong> <a href="/seo/">ניהול קידום אורגני חודשי</a> — תוכנית מותאמת לפי תחרות, אזור והיקף (החל מ-2,000 ₪ + מע&quot;מ לפי מחירון, לא התחייבות למיקומים).</p></div>`,
  19428: `<div class="${MARKER}" data-sprint1="19428" style="margin:28px 0;padding:20px;border-radius:12px;background:#ecfdf5;border:1px solid #a7f3d0;"><p>מחפשים חברה שתלווה אתכם בקידום? <a href="/seo/">שירות קידום אתרים (SEO)</a> של Adwrks 365 — אסטרטגיה, תוכן וטכני.</p></div>`,
  19792: `<div class="${MARKER}" data-sprint1="19792" style="margin:28px 0;padding:20px;border-radius:12px;background:#faf5ff;border:1px solid #e9d5ff;"><p>רוצים ליווי מלא ולא רק מחירון? <a href="/website-building/">בניית אתר עם ליווי מקצועי</a> — תכנון, עיצוב ו-WordPress מותאם לשיווק.</p></div>`,
  21189: `<div class="${MARKER}" data-sprint1="21189" style="margin:28px 0;padding:20px;border-radius:12px;background:#faf5ff;border:1px solid #e9d5ff;"><p>אחרי הערכה במחשבון: <a href="/website-building/">להצעת מחיר לבניית אתר</a> מותאמת לדרישות הפרויקט.</p></div>`,
  21249: `<div class="${MARKER}" data-sprint1="21249" style="margin:28px 0;padding:20px;border-radius:12px;background:#fdf2f8;border:1px solid #fbcfe8;"><p>לניהול שוטף ולא רק מדריך: <a href="/social-media-management/">ניהול קמפיינים ממומנים ב-Meta</a> (Facebook &amp; Instagram) — דמי ניהול לפי מחירון, תקציב מדיה בנפרד.</p></div>`,
  20350: `<div class="${MARKER}" data-sprint1="20350" style="margin:28px 0;padding:20px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;"><p data-sprint1="20350-lead"><strong>Adwrks 365</strong> — סוכנות בוטיק מ-2018, Google Partner. פרסום <strong>Google Ads, Meta, SEO</strong> ו<strong>בניית אתרים</strong> לקהל דובר רוסית (וגם עברית/אנגלית).</p><p><strong>שירותים:</strong></p><ul style="margin:12px 0;padding-right:1.25rem;"><li><a href="/google-ads/">פרסום ממומן בגוגל</a></li><li><a href="/social-media-management/">ניהול רשתות ו-Meta Ads</a></li><li><a href="/seo/">קידום אורגני (SEO)</a></li><li><a href="/website-building/">בניית אתרים</a></li><li><a href="/מחירון-שיווק-דיגיטלי/">מחירון שיווק דיגיטלי</a></li></ul><p>מחירי <strong>התחלה</strong> במחירון — <strong>הצעה מותאמת</strong> לפי היקף. <a href="/contact-us/">ייעוץ לפרסום ברוסית</a></p></div>`,
};

const postsPath = path.join("web/src/data/content/posts.json");
const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
const patched = [];

for (const [idStr, html] of Object.entries(SNIPPETS)) {
  const id = Number(idStr);
  const post = posts.find((p) => p.id === id);
  if (!post) throw new Error(`post ${id} missing`);
  if (post.content.includes(`data-sprint1="${id}"`)) {
    console.log("skip", id, "(already patched)");
    continue;
  }
  post.content = `${post.content}\n${html}`;
  post.modified = "2026-10-31T10:00:00";
  patched.push(id);
}

fs.writeFileSync(postsPath, JSON.stringify(posts));
console.log(JSON.stringify({ patched, skipped: Object.keys(SNIPPETS).length - patched.length }, null, 2));
