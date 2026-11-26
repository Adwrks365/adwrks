# PR #21 — סנכרון עם `main` (מעל `535b710`)

## קומיט מעודכן

| פריט | ערך |
|------|-----|
| **SHA** | `759c348` (merge main → feat/site-check-tool-page) |
| **Preview** | https://adwrks-git-feat-site-check-tool-page-adwrks.vercel.app/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/ |

## Merge

- בסיס: `535b710` + `origin/main` (`2d9a9cd` — PR #23 authority/SEO)
- התנגשות: `web/src/generated/routable-path-index.json` — נפתרה באמצעות `generate-routable-path-index.mjs`
- `seo-content.ts`: נשמרו עדכוני תוכן authority מ-main + `checkHref: "/בדיקת-אתר/"`

## נראות חיה

ברירת מחדל **כבויה** (ללא `SEARCH_VISIBILITY_PROVIDER` ב-Production). DataForSEO רק לאחר אישור + env ב-Preview.

## Preview QA (2026-11-26)

**API ללא SSO:** `302` על `/api/site-check`, `/api/pagespeed`, `/api/contact` — Deployment Protection.

| בדיקה | סטטוס |
|--------|--------|
| סריקה → דוח | **לא אומת** — SSO + לא נבדק ידנית אחרי merge |
| PageSpeed → ציון | **לא אומת** — `PAGESPEED_API_KEY` ב-Preview (לא אומת מקומית) + SSO |
| ליד + `lead_submit` | **לא אומת** — `RESEND_API_KEY`, `CONTACT_FORM_FROM` ב-Preview + SSO |

**נדרש לסגירה:** Preview env (למעלה) + התחברות Vercel / `VERCEL_AUTOMATION_BYPASS_SECRET` + Redeploy → אימות ידני או `scripts/site-check-preview-qa.mjs`.

PR #21 **לא ממוזג** — ממתין לאישור בעלים.