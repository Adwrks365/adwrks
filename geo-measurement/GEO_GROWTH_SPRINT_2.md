# ADWRKS 365 — GEO Growth Sprint 2  
## SEO + GEO: מנראות להמלצות AI ופניות איכותיות

**גרסה:** 2026-10-31 v2 (יישום Sprint 2 באתר)  
**סטטוס:** **יושם באתר** — commit Sprint 2 (ראה §16) · Round 1 / case studies / E1–E6 — חלקי (ראה `SPRINT2_EXTERNAL_ACTIONS.md`)  
**Sprint 1:** Production `62b9d60` (StartingOffer, FAQ sync, 8 קישורי מדריך) — **סגור**  
**Baseline (לא לחזור על ניתוח):** GSC Web 92d · GenAI P92 (803 impr.) · GA4 property 571 users (Aug–Oct 2026, נעול) · `queries.csv` (97) · Round 1 (30) — **EXECUTION_PENDING**  
**מסמכים קשורים:** `GEO_GROWTH_ROADMAP_90_DAYS.md` · `GEO_MASTER_PLAN.md` §11 · `SEO_GEO_OPPORTUNITY_MATRIX.md`

---

## 0. סגירת Sprint 1 — Production (2026-10-31)

בדיקה קצרה **אחרי Deploy** (`62b9d60`) — מובייל 390px + דסקטופ 1440px, `https://adwrks.co.il`:

| עמוד | HTTP | overflow | StartingOffer / מחיר | tel | WhatsApp | טופס |
|------|------|----------|----------------------|-----|----------|------|
| `/google-ads/` | 200 | לא | 850 ₪ + מע"מ | כן | כן | — |
| `/seo/` | 200 | לא | 2,000 ₪ + מע"מ | כן | כן | — |
| `/website-building/` | 200 | לא | 1,800 ₪ + מע"מ | כן | כן | — |
| `/social-media-management/` | 200 | לא | 1,050 ₪ Meta ממומן | כן | כן | — |
| `/מחירון-שיווק-דיגיטלי/` | 200 | לא | 2,000 ✓ · **אין 2,500** | כן | כן | — |
| `/contact-us/` | 200 | לא | — | כן | כן | טופס ✓ |

**צילומים:** `migration-audit/sprint1-prod-postdeploy/*.png`  
**מסקנה:** **PASS** — אין תקלה חדשה; לא חוזרים על QA מלא.

**מגבלות נשארות מ-Sprint 1 (לא Sprint 2):** B4 תנאי התקשרות · Meta Partner claims · קישור #8/#10 · T01 Query×Page export.

---

## 1. מצב נוכחי ופערים עסקיים

### 1.1 מה השתפר (Sprint 1)

- **שקיפות מחיר פתיחה** («החל מ-») ב-4 עמודי שירות React + עקביות מחשבון SEO **2,000 ₪**.
- **FAQ Schema** מסונכרן (Ads 8, SEO/Social/WB 7).
- **8 מדריכים** → CTA לשירות (כולל RU post 20350).

### 1.2 פער עסקי מרכזי (מנתונים מאומתים)

| שכבה | מצב | משמעות לפניות |
|------|-----|----------------|
| **Web — חשיפה** | 117K impr. / 161 clk (92d) · CTR ~0.14% | הרבה נראות, מעט קליקים |
| **Web — שירותים** | `/seo/` ~6.9K impr., **0 clk**; `/google-ads/` ~2.7K, pos ~62 | Intent מסחרי לא מומר |
| **Web — מאמרי מחיר** | WP cost ~12K impr.; SEO price ~8.9K | גולש לומד מחיר, לא בוחר ספק |
| **GenAI P92** | 803 impr. · **66 URLs** | נראות ב**מדריכים/כלים**, לא בעמודי שירות (Ads 6, SEO 4) |
| **שאילתות סוכנות (Web)** | `סוכנות שיווק דיגיטלי` 1,920 impr., 3 clk; `חברה לקידום אורגני` 1,357 impr., **0 clk** | פער **בחירת ספק** |
| **Round 1 ChatGPT** | **0 runs** | אין baseline המלצות AI — רק תוכנית |
| **Case studies** | **0** מפורסמים עם מספרים מאומתים | חולשה vs מתחרים ב-intent «מומלצת» |
| **About / B4** | GenAI ~7 impr.; HE-B08 חסום | חולשה ב«בוטיק / ללא התחייבות» |

**עיקרון Sprint 2:** לא «עוד תוכן כללי» — **תשובות מסחריות**, **הוכחה**, **entity**, **מדידה** — בלי הבטחת AI ranking.

---

## 2. ניתוח הזדמנויות לפי שירות

**מקור נראות:** GSC Web (92d) + GenAI P92 + קבוצות `queries.csv`.  
**כלל:** עדיפות ל**שיפור עמוד קיים** לפני URL חדש.

### 2.1 Google Ads (Search, Shopping, PMax, YouTube, Remarketing)

| # | חיפושי לקוח (דוגמות) | Intent | עמוד(ים) | נראות מאומתת | פער | באתר | מחוץ לאתר | השפעה | עדיפות | מאמץ |
|---|----------------------|--------|-----------|--------------|-----|------|-----------|--------|--------|------|
| 1 | `פרסום בגוגל`, `פרסום בגוגל לעסקים`, HE-C01–C03, C04 | ס/מח | `/google-ads/` | Web 2.7K; GenAI **6** | pos ~62; חסר **sub-intent** (Shopping/PMax/YouTube) מעל fold | H2+FAQ ל-PMax/YouTube/RM; קישור מ-`/google-shopping-guide/` (S1 ✓) | Round 1 C01,C03,C04 | גבוהה | **P0** | M |
| 2 | Shopping HE-C06 | ס | `/google-shopping-guide/` → `/google-ads/` | guide 2.4K clk 4 | מדריך > שירות | פסק «ניהול Shopping» בראש המדריך (לא מחיר חדש) | — | בינונית | P1 | L |
| 3 | PMax, YouTube, RM HE-C07–C09 | ס | `/google-ads/` | Meta ב-Web חלש | תת-כותרות + «לא במחיר 850» | אותו עמוד | — | בינונית | P1 | L |

### 2.2 Meta Ads (Facebook, Instagram, leads)

| # | חיפוש | Intent | עמוד | נראות | פער | באתר | מחוץ | השפעה | עדיפות | מאמץ |
|---|--------|--------|------|-------|-----|------|-----|--------|--------|------|
| 1 | HE-D01–D06 | ס | `/social-media-management/` | Web q ~486; GenAI **1** | אין Meta Partner proof | FAQ לידים/WhatsApp; **לא** badge חדש | Round 1 D01,D02 | בינונית | P1 | M |
| 2 | `פרסום ממומן בפייסבוק` | מ/ס | `/פרסום-ממומן-בפייסבוק/` | impr. גבוה | S1 CTA ✓ | בדיקת CTR post-deploy | — | בינונית | P2 | L |

### 2.3 SEO וקידום אורגני

| # | חיפוש | Intent | עמוד | נראות | פער | באתר | מחוץ | השפעה | עדיפות | מאמץ |
|---|--------|--------|------|-------|-----|------|-----|--------|--------|------|
| 1 | `חברה לקידום אורגני`, HE-E01 | ס | **`/seo/`** | 6.9K impr. **0 clk**; pos ~48 | cannibal עם `/digital-marketing/seo/` 9K **0 clk** | FAQ «למי מתאים» + box ב-`/מחיר-קידום-אתרים/` (S1 ✓) | — | **גבוהה** | **P0** | M |
| 2 | `קידום אתר בגוגל` | ס/מ | `/קידום-אתרים-בגוגל/` | 8.2K impr. | CTA לשירות (S1 ✓) | מעקב CTR 28d | — | גבוהה | P1 | L |
| 3 | Local SEO HE-E04 | ס | `/seo/` + דפי location | — | thin local proof | פסקה + קישור מ-`/סוכנות-פרסום-שיווק-בכרמיאל/` (GenAI **20**) | GBP | בינונית | P1 | M |

### 2.4 AEO / GEO

| # | חיפוש | Intent | עמוד | נראות | פער | באתר | מחוץ | השפעה | עדיפות |
|---|--------|--------|------|-------|-----|------|-----|--------|--------|
| 1 | HE-F01, F03 | מ/ס | `/seo-2026-ai-answers/`, `/מהו-aeo…/` | F_aeo ~1.9K q; GenAI 22 | exposure ≠ recommendation | קישור מפורש ל-`/seo/` + About entity | Round 1 | בינונית (GEO) | P1 |
| 2 | HE-B01, B06, B07 | ס | `/about-us/`, Hub | A_digital 17K q impr. | weak «למה ADWRKS» | B1 process + **B4** (blocked) | directories | גבוהה boutique | **P0** (B4) |

### 2.5 בניית אתרים, WordPress, LP

| # | חיפוש | Intent | עמוד | נראות | פער | באתר | השפעה | עדיפות |
|---|--------|--------|------|-------|-----|------|--------|--------|
| 1 | WP cost posts, HE-G01–G02 | מ/מח | `/website-building/` vs מדריכים | 12K+ impr. guides | guides > service | S1 CTAs ✓; process + portfolio **22** (page-local) | גבוהה | P1 |
| 2 | HE-H01 landing | ס | `/website-building/` + pricing | 250 q | LP לא בולט | FAQ «דף נחיתה מ-1,200 ₪» visible | בינונית | P2 |

### 2.6 Google Business Profile / Maps

| # | חיפוש | Intent | עמוד | נראות | פער | באתר | מחוץ | השפעה | עדיפות |
|---|--------|--------|------|-------|-----|------|-----|--------|--------|
| 1 | HE-I01, maps | מ/ס | `/google-business-profile/` | Web 6K; GenAI **85** | guide חזק; שירות Maps ₪400+ לא בולט | CTA ל-`/google-ads/` + pricing card | **GBP** consistency (Package E) | **גבוהה** local | **P0** |

### 2.7 SMB + Hub שירותים

| # | Intent | עמוד | פער | באתר | עדיפות |
|---|--------|------|-----|------|--------|
| 1 | HE-J01, J03, A03 | `/שירותי-שיווק-דיגיטלי/` | Hub GenAI **1**; Web — | FAQ השוואתי **מאוזן** (לא WB dominance) | P1 |
| 2 | «שיווק דיגיטלי לעסקים» | `/שיווק-דיגיטלי-לעסקים/` | EN mirror impr. | קישור Hub + 3 שירותים | P2 |

### 2.8 פרסום ברוסית

| # | Intent | עמוד | נראות | פער | באתר | מחוץ | עדיפות |
|---|--------|------|-------|-----|------|-----|--------|
| 1 | K*, `פרסום ברוסית` | `/פרסום-דיגיטלי-בשפה-הרוסית/` | GenAI **69**; Web 378+ q | staffing FAQ (PENDING) | S1 block ✓ | RU directories | P1 |

### 2.9 צפון / כרמיאל / ישראל

| # | Intent | עמוד | נראות | פער | באתר | עדיפות |
|---|--------|------|-------|-----|------|--------|
| 1 | HE-M01, M06, local | `/סוכנות-פרסום-שיווק-בכרמיאל/` + 24 locations | GenAI **20** (commercial!) | proof מקומי | NAP + קישור Hub; **לא** המציא stats | P1 |

---

## 3. השוואה למתחרים (מחקר — לא המלצת AI)

**הנחה:** דירוג גבוה ב-Google **≠** המלצה ב-ChatGPT. השוואה על **מה שאפשר לראות בפומבי** (2026-10).

| סוג | דוגמה (ישראל) | מה בולט באתר | פער ADWRKS | מה לא להעתיק |
|-----|---------------|--------------|------------|--------------|
| B2B agency + cases | [Inter-Dev](https://inter-dev.co.il/cases/) | ארכיון case studies עם **מספרים** (traffic %, CPC ↓) | **אין** case studies מספריים | סuperlatives בלי אישור לקוח |
| Performance / CRM proof | [SFB](https://www.sfb.co.il/en-us/case-study/b2b-google-ads-signed-deals) | ROAS על **חוזים חתומים** + HubSpot | אין attribution story | להבטיח ROAS |
| SEO data wall | [DigiAssets](https://digiassets.co.il/en/seo-case-studies/) | GSC/GA charts לכל לקוח | אין charts מאומתים | להמציא גrafים |
| Boutique freelancer | [Alan Schvartzer – SIMtlv](https://alanschvartzer.pro/simtlv/) | case קצר Search+PMax+Shopping | פחות personal brand | — |

**יתרון ADWRKS (להדגיש בלי להגזים):** Google Partner (מאומת) · בוטיק · trilingual · **כלים** (ROI, speed test) · GenAI exposure בנישות (GBP, RU) · Sprint 1 pricing transparency.

**חולשה יחסית:** case studies · About/B4 · GenAI על `/google-ads/`/`/seo/` · cannibalization SEO cluster.

---

## 4. תוכנית מקרי בוחן (3 ראשונים)

**כלל:** פרסום רק אחרי **אישור לקוח בכתב** + מקור נתונים (Ads/Meta/GA4/GSC/CRM).

### CS-1 — Google Ads (B2B שירותים / lead gen)

| שדה | נדרש לאישור |
|-----|-------------|
| תעשייה + אזור | |
| תקופה (חודשים) | |
| היקף ניהול (₪/חודש) **ללא** חשיפת מותג אם צריך | |
| תקציב מדיה (טווח) | |
| KPI: CPL / CPA / leads / שיחות (מ-Ads + CRM) | |
| שינוי מ-«לפני» (אם יש) | |
| ציטוט לקוח (אופציונלי) | |
| **מיקום באתר** | בלוק ב-`/google-ads/` **אחרי** Hero/StartingOffer — לא homepage |

### CS-2 — SEO (קידום אורגני)

| שדה | נדרש |
|-----|------|
| מצב התחלתי (traffic/keywords) | GSC export |
| תקופה | |
| ביטויי מפתח (3–5) + אזור | |
| תוצאה: clicks/impressions/positions **או** leads | |
| היקף חודשי (₪) — **מ-2,000+** ללא הבטחת מיקום | |
| **מיקום** | `/seo/` — section «תוצאות» (לא FAQ) |

### CS-3 — אתר + Ads (מעטפת)

| שדה | נדרש |
|-----|------|
| One Page / multi · תאריך עלייה | |
| שילוב Ads/SEO (כן/לא) | |
| KPI: leads post-launch | |
| **מיקום** | `/website-building/` + קישור ל-CS-1 |

**אין** screenshot Ads dashboard מ-Sprint docs לפרסום עד אישור.

---

## 5. תוכנית סמכות חיצונית (Package E — ממוקד)

| # | פעולה | מטרה | בעלות | אישור |
|---|--------|------|--------|--------|
| E1 | **Google Business Profile** — NAP = מתכת 34, 079-5599449, שעות | entity + local | Owner | כן |
| E2 | **Trustindex** — תיקון כתובת 32→34 (מ-master plan) | consistency | Owner | כן |
| E3 | **B144 / Dapei Zahav** — claim או מconscious skip | citations | Owner | החלטה |
| E4 | **RU directories** — 2–3 מקורות לegitimate (לא spam) | K* queries | Owner + copy | כן |
| E5 | **Guest expert** — מאמר אחד (למשל PPC/GBP) באתר מקצועי | off-site mention | Owner outreach | כן |
| E6 | **LinkedIn** — founders post on process (לא case numbers) | entity | Owner | אופציונלי |

**לא:** קניית קישורים · רשימות directories אגרסיביות · Meta Partner שלא מאומת.

---

## 6. עשר פעולות Sprint 2 (מדורגות)

| ID | פעולה | Quick Win? | פוטנציאל פניות | AI/Google | נתונים | מאמץ | סיכון | מדד הצלחה (28–56d) |
|----|--------|------------|----------------|-----------|--------|------|-------|---------------------|
| **S2-01** | **Round 1** — 30 שאלות ChatGPT (`R1_CHATGPT_PILOT_RUNBOOK.md`) → `runs-log.csv` | ✓ | בינוני (baseline) | **AI visibility** | מוכן | M (owner time) | נמוך | C*/E* rates; **לא** = המלצה |
| **S2-02** | **`/google-ads/`** — H2 קצרים: Shopping, PMax, YouTube, Remarketing + «לא ב-850» + FAQ 1 (process) | ✓ | **גבוה** | Web+AI selection | GSC C-group | M | positioning | impr./clk `/google-ads/`; R1 C06–C09 |
| **S2-03** | **`/seo/`** — בלוק «למי מתאים / תהליך חודשי» + קישור `/מחיר-קידום-אתרים/`; **לא** 301 עד T01 | ✓ | **גבוה** | Web E-group | 6.9K impr. | M | cannibal | clk `/seo/`; pos `חברה לקידום` |
| **S2-04** | **`/about-us/`** — B1 process + founders (facts only); **B4 FAQ** — רק אחרי אישור משפטים | — | **גבוה** boutique | AI B-group | About GenAI 7 | M | legal copy | R1 B06,B07,N06 |
| **S2-05** | **`/google-business-profile/`** — CTA Maps ₪400+ + קישור Hub; **E1** GBP off-site | ✓ | **גבוה** local | GenAI 85 | I-group | M | — | GenAI GBP URL; local leads |
| **S2-06** | **Case study CS-1** — intake → publish block ב-`/google-ads/` | — | **גבוה** | selection queries | owner data | H | **no fake numbers** | leads tagged Ads; R1 C01 |
| **S2-07** | **`/שירותי-שיווק-דיגיטלי/`** — FAQ השוואתי (בוטיק vs גדול; מתי Ads vs SEO) — agency lock | ✓ | בינונית | A-group 17K q | draft ready | M | IA lock | Hub clk; R1 HE-A* |
| **S2-08** | **`/google-shopping-guide/`** — lead CTA «ניהול Shopping» (above fold paragraph) | ✓ | בינונית | Web 2.4K | exists | L | — | clk guide→service |
| **S2-09** | **T01** — GSC Query×Page export → החלטה **301** `/digital-marketing/seo/` (רק באישור URL) | — | גבוה ארוך טווח | Web 9K waste | needs export | M | **URL** | consolidation impr. |
| **S2-10** | **מדידת פניות** — spreadsheet CRM: source URL + service line (ללא GTM עד אישור) | ✓ | **גבוה** business | — | CRM | L | — | leads/service/month |

**סדר ביצוע מומלץ:** S2-01 (מ parallel) → S2-02, S2-03, S2-05 (Quick Wins) → S2-04, S2-06 (owner-dependent) → S2-07, S2-08 → S2-09, S2-10.

---

## 7. מדדי הצלחה (שלוש שכבות)

| שכבה | מדד | מקור | Baseline | יעד Sprint 2 (מגמה, לא הבטחה) |
|------|-----|------|----------|--------------------------------|
| **נראות** | Impressions + avg position | GSC Web | 117K / service pages pos 47–62 | ↑ impr. + ↑ pos על `/seo/`, `/google-ads/` |
| **נראות AI** | GenAI impr. ל-URLs מסחריים | GSC GenAI P92 | Ads 6, SEO 4 | ↑ impr. **≠** recommendation |
| **נראות AI (panel)** | Cited / Entity / Explicit rec | Round 1 `runs-log.csv` | **0** | baseline + מגמה 6–8 שבועות |
| **תנועה** | Sessions / engaged sessions | GA4 main | 571 users (3mo) | ↑ sessions ל-paths שירות |
| **תנועה AI** | Referrals ChatGPT/Perplexity/Gemini | GA4 | 4 users ChatGPT (baseline) | monitor only — **לא** KPI יחיד |
| **תוצאה** | Leads איכותיים (CRM) | Owner sheet S2-10 | TBD | ↑ leads עם `service=Ads|SEO|…` |

**אסור:** לפרש GenAI impressions כ«המלצות» · לפרש GA4 ChatGPT sessions כ-success של GEO.

---

## 8. נדרש מאישורך (לפני יישום קוד)

| ID | נושא | חוסם |
|----|------|------|
| A-S2-01 | אישור **S2-02–S2-03, S2-05, S2-07, S2-08** (copy + מיקום) | deploy תוכן |
| A-S2-02 | **B4** — ניסוח חוזה / בעלות חשבון Ads/Meta | S2-04 |
| A-S2-03 | **CS-1..3** — בחירת לקוח + נתונים + sign-off | S2-06 |
| A-S2-04 | **301 SEO cluster** (S2-09) | URL change |
| A-S2-05 | **E1–E4** off-site (GBP, directories) | authority |
| A-S2-06 | **Round 1** — הקצאת זמן owner ל-30 שאלות ChatGPT | AI baseline |
| A-S2-07 | **GTM/GA4 events** (אם ירצה מעבר ל-CRM sheet) | tracking |

---

## 9. רשימת שינויים מומלצת — יישום הבא (batch אחד)

לאחר אישור A-S2-01:

1. `google-ads-content.ts` + `.en.ts` — H2 sub-intents + FAQ process (ללא מחיר חדש).
2. `seo-content.ts` + `.en.ts` — «למי / תהליך» block.
3. `google-business-profile` — **post** content patch או page component (לבדוק מבנה).
4. `about-content.ts` — B1 (ללא B4 עד A-S2-02).
5. `שירותי-שיווק-דיגיטלי` — Hub FAQ (composer/page content).
6. `posts.json` — `/google-shopping-guide/` CTA above fold (patch).
7. `sync-sprint1-service-faq.mjs` pattern — FAQ schema after copy change.
8. **לא** `generate-i18n` · **לא** testimonials · **לא** pricing Sprint 1.

---

## 10. מה מחוץ Sprint 2

- Sprint 2 **לא** מחליף Round 1 / 90-day roadmap — **ממקד** 10 פעולות.
- **אין** הבטחת הופעה ב-AI.
- **אין** שינוי תשתית (§9 constraints master plan).

---

---

## 16. יישום Sprint 2 (2026-10-31)

| משימה | סטטוס | הערות |
|-------|--------|-------|
| S2-01 ביקורות — הסרת תגית | ✅ | `HOMEPAGE_RESULT_QUOTES` HE+EN |
| S2-02 Google Ads | ✅ | קמפיינים + מדידה; מחיר 850 ללא Shopping |
| S2-03 SEO | ✅ | `SEO_SCOPE`; מ-2,000 ₪ |
| S2-04 About (חלקי) | ✅ | Google Partner בלבד; `ABOUT_VERIFIED`; ללא Meta badge |
| S2-05 GBP | ✅ | post 14288 + מדריך ב-Hub |
| S2-07 Hub FAQ | ✅ | 8 שאלות + FAQPage schema HE/EN |
| S2-08 Shopping | ✅ | post 17923 — CTA למעלה |
| Case studies | ✅ | 4 מקרים ב-`cases.ts` — SEO×2, Tal (WB+GAds), Meta אנונימי; ראה `CASE_STUDY_SOURCE_LOG.md` |
| E1–E6 / Round 1 | 🔶 | `SPRINT2_EXTERNAL_ACTIONS.md` |

**QA מקומי:** typecheck ✅ · build ✅ · lint — 6 errors קיימים (לא מ-Sprint 2).

**Baseline למעקב (28d / 90d):** GSC Web impr./clk · GenAI impr. · `/seo/` `/google-ads/` clk · hub FAQ impressions · leads (GA4) — ללא Round 1 מזויף.

---

## 17. מקרי בוחן — לקוחות אמיתיים (2026-10-31)

**מיקום באתר:** סקשן «מקרי בוחן» בעמודי `/seo/`, `/google-ads/`, `/website-building/`, `/social-media-management/` (+ EN).

| ID | פרסום | מקור |
|----|--------|------|
| `cs-seo-menofeyhasdai` | כן (שם + אתר) | דוח UBS (owner brief) |
| `cs-seo-express-hovalot` | כן (שם + אתר) | דוח UBS (owner brief) |
| `cs-wb-tal-shina-gads` | כן (שם) | ביקורת דף הבית + צילום GAds |
| `cs-meta-leads-oct2026` | כן (אנונימי) | צילום Meta Ads |

PDF/צילומים: **`case-study-sources/`** + **`CASE_STUDY_SOURCE_LOG.md`** — לא נמצאו ב-workspace; הצלבת PDF **לא בוצעה**.

---

## 18. Sprint 2 closure (2026-10-31)

| פעולה | סטטוס |
|--------|--------|
| מקרי בוחן — Meta ניסוח ניטרלי | ✅ |
| SEO Hasdai/Express — תנודתיות / מעבר פלטפורמה | ✅ (ללא ייחוס ודאי) |
| UI מקרי בוחן — מקור+תקופה, limitations ב-details | ✅ |
| Hub `HUB_DISCOVERABILITY` — עובדות ל-AI/בחירת ספק | ✅ |
| SEO — קישורים למחירון + `/מחיר-קידום-אתרים/` | ✅ |
| `GEO_BASELINE_28_90_TRACKER.md` | ✅ |
| PDF cross-check | ⏳ ממתין לקבצים בתיקייה |
| Round 1 / E1–E6 / S2-09 301 / B4 | ⏳ owner / אישור |
