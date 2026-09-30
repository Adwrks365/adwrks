# Phase 5B — Production Preparation

**Date:** 2026-09-30  
**Vercel Preview:** https://adwrks.vercel.app  
**Production WordPress (unchanged):** https://adwrks.co.il  
**DNS / domain attach:** NOT performed  

---

## A. Email delivery

### Implementation

- Replaced `CONTACT_FORM_WEBHOOK_URL` with server-side email via [Resend HTTP API](https://resend.com/docs/api-reference/emails/send-email).
- Code: `web/src/lib/email/send-contact-form-email.ts`, `web/src/app/api/contact/route.ts`.
- Destination hard-coded: `info@adwrks.co.il`.
- Subject: `ליד חדש מאתר Adwrks 365`.
- Fields in email: name, phone, email (if supplied), message, form source, originating page (Referer), timestamp (Asia/Jerusalem).
- Honeypot, privacy consent, and server validation preserved.
- Visitor email used as `Reply-To` only when valid; never as authenticated sender.
- User input escaped in HTML body; plain-text fallback included.
- Missing provider credentials → HTTP **503** with user-friendly error (no fake success).
- Provider failure → HTTP **502** with user-friendly error.

### Provider

**Resend** — no email library was previously installed. Resend chosen for Vercel-compatible transactional API with minimal dependencies (native `fetch`, no SDK).

### Environment variables

| Name | Purpose | Secret | Preview | Production |
|---|---|---|---|---|
| `RESEND_API_KEY` | Resend API authentication | Yes | Optional (inbox test) | **Required** |
| `CONTACT_FORM_FROM` | Verified sender address in Resend | No | Optional | **Required** |

Owner must verify sending domain in Resend before cutover.

### Actual inbox test result (Phase 5B initial)

**EMAIL DELIVERY CONFIGURATION REQUIRED** at Phase 5B commit time.

Subsequently verified by owner: Resend domain `adwrks.co.il` verified; Vercel env configured; first live submission from `adwrks.vercel.app` arrived at `info@adwrks.co.il`.

---

## A2. Contact Email Design & Attribution (Phase 5B.1)

### Form inventory

| Form ID | Component | Pages | Fields | API | Recipient |
|---|---|---|---|---|---|
| `homepage-contact` | `ContactForm` (compact) | Homepage (`/`) | name*, phone*, email*, message, privacy | `/api/contact/` | `info@adwrks.co.il` |
| `contact-page` | `ContactForm` (default) | `/contact-us/` | name*, phone*, email*, message, privacy | `/api/contact/` | `info@adwrks.co.il` |
| `article-sidebar` | `ArticleSidebarContactForm` | All 54 article pages (sidebar) | name*, phone*, email (optional), privacy, hidden message | `/api/contact/` | `info@adwrks.co.il` |

**Not lead forms:** `GlobalFloatingUI` (WhatsApp + tel links only). No footer form. No service-page submit forms.

### Form ID → Hebrew label (server allowlist)

| ID | Label |
|---|---|
| `homepage-contact` | טופס יצירת קשר – דף הבית |
| `contact-page` | טופס צור קשר |
| `article-sidebar` | טופס צדדי – מאמר |
| unknown / legacy | טופס יצירת קשר (fallback) |

Legacy `formType: article` maps to `article-sidebar`.

### Email design

- RTL Hebrew HTML card email + plain-text fallback
- Header: Adwrks 365 + “ליד חדש מהאתר” + form badge
- Section: פרטי הלקוח (non-empty fields only; tel:/mailto: links)
- Section: מקור הליד (form, page title, path, canonical URL, submitted URL when different)
- Footer: פרטי שליחה (Israel date/time, environment label)
- Subject: `ליד חדש | Adwrks 365 | [Form Name] | [Page Name]`

Code: `web/src/lib/email/lead-email-template.ts`, `contact-form-attribution.ts`, `contact-form-ids.ts`

### Source-page attribution

- Server props pass `pageTitle` + `pagePath` from each page (article title/path, homepage, contact page)
- Client adds `pageUrl` from `window.location.href` at submit time
- Server builds canonical `https://adwrks.co.il{path}` and environment label (Vercel Preview / Production)

### Phase 5B.1 inbox tests (deploy `8b5b120`)

Controlled API submissions from `https://adwrks.vercel.app` after redeploy:

| Form ID | Test name | API | Expected subject |
|---|---|---|---|
| `homepage-contact` | Phase5B1 Homepage Test | 200 OK | `ליד חדש \| Adwrks 365 \| טופס יצירת קשר – דף הבית \| סוכנות שיווק דיגיטלי` |
| `contact-page` | Phase5B1 Contact Test | 200 OK | `ליד חדש \| Adwrks 365 \| טופס צור קשר \| צור קשר` |
| `article-sidebar` | Phase5B1 Article Test | 200 OK | `ליד חדש \| Adwrks 365 \| טופס צדדי – מאמר \| כמה עולה פרסום בגוגל?` |

All three returned success UI payload. Reply-To set to test visitor emails where supplied.

**Owner inbox check:** Confirm the three redesigned emails in `info@adwrks.co.il` Gmail (RTL layout, מקור הליד section, correct attribution). Infrastructure was previously verified by owner with first live submission.

---

## B. Analytics

### WordPress production audit

Production loads **Google Site Kit** with direct **gtag.js** (not GTM container):

- `https://www.googletagmanager.com/gtag/js?id=G-T4TE22LLC1`
- `https://www.googletagmanager.com/gtag/js?id=AW-11221673873`

Inline config is deferred/base64-encoded by WordPress optimization plugin; decoded behavior is standard `gtag('config', …)` for both IDs.

**No conversion events discovered** — no `gtag('event', 'conversion'…)`, `send_to`, or AW conversion labels found on homepage or contact page HTML.

### Next.js implementation

- `web/src/lib/analytics.ts` — preserved IDs (unchanged).
- `web/src/components/GoogleTags.tsx` — single gtag.js load, `afterInteractive`, configs both GA4 and Google Ads; `PageViewTracker` sends `page_path` on App Router navigations (avoids duplicate initial load).
- Injected in `layout.tsx` only when `isIndexableProduction()` is true.

### Activation logic

Tags load **only** when all are true:

```
NODE_ENV === "production"
VERCEL_ENV === "production"
VERCEL_PROJECT_PRODUCTION_URL === "adwrks.co.il"
```

| Host | Analytics | Indexing |
|---|---|---|
| `*.vercel.app` | Off | `noindex`, `robots.txt → Disallow: /` |
| `https://adwrks.co.il` (after domain attach) | On | Per-page preserved SEO |

Preview QA traffic does not hit production GA4/Ads.

### Conversion tracking status

| Item | Status |
|---|---|
| Base GA4 tag `G-T4TE22LLC1` | Implemented (production-host gated) |
| Base Google Ads tag `AW-11221673873` | Implemented (production-host gated) |
| Conversion actions discovered on WordPress | **None found** |
| Conversion actions implemented | **None** (none discovered to preserve) |
| Conversion actions requiring manual info | Any future form/call conversions owner may want — labels not present on current WP site |

---

## C. Broken links (`/מחירון-שיווק-דיגיטלי/`)

### Four original findings

| # | Anchor | Original href | HTTP (WP + Vercel) | Context | WP same? | Class |
|---|---|---|---|---|---|---|
| 1 | *(stylesheet, not anchor)* | `/wp-content/uploads/trustindex-facebook-widget.css?…` | 404 | Trustindex plugin artifact | Yes (WP plugin) | **C** — plugin artifact |
| 2 | למידע נוסף ← | `/קידום-אורגני/` (encoded Hebrew slug) | 404 | SEO service card “קידום אורגני (SEO) + AI” | Yes — 404 on WP too | **A** — legacy URL; live service at `/seo/` |
| 3 | למידע נוסף ← | `/landing-page/` | 404 | “דף נחיתה” pricing card | Yes — 404 on WP too | **A** — equivalent `/hosting-plans/` (landing/one-page packages) |
| 4 | למידע נוסף ← (×2) | `/website-design/` | 404 | One-page and brochure site cards | Yes — 404 on WP too | **A** — equivalent `/website-building/` |

**Note on #1:** Trustindex CSS was reported in Phase 5A4 crawl but is **not** present in pricing page source HTML. Defensive strip added in `html.ts` for `<link … trustindex …>`. Trustindex widget markup is already stripped elsewhere.

### Fixes applied

| Original | Updated to |
|---|---|
| `…/קידום-אורגני/` | `https://adwrks.co.il/seo/` |
| `…/landing-page/` | `https://adwrks.co.il/hosting-plans/` |
| `…/website-design/` (2×) | `https://adwrks.co.il/website-building/` |

Files: `web/src/data/content/pages.json`, extracted pricing JSON.

### Unresolved

None on pricing page after fixes. Trustindex CSS not found in pricing source — monitor after deploy.

---

## D. Historical article ratings

### Preserved dataset

- `migration-audit/article-rating-migration.json`
- 54 / 54 articles, 2,430 verified historical votes from WordPress Rate My Post
- **Not modified** in Phase 5B

### Recommended persistence architecture (comparison)

| Approach | Historical 2,430 votes | New votes | Duplicate mitigation | Maintenance | Vercel fit |
|---|---|---|---|---|---|
| **Static display from JSON** (no DB) | Import JSON at build; show read-only totals in UI | Not persisted | N/A for new | Lowest | Excellent |
| **Supabase Postgres** | One-time migration table keyed by WP post ID / route | INSERT with IP hash or cookie + RLS | Server-side unique constraint | Low ongoing | Excellent |
| **Vercel KV / Upstash Redis** | Seed from JSON | INCR per article + visitor key TTL | Key per visitor+article | Low | Good |
| **Serverless blob (Vercel Blob JSON)** | Merge file at deploy | Rewrite blob on vote | Race conditions without locking | Fragile | Possible |

**Recommendation:** Supabase (or Postgres) — simplest path to preserve verified historical totals, accept new votes with duplicate protection, and map articles by existing `wordpressId` / route. **Not implemented** pending owner approval.

### Schema decision

- WordPress emitted questionable `CreativeWorkSeason` + `AggregateRating` via Rate My Post.
- **Do not** add `AggregateRating` schema in Next.js without semantic justification.
- Phase 5B: prioritize accurate visible content + preserved data file over rich-result stars.

---

## E. Production indexing

### Preview behavior (current)

- `isIndexableProduction()` → false on `adwrks.vercel.app`
- All pages: `noindex, nofollow`
- `robots.txt`: `Disallow: /`
- Canonicals: `https://adwrks.co.il/...` (unchanged)

### Future production behavior (automatic after domain attach)

When Vercel sets `VERCEL_PROJECT_PRODUCTION_URL=adwrks.co.il`:

- `robots.ts` → `Allow: /`, sitemap `https://adwrks.co.il/sitemap.xml`
- Per-page robots from preserved `seo.json`
- Analytics tags activate
- No manual code change required

---

## F. Domain plan

| Item | Plan |
|---|---|
| Apex | Attach `adwrks.co.il` in Vercel; DNS A/AAAA to Vercel when approved |
| www | Attach `www.adwrks.co.il`; configure Vercel redirect to apex preserving path + query |
| SSL | Verify certificates issued in Vercel for both hosts **before** DNS cutover |
| Redirect chains | Single hop www → non-www HTTPS; avoid HTTP→www→non-www chains |

**Not executed in Phase 5B.**

---

## G. Environment variables (names only)

### REQUIRED BEFORE DOMAIN

- `RESEND_API_KEY`
- `CONTACT_FORM_FROM`

### Automatic (do not set manually)

- `NODE_ENV`
- `VERCEL_ENV`
- `VERCEL_PROJECT_PRODUCTION_URL`

### OPTIONAL

- Analytics IDs are hard-coded; no env vars

### REMOVED

- `CONTACT_FORM_WEBHOOK_URL`

See `migration-audit/production-env-checklist.md`.

---

## H. SEO regression

Post–Phase 5B local validation (`validate-migration.js` against production build):

| Check | Result |
|---|---|
| Sitemap URLs | 74 |
| Missing routes (non-200) | **0** |
| Production canonicals | Preserved |
| Preview noindex | Preserved |
| Homepage H1 | `סוכנות שיווק דיגיטלי` (owner-approved) |

Validator reports 45 “seo-significant” heading diffs vs WordPress baseline — pre-existing migration classification, not introduced by Phase 5B.

---

## I. Images

Baseline maintained: **1,017 images / 0 genuine broken** (Phase 5A4). Phase 5B changes do not alter image pipelines. Re-verify on Vercel after deploy.

---

## J. Performance

| Metric | Phase 5A4 baseline | Phase 5B |
|---|---|---|
| Homepage Desktop Lighthouse | 99 | Not re-run; gtag uses `afterInteractive` (non-blocking) |
| Homepage Mobile Lighthouse | 91 | Not re-run post-deploy |

Recommend spot Lighthouse on Vercel after redeploy if owner wants confirmation.

---

## K. Security

| Check | Result |
|---|---|
| Email secrets server-side only | Pass |
| No secrets in Git | Pass |
| No `NEXT_PUBLIC_*` secrets | Pass |
| No visitor-controlled From address | Pass |
| Server validation preserved | Pass |
| Input escaped in email HTML | Pass |
| No open relay (fixed destination) | Pass |
| No provider errors exposed to visitor | Pass |
| Missing config → 503, not fake success | Pass |

---

## L. Remaining blockers

1. **EMAIL DELIVERY CONFIGURATION REQUIRED** — Resend credentials + verified sender + real inbox test
2. **Domain attach + SSL verification** — intentional cutover step (not Phase 5B)
3. **Article rating persistence** — owner decision (optional before cutover)
4. **Google Ads conversions** — none on current WP; define if needed post-launch

---

## Final status

**PRODUCTION PREPARATION — CONDITIONS REMAIN**

Code and documentation are ready for domain attach, but email delivery is not verified and Resend credentials are not configured on Vercel.
