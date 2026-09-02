-- Client portal + AI content pipeline
-- Adds client logins (auto-linked by email), per-client row security,
-- the approval workflow (AI drafts -> Theo curates -> client approves),
-- and brand-voice fields that feed the AI drafting function.

-- ============ ROLES ============
alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('owner','assistant','client','pending'));
alter table public.profiles add column client_id uuid references public.clients(id) on delete set null;

-- New signups: client email match -> client; first ever user -> owner; else pending
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  v_client uuid;
  v_role text;
begin
  select id into v_client
  from public.clients
  where lower(email) = lower(new.email)
  limit 1;

  if v_client is not null then
    v_role := 'client';
  elsif not exists (select 1 from public.profiles) then
    v_role := 'owner';
  else
    v_role := 'pending';
  end if;

  insert into public.profiles (id, full_name, role, client_id)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), v_role, v_client);
  return new;
end;
$$;

-- Role helpers (security definer so policies can read profiles without recursion)
create or replace function public.app_role()
returns text
language sql stable
security definer set search_path = ''
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.app_client_id()
returns uuid
language sql stable
security definer set search_path = ''
as $$
  select client_id from public.profiles where id = auth.uid()
$$;

create or replace function public.is_owner()
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select coalesce((select role from public.profiles where id = auth.uid()) in ('owner','assistant'), false)
$$;

revoke execute on function public.app_role(), public.app_client_id(), public.is_owner() from anon, public;
grant execute on function public.app_role(), public.app_client_id(), public.is_owner() to authenticated;

-- ============ BRAND VOICE (feeds the AI drafting function) ============
alter table public.clients
  add column brand_voice text,
  add column target_audience text,
  add column content_pillars text,
  add column default_hashtags text;

comment on column public.clients.brand_voice is 'Tone of voice notes the AI drafting function writes in.';
comment on column public.clients.content_pillars is 'Recurring themes/topics, comma separated.';

-- ============ APPROVAL WORKFLOW COLUMNS ============
alter table public.content_items drop constraint content_items_status_check;
alter table public.content_items add constraint content_items_status_check
  check (status in ('idea','draft','awaiting_approval','changes_requested','approved','scheduled','published','cancelled'));

alter table public.content_items
  add column ai_generated boolean not null default false,
  add column ai_model text,
  add column approved_at timestamptz,
  add column approved_by uuid references auth.users(id) on delete set null,
  add column client_feedback text;

-- ============ RLS REWRITE: owner manages everything, clients see their own ============

-- clients
drop policy "Authenticated users manage clients" on public.clients;
create policy "Owner manages clients"
  on public.clients for all to authenticated
  using (public.is_owner()) with check (public.is_owner());
create policy "Clients view own record"
  on public.clients for select to authenticated
  using (id = public.app_client_id());

-- social_accounts: clients can add and manage their own handles
drop policy "Authenticated users manage social accounts" on public.social_accounts;
create policy "Owner manages social accounts"
  on public.social_accounts for all to authenticated
  using (public.is_owner()) with check (public.is_owner());
create policy "Clients manage own social accounts"
  on public.social_accounts for all to authenticated
  using (client_id = public.app_client_id())
  with check (client_id = public.app_client_id());

-- content_items: clients see items sent to them; can only approve or request changes
drop policy "Authenticated users manage content" on public.content_items;
create policy "Owner manages content"
  on public.content_items for all to authenticated
  using (public.is_owner()) with check (public.is_owner());
create policy "Clients view own content"
  on public.content_items for select to authenticated
  using (
    client_id = public.app_client_id()
    and status in ('awaiting_approval','changes_requested','approved','scheduled','published')
  );
create policy "Clients decide on content awaiting approval"
  on public.content_items for update to authenticated
  using (client_id = public.app_client_id() and status = 'awaiting_approval')
  with check (client_id = public.app_client_id() and status in ('approved','changes_requested'));

-- analytics_snapshots
drop policy "Authenticated users manage analytics" on public.analytics_snapshots;
create policy "Owner manages analytics"
  on public.analytics_snapshots for all to authenticated
  using (public.is_owner()) with check (public.is_owner());
create policy "Clients view own analytics"
  on public.analytics_snapshots for select to authenticated
  using (client_id = public.app_client_id());

-- invoices
drop policy "Authenticated users manage invoices" on public.invoices;
create policy "Owner manages invoices"
  on public.invoices for all to authenticated
  using (public.is_owner()) with check (public.is_owner());
create policy "Clients view own invoices"
  on public.invoices for select to authenticated
  using (client_id = public.app_client_id());

-- services
drop policy "Authenticated users manage services" on public.services;
create policy "Owner manages services"
  on public.services for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- leads
drop policy "Authenticated users manage leads" on public.leads;
drop policy "Authenticated users update leads" on public.leads;
drop policy "Authenticated users delete leads" on public.leads;
create policy "Owner views leads"
  on public.leads for select to authenticated using (public.is_owner());
create policy "Owner updates leads"
  on public.leads for update to authenticated
  using (public.is_owner()) with check (public.is_owner());
create policy "Owner deletes leads"
  on public.leads for delete to authenticated using (public.is_owner());

-- profiles: owner can see all profiles (to manage client access)
create policy "Owner views all profiles"
  on public.profiles for select to authenticated
  using (public.is_owner());