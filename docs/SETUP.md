# Setup Guide — Theo Social Studio

## What's already done

- **Supabase project** `theo-social-studio` (ref `ehapjmliqboqikwspqvz`) created in
  **eu-west-2 (London)** under madeleinejoubert-ui's org.
- **Database schema applied** (see `supabase/migrations/`): clients, social accounts,
  content calendar, Metricool analytics snapshots, services, invoices, leads — all with
  row-level security. Website visitors can only *submit* leads; everything else requires
  a signed-in user.
- **Starter packages seeded** in the `services` table (edit pricing anytime).
- **This app**: React + Vite dashboard with login, dashboard stats, client list,
  content calendar, and lead management.

## Run locally

```bash
npm install
cp .env.example .env   # the public keys are already filled in
npm run dev
```

Open http://localhost:5173, click **"First time? Create an account"**, and sign up with
Theo's email. Confirm the email, sign in — that account is the owner.

> Tip: once Theo has signed up, disable open signups in the Supabase dashboard
> (Authentication → Providers → Email → turn off "Allow new users to sign up")
> so no one else can create an account.

## Deploy (free)

**Vercel** (simplest):
1. Sign in at vercel.com with the GitHub account and import this repository.
2. Framework preset: Vite. Add the two environment variables from `.env.example`.
3. Deploy — you'll get `theo-social-studio.vercel.app`; add a custom domain later.

Netlify works identically (build command `npm run build`, publish directory `dist`).

## Supabase dashboard

Manage data, auth, and backups at
[supabase.com/dashboard/project/ehapjmliqboqikwspqvz](https://supabase.com/dashboard/project/ehapjmliqboqikwspqvz).

Recommended settings to review:
- **Authentication → Email**: disable signups after Theo registers (see above).
- **Authentication → URL configuration**: add the deployed site URL.
- **Database → Backups**: confirm daily backups are on.

## Metricool workflow

Metricool remains the scheduling/analytics engine; this platform is the business
system around it:

1. Each client = one Metricool **brand** with their channels connected.
2. Plan content here (Content Calendar) → schedule it in Metricool → mark it
   `published` here.
3. Monthly: pull each client's Metricool report and store the headline numbers in
   `analytics_snapshots` (a future enhancement can automate this via the Metricool
   API on their Advanced plan).

## Website lead form

The public marketing site (Base44 today, or a page added to this app later) can post
enquiries straight into the database — RLS allows anonymous inserts to `leads` only:

```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
await supabase.from('leads').insert({ name, email, company, message, source: 'website' })
```

New leads appear on the Leads page and in the dashboard count.

## Suggested next steps

- Invoices page in the app (table and schema already exist).
- Analytics page charting `analytics_snapshots` per client.
- Automate Metricool report import via an Edge Function.
- Public marketing pages (services are already readable anonymously from `services`).
