# PR #21 — סגירת Preview (`75285eb`) — מצב 2026-11-23

**Preview URL (חסום לאוטומציה):**  
https://adwrks-git-feat-site-check-tool-page-adwrks.vercel.app/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/

**HEAD:** `75285eb` · **Vercel deploy:** עבר (ירוק)

---

## מה נחסם ב־Preview (דורש ממך)

| בדיקה | סטטוס אוטומטי | מה נדרש |
|--------|----------------|---------|
| **כל ה-API** (`/api/site-check`, `/api/pagespeed`, `/api/contact`) | **401** — Vercel Deployment Protection | כיבוי Protection ל-Preview **או** הגדרת `VERCEL_AUTOMATION_BYPASS_SECRET` + פרמטר bypass בבדיקות; אימות SSO בדפדפן מחובר ל-Vercel |
| **PageSpeed בפועל** | לא אומת ב-Preview | `PAGESPEED_API_KEY` ב-**Environment → Preview** (לא רק Production) + **Redeploy** |
| **ליד → Resend** | לא אומת ב-Preview | `RESEND_API_KEY` + `CONTACT_FORM_FROM` (דומיין מאומת ב-Resend) ב-**Preview** + Redeploy |

אין גישה מכאן להגדרות Vercel / משתני סביבה בפריסה.

---

## 1. ShopGarden במובייל (ראיה מקומית = אותו קוד `75285eb`)

**הערה:** צילומים מול `http://localhost:3000` (dev, build אחרון) — **לא** מול Preview עקב 401.

| קובץ | תוכן |
|------|------|
| `migration-audit/site-check-preview/pr21-closure-shopgarden-mobile-now.png` | סיכום עמודים + ממצא H1 בית + CTA קידום |
| `migration-audit/site-check-preview/pr21-closure-shopgarden-store-insight-mobile.png` | תובנת חנות: **9 קטגוריות, 6 מוצרים**, **ב־2 קטגוריות ללא H1**, 6/6 עם רכישה, ניווט בית→קטגוריה→`/items/` |

**סיכום סריקה (API מקומי):**
- `pageTypeSummary`: דף הבית, 9 קטגוריות, 6 מוצרים, יצירת קשר, 3 אחרים.
- **6 המוצרים:** כולם מתוך קישורי `/items/` שנמשכו **מעמודי קטגוריה שנפתחו** (בפועל מאותו מסלול קטלוג — לרוב מ־«מוצרי הצללה» `/343098-…` ועמוד קטגוריה ראשון שנפתח במדגם).
- **ממצא מדורג (ראשון):** H1 חסר בדף הבית (תיקון נקודתי).
- **המלצה לבעל החנות (תובנה 2):** השוואת מובייל מוצר מול קטגוריה; בפירוט — **2 קטגוריות ללא H1** ב-HTML (לא מוצג כממצא נפרד אם יש עדיפות גבוהה יותר לבית).

---

## 2. PageSpeed — מכסה 3/יום משותפת

**קוד:** `PAGESPEED_DAILY_LIMIT = 3`, cookie `adwrks_psi_day` — **אותו מונה** ל:
- כפתור «בדקו מהירות» ב־[בדיקת אתר](/בדיקת-אתר/)
- כלי [בדיקת מהירות](/בדיקת-מהירות-אתר/) (embed)

**בדיקה ב-Preview:** לא בוצעה — 401 + חסר אימות `PAGESPEED_API_KEY` ל-Preview.

**מקומי (ללא מפתח):** `POST /api/pagespeed` → `503` `unavailable` (צפוי).

**סריקת אתר:** מכסה נפרדת — **8/יום** (`adwrks_site_check_day`).

---

## 3. ליד — לא אומת ב-Preview

**נדרש:** `RESEND_API_KEY`, `CONTACT_FORM_FROM` ב-Preview.  
**נושא מייל / שעת שליחה:** לא זמינים — שליחה נחסמה ב-401 / חסר Resend מקומית.

**מקומי:** הרצת `scripts/site-check-preview-qa.mjs` — ראו פלט `leadEvents` (אם `/api/contact` 503 בלי Resend, ליד לא יישלח).

**GA4:** `lead_submit` פעם אחת אחרי הצלחת טופס (`pushLeadSubmitEvent` ב-`GoogleTags.tsx`).

---

## מה לעשות כדי לסגור ב-Preview ידנית (3 דקות)

1. Vercel → Project → **Deployment Protection** → אפשר גישה ל-Preview (או הוסף Bypass secret).
2. **Settings → Environment Variables** → Preview: `PAGESPEED_API_KEY`, `RESEND_API_KEY`, `CONTACT_FORM_FROM`.
3. **Redeploy** branch `feat/site-check-tool-page` (`75285eb`).
4. במובייל: ShopGarden → פתח «תובנות» → PageSpeed → ליד בדיקה אחת → בדוק `info@adwrks.co.il`.

**PR #21 נשאר פתוח** לאישור merge.