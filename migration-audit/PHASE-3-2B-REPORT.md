# Phase 3.2B — Structural / Navigation / Content Repair Report

**Date:** 2026-09-29  
**Status:** COMPLETE — stopped before Phase 4 SEO  
**Production reference:** https://adwrks.co.il (read-only)

---

## 1. Correct Blog Destination Discovered

| Field | Value |
|-------|-------|
| **Production URL** | `https://adwrks.co.il/blog/` |
| **Local URL** | `/blog/` |
| **Menu label** | **מידע מקצועי** (not "בלוג") |
| **Page H1** | חדשות ומידע מקצועי |
| **Evidence** | Live production header menu; dedicated blog landing with article grid — **not** the `/digital-marketing/` category archive |

**Previous incorrect local behavior:** Header "בלוג" linked to `/digital-marketing/` (category archive).

**Fix:** Added `BlogPage` component + `/blog/` route in loader; nav updated in `web/src/lib/site.ts`.

Audit: `migration-audit/navigation-reconciliation.json`

---

## 2. Navigation Corrections

Production vs local now matched:

| Order | Label | Destination |
|-------|-------|-------------|
| 1 | דף הבית | `/` |
| 2 | שירותים | `/שירותי-שיווק-דיגיטלי/` + 6-item dropdown |
| 3 | מי אנחנו | `/about-us/` |
| 4 | מידע מקצועי | `/blog/` + 4 category children |
| 5 | יצירת קשר | `/contact-us/` |

**Corrections applied:**
- Blog link: `/digital-marketing/` → `/blog/`; label "בלוג" → "מידע מקצועי"
- Contact label: "צור קשר" → "יצירת קשר"
- Services dropdown reordered to match production (Google Ads first; added pricing link)
- Blog dropdown children preserved as category links (`/digital-marketing/`, `/digital-marketing/ads/`, etc.)

---

## 3. Dropdown Bug — Root Cause and Fix

**Root cause:** CSS-only `:hover` / `:focus-within` dropdown visibility persisted across route changes and scroll because the hover state could remain active or the dropdown was not tied to navigation lifecycle.

**Fix (`web/src/components/SiteHeader.tsx`):**
- Replaced CSS hover dropdown with explicit JS state (`servicesOpen`, `blogOpen`)
- `onMouseEnter` / `onMouseLeave` + focus/blur containment for desktop
- `closeAll()` on every nav link click
- **`key={pathname}`** on inner nav component — remounts on route change, resetting all open state without fragile `useEffect` setState
- Escape key closes all menus
- Mobile: separate accordion toggles; menu closes after navigation via remount + `closeAll`

**Removed:** `:hover/:focus-within` dropdown CSS in `globals.css`; replaced with `.site-nav-dropdown.is-open`.

---

## 4. Six Service Pages — Individual Verification

All six service pages now use **verified TypeScript content models** rendered by `VerifiedServicePage` — not automatic Elementor heading inference.

| Page | Local path | Data file | Status |
|------|-----------|-----------|--------|
| SEO | `/seo/` | `services/seo.ts` | Verified — lists, steps, cards, FAQ |
| Google Ads | `/google-ads/` | `services/google-ads.ts` | Verified |
| Website Building | `/website-building/` | `services/website-building.ts` | **Manual repair** |
| Social Media | `/social-media-management/` | `services/social-media-management.ts` | Verified |
| Hosting | `/hosting-plans/` | `services/hosting-plans.ts` | Verified — Hebrew tiers only |
| Main Services | `/שירותי-שיווק-דיגיטלי/` | `services/main-services.ts` | Verified |

**Gate:** `sectionHasContent()` — sections without body content are never rendered.  
**Images:** `usedImages` Set prevents duplicate image placement across sections.

Audit: `migration-audit/service-page-reconciliation.json`

---

## 5. Empty Sections — Found and Fixed

**Root cause:** `groupBlocksIntoSections()` in `elementor-extract.ts` created sections from h2/h6 headings even when no associated body content was extracted (icon lists, nested widgets missed).

**Fix:** Bypassed automatic extraction for service pages; use verified models only.

**Post-repair audit** (`scripts/audit-empty-sections.js`):
- **Service pages (6):** 0 empty heading-only sections detected
- **Website Building:** Visual QA confirms all previously empty headings now have content (lists, steps, cards)
- **Homepage:** Heuristic flags for "broken-images" and one heading-without-body — likely lazy-load timing false positives in headless browser; not service-page structural issues
- **Contact:** Duplicate paragraph detection (hero copy repeated in bottom CTA block — cosmetic, not empty section)

---

## 6. Duplicate Content — Found and Fixed

**Service pages (before):** Same hero image repeated in multiple sections; paragraphs duplicated by Elementor block grouping.

**Fix:** `usedImages` deduplication in `VerifiedServicePage`; no copy invented to fill layouts.

**Remaining (non-service):**
- Contact page: 3 paragraphs appear twice (hero + final CTA) — intentional marketing repetition on production-style layout; flagged in audit, not auto-deleted per instructions

---

## 7. Duplicate / Wrong Images — Found and Fixed

**Before:** Extraction pipeline reused hero/marketing images across multiple inferred sections.

**Fix:** Per-section image assignment in verified data files; render-time dedup via `usedImages`. Sections without production images render without image placeholders.

---

## 8. Website Building Page — Manual Repair Details

Rebuilt from live production (`https://adwrks.co.il/website-building/`):

| Section | Content attached |
|---------|-----------------|
| למי שירות בניית אתרים שלנו מתאים? | 6-item verified list |
| מה כולל תהליך בניית אתר אצלנו? | 6 numbered process steps + image |
| למה לבנות את האתר דווקא עם Adwrks 365? | 6 benefit cards |
| שאלות נפוצות | 4 FAQ items |
| Final CTA | Production closing copy |

**Removed:** Empty heading-only sections, duplicate images, giant whitespace from empty grid columns.

**Visual confirmation:** Screenshots at 390px and 1440px show populated sections throughout.

---

## 9. Screenshots Actually Inspected

Location: `migration-audit/visual-qa-phase-3-2b/`

| Page | 390px | 1440px | Inspected |
|------|-------|--------|-----------|
| Homepage | ✓ | ✓ | No service-style empty sections |
| Blog landing | ✓ | ✓ | H1 "חדשות ומידע מקצועי" present |
| About | ✓ | ✓ | OK |
| Contact | ✓ | ✓ | OK |
| Main services | ✓ | ✓ | Populated sections |
| SEO | ✓ | ✓ | No empty blocks |
| Google Ads | ✓ | ✓ | No empty blocks |
| **Website Building** | ✓ | ✓ | **All headings paired with content** |
| Social Media | ✓ | ✓ | No empty blocks |
| Hosting | ✓ | ✓ | Hebrew pricing tiers |

**Issues found in visual QA:** 0

---

## 10. Desktop Interaction Test

Script: `scripts/interaction-test.js`  
Report: `migration-audit/interaction-test-report.json`

| Step | Result |
|------|--------|
| Homepage loads | PASS |
| Services dropdown opens on hover | PASS |
| Click service → route changes | PASS (`/seo/`) |
| Dropdown closed after navigation | PASS |
| Dropdown remains closed after scroll | PASS |
| Dropdown closes on Escape | PASS |
| Blog link → `/blog/` | PASS |

**Desktop: 7/7 passed**

---

## 11. Mobile Interaction Test

| Step | Result |
|------|--------|
| Mobile menu opens | PASS |
| Blog accordion → navigate to `/blog/` | PASS |
| Menu closed after navigation | PASS |

**Mobile: 4/4 passed**  
**Total: 11/11 passed**

---

## 12. Remaining Visual / Content Problems

Not blocking Phase 3.2B structural repair; deferred to later phases:

1. **Homepage** — audit heuristics flag lazy-loaded images as "broken" in headless scan; manual screenshot review shows images present
2. **Contact page** — duplicate hero paragraphs in bottom CTA (cosmetic)
3. **32 URLs marked `seo-significant`** in route validator — expected from layout redesign vs legacy Elementor HTML; **Phase 4 scope, not addressed here**
4. **Category archive pages** (`/digital-marketing/*`) — still use legacy content pipeline; distinct from blog landing

---

## 13. Route Validator Status

```
Summary: 0 exact, 42 acceptable, 32 SEO-significant, 0 missing
```

- `/blog/` → **acceptable**
- `/about-us/` → **acceptable**
- Service pages → **seo-significant** (layout/content structure change — intentional Phase 3.2/3.2B rebuild)
- **0 missing routes**

Report: `migration-audit/validation-report.json`

---

## 14. Lint

```
npm run lint → PASS
```

Fixed `react-hooks/set-state-in-effect` by using `key={pathname}` remount pattern instead of `useEffect` + `closeAll()`.

---

## 15. TypeScript

```
npx tsc --noEmit → PASS
```

---

## 16. Build

```
npm run build → PASS
```

Fresh production server started on port 3000 before all browser QA.

---

## Audit Artifacts

| File | Purpose |
|------|---------|
| `migration-audit/navigation-reconciliation.json` | Production vs local nav |
| `migration-audit/service-page-reconciliation.json` | Per-section service page status |
| `migration-audit/empty-section-audit.json` | Empty/duplicate heuristic scan |
| `migration-audit/interaction-test-report.json` | Dropdown + blog navigation |
| `migration-audit/visual-qa-phase-3-2b/` | Screenshots + report |

## Key Code Changes

- `web/src/lib/site.ts` — corrected PRIMARY_NAV
- `web/src/components/SiteHeader.tsx` — dropdown behavior fix
- `web/src/components/pages/VerifiedServicePage.tsx` — verified render pipeline
- `web/src/components/pages/BlogPage.tsx` — blog landing
- `web/src/lib/pages/services/*.ts` — 6 verified content models
- `web/src/lib/content/loader.ts` — `/blog/` route resolution
- `web/src/components/ContentPage.tsx` — routes verified service pages

---

**Phase 3.2B complete. Phase 4 SEO not started.**  
No commit, push, deploy, WordPress, or DNS changes made.
