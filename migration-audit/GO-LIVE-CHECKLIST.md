# Go-live checklist

Do not execute this during Phase 4B. DNS, Vercel, WordPress, and Search Console stay untouched until a later approved step.

## Before GitHub / Vercel

- [ ] Phase 4B report reviewed
- [ ] Homepage H1 decision recorded
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` still pass
- [ ] No `.env` files with secrets are committed
- [ ] `WP_USER` / `WP_PASS` stay off the Vercel project

## Vercel Preview

- [ ] Import the project. Do not attach the production domain yet
- [ ] Confirm Preview has `VERCEL_ENV=preview`
- [ ] Confirm Preview `robots.txt` is `Disallow: /` and pages are noindex
- [ ] Set `CONTACT_FORM_WEBHOOK_URL` to a test inbox only if a form test is wanted
- [ ] Submit one homepage form, one contact-page form, and one article form to that test inbox
- [ ] Check 360 / 390 / 1440 on homepage, one service, one article, contact
- [ ] Check `/plans/` returns 308 to `/hosting-plans/`
- [ ] Check a fake URL returns 404, not a 200 of another page
- [ ] Do not install analytics on Preview unless a test property is explicitly chosen

## Production project before DNS

- [ ] Production environment: `VERCEL_ENV=production` (platform-set)
- [ ] `CONTACT_FORM_WEBHOOK_URL` points at the real delivery target
- [ ] Add domains `adwrks.co.il` and `www.adwrks.co.il` in Vercel, without changing DNS yet
- [ ] Plan one direct redirect: `https://www.adwrks.co.il/{path}` → `https://adwrks.co.il/{path}`
- [ ] Avoid a chain of HTTP www → HTTPS www → HTTPS non-www if the host can do one hop
- [ ] SSL certificates ready for both hosts
- [ ] Production robots must allow crawling and reference `https://adwrks.co.il/sitemap.xml`
- [ ] Decide Google Analytics `G-T4TE22LLC1` and Google Ads `AW-11221673873` before cutover
- [ ] Confirm Search Console already verifies the existing property (DNS or meta). Do not use Change of Address

## Immediately before DNS cutover

- [ ] Fresh WordPress backup / snapshot
- [ ] Export or confirm `migration-audit/article-rating-migration.json` is stored outside the old server
- [ ] Re-check `/plans/` and the 74 sitemap URLs on the production deployment hostname
- [ ] Send a real form test to the production webhook and confirm it arrives
- [ ] Analytics present or explicitly deferred
- [ ] Homepage, contact, one service, one article, one category open on the new host

## DNS cutover

- [ ] Point only the records required for `adwrks.co.il` and `www.adwrks.co.il`
- [ ] Do not change unrelated records
- [ ] Keep the previous records noted for rollback

## Immediately after cutover

- [ ] `https://adwrks.co.il/` is 200
- [ ] `https://www.adwrks.co.il/` is one hop to non-www
- [ ] HTTP is one hop to HTTPS non-www where possible
- [ ] Canonicals are `https://adwrks.co.il/...`
- [ ] `robots.txt` is not `Disallow: /`
- [ ] `sitemap.xml` lists 74 production URLs and no localhost or Vercel host
- [ ] SSL is valid
- [ ] Forms deliver
- [ ] Analytics requests fire, if enabled
- [ ] `/plans/` still redirects to `/hosting-plans/`

## Search engines

- [ ] Use the existing Search Console property
- [ ] Do not use Change of Address
- [ ] Submit or refresh `https://adwrks.co.il/sitemap.xml`
- [ ] Inspect homepage, one service, and one article
- [ ] Do this only after robots is indexable

## First 24–72 hours

- [ ] Watch 404s
- [ ] Watch crawl stats and indexing
- [ ] Watch analytics and form delivery
- [ ] Watch server errors
- [ ] Check Core Web Vitals only from field data, not from localhost

## Rollback

Return DNS to the current WordPress host if any of these stay broken after a short check:

- Homepage or contact returns 5xx
- Forms do not deliver and leads are being lost
- `robots.txt` still disallows the whole site on the production domain
- Canonicals point at a Vercel or localhost host
- SSL fails for the apex domain

WordPress can stay up as the rollback copy. The new site does not need it to render pages.
