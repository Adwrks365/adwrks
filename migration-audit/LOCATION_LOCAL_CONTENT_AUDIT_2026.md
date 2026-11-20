# ביקורת תוכן מקומי — עמודי אזורים (2026)

**ענף:** `feat/location-local-content-audit-2026`  
**בסיס:** `main` אחרי מיזוג PR #15  
**מותג:** Adwrks 365  
**סטטוס:** ממתין לאישור merge / פריסה  
**עדכון (גיאוגרפיה):** commit `d6eb7a4` — `titleKind` (`nearby` | `more_cities` | `areas`) + `NEARBY_CITIES_ALLOWED` + QA על כותרות מטעות

## סיכום

1. **מקור יחיד ל«אזורים סמוכים»** — `location-nearby-2026.ts` מספק גם את `NEARBY_IDS` ל־`registry.ts` וגם `nearbyTitle` / `nearbyIntro` ב־HE+EN.
2. **תיקון תוכן מוצג (שכבה אחרונה)** — `location-local-content-2026.ts`: CTA מקצועיים, `cardText`, ותיקוני אתגרים לעמודים עם ניסוח אוטומטי.
3. **לא שונו:** כתובות URL, `seoTitle` / `seoDescription` מאושרים, canonical, hreflang, טפסים ומעקב.

## לפני / אחרי — דוגמאות מרכזיות

| עמוד | נושא | לפני | אחרי |
|------|------|------|------|
| עפולה | כרטיסיות סמוכות | כרמיאל, **הצפון**, חדרה | כרמיאל, חיפה, חדרה |
| עפולה | כותרת אתגרים | מרחק מהמרכז — דיגיטל שווה זהב | איך מגיעים ליותר לקוחות בעפולה והסביבה? |
| עפולה | CTA | ייעוץ לעפולה | ייעוץ שיווקי / ייעוץ שיווקי לעסקים בעפולה |
| ירושלים | כותרת מדור | ערים סמוכות (עם מרכז/דרום) | **אזורי שירות נוספים** + הסבר |
| חיפה | קישורים | כלל **קריות** (אזור) תחת «ערים סמוכות» | עכו, כרמיאל, חדרה (ערים בלבד) |
| כל 24 מיקומים | CTA eyebrows | `ייעוץ ל{עיר}` | `ייעוץ שיווקי` + `contactTitle` מלא |

## מטריצה — כותרת / הסבר / קישורים (מוצג בפועל)

מקור: `npx tsx web/scripts/qa-location-nearby-matrix.mjs` עם `PRINT_MATRIX=1`.

| id | locale | mode | כותרת מדור | קישורים (ids) |
|----|--------|------|------------|----------------|
| karmiel | he | cities | ערים נוספות בגליל והצפון | haifa, afula, hadera |
| karmiel | en | cities | More cities in the Galilee and north | haifa, afula, hadera |
| north | he | cities | ערים נוספות בצפון | karmiel, haifa, afula |
| north | en | cities | More cities in the north | karmiel, haifa, afula |
| krayot | he | cities | ערים סמוכות לקריות | haifa, akko, karmiel |
| krayot | en | cities | Cities near the Krayot | haifa, akko, karmiel |
| center | he | cities | ערים נוספות במרכז | tel-aviv, ramat-gan, petah-tikva |
| center | en | cities | More cities in the center | tel-aviv, ramat-gan, petah-tikva |
| sharon | he | cities | ערים נוספות בשרון | netanya, herzliya, kfar-saba |
| sharon | en | cities | More cities in the Sharon | netanya, herzliya, kfar-saba |
| south | he | cities | ערים נוספות בדרום | beer-sheva, ashdod, ashkelon |
| south | en | cities | More cities in the south | beer-sheva, ashdod, ashkelon |
| haifa | he | cities | ערים סמוכות לחיפה | akko, karmiel, hadera |
| haifa | en | cities | Cities near Haifa | akko, karmiel, hadera |
| tel-aviv | he | cities | ערים סמוכות לתל אביב | ramat-gan, holon, petah-tikva |
| tel-aviv | en | cities | Cities near Tel Aviv | ramat-gan, holon, petah-tikva |
| ramat-gan | he | cities | ערים סמוכות לרמת גן | tel-aviv, petah-tikva, rishon-lezion |
| ramat-gan | en | cities | Cities near Ramat Gan | tel-aviv, petah-tikva, rishon-lezion |
| petah-tikva | he | cities | ערים סמוכות לפתח תקווה | ramat-gan, rishon-lezion, tel-aviv |
| petah-tikva | en | cities | Cities near Petah Tikva | ramat-gan, rishon-lezion, tel-aviv |
| rishon-lezion | he | cities | ערים סמוכות לראשון לציון | holon, bat-yam, petah-tikva |
| rishon-lezion | en | cities | Cities near Rishon LeZion | holon, bat-yam, petah-tikva |
| holon | he | cities | ערים סמוכות לחולון | bat-yam, rishon-lezion, tel-aviv |
| holon | en | cities | Cities near Holon | bat-yam, rishon-lezion, tel-aviv |
| bat-yam | he | cities | ערים סמוכות לבת ים | holon, rishon-lezion, tel-aviv |
| bat-yam | en | cities | Cities near Bat Yam | holon, rishon-lezion, tel-aviv |
| akko | he | cities | ערים סמוכות לעכו | haifa, karmiel, hadera |
| akko | en | cities | Cities near Akko | haifa, karmiel, hadera |
| hadera | he | cities | ערים סמוכות לחדרה | netanya, herzliya, haifa |
| hadera | en | cities | Cities near Hadera | netanya, herzliya, haifa |
| afula | he | cities | ערים סמוכות לעפולה | karmiel, haifa, hadera |
| afula | en | cities | Cities near Afula | karmiel, haifa, hadera |
| herzliya | he | cities | ערים סמוכות להרצליה | raanana, kfar-saba, netanya |
| herzliya | en | cities | Cities near Herzliya | raanana, kfar-saba, netanya |
| kfar-saba | he | cities | ערים סמוכות לכפר סבא | raanana, herzliya, netanya |
| kfar-saba | en | cities | Cities near Kfar Saba | raanana, herzliya, netanya |
| raanana | he | cities | ערים סמוכות לרעננה | kfar-saba, herzliya, netanya |
| raanana | en | cities | Cities near Raanana | kfar-saba, herzliya, netanya |
| netanya | he | cities | ערים סמוכות לנתניה | hadera, herzliya, kfar-saba |
| netanya | en | cities | Cities near Netanya | hadera, herzliya, kfar-saba |
| jerusalem | he | areas | אזורי שירות נוספים | center, sharon, south |
| jerusalem | en | areas | More service areas | center, sharon, south |
| beer-sheva | he | cities | ערים נוספות בדרום | ashdod, ashkelon |
| beer-sheva | en | cities | More cities in the south | ashdod, ashkelon |
| ashdod | he | cities | ערים נוספות בדרום | ashkelon, beer-sheva |
| ashdod | en | cities | More cities in the south | ashkelon, beer-sheva |
| ashkelon | he | cities | ערים נוספות בדרום | ashdod, beer-sheva |
| ashkelon | en | cities | More cities in the south | ashdod, beer-sheva |

**הסברי `nearbyIntro`:** ראו `NEARBY_BY_PAGE` בקובץ `web/src/lib/pages/locations/location-nearby-2026.ts` — אחד-לאחד עם הכרטיסיות.

## סדר שכבות תוכן (אחרי PR)

1. Base + extra (`copy-he.ts` / `copy-en.ts`)  
2. Hero (`location-hero-copy-2026`)  
3. Section rewrite (`location-section-rewrite-2026`)  
4. UX audiences + mid CTA (`location-content-ux-2026`)  
5. **Nearby** (`location-nearby-2026`)  
6. **Local content patch** (`location-local-content-2026`)  
7. SEO meta (נעול)

## QA שבוצע

| בדיקה | תוצאה |
|--------|--------|
| `npm run build` (web) | PASS |
| `qa-location-nearby-matrix.mjs` | PASS (48 שורות: 24×HE+EN) |
| `qa-location-content-ux-2026.mjs` | PASS (כולל איסור `ייעוץ ל…` / דיגיטל שווה זהב) |
| `qa-location-seo-2026.mjs` | PASS |
| `qa-location-faq-rewrite.mjs` | PASS |
| `qa-location-nav-groups.mjs` | PASS |

**Desktop/Mobile ויזואלי:** לא הורץ אוטומטית בסבב זה — מומלץ ספוט על עפולה, ירושלים, חיפה לפני פריסה.

## קבצים עיקריים

- `web/src/lib/pages/locations/location-nearby-2026.ts` (חדש)
- `web/src/lib/pages/locations/location-local-content-2026.ts` (חדש)
- `web/src/lib/pages/locations/registry.ts`
- `web/src/lib/pages/locations/copy-he.ts` / `copy-en.ts`
- `web/scripts/qa-location-nearby-matrix.mjs` (חדש)