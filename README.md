# Theo Social Studio

Business platform for Theo Joubert's freelance social media management business —
built around the Metricool workflow developed for Owl Schoolhouse.

**Stack:** React + Vite frontend · Supabase (Postgres + Auth, London region) backend.

| Piece | Where |
|---|---|
| App code | `src/` — login, dashboard, clients, content calendar, leads |
| Database schema | `supabase/migrations/` (already applied to the live project) |
| Supabase project | `theo-social-studio` (`ehapjmliqboqikwspqvz`, eu-west-2) |
| How to run & deploy | [`docs/SETUP.md`](docs/SETUP.md) |
| **UK self-employment launch checklist** | [`docs/UK_SELF_EMPLOYMENT_CHECKLIST.md`](docs/UK_SELF_EMPLOYMENT_CHECKLIST.md) |

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Sign up once with Theo's email (then disable open signups in Supabase — see the
setup guide).

## What the platform does

**Studio console (Theo):**
- **Clients** — pipeline from lead → active, with packages, fees, brand voice, and
  Metricool brand link.
- **Content Calendar** — AI drafting panel (Claude writes in the client's brand
  voice), manual planning, and the approval workflow.
- **Leads** — the public website form writes straight into the database.
- **Dashboard** — active clients, posts scheduled this week, new leads, unpaid invoices.

**Client portal (each client logs in with their own email):**
- **Overview** — their Metricool numbers (synced nightly), plus what's coming up.
- **Approvals** — every post's copy and proposed time, with one-click approve or
  "request changes" with a note. Nothing goes live without the client's yes.
- **My Accounts** — they add the social profiles they want managed.

**The AI line:** `Claude drafts → Theo curates → client approves → scheduled in
Metricool`. AI only ever creates drafts; two humans stand between it and anything
being published.

**Automations (Supabase Edge Functions):**
- `metricool-sync` — nightly (05:30 UTC) pull of every client's 30-day platform
  metrics from the Metricool API into `analytics_snapshots`.
- `ai-draft` — owner-only Claude drafting; activates when Theo's own
  `ANTHROPIC_API_KEY` is added at handover (see [`docs/HANDOVER.md`](docs/HANDOVER.md)).
