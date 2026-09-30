# Phase 4B — Pre-launch validation

Local site: http://localhost:3000

Production reference: https://adwrks.co.il (read-only)

Phase 4A remains the SEO baseline. This pass did not redesign pages, rewrite titles, or deploy.

**Readiness: READY FOR VERCEL PREVIEW**

Not ready for DNS cutover. The production host has not been deployed or tested.

## 1. Executive summary

All 74 intended sitemap URLs return 200 on the current local build, with production canonical hosts and staging noindex. The rendered-image audit is still 1,017 images and 0 broken. `/plans/` still 308s to `/hosting-plans/`. A missing URL returns a real 404, not another page.

Nothing in this pass is a launch blocker for a noindex Preview. Before DNS, the contact webhook, the indexing switch, the www redirect, and the analytics decision still have to be done on Vercel. Historical Rate My Post totals were recovered for all 54 sitemap articles and saved. They are not shown in the new helpfulness widget. That has to be decided before the old WordPress server is retired.

## 2. 74-URL crawl

Clean local crawl of the Rank Math sitemap set, 30 Sep 2026.

| Check | Result |
|---|---|
| URLs | 74 |
| HTTP 200 | 74 |
| Non-200 | 0 |
| Wrong-page / soft 200 | 0 |
| Staging `noindex` | 74 / 74 |
| Canonical on `https://adwrks.co.il` | 74 / 74 |
| `localhost`, `vercel.app`, or www in canonicals | 0 |
| Pages with exactly one H1 | 74 / 74 |

Metadata code for these URLs was not changed in this phase. Title, description, and Open Graph results from Phase 4A still stand.

## 3. SEO integrity

- Titles, descriptions, canonicals, and sitemap membership: unchanged from Phase 4A (0 title mismatches, 0 canonical host errors, 0 sitemap gaps).
- Open Graph type remains `website` on `/` and `article` elsewhere.
- Empty production descriptions and missing social images were not given new fallbacks.
- Legal pages `/privacy-policy/`, `/accessibility-statement/`, and `/terms-of-use/` are 200 and are linked in the footer. They are not in the 74-URL sitemap. Production marks privacy `noindex`. Local privacy has no H1; production’s H1 is `מדיניות פרטיות – adwrks.co.il`. Content is present. Not rewritten.

## 4. Homepage H1 — manual decision

Classification: **MANUAL DECISION REQUIRED**

| | Text |
|---|---|
| Production H1 | `Adwrks 365 סוכנות שיווק דיגיטלי ואסטרטגיית צמיחה` |
| Local H1 | `Adwrks 365 שיווק דיגיטלי, ביצועים ו-SEO` |
| Production `<title>` | `סוכנות שיווק דיגיטלי ⋆ Adwrks 365` |
| Local `<title>` | `סוכנות שיווק דיגיטלי ⋆ Adwrks 365` |

The title tag matches. The H1 does not.

Surrounding local hero copy:

- Badge: `סוכנות שיווק דיגיטלי • מאז 2018`
- Lead: `בונים לכם נוכחות דיגיטלית שמביאה תוצאות. סוכנות שיווק (מעטפת 360°) המתמחה בביסוס סמכות דיגיטלית מבוססת AI ו-ROI.`
- Support line: `מומחים בבניית אתרים, ניהול קמפיינים ממומנים (PPC) וקידום אורגני (SEO/AIO).`

The old H1 sentence is not present elsewhere on the local homepage. The new H1 still describes the same business (Adwrks 365, digital marketing, SEO). It is not the same sentence. It was not changed in this phase.

## 5. Sitemap

Local `sitemap.xml` uses `https://adwrks.co.il`. Phase 4A already matched live production 74 to 74, with no tags, feeds, pagination, attachments, or Elementor routes. This phase did not change sitemap code. No localhost or Vercel URLs in the sitemap sample.

## 6. Robots / indexability

Local and Preview stay noindex.

Indexing turns on only when `NODE_ENV === "production"` and `VERCEL_ENV === "production"`.

- Local `robots.txt` now: `User-Agent: *` / `Disallow: /`
- Intended production `robots.txt`: allow `/`, sitemap `https://adwrks.co.il/sitemap.xml`
- Live WordPress `robots.txt` allows crawling and does not print a Sitemap line

This switch is implementable. It is not active, and it must be confirmed on the real Production deployment before DNS. Classification: **VERIFY AFTER DEPLOYMENT BEFORE INDEXING**. Not a code blocker.

## 7. Canonicals

No production-host contamination on the 74 URLs, sitemap, or Open Graph URLs. Schema URLs in the captured Rank Math JSON-LD already use `https://adwrks.co.il`.

## 8. Redirects

`/plans/` → `/hosting-plans/` returns **308**. No redirect loop was observed.

Trailing slash, sampled:

- `/`, `/seo/`, `/about-us/`, `/blog/`, `/google-ads/`, and a Hebrew article without the slash return **308** to the slashed URL
- `/` is already the canonical form

www → non-www is not configured and was not tested against DNS. Required at launch. See the go-live checklist.

## 9. 404 behavior

`/this-page-does-not-exist-4b/` returns **404**.

After this phase the response title is `העמוד לא נמצא`, robots is `noindex`, and there is no homepage canonical. The page offers links to home and contact. It does not render another article or service. This is not a soft 404.

A custom `not-found` page was added because the previous 404 reused the homepage title and canonical. That was a real bug. It is fixed.

## 10. Internal links

Phase 4A’s three unresolved pricing-page links are unchanged:

| URL | Production | Local | Class |
|---|---|---|---|
| `/website-design/` | 404 | 404 | Expected legacy 404. Not in the sitemap. Not created. |
| `/קידום-אורגני/` | 404 | 404 | Expected legacy 404. Not in the sitemap. Not created. |
| `/landing-page/` | 200, `noindex` attachment | 404 | Not in the sitemap. Not recreated. Acceptable. |

No localhost links in page content. `catalog.adwrks.co.il` stays an external property. One article links to `http://catalog.adwrks.co.il/` and another links to `http://amiam.co.il`. Those are ordinary links, not loaded page resources.

## 11. Images / media

`node scripts/audit-rendered-images.js` against the current server:

- 74 URLs
- 1,017 images
- 0 broken

Favicon files and the Apple/icon webp files return 200. Article and page images are served from `/wp-content/uploads/` on this app. Absolute `https://adwrks.co.il/wp-content/uploads/...` strings in metadata and schema are the production URLs of those same files. They are not a live WordPress API dependency. After cutover they are this site.

## 12. Schema

Representative behavior from the crawl and from production HTML:

- Page JSON-LD is still the captured production graph
- The extra layout Organization block removed in Phase 4A is still gone
- 54 local article responses contain `AggregateRating` because that block is already inside the captured production JSON-LD
- On production that block is `@type: CreativeWorkSeason`, which is how Rate My Post emits it
- No new AggregateRating, Review, or FAQ schema was added in this phase

## 13. Article ratings

Plugin: **Rate My Post** (`rate-my-post`).

The migration JSON files did not contain `rmp_avg_rating` or vote meta. The totals were read from the live public widget on each production article.

Artifact: `migration-audit/article-rating-migration.json`

| | |
|---|---|
| Sitemap articles checked | 54 |
| Widget recovered | 54 |
| With at least one vote | 54 |
| Without a widget | 0 |
| Vote counts | 5 to 124 per article, 2,430 votes in total |
| Source | Visible average and vote count, plus `data-post-id` |

Example, not estimated:

- `/בדיקת-מהירות-אתר/` post 21496, average 5, 69 votes
- `/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/` post 10983, average 3.4, 5 votes

The new article UI is a yes/no helpfulness control stored in `localStorage` for that browser only. It does not load or display these totals.

Classification: **MANUAL DECISION REQUIRED** before WordPress is retired. The numbers are saved. Showing them needs an approved storage approach. No database was added.

## 14. Article SEO signals

For the 54 articles inside the 74-URL set, Phase 4A already matched title, description, canonical, robots intent, single H1, Open Graph, and sitemap membership against production. This crawl did not find a new mapping or status failure. Body HTML, featured images, and categories were not rewritten. Dates and author remain what the article template already renders from the migrated post.

## 15. Forms

Local API checks, no email delivered:

| Case | Result |
|---|---|
| Missing privacy consent | 400 |
| Article form without email | 200 |
| Honeypot field filled | 200, treated as success, not stored as a lead |
| Invalid email | 400 |

Without `CONTACT_FORM_WEBHOOK_URL`, a valid submission returns a development acknowledgement and is not delivered. That path no longer writes the visitor’s name, phone, or email to the server log.

Classification: **FIX BEFORE DNS CUTOVER**. Delivery was not tested against a real inbox. Mark it `REQUIRES PREVIEW/PRODUCTION ENV TEST`.

## 16. Accessibility smoke

Not a WCAG audit. Existing controls already expose names: icon buttons, the privacy checkbox label, and the helpfulness group. Focus styles exist on links and buttons. No new accessibility regression was introduced except the 404 page, which has a text heading, a short explanation, and text links.

Legal pages have no local H1 while production privacy has one. They are noindex and outside the sitemap. Left as-is.

## 17. Responsive

No layout pass in this phase. Phase 3.3J is still the footer/responsive baseline. This phase did not change homepage, service, or article layout. No new overflow was introduced by the 404 page (centered text, wrapping buttons).

## 18. Performance readiness

Localhost numbers are not field Core Web Vitals. Classification: **VERIFY AFTER PREVIEW/PRODUCTION DEPLOYMENT**.

What is already true in code:

- Pages are server-rendered by default
- Client components are limited to header, forms, carousels, counters, article TOC, rating, floating controls, and the pricing iframe
- `next/font` loads Heebo at 400/500/600/700
- Images go through `next/image` on rebuilt templates
- No analytics script is loaded locally, so a Lighthouse run here would not match production once tags are added

The pricing page embeds `https://a2f55361-9e5b-4902-aac9-a41086cfeb54-krtyyh.sticklight.app/pricing-calculator`. That is an external runtime iframe from the Sticklight plugin, not WordPress REST. If that host goes away, the calculator frame fails. The rest of the page does not.

## 19. Analytics / tracking

| System | Production | Local | Before launch |
|---|---|---|---|
| Google Analytics 4 | `G-T4TE22LLC1` via gtag | Absent | Manual decision. Not installed here |
| Google Ads | `AW-11221673873` via gtag | Absent | Manual decision. Not installed here |
| reCAPTCHA | Explicit render script on production | Absent | Not required by the current forms |
| GTM container | Not seen as a separate GTM- id | Absent | — |
| Meta Pixel | Not seen in the sampled article/home scripts | Absent | — |
| Search Console | A verification token exists in the Rank Math export | Not emitted | Confirm the existing property. Do not use Change of Address |

IDs above are public measurement IDs, not API secrets.

## 20. Environment variables

See `migration-audit/production-env-checklist.md`.

## 21. Secret exposure

`web/src` has no API keys, service-role keys, SMTP secrets, or WordPress passwords. The only client-adjacent risk found was the contact handler logging name, phone, and email when no webhook is set. That log no longer includes those fields.

`WP_USER` and `WP_PASS` are read by local audit scripts from the environment. They are not referenced by the Next app. `.env*` is gitignored. No env file is in the workspace. Nothing secret is copied into this report.

## 22. WordPress runtime dependencies

Normal HTML does not call `wp-json`, `admin-ajax`, or Elementor’s live editor. Migrated HTML is rendered from local data. Media files are in this project.

Remaining external pieces:

- Sticklight pricing iframe
- Optional links to `catalog.adwrks.co.il`
- Production analytics, not yet carried over

None of these require the WordPress front end to paint the 74 URLs.

## 23. Production-output contamination

User-facing local HTML for the 74 URLs did not contain `localhost`, `127.0.0.1`, or `.vercel.app`. Audit markdown is not production output. The two `http://` hits are outbound links, not stylesheets, scripts, or images.

## 24. Build validation

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass |

Build routes: static shell, SSG catch-all, dynamic `/api/contact`, `robots.txt`, `sitemap.xml`. No failed static generation.

## 25. Classification

### A. Launch blocker

None for a noindex Vercel Preview.

### B. Fix before DNS cutover

- Set `CONTACT_FORM_WEBHOOK_URL` and prove a test lead arrives
- Confirm Production `VERCEL_ENV=production` lifts noindex and `Disallow: /`
- Configure www → `https://adwrks.co.il` in one hop, with SSL
- Decide whether to restore GA4 and Google Ads before cutover
- Confirm Search Console on the existing property

### C. Verify after deployment, before indexing

- Production robots and sitemap on the real host
- Form delivery
- www redirect
- Analytics requests
- Field performance after tags and the real CDN

### D. Accepted migration difference

- Staging noindex
- Homepage H1 wording, pending the manual decision
- Elementor H2/H3 differences already recorded in Phase 4A
- `/landing-page/` 404 locally, noindex attachment on production, not in the sitemap
- `/website-design/` and `/קידום-אורגני/` 404 on both sides
- CreativeWorkSeason rating schema left as captured production JSON-LD, not extended
- Legal pages outside the sitemap

### E. Post-launch improvement

- Show recovered Rate My Post totals in the article UI, after a storage decision
- Repair pricing-page links that already 404 on production
- Replace or keep the Sticklight calculator host
- Field Core Web Vitals work after real traffic

## 26. Manual decisions

1. Homepage H1, section 4.
2. Whether historical vote totals must be visible before WordPress is turned off.
3. Whether GA4 and Google Ads are restored before cutover.
4. Whether `/landing-page/` should stay a 404.

## 27. Final readiness

**READY FOR VERCEL PREVIEW**

DNS cutover is not approved by this report.

## Code changes in this phase

- `web/src/app/not-found.tsx` — real 404 UI, noindex, no homepage canonical
- `web/src/app/api/contact/route.ts` — stop logging lead name, phone, and email

## Artifacts

- `migration-audit/phase-4b-summary.json`
- `migration-audit/article-rating-migration.json`
- `migration-audit/production-env-checklist.md`
- `migration-audit/GO-LIVE-CHECKLIST.md`
- `migration-audit/rendered-image-audit.json` (re-run, 0 broken)

**STOP. Phase 4B complete. Awaiting manual review.**
