# PR #11 — השוואת strip hooks (לפני / אחרי)

Generated: 2026-11-20T07:29:27.885Z

בדיקה ממוקדת ב־**שני מנגנונים בלבד** (לא כולל `ensureReviewsNeutralClosing` / `ensureChoosingNeutralClosing` / הסרת pitch לפי H2).

## תוצאה: ✅ הכול תקין

### `stripInlineCtaBlocks` — `/en/what-is-internet-marketing/` — OK

| מדד | לפני | אחרי |
|-----|-----:|-----:|
| `<img>` | 0 | 0 |
| `<p>` | 40 | 38 |
| `<a>` | 10 | 8 |
| inline CTA blocks | 2 | 0 |
| FAQ section tag שלם (אחרי) | — | true |
| bytes הוסרו | 2589 | |

- תמונה בקטע שנמחק: לא ✅
- רק בלוקי `article-inline-cta-block`: כן ✅
- קובץ diff: `migration-audit/pr11-strip-hooks-diff/_en_what-is-internet-marketing_-stripInlineCtaBlocks-removed.html`

### `stripInlineCtaBlocks` — `/en/remarketing-guide/` — OK

| מדד | לפני | אחרי |
|-----|-----:|-----:|
| `<img>` | 0 | 0 |
| `<p>` | 50 | 50 |
| `<a>` | 10 | 7 |
| inline CTA blocks | 3 | 0 |
| FAQ section tag שלם (אחרי) | — | true |
| bytes הוסרו | 2560 | |

- תמונה בקטע שנמחק: לא ✅
- רק בלוקי `article-inline-cta-block`: כן ✅
- קובץ diff: `migration-audit/pr11-strip-hooks-diff/_en_remarketing-guide_-stripInlineCtaBlocks-removed.html`

### `stripLegacyH4ClosingSummary` — `/כוחם-של-ביקורות-והמלצות/` — OK

| מדד | לפני | אחרי |
|-----|-----:|-----:|
| `<img>` | 0 | 0 |
| `<p>` | 27 | 22 |
| `<a>` | 12 | 8 |
| inline CTA blocks | 0 | 0 |
| FAQ section tag שלם (אחרי) | — | true |
| bytes הוסרו | 1053 | |

- תמונה בקטע שנמחק: לא ✅
- רק בלוק לסיכום H4 לפני FAQ: כן ✅
- קובץ diff: `migration-audit/pr11-strip-hooks-diff/_כוחם-של-ביקורות-והמלצות_-stripLegacyH4ClosingSummary-removed.html`


## מאמרי stripInlineCtaBlocks

- `/en/what-is-internet-marketing/` — הוסרו **2** בלוקי CTA באמצע (כותרת + כפתור popup); שאר התוכן, תמונות וקישורים ללא שינוי.
- `/en/remarketing-guide/` — הוסרו **3** בלוקי CTA באמצע; מקטעי ההסבר, רשימות ו־FAQ נשארו.

## stripLegacyH4ClosingSummary

- `/כוחם-של-ביקורות-והמלצות/` — הוסר **רק** בלוק Legacy: `<h4>לסיכום:</h4>` + פסקת סיכום ארוכה מ־Elementor **עד** (לא כולל) `<section class="adwrks-article-faq-block">`. תמונות, קישורים חיצוניים (Hosting Tribunal, G2 וכו') וסטטיסטיקות **לפני** הבלוק נשארו. לאחר מכן (שלב נפרד) נוסף H2 לסיכום קצר.

אין Merge / פריסה.
