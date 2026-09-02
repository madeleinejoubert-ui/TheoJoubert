# Handover Runbook — Moving the Platform to Theo's Own Accounts

The platform is being built under Madeleine's accounts. When the build and automation
are complete, everything moves to accounts Theo owns. Nothing is trapped: the schema
lives in `supabase/migrations/`, the functions in `supabase/functions/`, and the app in
this repo — so the handover is account moves plus secret swaps.

## Order of operations

### 1. Theo creates his own accounts (before anything moves)

- **GitHub** account (free).
- **Supabase** account + organization (the project costs $10/month on a paid org;
  the free tier also works for one project if he starts fresh).
- **Anthropic Console** account at console.anthropic.com → create an API key
  (this is the "link his own Claude account" step — the `ai-draft` function is already
  wired for it).
- **Metricool** account on Advanced (API access + multi-brand) — brands re-connect to
  his account, and he generates his own userToken/userId under Settings → API.
- **Vercel** account (free) for hosting the app.

### 2. Transfer the GitHub repository

GitHub → repo **Settings → General → Danger Zone → Transfer ownership** → Theo's
username. The repo URL redirects automatically; Theo then adds Madeleine as a
collaborator if she's still helping.

### 3. Move the Supabase project — two options

**Option A — transfer the live project (keeps all data):**
Supabase dashboard → Project Settings → General → **Transfer project** to Theo's
organization (he must accept from his account). Billing moves with it.

**Option B — fresh project under Theo (clean start, no data migration):**
1. Theo creates a new project (London / eu-west-2).
2. Run every file in `supabase/migrations/` in order (SQL editor or `supabase db push`).
   ⚠️ Before running `20260902141000_schedule_metricool_sync.sql`, replace the project
   URL and anon key inside it with the new project's values.
3. Deploy both edge functions: `supabase functions deploy metricool-sync ai-draft`.
4. Update `.env` / Vercel env vars with the new project URL + publishable key.

### 4. Set the secrets (Supabase → Edge Functions → Secrets)

| Secret | Value | Powers |
|---|---|---|
| `METRICOOL_USER_TOKEN` | Metricool Settings → API | nightly analytics sync |
| `METRICOOL_USER_ID` | Metricool Settings → API | nightly analytics sync |
| `ANTHROPIC_API_KEY` | console.anthropic.com | AI post drafting |
| `ANTHROPIC_MODEL` (optional) | e.g. `claude-opus-5` | model override |

Then set each client's **Metricool brand id** on their client record and tick their
social accounts as connected — the 05:30 sync picks them up the next morning.

### 5. Repoint hosting and auth

- Vercel: import the (now Theo-owned) repo, set the two `VITE_*` env vars, deploy;
  add the custom domain.
- Supabase → Authentication → URL configuration: set the deployed site URL.
- Supabase → Authentication → Email: **signups stay open** (client logins depend on
  it — new signups only get access if their email matches a client record; anyone
  else lands in the "pending" holding screen with no data access).

### 6. Decommission on Madeleine's side (after verifying the move)

- Pause or delete the old `theo-social-studio` project (stops the $10/month).
- Remove any leftover Vercel deployment under Madeleine's account.
- Rotate the Metricool token if it was ever shared during the build.

## What each automation needs to stay alive after handover

| Automation | Depends on |
|---|---|
| Nightly Metricool → Supabase analytics sync (pg_cron, 05:30 UTC) | `METRICOOL_*` secrets + per-client brand ids + connected accounts |
| AI drafting (`ai-draft` function, owner-only) | `ANTHROPIC_API_KEY` secret |
| Client logins auto-linking | client records carrying the client's real email |
