# Phase 3.3E — Final Article Template + WordPress Content Cleanup

**Date:** 2026-09-30  
**Status:** Complete — awaiting manual approval  
**Scope:** Focused article template repair + systematic HTML entity normalization

---

## 1. Article sidebar changes

**Removed from desktop sidebar:**
- Article rating
- Author card
- Table of Contents

**New desktop sidebar order:**
1. **Facebook recommendations / social proof** — verified testimonials from migrated homepage data (`HOMEPAGE_TESTIMONIALS`), with link to real Facebook page (`SITE.social.facebook`). No invented reviews or counts.
2. **Related articles** — 3 compact items with thumbnail, title, 2–3 line excerpt, CTA "קראו את המאמר".
3. **Compact contact form** — reuses `/api/contact/` infrastructure (name, phone, email, honeypot). CTA: "רוצים שנעזור לכם לקדם את העסק?"

Sidebar is non-sticky; modules flow naturally with the article.

---

## 2. Facebook recommendations / social proof

**Implementation:** `ArticleFacebookSocialProof.tsx`

- Uses verified migrated Facebook-style client recommendations already present in `HOMEPAGE_TESTIMONIALS` (same source as homepage carousel).
- Shows 2 compact quotes with real names, roles, and avatar images from `/wp-content/uploads/`.
- Link: "צפו בכל ההמלצות ב-Facebook" → `https://www.facebook.com/adwrks365`
- No fabricated ratings, counts, or embed scripts.

---

## 3. Contact form implementation

**Implementation:** `ArticleSidebarContactForm.tsx`

- Client component posting to existing `/api/contact/` route.
- Fields: שם, טלפון, אימייל (matches site contact flow).
- Hidden message preset: "פנייה מטופס צד מאמר".
- Honeypot field preserved.
- Compact sidebar styling; no secrets exposed client-side.

---

## 4. TOC relocation

**Moved from sidebar → main article column**

Order in main column:
- Hero / metadata (unchanged)
- **Table of Contents** (inline accordion)
- Article body (prose card)

Component: `ArticleToc.tsx` with class `article-toc-inline`.

---

## 5. TOC default closed behavior

- Uses native `<details>/<summary>` with controlled state.
- Label: **תוכן עניינים**
- **Default: closed** on desktop and mobile.
- Opens to show H2/H3 hierarchy with active heading highlight.
- Click scrolls to heading (smooth scroll; respects `prefers-reduced-motion`).
- Closes after selection.
- Internal scroll when list is long (`max-height: min(50vh, 24rem)`).

---

## 6. HTML entity root cause

WordPress exported content with HTML entities in text nodes and excerpts (`&quot;`, `&#8211;`, `&amp;quot;`, etc.). Previous pipeline:

- Decoded titles at load time only.
- `decodeHtmlEntities` was single-pass with limited entity coverage.
- Article HTML rendered via `dangerouslySetInnerHTML` without text-node decoding.
- Excerpts decoded in `formatExcerpt`, but double-encoded values could survive one pass.

**Fix:** Multi-pass `decodeHtmlEntities` + `decodeHtmlTextNodes()` applied in `processContentHtml()` — decodes text between tags only, preserving HTML structure and sanitization boundary.

---

## 7. Entity issues found / fixed

| Metric | Count |
|--------|-------|
| Source posts with raw entities in title/excerpt | 48 |
| Rendered pages with visible raw entities (before fix, estimated from source) | 48+ post excerpts + inline HTML text |
| Rendered pages with visible raw entities (after fix) | **0** |

---

## 8. Remaining visible raw entities

**0** across 74 sitemap URLs (`migration-audit/html-entity-audit.json`).

Patterns checked: `&quot;`, `&amp;`, `&#…;`, `&nbsp;`

---

## 9. Article end layout

**Order (all viewports):**
1. Article body
2. **Rating** — "המאמר היה מועיל?"
3. **Author** — verified Adwrks 365 team bio
4. **Related articles grid** — 3 rich cards ("למאמר המלא")
5. CTA band — "דברו איתנו"

No rating duplication on desktop. Mobile gets full end stack (sidebar hidden).

---

## 10. Desktop QA result

**52/54 automated checks passed** (`migration-audit/qa-phase-3-3e.json`)

Verified on 4 articles at 1440px:
- TOC in article column, closed by default ✓
- No rating in sidebar ✓
- Facebook proof visible ✓
- Related articles + contact form in sidebar ✓
- Rating at article end ✓
- No visible raw HTML entities ✓
- Single H1 ✓ (3/4 articles; see remaining issues)

Screenshots: `migration-audit/visual-qa-phase-3-3e/` (4 articles × 390 + 1440)

---

## 11. Mobile QA result

Verified at 390px:
- TOC inline, closed by default ✓
- End-of-article rating, author, related grid ✓
- No horizontal overflow observed in screenshots ✓
- Entity decoding ✓

---

## 12. Scroll-to-top verification

- Hidden at top ✓
- Appears after scroll ✓
- Returns near top on click (y=49 with smooth scroll) ✓
- Left container contracts when scroll-top hidden (preserved from 3.3D) ✓

---

## 13. Image audit result

```
urlsScanned: 74
totalImagesChecked: 1017
brokenAfter: 0
```

(`migration-audit/rendered-image-audit.json`)

---

## 14–16. Validation

| Check | Result |
|-------|--------|
| `npm run lint` | **PASS** |
| `npx tsc --noEmit` | **PASS** |
| `npm run build` | **PASS** |

---

## 17. Remaining known issues

1. **ROI calculator article (`/מחשבון-roi-מעודכן-2026/`)** has 2× H1 — pre-existing embedded H1 in WordPress article body. Not changed per scope (no heading/content edits).
2. **Scroll-to-top smooth scroll** settles at ~49px instead of exact 0 — functional, carried from 3.3D.
3. **`ArticleTestimonialSnippet.tsx`** remains unused (superseded by `ArticleFacebookSocialProof`).

---

## Files changed

| File | Change |
|------|--------|
| `ArticleTemplate.tsx` | TOC in main; simplified sidebar |
| `ArticleSidebarCards.tsx` | FB proof + related + contact |
| `ArticleFacebookSocialProof.tsx` | **New** |
| `ArticleSidebarContactForm.tsx` | **New** |
| `ArticleToc.tsx` | Unified closed accordion in article |
| `ArticleEndSection.tsx` | Rating + author for all viewports |
| `paths.ts` | Multi-pass entity decode + text-node helper |
| `html.ts` | Apply text-node decode in pipeline |
| `article.ts` | Decode TOC heading text |
| `globals.css` | Sidebar/TOC/contact/FB styles |
| `scripts/audit-html-entities.js` | **New** |
| `scripts/qa-phase-3-3e.js` | **New** |

---

**STOP.** No deploy, push, commit, WordPress, or DNS changes. Awaiting manual approval before Phase 3.4 / SEO Phase 4.
