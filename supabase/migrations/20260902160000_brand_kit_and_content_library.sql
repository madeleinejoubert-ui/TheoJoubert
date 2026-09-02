-- Brand kit + client content library
-- Small first-time businesses arrive with no social media: give them a guided
-- brand kit (pick a colour scheme, upload a logo, one-line tagline) and a place
-- to drop photos/documents Theo can build posts from. A share token exposes the
-- brand kit as JSON so the Base44 app can spin up sample webpages in their colours.

-- ============ BRAND KIT FIELDS ============
alter table public.clients
  add column tagline text,
  add column color_scheme text,
  add column brand_colors jsonb,
  add column logo_path text,
  add column share_token uuid not null default gen_random_uuid() unique;

comment on column public.clients.brand_colors is 'JSON {primary, secondary, accent, neutral} hex colours.';
comment on column public.clients.share_token is 'Token for the public brand-kit endpoint (Base44 sample webpages).';

-- Clients update their own brand kit through this RPC (they have no direct UPDATE
-- on clients, so fees/status stay owner-only)
create or replace function public.save_brand_kit(
  p_tagline text,
  p_color_scheme text,
  p_brand_colors jsonb,
  p_logo_path text
)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if public.app_client_id() is null then
    raise exception 'No client linked to this account';
  end if;
  update public.clients
  set tagline = p_tagline,
      color_scheme = p_color_scheme,
      brand_colors = p_brand_colors,
      logo_path = coalesce(p_logo_path, logo_path)
  where id = public.app_client_id();
end;
$$;

revoke execute on function public.save_brand_kit(text, text, jsonb, text) from anon, public;
grant execute on function public.save_brand_kit(text, text, jsonb, text) to authenticated;

-- ============ ASSETS (content library records) ============
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  kind text not null default 'photo' check (kind in ('logo','photo','document','video','other')),
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  caption text,
  created_at timestamptz not null default now()
);

create index assets_client_idx on public.assets (client_id, created_at desc);

alter table public.assets enable row level security;

create policy "Owner manages assets"
  on public.assets for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

create policy "Clients manage own assets"
  on public.assets for all to authenticated
  using (client_id = public.app_client_id())
  with check (client_id = public.app_client_id());

-- ============ STORAGE BUCKET ============
insert into storage.buckets (id, name, public, file_size_limit)
values ('client-assets', 'client-assets', false, 52428800); -- 50 MB per file

-- Files live under <client_id>/<filename>; clients only reach their own folder
create policy "Owner manages client asset files"
  on storage.objects for all to authenticated
  using (bucket_id = 'client-assets' and public.is_owner())
  with check (bucket_id = 'client-assets' and public.is_owner());

create policy "Clients manage own asset files"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'client-assets'
    and (storage.foldername(name))[1] = public.app_client_id()::text
  )
  with check (
    bucket_id = 'client-assets'
    and (storage.foldername(name))[1] = public.app_client_id()::text
  );