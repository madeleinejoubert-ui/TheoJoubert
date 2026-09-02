-- Theo Social Studio: core business schema
-- Applied to project theo-social-studio (ehapjmliqboqikwspqvz) on 2026-09-02.
-- Clients, social accounts, content calendar, Metricool analytics, invoicing, leads

-- ============ PROFILES (app users: Theo, future assistants) ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'owner' check (role in ('owner','assistant')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Auto-create a profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ CLIENTS ============
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  email text,
  phone text,
  website text,
  status text not null default 'lead' check (status in ('lead','proposal','active','paused','ended')),
  package text,
  monthly_fee numeric(10,2),
  start_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Authenticated users manage clients"
  on public.clients for all
  to authenticated
  using (true)
  with check (true);

-- ============ SOCIAL ACCOUNTS (per client, tracked in Metricool) ============
create table public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  platform text not null check (platform in ('instagram','facebook','tiktok','linkedin','x','youtube','pinterest','threads','google_business')),
  handle text not null,
  profile_url text,
  connected_in_metricool boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.social_accounts enable row level security;

create policy "Authenticated users manage social accounts"
  on public.social_accounts for all
  to authenticated
  using (true)
  with check (true);

-- ============ CONTENT ITEMS (content calendar) ============
create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  copy_text text,
  platform text not null check (platform in ('instagram','facebook','tiktok','linkedin','x','youtube','pinterest','threads','google_business')),
  content_type text not null default 'post' check (content_type in ('post','reel','story','carousel','video','article','live')),
  status text not null default 'idea' check (status in ('idea','draft','awaiting_approval','approved','scheduled','published','cancelled')),
  scheduled_at timestamptz,
  published_at timestamptz,
  asset_url text,
  metricool_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_items_client_idx on public.content_items (client_id);
create index content_items_scheduled_idx on public.content_items (scheduled_at);

alter table public.content_items enable row level security;

create policy "Authenticated users manage content"
  on public.content_items for all
  to authenticated
  using (true)
  with check (true);

-- ============ ANALYTICS SNAPSHOTS (imported from Metricool reports) ============
create table public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  platform text not null,
  period_start date not null,
  period_end date not null,
  followers integer,
  net_follower_change integer,
  impressions integer,
  reach integer,
  engagements integer,
  engagement_rate numeric(6,3),
  link_clicks integer,
  posts_published integer,
  source text not null default 'metricool',
  raw jsonb,
  created_at timestamptz not null default now()
);

create index analytics_client_period_idx on public.analytics_snapshots (client_id, period_start);

alter table public.analytics_snapshots enable row level security;

create policy "Authenticated users manage analytics"
  on public.analytics_snapshots for all
  to authenticated
  using (true)
  with check (true);

-- ============ SERVICES (packages Theo sells) ============
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_monthly numeric(10,2),
  price_oneoff numeric(10,2),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Anyone can view active services"
  on public.services for select
  to anon, authenticated
  using (active = true);

create policy "Authenticated users manage services"
  on public.services for all
  to authenticated
  using (true)
  with check (true);

-- ============ INVOICES (simple record-keeping; Making Tax Digital friendly) ============
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete restrict,
  invoice_number text not null unique,
  issue_date date not null default current_date,
  due_date date,
  amount numeric(10,2) not null,
  vat_amount numeric(10,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','sent','paid','overdue','void')),
  paid_at date,
  notes text,
  created_at timestamptz not null default now()
);

create index invoices_client_idx on public.invoices (client_id);

alter table public.invoices enable row level security;

create policy "Authenticated users manage invoices"
  on public.invoices for all
  to authenticated
  using (true)
  with check (true);

-- ============ LEADS (enquiries from the public website) ============
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text,
  source text default 'website',
  status text not null default 'new' check (status in ('new','contacted','qualified','converted','closed')),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Public website contact form can submit a lead, but never read them back
create policy "Anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users manage leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated users update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users delete leads"
  on public.leads for delete
  to authenticated
  using (true);

-- ============ updated_at maintenance ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

create trigger content_items_set_updated_at
  before update on public.content_items
  for each row execute function public.set_updated_at();
