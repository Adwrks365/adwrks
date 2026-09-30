# Go-live checklist

Do not execute DNS cutover until every **REQUIRED BEFORE DOMAIN** item below is verified.

## Before GitHub / Vercel

- [x] Phase 4B report reviewed
- [x] Homepage H1 decision recorded (`סוכנות שיווק דיגיטלי`)
- [x] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass after Phase 5B
- [x] No `.env` files with secrets are committed
- [x] `WP_USER` / `WP_PASS` stay off the Vercel project

## Vercel Preview (current state)

- [x] Project imported; production domain **not** attached
- [x] Preview has `VERCEL_ENV=preview`
- [x] Preview `robots.txt` is `Disallow: /` and pages are noindex
- [x] 74 / 74 sitemap URLs return 200 on `adwrks.vercel.app`
- [x] Canonicals remain `https://adwrks.co.il/...`
- [x] `/plans/` returns 308 to `/hosting-plans/`
- [x] Custom 404 works
- [x] Analytics **not** loaded on Preview (production-host gate)
- [ ] **EMAIL DELIVERY** — set `RESEND_API_KEY` + `CONTACT_FORM_FROM` on Vercel, submit homepage + contact + article forms, confirm inbox receipt at `info@adwrks.co.il`

## Production project before DNS

### REQUIRED BEFORE DOMAIN

- [ ] `RESEND_API_KEY` set in Vercel Production
- [ ] `CONTACT_FORM_FROM` set to verified Resend sender on `adwrks.co.il`
- [ ] Real form test delivered to `info@adwrks.co.il` (not HTTP 200 alone)
- [ ] Add domains `adwrks.co.il` and `www.adwrks.co.il` in Vercel **without changing DNS yet**
- [ ] Plan www redirect: `https://www.adwrks.co.il/{path}` → `https://adwrks.co.il/{path}` (single hop in Vercel domain settings)
- [ ] Verify SSL certificates issued for both hosts in Vercel before DNS change

### Activates automatically after domain attach

- [ ] `VERCEL_PROJECT_PRODUCTION_URL=adwrks.co.il` (Vercel-set)
- [ ] Production robots allow crawling; sitemap `https://adwrks.co.il/sitemap.xml`
- [ ] Per-page indexability from preserved SEO data
- [ ] Google Analytics `G-T4TE22LLC1` and Google Ads `AW-11221673873` tags load (hard-coded, production-host only)

### OPTIONAL / DEFERRED

- [ ] Article rating persistence backend (owner approval required — see Phase 5B report)
- [ ] Google Ads conversion actions (none discovered on current WordPress — base tag only)

## Immediately before DNS cutover

- [ ] Fresh WordPress backup / snapshot
- [ ] Confirm `migration-audit/article-rating-migration.json` stored outside old server
- [ ] Re-check `/plans/` and 74 sitemap URLs on production deployment hostname
- [ ] Send production-domain form test and confirm inbox delivery
- [ ] Homepage, contact, one service, one article, one category open on new host

## DNS cutover

- [ ] Point only records required for `adwrks.co.il` and `www.adwrks.co.il`
- [ ] Do not change unrelated records
- [ ] Keep previous records noted for rollback

## Immediately after cutover

- [ ] `https://adwrks.co.il/` is 200
- [ ] `https://www.adwrks.co.il/` is one hop to non-www
- [ ] HTTP is one hop to HTTPS non-www where possible
- [ ] Canonicals are `https://adwrks.co.il/...`
- [ ] `robots.txt` is not `Disallow: /`
- [ ] `sitemap.xml` lists 74 production URLs
- [ ] SSL valid on apex and www
- [ ] Forms deliver to `info@adwrks.co.il`
- [ ] Analytics requests fire on production domain
- [ ] `/plans/` still redirects to `/hosting-plans/`

## Search engines

- [ ] Use existing Search Console property — do not use Change of Address
- [ ] Submit or refresh `https://adwrks.co.il/sitemap.xml` only after robots is indexable
- [ ] Inspect homepage, one service, and one article

## First 24–72 hours

- [ ] Watch 404s, crawl stats, analytics, form delivery, server errors

## Rollback

Return DNS to WordPress if any of these stay broken:

- Homepage or contact returns 5xx
- Forms do not deliver and leads are being lost
- `robots.txt` still disallows the whole site on production domain
- Canonicals point at Vercel or localhost
- SSL fails for apex domain
