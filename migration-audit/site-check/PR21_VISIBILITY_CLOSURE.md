# PR #21 — נראות בחיפוש + סגירה (`75285eb`+)

## מה נוסף

| רכיב | מצב |
|------|-----|
| הצעת עד 3 ביטויים מהסריקה | שרת `suggestSearchPhrases` |
| UI עריכה + IL/he/mobile | `SiteCheckVisibilitySection` |
| API `/api/search-visibility` | mock ברירת מחדל, `off` אופציונלי |
| מכסה נפרדת | `SEARCH_VISIBILITY_DAILY_LIMIT` (default 1 דוח/יום) |
| סריקה 8/יום, PageSpeed 3/יום | ללא שינוי |
| ליד | `leadAppendix` עם ביטויים ותוצאות |

## מאומת מקומית (dev, לא Preview)

- ShopGarden סריקה + ביטויים מוצעים מקטגוריה/מוצר
- Mock visibility: 3 שורות, תובנה עסקית, צירוף ל-leadNote
- **נתוני דוגמה** — לא DataForSEO חי

## Preview — חסום

- **401** Deployment Protection (ללא bypass secret)
- PageSpeed / Resend — לא אומתו ב-Preview

## חסר לאישור תשלום DataForSEO

- `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`
- `SEARCH_VISIBILITY_PROVIDER=live`
- חיווט SERP + AI Overview (מתוכנן אחרי אישור)

PR #21 פתוח.