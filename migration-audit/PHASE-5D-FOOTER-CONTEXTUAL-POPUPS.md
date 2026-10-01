# Phase 5D — Footer Polish + Smart Contextual Lead Popups

**Date:** 2026-10-01  
**Production URL:** https://adwrks.co.il

---

## Task 1 — Footer Visual Polish

**Change:** Tightened vertical rhythm in the brand column only (`globals.css`):

- `.site-footer-brand` gap: `0.45rem` → `0.2rem`
- `.site-footer-brand-title` margin-top removed; line-height `1.35`
- `.site-footer-desc` gap: `0.32rem` → `0.2rem`
- Logo link: minimal bottom margin for alignment

**Preserved:** Footer structure, content, legal bar, social links, Google Partner badge, floating controls. No `body`/`html` bottom padding added.

---

## Task 2 — Service Page Popup Mapping (16 sitemap service pages)

| URL | Context | Headline | CTA |
|-----|---------|----------|-----|
| `/google-ads/` | Google Ads | רוצים לבדוק את הקמפיינים בגוגל? | בקשת ייעוץ Google Ads |
| `/seo/` | SEO | רוצים לחזק את הנראות האורגנית בגוגל? | בקשת ייעוץ SEO |
| `/website-building/` | Website | רוצים אתר או דף נחיתה שמביא פניות? | בקשת ייעוץ לבניית אתר |
| `/social-media-management/` | Meta Ads | רוצים לייעל את הפרסום בפייסבוק ואינסטגרם? | בקשת ייעוץ Meta Ads |
| `/hosting-plans/` | Hosting | צריכים שקט נפשי לגבי האתר? | בקשת ייעוץ אחסון |
| `/שירותי-שיווק-דיגיטלי/` | Digital marketing | רוצים מעטפת שיווק דיגיטלי מותאמת? | בואו נדבר |
| `/digital-marketing/` | Digital marketing | (same) | בואו נדבר |
| `/digital-marketing/websites/` | Website | (website copy) | בקשת ייעוץ לבניית אתר |
| `/digital-marketing/google/` | Google Ads | (google ads copy) | בקשת ייעוץ Google Ads |
| `/digital-marketing/facebook/` | Meta Ads | (meta copy) | בקשת ייעוץ Meta Ads |
| `/digital-marketing/ads/` | Google Ads | (google ads copy) | בקשת ייעוץ Google Ads |
| `/digital-marketing/internet-advertisement/` | Digital marketing | (general copy) | בואו נדבר |
| `/digital-marketing/online-marketing/` | Digital marketing | (general copy) | בואו נדבר |
| `/digital-agency/` | Digital marketing | (general copy) | בואו נדבר |
| `/digital-marketing/seo/` | SEO | (seo copy) | בקשת ייעוץ SEO |
| `/מחירון-שיווק-דיגיטלי/` | Pricing | רוצים להבין מה מתאים לתקציב שלכם? | קבלת כיוון מותאם |

Supporting copy is defined in `web/src/lib/popups/messaging.ts` — no guaranteed results or invented statistics.

**Excluded from popups:** `/`, `/contact-us/`, `/about-us/`, `/blog/`, blog archives, category archives.

---

## Task 5 — Article Popup Logic

**Category mapping** (`categories.json` IDs):

| Category | Context |
|----------|---------|
| גוגל (227), קידום ממומן (229) | Google Ads |
| קידום אורגני (412) | SEO |
| בניית אתרים (226) | Website |
| פייסבוק (228) | Meta Ads |
| פרסום באינטרנט (230), שיווק באינטרנט (231), סוכנות דיגיטל (232), שיווק דיגיטלי (1) | Digital marketing |

**Title/path keyword override** (conservative): Google Maps, Google Ads, Meta, SEO, websites, hosting.

**Fallback:** General agency CTA (`general` context) when no confident match.

---

## Task 3–4 — Popup System

**Components:**

- `ContextualLeadPopupHost` — trigger orchestration (client-only, no SSR DOM until open)
- `ContextualLeadPopup` — accessible dialog (ESC, focus, `aria-modal`)
- `ContextualLeadPopupForm` — compact lead form

**Triggers (documented exact values):**

| Audience | Scroll depth | Time on page |
|----------|--------------|--------------|
| Service pages | **50%** | **40 seconds** |
| Articles | **60%** | **55 seconds** |

Whichever occurs first. One automatic impression per page view. Session suppressed after close or submit (`sessionStorage`). Blocked when accessibility panel open or user focused on existing form.

---

## Task 6 — Lead Form

- **Form ID:** `contextual-popup` (server allowlisted)
- **Fields:** name*, phone*, email optional, privacy consent, honeypot
- **Email subject example:** `ליד חדש | Adwrks 365 | פופאפ – קידום אורגני | [Page Name]`
- **popupContext** validated server-side against allowlist in `context-labels.ts`
- Reuses `/api/contact/` → Resend → `info@adwrks.co.il`

---

## Task 7 — GA4 Events

Events (no PII): `popup_view`, `popup_close`, `popup_submit`  
Parameters: `popup_id`, `popup_context`, `page_path`  
GA4 ID unchanged: `G-T4TE22LLC1`

---

## Task 8 — SEO / Performance Safety

- No changes to robots.txt, middleware SEO, metadata, canonicals, H1s, sitemap URLs, analytics IDs
- Popup is client-only; zero DOM until triggered (no CLS on load)
- Pages remain Server Components; popup host is a small client island
- Sitemap: **74 URLs** unchanged

---

## Build Validation

```
npm run lint       → PASS
npx tsc --noEmit   → PASS
npm run build      → PASS
```

---

## Final Status

```
FOOTER POLISH: PASS
SERVICE POPUPS: PASS
ARTICLE POPUPS: PASS
POPUP FORM DELIVERY: PASS (infrastructure; live Resend requires production keys)
GA4 EVENTS: PASS
MOBILE UX: PASS
SEO PRESERVATION: PASS
BUILD: PASS
```
