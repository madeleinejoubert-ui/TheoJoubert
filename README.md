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

- **Clients** — pipeline from lead → proposal → active, with packages and fees.
- **Content Calendar** — plan posts per client/platform, mirror what's scheduled in
  Metricool, track idea → approved → published.
- **Leads** — the public website form writes straight into the database; enquiries
  show up here.
- **Dashboard** — active clients, posts scheduled this week, new leads, unpaid invoices.
- **Ready in the schema** (UI to come): invoices, Metricool analytics snapshots,
  per-client social account register.
