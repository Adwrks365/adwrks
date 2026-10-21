#!/usr/bin/env node
/**
 * One-shot: title, date, SEO, and in-JSON body strings for post 19792 (HE).
 * Run: node web/scripts/update-post-19792-wordpress-cost.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function polishWordPressCostArticleHtml(html) {
  if (!html.includes("elementor-19792")) return html;
  const OLD_HEADING = "כמה עולה לבנות אתר אינטרנט ותחזוקה? | מחירון 2026";
  const NEW_HEADING = "כמה עולה לבנות אתר אינטרנט ולתחזק אותו.";
  let result = html.split(OLD_HEADING).join(NEW_HEADING);
  result = result.split(
    "וורדפרס היא מערכת ניהול תוכן (CMS) גמישה וחינמית, שמאפשרת לכל אחד להקים אתר. היא מפעילה למעלה מ-40% מהאתרים באינטרנט, בזכות היכולת שלה להתאים לכל מטרה – החל מאתרי תדמית פשוטים ועד חנויות וירטואליות מורכבות.",
  ).join(
    "וורדפרס היא מערכת ניהול תוכן (CMS) גמישה וחינמית, שמתאימה גם ב-2026 לאתרי תדמית, חנויות ומגזינים. היא מפעילה למעלה מ-43% מהאתרים בעולם — מאתר ביקור ועד חנות עם סליקה ומלאי.",
  );
  result = result.split(
    "אז כמה עולה לבנות אתר אינטרנט בוורדפרס? חשוב לזכור שעל אף שהמערכת עצמה חינמית, בניית אתר מקצועי כרוכה בעלויות שונות. המחיר הסופי משתנה בהתאם למספר גורמים, ולכן חשוב להבין אותם לפני שמתחילים:",
  ).join(
    "אז כמה עולה לבנות אתר אינטרנט בוורדפרס? המערכת עצמה חינמית, אבל אתר עסקי מקצועי דורש דומיין, אחסון, עיצוב, תוכן ולעיתים פיתוח. ב-2026 גם נגישות, אבטחה, מהירות (Core Web Vitals) ותחזוקת תוספים משפיעים על המחיר — ועל מה שמנועי חיפוש וכלי AI רואים באתר שלכם. לפני שמתחילים, כדאי להבין את הגורמים העיקריים:",
  );
  result = result.replace(
    /\* המחירים המפורטים כאן מעודכן נכון למעודכן לשנת 2026\./,
    "* המחירים המפורטים כאן מעודכנים נכון לשנת 2026.",
  );
  result = result.replace(/שירותי אחסון ואחזקה/g, "שירותי אחסון ותחזוקה");
  result = result.replace(/זהו אלמנט טקסט/g, "");
  return result;
}

const WEB = path.join(__dirname, "..");
const POST_ID = 19792;
const POST_TITLE = "כמה עולה לבנות אתר אינטרנט ולתחזק אותו | מחירון 2026";
const MODIFIED = "2026-10-21T09:00:00";
const POST_URL =
  "https://adwrks.co.il/%d7%9b%d7%9e%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%9c%d7%91%d7%a0%d7%95%d7%aa-%d7%90%d7%aa%d7%a8-%d7%90%d7%99%d7%a0%d7%98%d7%a8%d7%a0%d7%98-%d7%91%d7%95%d7%95%d7%a8%d7%93%d7%a4%d7%a8%d7%a1/";

const META =
  "מדריך מעודכן ל-2026: כמה עולה לבנות אתר וורדפרס בישראל, מה כוללת תחזוקה, וטווחי מחיר לפי סוג אתר — כולל מחירון Adwrks 365.";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(WEB, rel), "utf8"));
}

function writeJson(rel, data) {
  fs.writeFileSync(path.join(WEB, rel), JSON.stringify(data));
}

function replaceInObject(obj, from, to) {
  if (typeof obj === "string") {
    return obj.split(from).join(to);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceInObject(item, from, to));
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = replaceInObject(v, from, to);
    }
    return out;
  }
  return obj;
}

const postsPath = "src/data/content/posts.json";
const posts = readJson(postsPath);
const idx = posts.findIndex((p) => p.id === POST_ID);
if (idx === -1) {
  console.error("Post not found");
  process.exit(1);
}

posts[idx].title = POST_TITLE;
posts[idx].modified = MODIFIED;
posts[idx].content = polishWordPressCostArticleHtml(posts[idx].content);
writeJson(postsPath, posts);

const seoPath = "src/data/content/seo.json";
const seo = readJson(seoPath);
const seoIdx = seo.findIndex((r) => r.url === POST_URL);
if (seoIdx === -1) {
  console.error("SEO record not found");
  process.exit(1);
}

const oldTitle = "כמה עולה לבנות אתר אינטרנט ותחזוקה? | מחירון 2026";
const rec = seo[seoIdx];
rec.title = POST_TITLE;
rec.metaDescription = META;
rec.ogTitle = POST_TITLE;
rec.ogDescription = META;
rec.jsonLd = replaceInObject(rec.jsonLd, oldTitle, POST_TITLE);
rec.jsonLd = replaceInObject(
  rec.jsonLd,
  "2026-08-30T11:34:22+03:00",
  "2026-10-21T09:00:00+03:00",
);
writeJson(seoPath, seo);

console.log("Updated post", POST_ID, "and SEO for WordPress cost article.");
