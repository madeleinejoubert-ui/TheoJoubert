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
Theo's email. Confirm the email, sign in — **the first account ever created becomes the
owner** automatically.

> Signups must STAY OPEN: clients log in through the same screen. A new signup only
> gets access if its email matches a client record (it becomes a client-portal login
> for that client); any other signup lands in a "pending" holding screen with no data
> access. So: add the client with their real email first, then invite them to sign up.

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
- **Authentication → URL configuration**: add the deployed site URL.
- **Database → Backups**: confirm daily backups are on.
- **Edge Functions → Secrets**: this is where the automations get their keys —
  `METRICOOL_USER_TOKEN` + `METRICOOL_USER_ID` (nightly analytics sync) and
  `ANTHROPIC_API_KEY` (AI drafting; Theo's own Claude key at handover).

## The AI content pipeline (and where the human line sits)

```
Claude drafts  →  Theo curates  →  Client approves copy + timing  →  Scheduled in Metricool  →  Published
   (AI)            (human #1)         (human #2, in the portal)          (human-operated)
```

- **AI drafts**: the `ai-draft` edge function (owner-only) writes posts in the client's
  brand voice from the fields on their client record. Everything it creates is status
  `draft`, flagged `ai_generated`, and visible only to Theo.
- **Theo curates**: edits the keepers and moves them to `awaiting approval` on the
  Content Calendar.
- **Client approves**: in the portal, the client sees the copy and the proposed time,
  and either approves or sends it back with a note (`changes requested`). Row-level
  security means a client can *only* flip `awaiting_approval` items to approved or
  changes-requested — nothing else, and never another client's.
- **Publish**: only approved items get scheduled in Metricool. The AI never touches a
  social network.

## Brand kit, content library, and Base44 sample webpages

Built for very small businesses starting social media from zero:

- **Brand Kit** (client portal): the client picks one of six curated colour schemes
  (fine-tunable per swatch), uploads a logo, and writes a one-line tagline. Saved via
  the `save_brand_kit` RPC so clients can never touch fees or status fields.
- **Content Library** (client portal): drag-in uploads of photos, videos, and
  documents to the private `client-assets` storage bucket (50 MB/file). Storage
  policies confine each client to their own folder. Theo sees everything under
  **Brand & Library** in the studio console.
- **AI uses all of it**: drafts are written in the brand voice and tagline, and each
  draft names a real photo from the client's library to use.
- **Base44 sample webpages**: every client has an unguessable share token. The
  `brand-kit` edge function returns their kit as JSON — colours, logo, tagline,
  sample photos (7-day signed URLs), social handles:

  ```
  GET https://ehapjmliqboqikwspqvz.supabase.co/functions/v1/brand-kit?token=<share_token>
  Header: apikey: <project anon key>
  ```

  The exact URL per client (copy button included) is on the **Brand & Library** page.
  Point the Base44 app at it to spin up a sample site in the client's branding.
  Rotating `share_token` on the client row revokes an old link.

## Nightly Metricool analytics sync

The `metricool-sync` edge function runs at 05:30 UTC daily (pg_cron) and pulls a
rolling 30-day snapshot per client platform into `analytics_snapshots` — that's what
the client Overview page shows. To activate per client: set their **Metricool brand
id** on the client record and mark their social accounts as connected in Metricool.

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
