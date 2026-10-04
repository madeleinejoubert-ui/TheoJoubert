-- Online sign-ups: which plan, and which Client Agreement version was accepted when
alter table public.leads
  add column plan text check (plan in ('starter','growth','pro')),
  add column terms_version text,
  add column terms_accepted_at timestamptz;
