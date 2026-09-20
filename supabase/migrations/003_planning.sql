-- Planning extras. Safe if already present.
alter table public.guests
  add column if not exists address text,
  add column if not exists events text[] not null default '{}';

alter table public.tenants
  add column if not exists city text,
  add column if not exists guest_target integer,
  add column if not exists budget_cents bigint,
  add column if not exists rite text;
