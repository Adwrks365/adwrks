# Production environment checklist

No secret values are listed here.

## Vercel Production — required before domain cutover

| Variable | Purpose | Secret | Preview required | Production required |
|---|---|---|---|---|
| `NODE_ENV` | Set by Next.js / Vercel (`production` on deployed builds) | No | Automatic | Automatic |
| `VERCEL_ENV` | Distinguishes Production from Preview | No | Automatic (`preview`) | Automatic (`production`) |
| `VERCEL_PROJECT_PRODUCTION_URL` | Must equal `adwrks.co.il` for indexing and analytics to activate | No | Automatic (preview hostname) | Automatic after domain attach |
| `RESEND_API_KEY` | Resend API key for server-side form email delivery | Yes | Optional (only for inbox test) | **Yes — before DNS cutover** |
| `CONTACT_FORM_FROM` | Verified Resend sender address used as the authenticated From header | No (address, not password) | Optional (must match verified domain) | **Yes — before DNS cutover** |

Lead destination `info@adwrks.co.il` is hard-coded in the app. It is not an environment variable.

## Vercel Production — optional / automatic

| Variable | Purpose | Secret | Preview | Production |
|---|---|---|---|---|
| Analytics IDs (`G-T4TE22LLC1`, `AW-11221673873`) | Hard-coded; tags load only when `isIndexableProduction()` is true | No | Not loaded | Loaded after domain attach |

## Local audit scripts only (never on Vercel)

| Variable | Purpose | Secret | Vercel |
|---|---|---|---|
| `WP_USER` | Read-only WordPress audit login | Yes | No |
| `WP_PASS` / `WP_APP_PASS` | WordPress application password | Yes | No |

## Indexing and analytics activation

Both production indexing (`robots.txt`, page `robots` meta) and Google tag loading require **all** of:

- `NODE_ENV === "production"`
- `VERCEL_ENV === "production"`
- `VERCEL_PROJECT_PRODUCTION_URL === "adwrks.co.il"`

Until the production domain is attached and Vercel sets the last value, every `*.vercel.app` deployment stays `noindex, nofollow` with `robots.txt → Disallow: /`, and analytics tags are not injected.

## Email provider setup (owner action)

1. Create a Resend account and verify the sending domain (`adwrks.co.il`).
2. Create an API key → set as `RESEND_API_KEY` in Vercel Production (and Preview if testing).
3. Set `CONTACT_FORM_FROM` to a verified sender on that domain (not the visitor's email).
4. Submit a real test form from `https://adwrks.vercel.app` and confirm delivery to `info@adwrks.co.il`.

## Removed

`CONTACT_FORM_WEBHOOK_URL` — replaced by direct Resend email delivery in Phase 5B.

## Not used

No `NEXT_PUBLIC_*` variables. No Supabase or SMTP variables in the app runtime.

`.env*` is gitignored under `web/.gitignore`.
