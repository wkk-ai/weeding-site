-- Gift photos, guest party size, gift messages

alter table public.gifts
  add column if not exists photo_url text;

alter table public.guests
  add column if not exists plus_one_name text,
  add column if not exists party_size integer not null default 1,
  add column if not exists kids integer not null default 0;

alter table public.transactions
  add column if not exists message text;

alter table public.tenants
  add column if not exists custom_domain text;
