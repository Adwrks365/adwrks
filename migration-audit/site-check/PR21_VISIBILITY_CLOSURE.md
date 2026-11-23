# PR #21 — נראות בחיפוש (`20c3aa4`+)

## שינוי מצב ספק (המשך)

| מצב | התנהגות |
|-----|---------|
| **לא מוגדר / פרודקשן** | `off` — בלוק נראות מוסתר, סריקה + טופס ללא שינוי |
| **`SEARCH_VISIBILITY_PROVIDER=mock`** | דמו מפורש (Preview) — `isDemoData: true` |
| **`live` + `DATAFORSEO_*`** | SERP חי עומק 20 + AI overview (מקורות) — **לא** mock |

| רכיב | מצב |
|------|-----|
| DataForSEO live | `dataforseo-provider.ts` — קריאה אמיתית; כשל ביטוי = שורה חלקית |
| ליד במייל | מזהה דמו: נושא `נראות: דוגמה`, באנר HTML, שורה בטקסט |
| אומדן עלות | `GET /api/search-visibility` + UI במצב mock |

## מאומת

- Unit: `provider-mode`, `lead-email-visibility-demo`
- Local dev עם `SEARCH_VISIBILITY_PROVIDER=mock` — זרימת דמו + leadAppendix

## Preview — עדיין חסום (אם אין bypass)

- **401** Deployment Protection
- PageSpeed / Resend / `lead_submit` ב-Preview — ממתין ל-`PAGESPEED_API_KEY`, `RESEND_*` + גישה מורשית

## לפני מיזוג (בעלים)

1. Preview: `SEARCH_VISIBILITY_PROVIDER=mock` לדמו QA בלבד
2. פרודקשן: ללא משתנה (off) עד אישור תשלום
3. אחרי אישור: `live` + `DATAFORSEO_*`

PR #21 פתוח.