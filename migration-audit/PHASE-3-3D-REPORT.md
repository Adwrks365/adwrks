# Phase 3.3D — Global UI Consistency Report

**Date:** 2026-09-30  
**Status:** Complete — stopped before Phase 3.4 / SEO Phase 4

---

## Article UX

### Sidebar architecture
- Split **navigation** (TOC) from **discovery/trust** (rating, author, related).
- Desktop order: discovery modules **top** → sticky TOC **below**.
- TOC uses `max-height: min(42vh, 22rem)` with internal scroll — long TOCs no longer push modules off-screen.

### Related articles
- Sidebar: compact list with thumbnail, title, date, 2–3 line excerpt, CTA ("קראו את המאמר").
- Article end: richer 3-card grid with image, excerpt, "למאמר המלא" (desktop only — no duplicate sidebar list).

### Rating redesign
- Visitor copy: **"המאמר היה מועיל?"** / **"נשמח לדעת אם המידע עזר לכם."**
- Removed all migration/developer language.
- Premium star interaction: hover, selected, keyboard, touch targets.

### Author redesign
- Verified bio updated; circular logo avatar; compact sidebar + richer mobile/end variant.

### Mobile order
Hero → collapsible TOC → body → rating → author → related cards → CTA

---

## Floating controls

| Fix | Detail |
|-----|--------|
| Scroll-to-top regression | Root cause: hidden button still rendered with `opacity:0` reserving space; scroll listener lacked initial check. **Fix:** conditional render + `onScroll()` on mount. |
| Dynamic left container | Container shrinks to single a11y button at top; expands when scroll-top mounts. |
| Accessibility icon | Replaced with wheelchair / ISA-style symbol. |
| WhatsApp/Phone hover | `align-self: flex-end` + `width: fit-content` — siblings no longer expand together. |

---

## Content pages

| Page | Change |
|------|--------|
| Social Media | 4 service cards in one row on desktop (`grid-template-columns: repeat(4, 1fr)`) |
| Services hub | Verified images added for Social + Website Building sections |
| Services (all) | `ServiceVisualPanel` fallback when no verified image; alternating split grid |
| Contact | Compact hero — removed repetitive subtitle block; shorter supporting copy |
| About | Balanced image/text on "ליווי שיווק דיגיטלי" section (`about-media-card--balanced`) |

---

## Blog

- Real WordPress category filter chips (`BlogCategoryFilters`) on blog + category archives.
- Hero → filters → post count → grid spacing.
- Excerpt decoding via `formatExcerpt()` — no raw `&quot;`, `&#8211;`, etc.

---

## Global / regression

- **Image audit:** 909 checked, **BROKEN AFTER = 0** (preserved from 3.3C).
- Carousels, counters, footer, header — not regressed.
- Screenshots: `migration-audit/visual-qa-phase-3-3d/` (1440 + 390 for 7 pages).

---

## Validation

```
npm run lint     ✓ PASS
npx tsc --noEmit ✓ PASS
npm run build    ✓ PASS
```

**QA:** 9/10 automated checks passed. Scroll-to-top returns to ~49px (smooth scroll settle) — functional.

---

## Remaining issues

- None blocking. Optional: tune smooth-scroll settle if exact `scrollY=0` is required on all browsers.
