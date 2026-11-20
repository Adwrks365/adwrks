# PR #11 — QA לאחר סנכרון עם `main` (PR #12)

**תאריך:** 2026-11-20  
**ענף:** `feat/blog-content-rollout-2026`  
**PR:** https://github.com/Adwrks365/adwrks/pull/11  
**לא בוצע merge / פריסה לפרודקשן · לא התחיל Batch8.**

## 1. סנכרון עם `main`

- בוצע `git merge origin/main` (כולל PR #12 — location hero / `sp-hero--location`).
- קומיט מיזוג: `9073617` — *Merge main (PR #12) into blog rollout branch*.

## 2. פער 108 מול 110 — הסבר

| מקור | HE | EN | סה״כ |
|------|---:|---:|-----:|
| `posts.json` (גולמי) | 56 | 54 | **110** |
| `getAllPosts()` (מיפוי rollout / בלוג) | 55 | 53 | **108** |

**שני הפוסטים שלא נספרים במיפוי** אינם «נעלמו» מהאתר — אלו דפי אזור כרמיאל שמאוחסנים כ־post אך מוחרגים מרשימות הבלוג:

- `/סוכנות-פרסום-שיווק-בכרמיאל/`
- `/en/digital-marketing-agency-carmiel/`

מוגדר ב־`HIDDEN_FROM_LISTINGS` ב־`web/src/lib/pages/locations/paths.ts`.  
המספר **108** הוא מקור האמת ל־rollout; **110** ב־`BLOG_CONTENT_AUDIT_2026.json` ובכותרת הישנה של התוכנית = ספירת JSON ללא ההפרדה הזו. עודכן כותרת ב־`audit-blog-rollout-status.mjs`.

## 3. Batch6–7 — QA חזותי מלא (10 מאמרים)

סקריפט: `web/scripts/qa-blog-rollout-batch67-full.mjs`  
בדיקות לכל URL: **desktop + mobile** (Pixel 5)

- lead (`adwrks-article-lead-2026` / lead קיים)
- FAQ (≥3 `details.adwrks-faq-item`)
- סיכום (כותרת `סיכום` / `לסיכום` או EN: `Summary` / `In conclusion`)
- תאריך מעודכן גלוי (`2026-11-20`)
- JSON-LD `dateModified` עם `2026-11-20`
- CTA (`article-cta-band` / inline / popup)
- **ללא** `sp-hero--location` על מאמרים

**תוצאה: 20/20 OK** (+ 2 בדיקות אזור, ראו §5).  
צילומי מסך: `migration-audit/qa-blog-rollout-batch67-full/`.

## 4. רגרסיה מול PR #12 (אזורים ורכיבים משותפים)

| בדיקה | תוצאה |
|--------|--------|
| `qa-location-hero-2026.mjs` (copy סטטי 26 דפי אזור) | OK |
| `qa-location-service-hero-regression.mjs` — `/seo/`, `/google-ads/`, hub שירותים | OK — **אין** `sp-hero--location` |
| בתוך full visual — כרמיאל HE | OK — **יש** `sp-hero--location` |
| בתוך full visual — מאמרי batch6/7 | OK — **אין** location hero |

## 5. Build ובדיקות נוספות

| בדיקה | תוצאה |
|--------|--------|
| `npm run build` (web) | OK |
| `audit-blog-rollout-status.mjs` | total **108**, enriched **46** |
| `qa-blog-rollout-batch67.mjs` | 10/10 OK (אזהרות CTA ללא wrap inline — תקין; CTA ב־`ArticleEndSection`) |
| `qa-blog-cta-centering.mjs` | OK |
| `qa-blog-reading-ux.mjs` | **כשל ידוע** — `/כך-בוחרים-חברה-לשיווק-דיגיטלי/` `dateModified` עדיין `2026-05-13` (Batch4, לפני PR #11); לא נגענו בתוכן מאמר זה |

## 6. Batch6–7 — רשימת מאמרים שנבדקו

**Batch6 (HE):**  
`/פרסום-לעסקים/`, `/כוחם-של-ביקורות-והמלצות/`, `/מהי-סוכנות-דיגיטלית/`, `/סוכנות-לשיווק-דיגיטלי/`, `/מדריך-קידום-העסק-בגוגל/`

**Batch7 (EN):**  
`/en/business-advertising/`, `/en/what-is-internet-marketing/`, `/en/paid-vs-organic-seo/`, `/en/remarketing-guide/`, `/en/choosing-digital-marketing-agency/`

## 7. שינויים ב-QA בשלב זה

- סקריפט חדש `qa-blog-rollout-batch67-full.mjs` (10×2 + JSON-LD + רגרסיית אזור).
- תיקון סלקטורים Playwright ל־`.article-body-html` ו־`article-cta-band`.
- הבהרת כותרת תוכנית rollout ל־108 routable posts.

---

**קומיט אחרון לדוח זה:** ראה `git log -1` בענף לאחר push QA.