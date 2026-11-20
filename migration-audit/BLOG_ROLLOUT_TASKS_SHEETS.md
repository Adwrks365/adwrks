# Blog rollout — שורות לגיליון משימות (Google Sheets)

העתיקו לגיליון המשימות הקיים לפי קטגוריה. **לא** לפרוס ללא אישור אחרי סקירת PR.

| סטטוס | קטגוריה | משימה | אחראי | תלות | הערות |
|-------|---------|--------|-------|------|--------|
| Done (main) | Blog UX | PR #10 — מרכוז CTA במאמרים | Dev | PR #9 | בפרודקשן |
| Done (main) | Content | Batch2–5 + pilot — 36+ מאמרים מועשרים | Dev | — | ראו registry |
| In review | Content | Batch6 — 5 מאמרים HE (פרסום/סוכנות/ביקורות/גוגל) | Dev | PR rollout | commit נפרד |
| In review | Content | Batch7 — 5 מאמרים EN (advertising, marketing, paid/organic, remarketing, agency) | Dev | Batch6 | commit נפרד |
| Planned | Content | Batch8–22 — ~58 מאמרים שנותרו (5 לקבוצה) | Dev | אישור Batch6/7 | `BLOG_CONTENT_ROLLOUT_PLAN.md` |
| In review | QA | `audit-blog-rollout-status.mjs` + JSON מלא | Dev | — | 108 פוסטים |
| In review | QA | `qa-blog-rollout-batch67.mjs` + Playwright visual | Dev | build local | 4 URLs × 2 viewports |
| Planned | QA | רגרסיה פרוד לפני merge | Owner | אישור PR | `qa-blog-reading-ux` + CTA scripts |
| Blocked | Deploy | Merge + Vercel production | Owner | QA + אישור מפורש | **אין פריסה אוטומטית** |

## קבוצות עבודה עתידיות (מתוך JSON)

כל `batch8-planned` … `batchN-planned` ב-`migration-audit/BLOG_CONTENT_ROLLOUT_STATUS.json` מכיל 5 מאמרים (ממוינים לפי post id). עדכנו את הגיליון אחרי כל PR עם:

- מספר מאמרים שופרו ב-PR
- post ids / paths
- תאריך `dateModified` ב-`article-content-revisions.json` (רק עם עדכון מהותי)