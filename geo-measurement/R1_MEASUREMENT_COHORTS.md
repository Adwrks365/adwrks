# Round 1 — שתי קבוצות מדידה (אל תאחד)

**עדכון:** 2026-10-31  
**סטטוס ראיות:** `OWNER_REPORTED` — צילומי מסך חסרים (`evidence/R1/`)

## למה שתי קבוצות

| קohort | session_state | שימוש |
|--------|---------------|--------|
| **A — Personalization possible** | `owner_session` (10 שאלות מותאמות) | **לא** נראות ציבורית; מדגם פנימי בלבד |
| **B — Unpersonalized** | `temporary_chat_unpersonalized` | **קרוב יותר** לנראות ללקוח לא מוכר — עדיין לא ממצה את כל המנועים |

**אין להסיק** שהפרש A↔B נובע **רק** מהתאמה אישית / זיכרון. ייתכנו גם וariance בין ריצות, מקורות שונים, או Search. **נדרשות בדיקות חוזרות** באותו פרוטוקול.

---

## קohort A — 10 שאלות (בדיקה ראשונה)

**מקור:** `R1_ROUND1_10_OWNER_EVIDENCE.md`, `runs-log.csv` (`run_no=1`, `R1-CUSTOM-Q01`…`Q10`)

| מדד | ערך |
|-----|-----|
| n | 10 |
| mentioned | **8/10** |
| #1 ברשימה | **7/10** |
| absent | **2/10** (#3 SEO, #9 GBP) |
| link כשהופיע | **8/8** |

---

## קohort B — Unpersonalized (Temporary Chat)

**שאלות:** **1, 2, 3, 10** בלבד (אותו נוסח כמו A).  
**מקור:** דיווח בעלים 2026-10-31.

| # | שאלה (קצר) | A (ראשונה) | B (Unpersonalized) |
|---|------------|------------|---------------------|
| 1 | SMB/boutique agency IL | #1 | **לא הופיע** |
| 2 | Google Ads management IL | #1 | **לא הופיע** |
| 3 | SEO company IL | absent | **absent** |
| 10 | personal + affordable SMB | בלעדי / #1 | **לא הופיע** |

### סיכום B (n=4)

| מדד | ערך |
|-----|-----|
| mentioned | **0/4** |
| #1 | **0/4** |
| link | **0/4** |

### סיכום השוואתי (4 שאלות זהות בלבד)

| מדד | A (4 שאלות) | B (4 שאלות) |
|-----|-------------|-------------|
| mentioned | **3/4** (#1, #2, #10; #3 לא) | **0/4** |

**לא ממוצע 10+4.** דווחו בנפרד בדוחות וב-`GEO_PUBLIC_VISIBILITY_GROWTH_EXECUTION.md`.

---

## המשך מדידה (פרוטוקול)

1. הרחבת **B** לשאלות **4–9** באותו מצב Unpersonalized (ללא שינוי נוסח).
2. הרחבת **B** ל-Gemini / Perplexity כשיש גישה מורשית — אחרת `NOT_RUN`.
3. לכל ריצה: תאריך, מנוע, `personalization=Y|N`, web search, מיקום, mentioned, position, link, sources, screenshot path.
4. **אין** לשנות שאלות כדי לשפר מדגם.

---

## קישורים

- `AI_MANUAL_MEASUREMENT_PROTOCOL.md`
- `runs-log.csv` (שורות `run_no=2` ל-B)
- `R1_CHATGPT_PILOT_REPORT.md`
