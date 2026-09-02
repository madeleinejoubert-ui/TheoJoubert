-- Link each client to their Metricool brand so the sync automation knows what to pull
alter table public.clients add column metricool_blog_id text;
comment on column public.clients.metricool_blog_id is 'Metricool brand (blog) id for this client; required for automated analytics sync.';
