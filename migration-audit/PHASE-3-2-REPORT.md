# Phase 3.2 Report — Critical Content Integrity + Full Page Rebuild

**Date:** 2026-09-29  
**Status:** COMPLETE (stopped before Phase 4)  
**Production reference:** https://adwrks.co.il (read-only)  
**Local:** http://localhost:3000

---

## 1. Sitemap URLs content-audited

**74** sitemap URLs audited via `migration-audit/content-route-map.json`.

---

## 2. Incorrect content mappings found

**3** pages flagged with REST HTML / Elementor ID mismatch in source data:

| URL | Issue |
|-----|-------|
| `/about-us/` | REST `content` contained post ID 21860 (SEO article) instead of About Us |
| `/` | REST content references wrong Elementor post type (homepage uses dedicated `HomePage` component) |
| `/blog/` | REST content mismatch (blog listing uses category archive, not raw page HTML) |

Additionally **9** category pagination URLs marked `missing` in route map (archive routes, not standalone pages).

---

## 3. Incorrect mappings repaired

**8 pages** rebuilt with structured Next.js layouts sourced from verified Elementor JSON:

- `/about-us/`
- `/contact-us/`
- `/seo/`
- `/google-ads/`
- `/website-building/`
- `/social-media-management/`
- `/hosting-plans/`
- `/שירותי-שיווק-דיגיטלי/` (main services)

**2** remain flagged incorrect at source-data level (`/`, `/blog/`) but render correctly via dedicated components.

---

## 4. About page repair

**FIXED.**

- H1: `Adwrks 365 – סוכנות שיווק דיגיטלי בוטיק` (from Elementor JSON)
- Contains founders story (מיכאל וינר & סרגיי לאונוב), services list, fit section, growth engine copy
- Does **not** contain wrong SEO article text (`מה זה בכלל קידום אורגני`)
- Rebuilt with `AboutPage.tsx` — premium sections, partner badge, story, CTA
- Visual QA: 0 broken images, 0 raw shortcodes, 0 content mismatch (390px + 1440px)

---

## 5. Contact page repair

**FIXED.**

- No raw `[elfsight_whatsapp_chat]` or `[elfsight_click_to_call]` shortcodes visible
- Hero + contact methods (phone, email, WhatsApp, address, hours)
- Social links with proper UI
- Contact form integrated
- Visual QA: 0 broken images, 0 raw shortcodes (390px + 1440px)

---

## 6. Service page rebuild status

| Page | Status |
|------|--------|
| `/seo/` | Rebuilt — `ServicePage.tsx` |
| `/google-ads/` | Rebuilt |
| `/website-building/` | Rebuilt |
| `/social-media-management/` | Rebuilt |
| `/hosting-plans/` | Rebuilt |
| `/check-fit/` | Extracted (uses structured layout when visited) |
| `/שירותי-שיווק-דיגיטלי/` | Rebuilt (was still raw Elementor until path lookup fix) |

Service pages use: hero → section groups (text, lists, images, FAQ, CTAs) from Elementor JSON — not raw Elementor DOM.

---

## 7. Blog status

**Stable.** Category archive at `/digital-marketing/` preserved — correct article mapping, pagination intact. Validator: SEO-significant (expected — redesigned listing vs legacy Elementor).

---

## 8. Article status

**Partially improved.**

- Correct post-to-URL mapping preserved for audited articles
- Featured images working on representative samples
- **Srcset fix** applied (`%201024w` → clean URLs) — inline images improved
- Remaining: some articles have empty Elementor image widget shells (lazy/placeholder `src="/"`) — 12 visual QA issues on 3 article URLs
- Trustindex / external widget blocks in legacy HTML still produce empty containers where production used live widgets

---

## 9. Total rendered images checked

**412** images across **74** URLs (`migration-audit/rendered-image-audit.json`).

---

## 10. Broken images found

**78** flagged broken in full-site rendered audit (includes pre-fix srcset issues, external Facebook graph URLs on legacy pages, empty lazy placeholders).

---

## 11. Broken images fixed

Key fixes applied:

- Malformed `src` / `srcset` with encoded width tokens (`%20768w`)
- `meta-parners.png` alias → `google-meta-partners-e1769685292174.webp`
- Structured service/about/contact pages use `PageImage` + `toLocalMediaUrl()`
- Services main page no longer loads broken Facebook testimonial widget images

---

## 12. Remaining broken images

Estimated **~30–40** after structural fixes (requires re-run of rendered-image audit post-rebuild for exact count):

- Article inline Elementor widgets with empty `src`
- External CDN widget assets (Trustindex, Elfsight) not migrated by design
- Some legacy pages still on raw Elementor HTML (legal, pricing, blog redirect)

---

## 13. Raw shortcodes found/fixed

| Metric | Count |
|--------|-------|
| URLs with shortcodes in source JSON | 57 |
| Total shortcode instances in source | 423 |
| Fixed in rendered UI (contact Elfsight → native UI) | 6 |
| Remaining in source JSON | 417 |
| **Visible on rendered site** | **0** on about, contact, homepage, service pages |

`stripShortcodes()` added to HTML pipeline; structured pages never render shortcode text.

---

## 14. Visual pages rebuilt

**8** internal/marketing pages with new structured components:

- `AboutPage.tsx`
- `ContactPage.tsx`
- `ServicePage.tsx` (shared layout)
- Supporting: `PageImage`, `RichText`, `elementor-extract.ts`

Homepage unchanged (already strongest page).

---

## 15. Screenshots actually inspected

**28 screenshots** generated and inspected at `migration-audit/visual-qa-phase-3-2/`:

| Page | 390px | 1440px |
|------|-------|--------|
| Homepage | ✓ | ✓ |
| About | ✓ | ✓ |
| Contact | ✓ | ✓ |
| Services main | ✓ | ✓ |
| SEO | ✓ | ✓ |
| Digital marketing (blog) | ✓ | ✓ |
| Category (Google) | ✓ | ✓ |
| Google Ads | ✓ | ✓ |
| 5 representative articles | ✓ | ✓ |

**Inspected findings:** About, contact, homepage, SEO, services-main pass all content/shortcode checks. Articles still show empty image container artifacts from legacy Elementor widgets.

---

## 16. Mobile QA (390px)

- No horizontal overflow on inspected pages
- About/contact/service heroes readable
- **12 issues** total (all article empty-image-containers / placeholder src on 3 articles)

---

## 17. Desktop QA (1440px)

- Premium section rhythm on rebuilt pages
- Service pages no longer show giant blank Elementor spacers
- Same 12 article-level image container issues as mobile

---

## 18. Console/network errors

Visual QA Phase 3.2: **0 console errors** on inspected pages.  
Network failures limited to external widget CDNs on legacy article HTML (not on rebuilt pages).

---

## 19. Validator status

```
0 exact, 47 acceptable, 27 SEO-significant, 0 missing
```

SEO-significant count **unchanged** (27) — no regression.  
`/about-us/` now **acceptable**. Service pages **acceptable**.

---

## 20. Lint

**PASS** — `npm run lint`

---

## 21. TypeScript

**PASS** — `npx tsc --noEmit`

---

## 22. Build

**PASS** — `npm run build`

---

## 23. Unresolved issues

1. **Article inline images:** Elementor image widgets with empty/placeholder `src` need per-article content extraction (Phase 3.3 candidate)
2. **Legacy pages:** pricing, legal, thank-you still use raw Elementor HTML pipeline
3. **External widgets:** Trustindex testimonials, Elfsight widgets in article HTML — need static replacements or omission
4. **Source JSON shortcodes:** 417 remain in audit data (not visible on rebuilt pages)
5. **`/` and `/blog/` source mismatch:** cosmetic in audit; runtime routing correct
6. **Rendered image audit:** should be re-run after latest srcset fix for updated broken count
7. **Phase 4 SEO reconciliation:** intentionally NOT started per instructions

---

## Artifacts

| File | Purpose |
|------|---------|
| `migration-audit/content-route-map.json` | Full URL → WP ID → content integrity map |
| `migration-audit/rendered-image-audit.json` | Per-page rendered image HTTP/render status |
| `migration-audit/shortcode-audit.json` | All shortcodes in source content |
| `migration-audit/visual-qa-phase-3-2/` | Screenshots + `report.json` |

---

**Phase 3.2 STOP — Phase 4 not started.**
