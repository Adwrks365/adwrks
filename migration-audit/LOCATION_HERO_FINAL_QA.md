# סקירה סופית לפני merge — PR #12

תאריך: 2026-11-20  
ענף: `feat/location-hero-h1-2026`

## 1. H1 בעברית (25 עמודים)

- כל 24 ערים/אזורים + hub: **כולם כוללים «שיווק דיגיטלי»** (26 בדיקות כולל hub).
- מגוון ניסוחים: «חברה לשיווק דיגיטלי ב…» (7), «שיווק דיגיטלי ב… — …» (רוב השאר), «סוכנות…», «משרד פרסום…» — לא תבנית אחת עם החלפת שם בלבד.
- **חיפה:** עודכן ל־**«חברה לשיווק דיגיטלי בחיפה»** (במקום «שיווק דיגיטלי בחיפה — חברת פרסום דיגיטלי»).
- רענון קל גם ב: בת ים, ראשון לציון, רעננה, אשקלון — פחות חזרה מכנית על «חברה לשיווק…».

## 2. QA אוטומטי

| בדיקה | תוצאה |
|--------|--------|
| `qa-location-hero-2026.mjs` | 26/26 |
| `qa-location-meta-unchanged.mjs` | paths + seoTitle/seoDescription זהים ל-main |
| `qa-location-service-hero-regression.mjs` | SEO, Google Ads, Hub שירותים — **ללא** `sp-hero--location` |
| `npm run build` | עבר |

## 3. QA חזותי (Playwright)

6 עמודים × desktop + mobile (after local) + before מ-prod לאותם עמודים:

- hub (`/אזורי-פעילות/`)
- תל אביב, חיפה, ירושלים
- כרמיאל, צפון

צילומים: `migration-audit/qa-location-hero-2026/` (`{page}-before|after-{desktop|mobile}.png`)

נבדק:

- `sp-hero--location` על עמודי אזור בלבד
- H1 מכיל «שיווק דיגיטלי»
- `.sp-hero-actions` עם רוחב סביר (CTA ממורכז)

## 4. URL / מטא / Canonical / Hreflang

- **URL:** ללא שינוי (`paths.ts` זהה ל-main).
- **seoTitle / seoDescription:** ללא שינוי (אומת מול main).
- **JSON-LD:** מבנה, URLs ו-Canonical ללא שינוי. שדות `WebPage`/`Service` **`name`** עוקבים אחרי H1 (מכוון — לא שינוי מבני).

## 5. עיצוב Hero

- גרדיאנט ו-border-bottom מובחנים מהסקשן הבא.
- `text-wrap: balance` על כותרות.
- CTA: flex + justify center על אזורים בלבד.

## 6. מוכן לאישור?

כן מבחינה טכנית — **ממתין לאישור merge/פריסה מפורש** מהבעלים.