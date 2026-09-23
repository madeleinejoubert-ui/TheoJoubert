-- Richer lead capture for the Lantern Social website's Free Review form
alter table public.leads
  add column business_name text,
  add column phone text,
  add column website text,
  add column industry text,
  add column location text,
  add column main_platform text,
  add column profile_url text,
  add column biggest_challenge text,
  add column budget_range text,
  add column preferred_contact text,
  add column gdpr_consent boolean not null default false;
