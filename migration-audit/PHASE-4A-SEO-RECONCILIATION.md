# Phase 4A — SEO reconciliation

Local review: http://localhost:3000

Production reference: https://adwrks.co.il (read-only)

Phase 4B was not started. No commit, push, deploy, DNS change, or production WordPress change. Staging noindex was left in place.

## A. Scope

74 intended sitemap URLs. Live production HTML was compared with the local Next.js site for every URL. The Rank Math sitemap (post, page, category) is the reconciliation set. Tag archives, media attachments, feeds, and Elementor utility URLs were not added.

## B. Before reconciliation

First pass on the current codebase, before the metadata fixes:

| Result | Count |
|---|---|
| SEO-significant | 73 |
| Needs manual review | 1 |
| Missing / 404 | 0 |
| Title mismatches | 0 |
| Canonical host errors | 0 |

The older Phase 3.2 validator reported 27 SEO-significant URLs. Those were mostly heading and layout differences after the Elementor rebuild, not missing routes. This pass rechecked them against live production. They were not assumed gone and not assumed still broken.

Shared causes on the first pass:

- `og:type` was `website` on 73 URLs where production emits `article`
- 7 legacy service URLs with an empty production description inherited the site-wide fallback description
- 14 URLs with no production OG image inherited the default social image
- One description differed only by Next.js encoding `'` as `&#x27;`

## C. Root causes

1. **Shared metadata helper.** `buildPageMetadata` forced `og:type=website`, filled empty descriptions from `SITE.description`, and filled missing OG images from the default asset.
2. **Duplicate organization schema.** The root layout emitted a second Organization object on top of the Rank Math JSON-LD already injected per page.
3. **Heading DOM.** Local templates do not reproduce Elementor H2/H3 trees. That is a layout difference, not lost metadata.
4. **Homepage H1.** Phase 3 replaced the production H1 with the current hero line. That wording was left as-is.
5. **One real redirect.** Production returns 308 from `/plans/` to `/hosting-plans/`. Local previously returned 404.

## D. Fixes performed

- `web/src/lib/content/metadata.ts`
  - Canonicals stay on `https://adwrks.co.il`. Localhost, www, and other hosts are replaced with the production URL.
  - Empty production descriptions are no longer replaced with the site description.
  - OG/Twitter images are emitted only when production has one.
  - `og:type` is `website` on `/` and `article` on every other intended URL, matching Rank Math.
- `web/src/app/layout.tsx` — removed the extra global Organization JSON-LD. Page-level production schema remains.
- `web/next.config.ts` — permanent redirect `/plans` → `/hosting-plans/` (observed production 308).
- `web/src/components/home/HomePage.tsx` — space after the homepage H1 line break so the accessible name is not `Adwrks 365שיווק`. The designed wording was not changed.

## E. Metadata

After the fixes, across all 74 URLs:

- Titles: exact match with live production. No audit-vs-live title conflicts.
- Meta descriptions: no mismatches. Pages that are empty in production stay empty.
- Canonicals: production host, self-referencing, no localhost or Vercel URLs.
- Robots: local/staging still sends `noindex, nofollow` and `Disallow: /`. That is environment protection. Intended production robots remain the live directives (`index, follow`, plus the Rank Math snippet settings). Production mode turns staging robots off only when `VERCEL_ENV=production`.

## F. Headings and content

- 73 URLs: one primary H1, matching production after HTML-entity normalization.
- Two articles keep a single H1 where production Elementor also printed a second H1. The extra H1 was not restored.
- Homepage H1 is the Phase 3 line: `Adwrks 365 שיווק דיגיטלי, ביצועים ו-SEO`. Production is `Adwrks 365 סוכנות שיווק דיגיטלי ואסטרטגיית צמיחה`. Not rewritten.
- H2/H3 trees differ from Elementor. Recorded as an implementation difference. Copy was not rewritten for keywords.
- Article bodies still render the migrated HTML. This pass did not rewrite posts.

## G. Internal links

| Finding | Count |
|---|---|
| Localhost / Vercel links | 0 |
| WordPress feed/tag/author endpoints in local content | 0 |
| Unresolved local links | 3 |
| `catalog.adwrks.co.il` links | 10, left external |

Unresolved, all on `/מחירון-שיווק-דיגיטלי/`:

- `/קידום-אורגני/` — 404 on production and locally
- `/website-design/` — 404 on production and locally
- `/landing-page/` — production 200, noindex attachment; local 404

`/plans/` now redirects and is no longer unresolved.

Equivalent absolute-to-relative and trailing-slash differences were not treated as failures.

## H. Images

Image rendering was not changed. The Phase 3.3I audit remains the image check: 74 URLs, 1,017 rendered images, 0 broken. ALT text was not rewritten. OG images now follow production: present where production has one, absent where production has none.

## I. Schema

Production Rank Math JSON-LD is still injected per page. Types matched live production after the extra layout Organization block was removed. No AggregateRating, fake reviews, fake FAQ, or new offer schema was added. FAQ schema is only present where it already existed in the captured production graph.

Rank Math breadcrumbs are off. Visible breadcrumbs were not added for SEO.

## J. Sitemap and robots

Live production sitemap and the local sitemap both contain the same 74 URLs. Missing: 0. Extra: 0. No tag, attachment, feed, or pagination URLs.

Production `robots.txt` is allow-all and does not print a Sitemap line. Local staging `robots.txt` disallows everything. The production-deploy robots file allows crawling and points at `https://adwrks.co.il/sitemap.xml`.

Tag sitemap is off in Rank Math. Tag archives were not added. Author archives are noindex in Rank Math and date archives are disabled. This site does not expose those routes.

## K. Redirects

See `migration-audit/redirect-reconciliation.json`.

- Implemented: `/plans/` → `/hosting-plans/` (308 locally, matching production).
- Not implemented: www → non-www. Canonicals are already non-www. The host redirect belongs to launch.
- Not invented: homepage catch-alls, attachment pages, or redirects for URLs that already 404 on production.

## L. Remaining differences

No unresolved SEO-significant metadata differences on the 74 URLs.

Still different, on purpose:

- Staging noindex / `Disallow: /`
- Homepage H1 wording
- H2/H3 structure versus Elementor
- `/landing-page/` attachment is 404 locally
- Two pre-existing 404 links on the pricing page

## M. Post-migration SEO opportunities

Not implemented:

- Decide whether the homepage H1 should return to the old production sentence after launch.
- Add a Sitemap line only if you want robots.txt to advertise it; production currently does not.
- Repair or retarget the pricing-page links that already 404 on production.
- www → non-www redirect at the host, during launch.

## N. Technical validation

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass |
| Reconciliation | 74 URLs, 0 missing, 0 SEO-significant, 73 semantically preserved, 1 manual review |
| `/plans/` | 308 → `/hosting-plans/` |

## Manual review

1. Homepage H1 wording versus the current production H1.
2. Whether `/landing-page/` (noindex attachment) should stay a 404 or point at an existing page.
3. Pricing-page links `/website-design/` and `/קידום-אורגני/` already 404 on production.
4. At launch, enforce www → `https://adwrks.co.il`. Not part of this phase.

## Artifacts

- `migration-audit/seo-reconciliation-matrix.json`
- `migration-audit/sitemap-reconciliation.json`
- `migration-audit/internal-link-reconciliation.json`
- `migration-audit/redirect-reconciliation.json`
- `migration-audit/phase-4a-summary.json`

**STOP — Phase 4A complete. Awaiting manual review.**
