# Production environment checklist

No secret values are listed here.

The Next.js app currently reads three environment signals. WordPress audit scripts read two more, and those scripts are not part of the site runtime.

| Variable | Purpose | Required | Scope | Vercel production | Vercel preview | Secret | Referenced by |
|---|---|---|---|---|---|---|---|
| `NODE_ENV` | Set by Next itself (`development` / `production`) | Automatic | Server | Yes, set by the platform | Yes, set by the platform | No | `web/src/lib/content/metadata.ts`, `web/src/app/robots.ts` |
| `VERCEL_ENV` | Distinguishes Production from Preview | Required for indexing to turn on | Server | Must be `production` on the production deployment | `preview` on preview deployments | No | same files as above |
| `CONTACT_FORM_WEBHOOK_URL` | Server-side destination for lead forms | Required before real leads are expected | Server only | Yes, before DNS cutover | Optional, use a test inbox | Yes | `web/src/app/api/contact/route.ts` |
| `WP_USER` | Read-only WordPress audit login | Not used by the website | Local scripts only | No | No | Yes, if set | `scripts/run-migration-audit.js`, `scripts/run-phase1b-audit.js` |
| `WP_PASS` | Read-only WordPress application password | Not used by the website | Local scripts only | No | No | Yes | same scripts |

## Indexing switch

Production indexing is enabled only when both are true:

- `NODE_ENV === "production"`
- `VERCEL_ENV === "production"`

Otherwise `robots.ts` returns `Disallow: /`, and page metadata is `noindex, nofollow`.

A production deployment must not set `VERCEL_ENV` manually to anything else. Vercel sets it. Preview deployments stay noindex.

## Not used

No `NEXT_PUBLIC_*` variables are referenced. There is no Supabase, Resend, or SMTP variable in the app.

`.env*` is gitignored under `web/.gitignore`. No `.env` file is present in the workspace.
