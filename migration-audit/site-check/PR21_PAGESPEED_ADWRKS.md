# PageSpeed ל־Adwrks — אבחון ציון חסר

## תסמין

בדיקת מהירות ל־`adwrks.co.il` מחזירה מצב «מוכן» בלי מספר (UI הציג «—» והמלצה כללית).

## סיבה טכנית

ה־API (`/api/pagespeed`) מחזיר `ok: true` גם כש־`lighthouseResult.categories.performance.score` חסר או לא מספרי. זה קורה כש־PageSpeed Insights מסיים בלי קטגוריית ביצועים (עומס כבד, זמן ריצה, או תשובה חלקית מ־Google).

מעתה:

- לוג שרת: `[pagespeed] lighthouse ok but performance score missing`
- שדה `performanceScoreMissing: true` בתשובה
- UI: הודעת `speedNoScore` + כפתור «נסו שוב» — **בלי** `speedTipGeneric`

## אימות מקומי

`scripts/qa-site-check-speed-ui-mobile.mjs` — mock עם/בלי ציון, צילומי מובייל ב־`migration-audit/site-check-preview/`.