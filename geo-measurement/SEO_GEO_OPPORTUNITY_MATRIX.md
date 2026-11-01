# מטריצת הזדמנויות SEO × GEO × תנועה

**תאריך:** 2026-10-30 · **תכנון בלבד** — ללא שינוי אתר/מעקב  
**מקורות:** `gsc-web-computed-summary.json`, `gsc-92day-computed-summary.json` / `GEO_GOOGLE_BASELINE.md`, **`queries.csv` (97)**, Round 1 (30 — **לא בוצע**).  
**GA4:** נכס ראשי **`G-T4TE22LLC1`** — baseline **01.08–29.10.2026 VERIFIED (owner)** (571 users, 4,187 events). ChatGPT: **4** first-user users / **16** sessions — **לא** לערבב. Realtime/`collect` **NOT_VERIFIED**. Catalog **`G-Z0DMMQVTQN`** / צילום 522 → **NOT_APPLICABLE**. `GA4_AI_REFERRAL_ANALYSIS.md` §2.

---

## 1. מילון מדדים (לא לאחד)

| עמודה | מה זה מודד | מקור | תקופה |
|-------|------------|------|--------|
| Web impr. | הופעות בחיפוש Google (Web) | GSC Web export | 2026-07-29 → 2026-10-28 |
| Web clicks | קליקים Web | GSC Web | idem |
| GenAI impr. | הופעות ב-Google Generative AI | GSC GenAI P92 | 2026-07-28 → 2026-10-27 |
| GA4 property users | Active users (90d) | Owner report | **571** (Aug–Oct 2026) |
| GA4 ChatGPT | First-user users / Sessions | Owner report | **4** / **16** — מדדים נפרדים |
| GA4 Realtime / `collect` | קליטה חיה | DevTools / Admin | **NOT_VERIFIED** |
| R1 mention rate | המלצה/אזכור במנוע AI | `runs-log.csv` | **אין נתונים** |
| Leads | `lead_submit` / key events | **`G-T4TE22LLC1`** | **NOT_VERIFIED** (by source) |

**אסור:** לסכום GenAI impr. + ChatGPT users; לייחס leads ל-SEO בלי ייצוא.

---

## 2. מטריצה לפי תחום שירות

דירוג חשיפה Web = סכום הופעות קבוצת שאילתות (1,001 שורות). GenAI = דוגמאות URL מ-P92 (לא סכום קבוצה מלא). עמודת **GA4** — ריקה עד ייצוא **`G-T4TE22LLC1`**.

| תחום | Web impr. (קבוצה) | Web clicks | מיקום ממוצע (שאילתות) | GenAI signal (P92) | GA4 (נכס) | R1 (30q) | פער / הזדמנות | עדיפות |
|------|-------------------|------------|------------------------|--------------------|-----------|----------|---------------|--------|
| **סוכנות שיווק דיגיטלי** | 17,412 | 10 | ~36 | Homepage 98 impr.; About 7 | 571 users (property) | pending | מיקום ~22 ל-head terms, CTR נמוך; About חלש ב-AI | **P1** |
| **Google Ads** | 7,044 | 2 | ~41 | `/google-ads/` 6 impr. | — | C* queries | Web חשיפה; GenAI כמעט לא מקשר שירות | **P1** |
| **SEO / אורגני** | 29,372 | 1 | ~53 | `/seo/` 4; מחיר מאמר 47 | — | E* | הופעות ענק על `/digital-marketing/seo/` 0 קליקים | **P1** |
| **Meta Ads** | 486 | 0 | ~49 | Social service ~1 | — | D* | חשיפה נמוכה בכל הערוצים | **P2** |
| **בניית אתרים** | 11,895 | 4 | ~44 | guides (WP price) 41+ impr. | — | G* | מחירונים מנצחים; שירות WB פחות ב-AI | **P2** |
| **דפי נחיתה** | 250 | 0 | ~67 | נמוך | — | H* | מדגם נמוך — Round 1 לפני תוכן | **P3** |
| **GBP / Maps** | 190 (+ דף 6K impr.) | 0 | ~30 | GBP guide **85** impr. | — | I* | מדריך חזק ב-AI; שירות Maps לבדוק | **P2** |
| **עסקים קטנים** | 79 | 0 | — | — | — | J* | לבדוק ב-non-brand export | **P3** |
| **פרסום ברוסית** | 378 | 0 | ~26 | RU post **69** impr. | — | K* | Web+GenAI מסכימים על RU content | **P2** |
| **AEO / GEO** | 1,937 | 0 | ~25 | `/seo-2026-ai-answers/` 22 | ChatGPT 4u/16s (referral) | F* | narrative + R1 נפרד מה-referral | **P2** |
| **צפון / מקומי** | 31 | 0 | ~6 | Karmiel 20 | Cities: TA, PT, Haifa… | M* | שאילתות מעטות בייצוא; דפי location | **P3** |
| **מידע / כלים** | 11,952 | 41 | ~34 | ROI, speed, popular searches | — | — | לא למסחור ישיר; תמיכה ב-entity | **ניהול** |
| **Legacy / 404** | GSC: locksmith 961, פרסום-עסק 2013 | 11 | — | — | GA4 **40** Not Found views | — | תוכנית URL §2.4 GA4 doc | **P0 תשתית** |

---

## 3. עמודי שירות שדורשים בדיקה (לא מחיקה)

| URL | Web | GenAI P92 | HTTP | פעולה מומלצת (מחקר) |
|-----|-----|-----------|------|---------------------|
| `/seo/` | 6,901 impr., 0 clk | 4 impr. | 200 | Intent, snippet, cannibalization vs `/digital-marketing/seo/` |
| `/google-ads/` | 2,757 impr., 3 clk | 6 impr. | 200 | מיקום 62 — למה רחוק מ-"פרסום בגוגל" |
| `/website-building/` | (בדוק ב-GSC דפים) | בדוק baseline | 200 | קישורים ממחירונים |
| `/social-media-management/` | בדוק | ~1 impr. | 200 | Round 1 D* |
| `/google-business-profile/` | 6,076 impr. | 85 impr. | 200 | המרת מדריך→שירות Maps |
| `/סוכנות-שיווק-דיגיטלי/` | 1,014 impr. | — | 200 | landing למסחרי agency |
| `/netanya-locksmith/` | 961 impr. | — | **404** (מכוון) | **סגור** — legacy; GSC היסטורי; לא להפנות |
| `/פרסום-עסק-חינם/` | 2,013 impr. | — | **200** | **סגור** — מאמר שמור; sitemap-he |

---

## 4. פער SEO רגיל ↔ נראות AI

| תופעה | Web (90d) | GenAI (P92) | משמעות |
|-------|-----------|-------------|--------|
| מדריכים/כלים | קליקים + impr. גבוהים | ROI, speed, GBP, RU, popular searches | Google AI **מקשר** תוכן אינפורמטיבי |
| עמודי שירות | impr. גבוהים, **CTR≈0** | `/google-ads/` 6, `/seo/` 4 | AI **לא** מחליף חשיפה Web; המלצה = F + off-site |
| ChatGPT referral (GA4) | — | — | **16 sessions / 4 first-user users** (owner); landing paths **NOT_VERIFIED** |
| Round 1 | — | — | ימדוד **המלצה** במנועים — לא GSC |

---

## 5. המלצות לפי שירות (תכנון)

1. **סוכנות:** B1 About + B4 terms; שיפור snippet ל-head queries; **לא** לשנות H1 גלובלי.  
2. **Google Ads / SEO:** canonical intent URL; case studies (C3) כשמאושר; מחיר SEO 2,000 ₪ כבר בפרודקשן — יישור מאמרים (D-10).  
3. **GBP:** factual copy (D-8 shipped); חיזוק שירות Maps מעמוד המדריך.  
4. **RU:** תוכן + E2 directories; לא לדלל positioning גלובלי.  
5. **GEO narrative:** `/seo-2026-ai-answers/` — Round 1 F* לפני הרחבה.  
6. **תשתית:** תיקון 404ים עם הופעות (locksmith, פרסום-עסק) — **GSC**; GA4 ראשי בנפרד (`G-T4TE22LLC1`).

---

## 6. סדר עדיפויות להמשך (ללא ביצוע)

| # | פעולה | בעלים / סוכן |
|---|--------|--------------|
| 1 | ייצוא GA4 §5 + אימות property/hostname | Owner |
| 2 | GSC query→page drill-down ל-8 שאילתות מסחריות | Owner |
| 3 | Round 1 ChatGPT pilot (`R1_CHATGPT_PILOT_RUNBOOK.md`) | Owner |
| 4 | החלטה legacy URLs (locksmith, business index) | Owner |
| 5 | עדכון מטריצה אחרי R1 + GA4 CSV | Agent (docs) |
| 6 | תוכן B–D לפי `GEO_MASTER_PLAN.md` | Owner approve → implement |

---

## 7. מידע נוסף נדרש

- [ ] GA4 Exploration (AI sources × landing × events)  
- [ ] GSC non-brand + query/page  
- [ ] אישור: האם **אינדקס עסקים** באותו domain/property  
- [ ] `runs-log.csv` אחרי Round 1  
- [ ] Key events / `lead_submit` volume ל-90d  
