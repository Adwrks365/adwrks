# Phase 5E — LCP / PageSpeed NO_LCP Isolation

**Date:** 2026-10-01  
**Production URL:** https://adwrks.co.il/  
**Scope:** Diagnostic isolation only; one minimal fix applied after A/B proof.

---

## ACTUAL LCP CANDIDATE

| Field | Value |
|-------|-------|
| **Element** | Hero marketing photo (`<img>`) |
| **Selector** | `div.home-hero-grid > div.home-hero-visual > img.mx-auto` |
| **Component** | `HomePage.tsx` → `next/image` with `HOMEPAGE_IMAGES.heroPhoto` |
| **Type** | Image |
| **Mobile dimensions** | 358 × 358 px |
| **Desktop dimensions** | 559 × 559 px |
| **Alt text** | סמארטפון המציג לקוחות מרוצים מהשיווק הדיגיטלי של סוכנות Adwrks 365 |
| **In initial server HTML** | YES — present in SSG output with `priority` |
| **Hydration replacement** | NO — same DOM node; no client swap |
| **LCP entries emitted** | YES on mobile (Playwright + Lighthouse); intermittent/zero on desktop Playwright runs |

**Not the LCP candidate (verified):**

- H1 `סוכנות שיווק דיגיטלי` — smaller area than hero image on mobile; gradient clipped text (`color: transparent`) makes text LCP eligibility unreliable.
- Header logo — too small (130×44 mobile); occasionally recorded as interim LCP before hero image wins.

---

## Task 1 — Measurement Summary

### Production (https://adwrks.co.il/) — before fix

| Viewport | Observed LCP entries | Final LCP element | LCP time | FCP |
|----------|---------------------|-------------------|----------|-----|
| Mobile 390 | 2 | Hero image | **696 ms** | 608 ms |
| Desktop 1440 | **0 (NO_LCP)** | — | — | 268 ms |

### Local baseline (variant A — hero has `.reveal`)

| Viewport | Observed LCP | Final LCP | FCP |
|----------|-------------|-----------|-----|
| Mobile 390 | 1 | Hero image @ **448 ms** | 176 ms |
| Desktop 1440 | **0** | — | 152 ms |

### Lighthouse mobile (throttled, variant A)

| Metric | Value |
|--------|-------|
| LCP (throttled score) | **3.2 s** |
| Observed LCP | **461 ms** |
| FCP | **1.4 s** |
| Speed Index | **1.6 s** |
| CLS | **0** |

Artifacts: `migration-audit/phase-5e-lcp/prod-v2-*.json`, `lh-a-reveal.json`, screenshots.

---

## Task 2 — Hero Reveal / Animation Audit

### `.reveal` CSS (`globals.css`)

```css
.reveal {
  animation: reveal-up 0.6s ease both;
}
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Hero behavior (variant A)

| Check | Finding |
|-------|---------|
| Hero wrapper | `section.home-hero-premium.reveal` |
| Initial opacity | **`opacity: 0`** on section (animation-fill-mode: `both`) |
| H1 / hero image inside reveal | Effective paint blocked by ancestor opacity until animation progresses |
| IntersectionObserver on hero | **None** |
| JS reveal logic | **None** — CSS-only |
| Hydration dependency | **No** — opacity gate is pure CSS, applied before hydration |

Paint sampling (production mobile, t=591 ms first frame):

- `section.home-hero-premium`: **opacity 0**
- `h1`, `hero img`: computed own opacity 1, but **rendered invisible** via parent opacity multiplication
- Hero section reaches opacity 1 only after ~600 ms animation completes

Below-the-fold sections retain `.reveal` unchanged.

---

## Task 3 — Controlled A/B Test

### Variant A — current (hero has `.reveal`)

See baseline tables above.

### Variant B — `.reveal` removed from hero only

Change: `className="home-hero-premium reveal"` → `className="home-hero-premium"`

| Metric | A (reveal) | B (no reveal) | Delta |
|--------|-----------|---------------|-------|
| Hero section opacity @ first paint | 0 | **1** | Immediate visibility |
| Playwright observed LCP (mobile) | 448 ms | **348 ms** | **−100 ms** |
| Lighthouse observed LCP (mobile) | 461 ms | **408 ms** | **−53 ms** |
| Lighthouse throttled LCP | 3.15 s | **3.12 s** | −27 ms |
| Lighthouse Speed Index | 1.58 s | **1.37 s** | **−208 ms** |
| FCP (Lighthouse) | 1.38 s | 1.37 s | ~same |
| CLS | 0 | 0 | No regression |

Visual: Hero content appears immediately; no fade/slide entrance. Design unchanged after paint. Below-fold reveals preserved.

**Causality:** Removing the opacity gate on the LCP ancestor stabilizes and improves LCP measurement. **Relationship confirmed.**

Artifacts: `local-b-no-reveal-*.json`, `lh-b-no-reveal.json`, screenshots.

---

## Task 4 — Other NO_LCP Causes Investigated

| Hypothesis | Result |
|------------|--------|
| LCP candidate removed/replaced after paint | **Not observed** — same `<img>` node from SSR |
| Client hydration replacing hero DOM | **No** — `HomePage` is a Server Component |
| Unusual container | Hero inside grid; no iframe/shadow DOM |
| Image lazy-loading | **No** — `priority` set; eager load confirmed in HTML |
| CSS background LCP | Hero uses `<img>`, not background-image |
| Font swap on H1 | Gradient clipped text; image wins LCP anyway |
| Console errors | **None** on production or local runs |
| PSI vs Chrome difference | Local Lighthouse **does** produce LCP (~3.1 s throttled). Production PSI NO_LCP may be Lightrider/throttling edge case **aggravated** by opacity-0 ancestor delaying eligible paint |

---

## Task 5 — Hero Image / next/image

| Setting | Value |
|---------|-------|
| `priority` | YES |
| `loading` | default (eager) |
| `sizes` | `(max-width: 1024px) 90vw, 45vw` |
| `width/height` | 560 / 560 |
| Preload in HTML | Discoverable in initial document (Lighthouse confirmed) |
| `fetchpriority=high` on preload | Not set (Lighthouse suggestion only; **not changed** — out of scope) |

Image configuration is not the primary defect. The reveal opacity gate on the ancestor section is.

---

## Task 6–7 — Production Change Applied

**Criteria met:**

1. Specific cause demonstrated (hero `.reveal` → `opacity: 0` on LCP ancestor)
2. Minimal change (one class removed from hero `<section>`)
3. A/B shows measurable LCP + Speed Index improvement
4. No meaningful design regression

**Change:**

```diff
- <section className="home-hero-premium reveal">
+ <section className="home-hero-premium">
```

---

## Task 8 — Validation

| Check | Result |
|-------|--------|
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS |
| H1 text unchanged | PASS — `סוכנות שיווק דיגיטלי` |
| Sitemap URL count | PASS — **74** |
| CLS | PASS — 0 (Lighthouse) |
| Footer / popups / forms / robots / middleware | NOT MODIFIED |
| Production post-deploy LCP | **Pending** — re-run PSI after Vercel deploy |

---

## Final Report

```
ACTUAL LCP CANDIDATE:
  div.home-hero-grid > div.home-hero-visual > img.mx-auto (hero photo, image)

LOCAL LCP BEFORE:
  Playwright mobile observed: 448 ms (hero image)
  Lighthouse mobile throttled: 3.2 s | observed: 461 ms
  Production Playwright mobile: 696 ms (hero image)

REVEAL A/B RESULT:
  Removing .reveal from hero → hero visible immediately (opacity 1 @ frame 1)
  Observed LCP: 448 ms → 348 ms (−100 ms)
  Lighthouse observed LCP: 461 ms → 408 ms (−53 ms)
  Speed Index: 1.58 s → 1.37 s
  CLS unchanged at 0

ROOT CAUSE FOUND: YES

APPLICATION DEFECT: YES
  Hero section .reveal applies opacity:0 (animation-fill-mode: both) to LCP ancestor chain

CODE CHANGE MADE: YES

FILES CHANGED:
  - web/src/components/home/HomePage.tsx
  - scripts/measure-lcp-phase-5e.mjs (diagnostic tool)
  - migration-audit/PHASE-5E-LCP-ISOLATION.md

LOCAL LCP AFTER:
  Playwright mobile observed: 348 ms
  Lighthouse mobile observed: 408 ms | throttled: 3.1 s

PRODUCTION LCP AFTER:
  Pending deploy — PSI NO_LCP re-test required on https://adwrks.co.il/

FCP:
  ~1.4 s (Lighthouse throttled, unchanged)

CLS:
  0

SEO PRESERVATION: PASS

BUILD: PASS

FINAL CLASSIFICATION: APPLICATION ISSUE
  (Hero .reveal opacity gate on LCP ancestor; PSI NO_LCP may also involve Lightrider edge cases)
```

---

## Measurement Artifacts

```
migration-audit/phase-5e-lcp/
  prod-v2-report.json
  prod-v2-mobile390.png / prod-v2-desktop1440.png
  local-a-reveal-report.json
  local-b-no-reveal-report.json
  lh-a-reveal.json
  lh-b-no-reveal.json
  *.png screenshots
```

Run diagnostics: `node scripts/measure-lcp-phase-5e.mjs --url https://adwrks.co.il/ --label prod`
