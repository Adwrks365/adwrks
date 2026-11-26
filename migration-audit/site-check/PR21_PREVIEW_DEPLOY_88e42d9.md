# PR #21 — Push + Preview `88e42d9`

## Git / Vercel

| פריט | ערך |
|------|-----|
| Push | `origin/feat/site-check-tool-page` → `88e42d9` |
| PR head | `88e42d99996d46ecd6948091d3ca6f7359bb5fe1` |
| GitHub Preview deployment | `2026-11-24T06:31:04Z`, שורש `88e42d9` |
| Vercel check | SUCCESS — [deployment](https://vercel.com/adwrks/adwrks/4Ah1BV639cf1wJgHpNKpgJJ1JEXw) |

**Preview URL:** https://adwrks-git-feat-site-check-tool-page-adwrks.vercel.app/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/

(דורש התחברות Vercel Deployment Protection — API מחזיר 302 ל-SSO.)

## DataForSEO live (פיילוט) — **לא בוצע**

אין במכונה / בסביבה המקומית:

- `DATAFORSEO_LOGIN`
- `DATAFORSEO_PASSWORD`

בלי אלה לא בוצעה קריאת API (אין חיוב, אין טעינת יתרה).

### מה נדרש ממך (Preview בלבד, דוח **אחד**)

ב-Vercel → Project **adwrks** → Settings → Environment Variables → **Preview** (לא Production):

| משתנה | ערך |
|--------|-----|
| `SEARCH_VISIBILITY_PROVIDER` | `live` |
| `DATAFORSEO_LOGIN` | אימייל מחשבון DataForSEO |
| `DATAFORSEO_PASSWORD` | סיסמת API (לא סיסמת אתר) |
| `SEARCH_VISIBILITY_DAILY_LIMIT` | `1` (מומלץ לפיילוט) |

**Production:** אל תגדיר את המשתנים לעיל (או השאר ללא `SEARCH_VISIBILITY_PROVIDER` = נראות כבויה).

אופציונלי לסגירת QA:

| משתנה | Preview |
|--------|---------|
| `PAGESPEED_API_KEY` | מפתח PSI |
| `RESEND_API_KEY` + `CONTACT_FORM_FROM` | שליחת ליד |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | בדיקות אוטומטיות מול Protection |

אחרי Redeploy: הרץ פיילוט מקומי מול אותן אישורים (ללא חשיפת סיסמה בצ'אט):

```powershell
cd web
$env:SEARCH_VISIBILITY_PROVIDER='live'
$env:DATAFORSEO_LOGIN='...'
$env:DATAFORSEO_PASSWORD='...'
node ..\scripts\dataforseo-live-pilot.mjs
```

פלט: `PR21_DATAFORSEO_PILOT.md` + צילום מדף בדיקת אתר אחרי «בדקו את הנראות בגוגל».

## QA Preview — סטטוס

| בדיקה | סטטוס |
|--------|--------|
| פריסת `88e42d9` | אומת ב-GitHub deployments |
| DataForSEO חי (3 ביטויים IL/he/mobile) | **חסום** — אין פרטי גישה |
| צילום דוח חי ב-Preview | **חסום** — SSO + אין live |
| PageSpeed ב-Preview | **לא אומת** — אין `PAGESPEED_API_KEY` מקומית + SSO |
| ליד במייל + `lead_submit` | **לא אומת** — אין Resend מקומי + SSO |

PR #21 נשאר פתוח.