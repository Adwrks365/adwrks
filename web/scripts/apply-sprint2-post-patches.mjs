/**
 * Sprint 2 — prepend service bridge blocks to selected posts (idempotent).
 * Run: node web/scripts/apply-sprint2-post-patches.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsPath = path.join(__dirname, "..", "src", "data", "content", "posts.json");

const SHOPPING_MARKER = "adwrks-sprint2-shopping-lead";
const GBP_MARKER = "adwrks-sprint2-gbp-service-bridge";

const SHOPPING_BLOCK = `<div class="${SHOPPING_MARKER}" style="margin:0 0 1.25rem;padding:1rem 1.25rem;border-radius:8px;background:#f3f6fb;border:1px solid #dbe4f0;"><p><strong>ניהול Google Shopping לחנות אונליין</strong> — Adwrks 365 מנהלת גם קמפיינים ב-Google Shopping (פיד מוצרים, Merchant Center וקמפיינים בחיפוש וב-Performance Max). השירות נפרד ממסלול Google Ads הבסיסי (850 ₪ + מע&quot;מ), והיקף ומחיר נקבעים לפי החנות. <a href="/google-ads/">לשירות Google Ads</a> · <a href="/contact-us/">הצעת מחיר</a></p></div>`;

const GBP_BLOCK = `<div class="${GBP_MARKER}" style="margin:0 0 1.25rem;padding:1rem 1.25rem;border-radius:8px;background:#f8faf5;border:1px solid #e2ead8;"><p><strong>ליווי מקצועי ב-Google Business Profile</strong> — הקמה ואופטימיזציה של פרופיל עסקי, עדכון פרטים, קטגוריות, תוכן ותמונות, וניהול נוכחות מקומית עם מדידה ושיפור מתמשך. <a href="/מחירון-שיווק-דיגיטלי/">למחירון (Maps/GBP)</a> · <a href="/seo/">קידום מקומי ו-SEO</a> · <a href="/google-ads/">קמפיינים מקומיים ב-Google Ads</a> · <a href="/contact-us/">צור קשר</a></p></div>`;

const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
const report = {};

function prepend(postId, marker, block) {
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    report[postId] = "missing";
    return;
  }
  if (post.content.includes(marker)) {
    report[postId] = "skipped";
    return;
  }
  post.content = block + post.content;
  report[postId] = "patched";
}

prepend(17923, SHOPPING_MARKER, SHOPPING_BLOCK);
prepend(14288, GBP_MARKER, GBP_BLOCK);

fs.writeFileSync(postsPath, JSON.stringify(posts));
console.log(JSON.stringify({ ok: true, report }, null, 2));
