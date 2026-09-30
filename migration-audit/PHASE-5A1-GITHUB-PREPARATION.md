# Phase 5A-1 — GitHub preparation

Local preparation only. No GitHub repository, no commit, no push, no Vercel project, no deploy, no DNS change, and no WordPress change.

## Git state

| Item | Result |
|---|---|
| Repository | Already initialized at the workspace root |
| Branch | `master` |
| Commits | None |
| Remote | None |
| Working tree | Preserved. Nothing was reset, cleaned, stashed, or discarded |

The index was staged for review and was not committed.

## Homepage H1

Owner-approved H1 is now exactly:

`סוכנות שיווק דיגיטלי`

Confirmed in the rendered homepage. The previous H1 was not restored. This difference is an approved content decision, not a migration error. The rest of the homepage was not rewritten. Title, canonical, and staging robots are unchanged:

- title: `סוכנות שיווק דיגיטלי ⋆ Adwrks 365`
- canonical: `https://adwrks.co.il/`
- robots on this local preview: `noindex, nofollow`

## Secret audit

No `.env` file is present. No WordPress application password, SMTP secret, Supabase service-role key, private key, or webhook URL is stored in the tree.

| File | Type | Would it be committed? | Remediation |
|---|---|---|---|
| `migration-audit/seo.json` | Facebook Graph `access_token` embedded in captured widget URLs (620) | Yes, this file is required at runtime | Values replaced with `REDACTED`. File kept |
| `migration-audit/pages-raw.json` | Same token type (140) | Yes, audit archive | Redacted. File kept |
| `migration-audit/pages.json` | Same token type (100) | Yes, runtime content source | Redacted. File kept |
| `migration-audit/posts.json` | Same token type (20) | Yes, runtime content source | Redacted. File kept |
| `migration-audit/homepage.html` | Same token type (20) | Yes, audit archive | Redacted. File kept |
| `migration-audit/visual-qa/report.json` | Same token type (8) | Yes, QA report | Redacted. File kept |

A rescan of text files outside `node_modules` and `.next` found no remaining live token and no WordPress auth cookies.

Rendered `/`, `/google-ads/`, `/contact-us/`, and `/google-shopping-guide/` contain neither the token nor the redaction marker. The public pages do not emit it.

Audit scripts read `WP_USER`, `WP_PASS`, and `WP_APP_PASS` from the environment only. Defaults are an empty password and the local username `migration`. Those scripts are not part of the site runtime.

`migration-audit/article-rating-migration.json` has no credentials. It still holds 54 articles and 2,430 historical votes.

## `.gitignore`

A root `.gitignore` was added. `web/.gitignore` already covered the Next app and now allows `web/.env.example`.

Ignored:

- root and app `node_modules`
- `web/.next`
- `.env` and `.env.*` except `.env.example`
- logs, Playwright output, OS junk, `*.pem`
- `migration-audit/**/*.png` (temporary visual-QA screenshots, about 240MB)

Not ignored:

- application source
- `web/public` media
- migration reports, reconciliation JSON, and `article-rating-migration.json`
- the redacted WordPress JSON the app reads at runtime

## Large files

Trackable tree excluding `node_modules`, `.next`, and the ignored screenshots is about 40MB. That is inside normal GitHub limits. No file is near the 100MB file limit. Git LFS was not added.

Largest individual file kept: `migration-audit/posts.json` at 7.16MB. `seo.json` is 3.6MB. `pages.json` and `elementor-templates.json` are under 3MB. No videos, database dumps, or backup archives were found.

## Environment variables

`web/.env.example` lists names and empty placeholders only.

| Variable | Role |
|---|---|
| `CONTACT_FORM_WEBHOOK_URL` | Server-only. Required before real leads are delivered. Value is unknown and was not invented |
| `NODE_ENV`, `VERCEL_ENV` | Set by the host. Indexing turns on only when both are `production` |
| `WP_USER`, `WP_PASS` | Local script `scripts/run-migration-audit.js` only. Do not set on the host |
| `WP_APP_PASS` | Local script `scripts/run-phase1b-audit.js` only. Different name from `WP_PASS`. Do not set on the host |

## Portability

Application code has no machine-specific Windows paths, no LAN address, and no embedded migration password. Canonicals stay on `https://adwrks.co.il`. Audit scripts default to `http://localhost:3000` only when they are run locally.

The Next app reads content and media indexes through a relative path: `migration-audit/` next to `web/`. A clone of this repository runs with `cd web` and `npm install`. That is portable.

It is not a GitHub blocker. It is a later hosting note: if a Vercel project uses Root Directory `web`, files outside `web/` are not deployed, and the site cannot read `../migration-audit`. Do not create that project in this step.

## Validation

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass |

Local preview after that build:

| Route | Result |
|---|---|
| `/` | 200, approved H1, production canonical, local noindex |
| `/contact-us/` | 200, production canonical, local noindex |
| `/google-ads/` | 200, production canonical, local noindex |
| `/google-shopping-guide/` | 200 article, production canonical, local noindex |
| `/sitemap.xml` | 200, 74 URLs |
| `/robots.txt` | 200, `Disallow: /` while this preview is not production |
| `/this-page-does-not-exist/` | 404, title `העמוד לא נמצא`, `noindex`, no canonical |
| `/plans/` | 308 to `/hosting-plans/` |

Article URLs, titles, descriptions, canonicals, headings, body copy, and sitemap membership were not edited. The only content edit in this step is the approved homepage H1, plus redaction of the captured Facebook token parameter inside audit and source JSON.

## First commit contents

Staged, not committed. 1,022 files: 922 under `web/`, 69 under `migration-audit/`, 30 under `scripts/`, plus the root `.gitignore`.

### Application source

`web/src`, Next config, `package.json`, `package-lock.json`, TypeScript and ESLint config, styles, and app components.

### Public/media assets

`web/public`, including migrated `wp-content/uploads` files the site serves.

### Migration/audit documentation

Phase reports, reconciliation JSON, checklists, `urls.json`, `media.json`, `media-map.json`, `categories.json`, `posts.json`, `pages.json`, `seo.json`, and `article-rating-migration.json`. Screenshot PNGs are excluded. Token values in the retained JSON and HTML captures are redacted.

### Scripts

`scripts/` local audit and QA scripts. They do not contain secret values.

### Configuration

Root `.gitignore`, `web/.gitignore`, and `web/.env.example`.

### Excluded local/generated/private files

- `node_modules` at the repo root and in `web/`
- `web/.next`
- `.env` files (none are present)
- about 240MB of `migration-audit/**/*.png`
- Playwright output, logs, and certificates

## Recommended repository

Name: `adwrks-365`

The npm package name is `web`, which is too generic for the repository.

Description: Adwrks 365 digital marketing site, migrated from WordPress to Next.js.

The owner creates or selects the GitHub repository. Do not push until that exists.

Current local branch is `master` and has no commits. GitHub's default branch is often `main`. Align those when the repository is created, before the first push.

## Blocker before GitHub

None. Secrets found in captured Facebook widget URLs were redacted. The index is ready for the owner to review and commit after the GitHub repository exists.
