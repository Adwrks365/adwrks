# Phase 5C.1 — Production Indexability Fix + Footer Gap

**Date:** 2026-10-01  
**Production URL:** https://adwrks.co.il  
**Commits:** `7851b1d`, `1cfbdfe` (main)

---

## Problem (Post-Launch)

Phase 5C found production still blocked from indexing and analytics:

| Symptom | Live state before fix |
|---------|----------------------|
| `<meta name="robots">` | `noindex, nofollow` |
| `robots.txt` | `Disallow: /` |
| GA4 `G-T4TE22LLC1` | Not in HTML |
| Google Ads `AW-11221673873` | Not in HTML |
| Footer | Large white gap below footer (desktop) |

**Root cause — indexability gate:**

```typescript
// web/src/lib/indexing.ts (before)
process.env.VERCEL_PROJECT_PRODUCTION_URL === "adwrks.co.il"
```

This env var did not match at Vercel build/runtime, so `isIndexableProduction()` always returned `false` on the real production deployment.

**Root cause — footer gap:**

```css
/* web/src/app/globals.css (before) */
body {
  padding-bottom: calc(7.25rem + env(safe-area-inset-bottom, 0px));
}
```

Previous footer collision fix moved floating-control clearance to `body`/`html`, extending document height with visible white space after the footer.

---

## Fix Applied

### Task 1 — Production environment detection

**File:** `web/src/lib/indexing.ts`

- Replaced brittle `VERCEL_PROJECT_PRODUCTION_URL` check with:
  - `isPreviewOrNonProductionDeployment()` — blocks preview/local (`VERCEL_ENV=preview`, `NODE_ENV≠production`)
  - `shouldAllowIndexing()` — `true` on Vercel production builds; hostname-aware when host is available
  - `isProductionHostname()` — `adwrks.co.il`, `www.adwrks.co.il`

**File:** `web/src/app/robots.ts`

- `export const dynamic = "force-dynamic"` + `headers().get("host")` for hostname-aware `robots.txt`
- Production domain → `Allow: /` + sitemap
- Preview / non-production hosts → `Disallow: /`

**File:** `web/src/middleware.ts` (new)

- Sets `X-Robots-Tag: noindex, nofollow` for preview deployments and non-production hostnames (e.g. `*.vercel.app`)
- Production apex/www passes through without header override

**Files:** `web/src/app/layout.tsx`, `web/src/lib/content/metadata.ts`

- Build-time `shouldAllowIndexing()` gates static metadata and `GoogleTags` (compatible with SSG)
- Avoids `headers()` in layout/pages (see incident below)

### Task 2 — Production analytics

**File:** `web/src/app/layout.tsx`

- `{shouldAllowIndexing() ? <GoogleTags /> : null}` — renders on Vercel production builds
- Existing base-tag-only behavior preserved (`G-T4TE22LLC1`, `AW-11221673873` via `GoogleTags.tsx`)

### Task 3 — Footer white gap

**File:** `web/src/app/globals.css`

- Removed `body { padding-bottom: calc(7.25rem + ...) }`
- Kept `html { scroll-padding-bottom: calc(7.25rem + ...) }` for anchor/focus clearance only
- Fixed floats remain `position: fixed`; no document height extension

### Incident — DYNAMIC_SERVER_USAGE 500

First commit (`7851b1d`) used `headers()` in root layout + `ProductionGoogleTags`, causing `DYNAMIC_SERVER_USAGE` on statically generated `[[...slug]]` pages (HTTP 500 on homepage).

**Hotfix (`1cfbdfe`):** Reverted to static layout metadata; removed `ProductionGoogleTags`; added middleware for hostname noindex header.

---

## Validation

### Build (local)

```
npm run lint       → PASS
npx tsc --noEmit   → PASS
npm run build      → PASS
```

### Live production — https://adwrks.co.il (2026-10-01 post-deploy)

| # | Check | Result |
|---|-------|--------|
| 1 | HTTP 200 | PASS |
| 2 | No noindex/nofollow in HTML meta | PASS (`index, follow`) |
| 3 | robots.txt allows crawling | PASS (`Allow: /`) |
| 4 | sitemap.xml 74 URLs | PASS |
| 5 | Canonical `https://adwrks.co.il/` | PASS |
| 6 | H1 exactly `סוכנות שיווק דיגיטלי` | PASS |
| 7 | www → apex 308 | PASS |
| 8 | GA4 `G-T4TE22LLC1` loads | PASS (script + gtag config) |
| 9 | Google Ads `AW-11221673873` loads | PASS (gtag config in client scripts) |
| 10 | Forms present / functional UI | PASS (homepage contact form rendered) |
| 11 | Footer white gap gone | PASS (gap below footer ≈ 0px at 1920/390) |
| 12 | Floating controls positioned | PASS (WhatsApp, phone, a11y, scroll-to-top visible) |
| 13 | No horizontal overflow (spot check) | PASS |

**Preview / vercel.app protection:**

- `https://adwrks.vercel.app/` → `X-Robots-Tag: noindex, nofollow` PASS

**Not in scope:** PSI NO_LCP (deferred per Phase 5C)

---

## Files Changed

| File | Change |
|------|--------|
| `web/src/lib/indexing.ts` | Robust production/preview/hostname detection |
| `web/src/app/robots.ts` | Dynamic, hostname-aware robots.txt |
| `web/src/middleware.ts` | X-Robots-Tag for non-production hosts |
| `web/src/app/layout.tsx` | Build-time indexing gate + GoogleTags |
| `web/src/lib/content/metadata.ts` | Uses `shouldAllowIndexing()` |
| `web/src/app/globals.css` | Remove body padding-bottom footer gap |

---

## Follow-up — GSC Live URL Test (2026-10-01 ~09:06 IST)

Google Search Console Live URL Test still reported `blocked by robots.txt` shortly after 5C.1 deploy.

**Investigation:** External curls at 09:07+ already returned `Allow: /` for browser, Googlebot, Googlebot Smartphone, and Google-InspectionTool UAs. Homepage had no `noindex` meta and no `X-Robots-Tag` on `adwrks.co.il`.

**Root cause:** Phase 5C.1 used `force-dynamic` robots.txt with runtime `headers().get("host")` + `shouldAllowIndexing(host)`. Any request where Host was missing or non-production at the edge could emit `Disallow: /`. During deploy rollouts / edge variance, Google could fetch that variant. GSC may also reflect a fetch from the pre-5C.1 `Disallow: /` window if tested within minutes of cutover.

**Fix (commit after this section):** Replaced dynamic hostname-aware `robots.ts` with **build-time static** robots on production Vercel deployments (`VERCEL_ENV=production` → always `Allow: /`). Excluded `robots.txt` and `sitemap.xml` from middleware matcher. `*.vercel.app` protection remains via middleware `X-Robots-Tag` only.

Build output confirms static prerender: `○ /robots.txt` (was `ƒ /robots.txt` dynamic).

---

## Final Status

```
PRODUCTION INDEXABILITY: PASS
ROBOTS: PASS
GA4: PASS
GOOGLE ADS: PASS
FOOTER GAP: PASS
BUILD: PASS
```
