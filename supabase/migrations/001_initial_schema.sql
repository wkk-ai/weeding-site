-- Wedding Site Creator — initial schema

create extension if not exists "pgcrypto";

create type plan_type as enum ('free', 'essential', 'complete');
create type rsvp_status as enum ('pending', 'confirmed', 'declined');
create type gift_status as enum ('active', 'funded', 'hidden');
create type transaction_status as enum ('pending', 'confirmed', 'failed', 'refunded');
create type payment_method as enum ('pix', 'card');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  partner1_name text not null,
  partner2_name text not null,
  wedding_date date not null,
  plan plan_type not null default 'free',
  plan_paid_at timestamptz,
  published boolean not null default false,
  password_hash text,
  asaas_wallet_id text,
  pix_key text,
  site_password text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  template_id text not null default 'classic',
  theme_color text not null default '#8b5a6b',
  content jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  rsvp_status rsvp_status not null default 'pending',
  meal_choice text,
  plus_one boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  price_cents integer not null check (price_cents > 0),
  funded_cents integer not null default 0 check (funded_cents >= 0),
  status gift_status not null default 'active',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  gift_id uuid references public.gifts(id) on delete set null,
  guest_name text not null,
  guest_email text,
  amount_cents integer not null,
  platform_fee_cents integer not null default 0,
  processing_fee_cents integer not null default 0,
  payment_method payment_method not null,
  status transaction_status not null default 'pending',
  asaas_payment_id text unique,
  created_at timestamptz not null default now()
);

create table public.domains (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  domain text not null unique,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_tenants_user on public.tenants(user_id);
create index idx_tenants_slug on public.tenants(slug);
create index idx_guests_tenant on public.guests(tenant_id);
create index idx_gifts_tenant on public.gifts(tenant_id);
create index idx_transactions_tenant on public.transactions(tenant_id);

alter table public.tenants enable row level security;
alter table public.sites enable row level security;
alter table public.guests enable row level security;
alter table public.gifts enable row level security;
alter table public.transactions enable row level security;
alter table public.domains enable row level security;

-- Tenants: owners only
create policy "tenants_select_own" on public.tenants
  for select using (auth.uid() = user_id);

create policy "tenants_insert_own" on public.tenants
  for insert with check (auth.uid() = user_id);

create policy "tenants_update_own" on public.tenants
  for update using (auth.uid() = user_id);

create policy "tenants_delete_own" on public.tenants
  for delete using (auth.uid() = user_id);

-- Public read published tenants by slug (via service role in API)
create policy "tenants_public_published" on public.tenants
  for select using (published = true);

-- Sites
create policy "sites_owner" on public.sites
  for all using (
    tenant_id in (select id from public.tenants where user_id = auth.uid())
  );

create policy "sites_public_published" on public.sites
  for select using (
    tenant_id in (select id from public.tenants where published = true)
  );

-- Guests: owner CRUD
create policy "guests_owner" on public.guests
  for all using (
    tenant_id in (select id from public.tenants where user_id = auth.uid())
  );

-- Gifts: owner CRUD + public read when published
create policy "gifts_owner" on public.gifts
  for all using (
    tenant_id in (select id from public.tenants where user_id = auth.uid())
  );

create policy "gifts_public" on public.gifts
  for select using (
    tenant_id in (select id from public.tenants where published = true)
    and status != 'hidden'
  );

-- Transactions: owner read only
create policy "transactions_owner_select" on public.transactions
  for select using (
    tenant_id in (select id from public.tenants where user_id = auth.uid())
  );

-- Domains: owner
create policy "domains_owner" on public.domains
  for all using (
    tenant_id in (select id from public.tenants where user_id = auth.uid())
  );

-- Storage bucket for wedding photos
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do nothing;

create policy "photos_public_read" on storage.objects
  for select using (bucket_id = 'wedding-photos');

create policy "photos_owner_upload" on storage.objects
  for insert with check (
    bucket_id = 'wedding-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "photos_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'wedding-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
