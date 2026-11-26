# PR #21 — סנכרון עם `main` (מעל `535b710`)

## Merge

- בסיס: `535b710` + `origin/main` (`2d9a9cd` — PR #23 authority/SEO)
- התנגשות: `web/src/generated/routable-path-index.json` — נפתרה באמצעות `generate-routable-path-index.mjs`
- `seo-content.ts`: נשמרו עדכוני תוכן authority מ-main + `checkHref: "/בדיקת-אתר/"`

## נראות חיה

ברירת מחדל **כבויה** (ללא `SEARCH_VISIBILITY_PROVIDER` ב-Production). DataForSEO רק לאחר אישור + env ב-Preview.

## Preview QA (דורש env + גישה)

| בדיקה | תנאי | סטטוס |
|--------|------|--------|
| סריקה → דוח | `SITE_CHECK_USAGE_SECRET` ב-Preview + SSO/bypass | ראה דוח השלמת PR |
| PageSpeed → ציון | `PAGESPEED_API_KEY` ב-Preview | |
| ליד → info@adwrks.co.il + `lead_submit` | `RESEND_API_KEY`, `CONTACT_FORM_FROM` | |

PR #21 **לא ממוזג** — ממתין לאישור בעלים.