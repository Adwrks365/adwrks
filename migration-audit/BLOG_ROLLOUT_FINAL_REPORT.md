# דוח סיכום — Rollout תוכן בלוג 2026 (שלב 1)

תאריך: 2026-11-20  
ענף: `feat/blog-content-rollout-2026`  
**לא בוצע merge / פריסה לפרודקשן.**

## מיפוי

| מדד | מספר |
|-----|-----:|
| סה״כ פוסטים (HE+EN) | 108 |
| כבר מועשרים (pilot, batch2–5, polish, **+batch6/7 ב-PR**) | 46 אחרי PR |
| לפני PR — ממתינים לטיפול מלא/חלקי | 72 |
| מתוכננים batch8+ (בקבוצות של 5) | ראו JSON |

מקור מיפוי: `migration-audit/BLOG_CONTENT_ROLLOUT_STATUS.json`, `BLOG_CONTENT_ROLLOUT_PLAN.md`.

## שלב זה — נבדקו ושופרו

### Batch6 (עברית) — 5 מאמרים

1. `/פרסום-לעסקים/`
2. `/כוחם-של-ביקורות-והמלצות/`
3. `/מהי-סוכנות-דיגיטלית/`
4. `/סוכנות-לשיווק-דיגיטלי/`
5. `/מדריך-קידום-העסק-בגוגל/`

שינויים: תקציר (lead), FAQ (4 שאלות כשמתאים), polish מבנה (סיכום כפול / בלוק מילות מפתח).

### Batch7 (אנגלית) — 5 מאמרים

1. `/en/business-advertising/` (זוג ל-HE)
2. `/en/what-is-internet-marketing/`
3. `/en/paid-vs-organic-seo/`
4. `/en/remarketing-guide/`
5. `/en/choosing-digital-marketing-agency/`

## לא שונו בשלב זה

- 36 מאמרים שכבר היו בסטנדרט PR #9–#10 (לא נערכו מחדש).
- מאמרים עם מחשבון/כלים (מהירות, ROI) — נשארו בתור batch ייעודי (ללא FAQ מלאכותי).
- ~58 מאמרים — מתוכננים ב-`batch8-planned` ואילך.

## בעיות שטופלו ב-batch6/7

- חוסר lead + FAQ במאמרי סוכנות/פרסום בסיסיים.
- קישורי שירות שגויים ב-EN (תוקן ל-`/en/social-media-management/`, `/en/digital-marketing-services/`).
- רישום מרכזי במסלול `article-enrichment-registry.ts`.

## QA שבוצע (מקומי)

| בדיקה | תוצאה |
|--------|--------|
| `npx tsx scripts/audit-blog-rollout-status.mjs` | JSON + MD |
| `npx tsx scripts/qa-blog-rollout-batch67.mjs` | lead/FAQ/תאריך |
| `npx tsx scripts/qa-blog-reading-ux.mjs` | רגרסיה batch4 |
| `npm run build` (web) | — |
| Playwright `qa-blog-rollout-visual.mjs` | 4 מאמרים × desktop+mobile — **8/8 OK** (localhost:3000) |

## מאמרים שנותרו

כל הפוסטים שאינם `source` ב-registry ואינם `acceptable-no-runtime` — רשימה מלאה ב-JSON לפי `plannedBatch`.

## צעדים הבאים (דורש אישור)

1. סקירת PR + Playwright screenshots (`migration-audit/qa-blog-rollout-batch67/`).
2. PR נוסף ל-batch8–10 (15 מאמרים) או המשך באותו ענף עם commits נפרדים.
3. רק אחרי אישור מפורש: merge ופריסה.