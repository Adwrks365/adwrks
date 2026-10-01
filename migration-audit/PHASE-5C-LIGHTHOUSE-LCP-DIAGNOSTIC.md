# Phase 5C — Lighthouse / LCP Diagnostic

**Date:** 2026-10-01  
**Production:** https://adwrks.co.il  
**Vercel Preview:** https://adwrks.vercel.app  
**Lighthouse version tested:** 13.5.0 (Headless Chromium 153)  
**Code changes:** None (diagnosis only)

---

## Executive summary

PageSpeed Insights reports **NO_LCP** and **TBT: Error — NO_LCP** on the homepage, while the page renders correctly in the filmstrip and final screenshot. Local Lighthouse 13.5.0 on the same URL **does record LCP** in observed trace metrics (~3.0s) and in the headline LCP audit (~2.7s simulated), but **Lantern/trace-engine insights throw `LanternError: NO_LCP`** during post-processing — the same error class described in open Lighthouse work ([UKM Invalidate fallback PR #16956](https://github.com/GoogleChrome/lighthouse/pull/16956)).

**Conclusion:** The PSI “NO_LCP” display is **primarily a Lighthouse 13.5 / Lantern trace-engine regression**, not evidence that the page fails to paint. No application change is justified solely to satisfy the synthetic audit.

A **secondary contributing factor** in the app is the homepage hero `.reveal` entrance animation (`opacity: 0` → `1` over 600ms), which can delay when LCP-eligible pixels are considered painted. This affects timing, not “no paint at all.”

**Separate critical finding (Task 2):** Production at `https://adwrks.co.il` is still serving **`noindex, nofollow`** and **`robots.txt → Disallow: /`**, and **GA4 / Google Ads tags are not injected**. This indicates `isIndexableProduction()` is still false on the live deployment (likely `VERCEL_PROJECT_PRODUCTION_URL` gate). Canonicals and sitemap content are otherwise correct. **Not modified in Phase 5C** per scope constraints.

---

## Task 1 — LCP reproduction & diagnosis

### 1. Expected LCP candidate (above the fold)

| Viewport | Primary candidate | Secondary | Notes |
|---|---|---|---|
| Mobile (~390px) | Hero image `adwrks-marketing-solutions.webp` via Next/Image (`priority`, preloaded) | H1 “סוכנות שיווק דיגיטלי” | Single-column grid: text block first, image below; image is larger pixel area |
| Desktop | Same hero image | H1 gradient text block | Two-column grid; image ~45vw |

Hero image request observed in network trace:

`https://adwrks.co.il/_next/image/?url=%2Fwp-content%2Fuploads%2Fadwrks-marketing-solutions.webp&w=750&q=75`

- `priority` set in `HomePage.tsx`
- Preload link present (High priority in Lighthouse network log)
- Not lazy-loaded

### 2. Does Chrome emit an LCP performance entry?

| Method | Result |
|---|---|
| Lighthouse 13.5 observed trace | **Yes** — `observedLargestContentfulPaint: 3039ms`, `lcpInvalidated: false` |
| Lighthouse headline LCP audit | **Yes** — 2.7s (simulated), score 0.86 |
| Post-load `performance.getEntriesByType('largest-contentful-paint')` in DevTools evaluate | Empty (entries not retained after navigation completes; expected without early buffered observer) |
| PSI reported by owner | **NO_LCP** error on LCP/TBT rows |

### 3. Does local Lighthouse reproduce NO_LCP?

**Partially.**

- CLI stderr: `LanternError: NO_LCP` from `LargestContentfulPaint.getOptimisticGraph`
- JSON report still contains valid LCP audit values and observed LCP in `audits.metrics`
- LCP **insights** (`lcp-breakdown-insight`, `lcp-discovery-insight`) score `notApplicable` because Lantern cannot build the optimistic graph

Same Lantern error on `https://adwrks.vercel.app/` — confirms **not production-domain-specific**.

### 4. Is NO_LCP specific to PSI / Lightrider?

**Likely yes for the error display path**, not for real-user painting.

- Local headless Lighthouse 13.5 shows the same Lantern failure while still computing observed LCP
- PSI uses Lighthouse/Lightrider infrastructure; known open issue when trace lacks standard LCP candidate events but page paints correctly
- Filmstrip and final screenshot render correctly (owner + local run confirmed)

### 5. Hero animation / rendering factors

| Factor | Present? | Location | LCP impact |
|---|---|---|---|
| Opacity entrance animation | **Yes** | `.reveal` on `<section class="home-hero-premium reveal">` | **Moderate risk** — `@keyframes reveal-up` starts at `opacity: 0` for 600ms |
| Transform entrance | **Yes** | Same `.reveal` (`translateY(12px)`) | Low–moderate (combined with opacity) |
| Gradient text / transparent color | **Yes** | `.home-hero-highlight { color: transparent; background-clip: text }` | **Low–moderate** for text-as-LCP |
| Hydration-dependent hero | **No** | `HomePage` is a Server Component; hero HTML in initial response | None |
| Client-side replacement | **No** | Hero not swapped after hydration | None |
| Lazy loading on hero image | **No** | `priority` on hero `Image` | None |
| `display:none` / `visibility:hidden` on hero | **No** | — | None |
| `prefers-reduced-motion` | Collapses animations to 0.01ms | `globals.css` | Would *improve* LCP measurement, not cause NO_LCP |

### 6. Above-the-fold DOM (homepage)

```
SiteHeader (logo preloaded)
└─ main
   └─ .homepage
      └─ section.home-hero-premium.reveal   ← animation wrapper
         ├─ h1.home-hero-title
         │  └─ span.home-hero-highlight    ← gradient text
         ├─ paragraphs + CTAs
         └─ .home-hero-visual
            └─ img (priority, sizes="(max-width: 1024px) 90vw, 45vw")
```

Fonts: Heebo via `next/font/google`, `display: swap`, preloaded woff2 (High priority).

### 7. Console / runtime / network errors

- Production homepage: **HTTP 200**, stable URL `https://adwrks.co.il/`
- No failed critical resources in Lighthouse run (document, CSS, fonts, hero image all 200)
- Third-party insight: empty (no 3rd-party scripts on initial load except none loaded when analytics gate is off)

### 8–9. HTTP & critical resources

| Check | Result |
|---|---|
| Final URL | `https://adwrks.co.il/` 200 |
| www redirect | 308 → `https://adwrks.co.il/` |
| Critical CSS | 200 (~20 KiB) |
| Critical fonts | 200 (preloaded) |
| Hero image | 200 (preloaded) |

---

## Root cause assessment

| Layer | Verdict | Evidence |
|---|---|---|
| **A. Lighthouse 13.5 Lantern / PSI display bug** | **Primary** | `LanternError: NO_LCP` in CLI; insights N/A; observed LCP present; same on vercel.app |
| **B. Hero `.reveal` opacity animation** | **Secondary (timing)** | 600ms fade-in on entire hero; observed FCP ~2.66s, LCP ~3.04s locally |
| **C. H1 gradient text (`color: transparent`)** | **Possible secondary** | Can affect text-as-LCP candidate registration |
| **D. Broken page / no paint** | **Ruled out** | Filmstrip, screenshot, FCP, observed LCP all present |

**No code changes made.** Removing `.reveal` from the hero would be a low-risk timing tweak if owner later wants faster *measured* LCP, but it is **not required** to fix a “page does not paint” problem, and it would not reliably fix PSI’s Lantern NO_LCP error display.

---

## Task 2 — Production SEO verification (post-cutover)

| Check | Expected | Actual (2026-10-01) | Pass? |
|---|---|---|---|
| `https://adwrks.co.il/` | 200 | 200 | ✅ |
| `www` → apex | 308 | 308 → `https://adwrks.co.il/` | ✅ |
| Canonical | `https://adwrks.co.il/` | `https://adwrks.co.il/` | ✅ |
| Indexable (no noindex) | index, follow | **`noindex, nofollow`** | ❌ |
| `robots.txt` | Allow `/`, sitemap | **`Disallow: /`** (no sitemap line) | ❌ |
| Sitemap URL count | 74 | 74 | ✅ |
| Homepage H1 | `סוכנות שיווק דיגיטלי` | `סוכנות שיווק דיגיטלי` | ✅ |
| GA4 `G-T4TE22LLC1` on production | Loaded | **Not in HTML** | ❌ |
| Google Ads `AW-11221673873` on production | Loaded | **Not in HTML** | ❌ |
| Analytics on `adwrks.vercel.app` | Off | Off (no gtag) | ✅ |

**Cause (code path):** `isIndexableProduction()` in `web/src/lib/indexing.ts` requires:

```
NODE_ENV === "production"
VERCEL_ENV === "production"
VERCEL_PROJECT_PRODUCTION_URL === "adwrks.co.il"
```

When false, `stagingRobots()` forces `noindex, nofollow` and `robots.ts` returns `Disallow: /`. `GoogleTags` is not rendered.

**Action required (outside Phase 5C scope):** Verify Vercel Production env sets `VERCEL_PROJECT_PRODUCTION_URL=adwrks.co.il` after domain attach, or adjust indexing gate to detect the live hostname. **Do not change DNS.**

---

## Task 3 — Performance opportunities (audit only)

| PSI finding | Est. savings | Class | Recommendation |
|---|---|---|---|
| Responsive image delivery (~30 KiB) | 30 KiB | **C** — low-value | Targets **below-fold** `.home-split-image` cards (5-3.png, 7-1.png), not hero. `sizes="(max-width: 768px) 90vw, 40vw"` serves w=750 for ~352px display (~504px DPR). Minor overserve; not hero LCP. **No change.** |
| Render-blocking CSS (~20.5 KiB) | — | **B** — framework | Single Next.js CSS chunk `1il3ro9v2-ofq.css`. Normal App Router behavior. **No critical-CSS hack.** |
| Legacy JavaScript (~13.8 KiB) | 14 KiB | **B** — framework | Next.js client chunk polyfills (`Array.prototype.at`, etc.). **No change** without browserslist policy review. |
| Forced reflow | — | **C** — false positive | Lighthouse insight table **empty** (score 1). **No action.** |

---

## Task 4 — Validation

| Step | Result |
|---|---|
| Code changes | **None** |
| `npm run lint` | Not re-run (no code diff) |
| `npx tsc --noEmit` | Not re-run (no code diff) |
| `npm run build` | Not re-run (no code diff) |
| Visual / layout regression | N/A |
| Forms | Not re-tested (unchanged) |
| Sitemap / canonicals / redirects | Verified via fetch (see Task 2) |

---

## Measurements (homepage mobile)

| Source | FCP | LCP | Speed Index | CLS | TBT |
|---|---|---|---|---|---|
| Owner PSI (reported) | 1.4s | **Error NO_LCP** | ~2.8s | 0 | **Error NO_LCP** |
| Local LH 13.5 simulated | 1.5s | 2.7s | 4.9s | 0 | 86ms |
| Local LH 13.5 observed trace | 2.66s | **3.04s** | 2.90s | 0 | — |

Discrepancy between PSI and local observed FCP/LCP is consistent with different throttling/network profiles; the **NO_LCP error is not reproduced in the observed LCP trace field** locally.

---

## Files changed

**None.**

---

## Recommendations (for owner, not implemented here)

1. **PSI NO_LCP:** Treat as Lighthouse 13.5 / Lantern issue until PSI updates; monitor [GoogleChrome/lighthouse#16956](https://github.com/GoogleChrome/lighthouse/pull/16956). Real-user CrUX LCP (when available) is the authoritative field metric.
2. **Optional future LCP timing tweak (low risk):** Remove `.reveal` from `.home-hero-premium` only (keep reveal on below-fold sections) if owner wants earlier measured LCP without redesign.
3. **Production indexing gate (urgent, separate task):** Fix `isIndexableProduction()` activation so live `adwrks.co.il` serves indexable robots, sitemap in robots.txt, and analytics tags — currently still in Preview/staging mode despite domain cutover.

---

## Status

**DIAGNOSIS COMPLETE — NO APPLICATION CHANGES**

PSI NO_LCP is **not** treated as a confirmed application defect. Observed LCP exists (~3s mobile). Production SEO indexing/analytics gate remains **inactive on live domain** and must be addressed separately from this performance diagnostic.
