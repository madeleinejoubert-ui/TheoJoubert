# Putting the site live on lanternsocial.co.uk (IONOS DNS)

The Lantern Social website now lives in this repository. To serve it at
**lanternsocial.co.uk**, deploy the repo to Vercel (free) and point the IONOS
DNS records at it. Email stays on IONOS — only the website records change.

## Step 1 — Deploy to Vercel

1. Sign in at vercel.com with the GitHub account and **Import** this repository.
2. Framework preset: **Vite**. Add the two environment variables from `.env.example`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
3. Deploy. Then in the Vercel project: **Settings → Domains → Add** →
   `lanternsocial.co.uk` and `www.lanternsocial.co.uk`. Vercel will display the
   exact records it wants — use those values if they differ from the table below.
4. Because the app uses client-side routing, add a rewrite so deep links work:
   this repo ships `vercel.json` doing exactly that — nothing to configure.

## Step 2 — Change these records in IONOS (Domains & SSL → lanternsocial.co.uk → DNS)

| Action | Type | Host | Current value | New value |
|---|---|---|---|---|
| **Edit** | A | `@` | `217.160.0.99` (IONOS MyWebsite) | `76.76.21.21` (Vercel) |
| **Delete** | AAAA | `@` | `2001:8d8:100f:f000::200` | — (Vercel doesn't need it) |
| **Delete** | A | `www` | `212.227.172.254` | — |
| **Delete** | AAAA | `www` | `2001:8d8:105:1:0:1:0:1` | — |
| **Add** | CNAME | `www` | — | `cname.vercel-dns.com` |
| **Delete** (optional tidy-up) | TXT | `_dep_ws_mutex` / `_dep_ws_mutex.www` | IONOS MyWebsite deploy locks | — once MyWebsite is cancelled |

> If Vercel's Domains screen shows a different A record value, use Vercel's —
> they occasionally update their apex IP; the dashboard is authoritative.

## Step 3 — Leave these alone (they run the email)

Do **not** touch: both `MX` records, the `TXT @` SPF record
(`v=spf1 include:_spf-eu.ionos.com ~all`), `_dmarc`, the two
`_domainkey` DKIM CNAMEs, `autodiscover`, and `_domainconnect`.
Changing any of those breaks hello@lanternsocial.co.uk delivery.

## Step 4 — After the switch

- DNS propagates in minutes to a few hours. Vercel issues the SSL certificate
  automatically once it sees the records.
- Add `https://lanternsocial.co.uk` in Supabase → Authentication → URL
  configuration (site URL + redirect URLs) so client logins work on the domain.
- If the IONOS "MyWebsite" product subscription is no longer used, cancel it so
  it isn't billed — the website is now served from Vercel + this repo.

## What visitors get

- `lanternsocial.co.uk` → the marketing site (Home, Services, Packages, How It
  Works, Results, About, FAQ, Free Review).
- **Free Review** form submissions land in the platform's `leads` table and
  appear instantly in Theo's console under Leads.
- **Client Login** (top right) → the client portal / studio console.
