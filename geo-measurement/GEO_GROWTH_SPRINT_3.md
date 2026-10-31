# ADWRKS 365 — GEO Growth Sprint 3

**גרסה:** 2026-10-31  
**מיקוד:** UI/UX polish + המשך SEO/GEO (Round 1, E1–E6)

## 20.1 Case study balance (2026-10-31)

- הסרת צילום מסך מכרטיס חסדאי; תג «מקרה מאומת» אחיד לכל הכרטיסים.
- כותרת סקשן ממורכזת; תוכן כרטיסים מיושר start (RTL).
- מטריקות בשורה (3) בדסקטופ; `dir=ltr` לערכים מספריים.
- CTA ב-footer אחיד (`margin-top: auto`).

**Deploy:** **`3f97314`** · GitHub **7457653036** · smoke UI **PASS** (390/768/1440, 11 paths) · צילומים `migration-audit/sprint3-ui-2026-10-31/{before,after}/`.

## 21. Full visual QA — locations hub (2026-10-31)

**בעיה:** `/אזורי-פעילות/` — רשימות צפופות + **כרטיסי `ServiceRelatedServices` כפולים** לכל הערים (עומס ויזואלי).

**תיקון:** `LocationsHubRegions` — כרטיסי אזור עם grid קישורים; **הסרת** כפילות regions+cities; סקשן שירותים = 6 שירותים בלבד; כותרות ממורכזות; רוחב `max-width: 72rem`.

**Deploy:** **`df4425f`** · GitHub **7457711335** · smoke **39/39 PASS** · צילומים `migration-audit/visual-qa-2026-10-31/{390,768,1440}/`.

## עמודים שנבדקו (UI audit)

דף הבית, Google Ads, SEO, Website Building, Social, About, מחירון, Contact, EN home/SEO/contact.

## המשך (לא Sprint 3 UI)

Round 1 · E1–E6 · B4 · entity schema · S2-09 301
