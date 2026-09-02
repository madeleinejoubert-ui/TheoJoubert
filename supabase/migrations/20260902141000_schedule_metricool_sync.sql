-- One snapshot per client+platform+period so the daily sync upserts instead of duplicating
create unique index analytics_snapshots_unique_period
  on public.analytics_snapshots (client_id, platform, period_start, period_end);

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- 05:30 UTC daily: refresh rolling-30-day Metricool snapshots for every linked client.
-- The Authorization header carries the project's PUBLIC anon key (safe to store; the
-- edge function still requires Metricool secrets to do anything).
select cron.schedule(
  'metricool-sync-daily',
  '30 5 * * *',
  $$
  select net.http_post(
    url := 'https://ehapjmliqboqikwspqvz.supabase.co/functions/v1/metricool-sync',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYXBqbWxpcWJvcWlrd3NwcXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTE2MzEsImV4cCI6MjEwMzkyNzYzMX0.JWaHQTKB_6S6kogcKeNmwugJJJjp45fWFxH-Z5xZUcQ"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);
