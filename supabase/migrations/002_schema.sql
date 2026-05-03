-- 002_schema.sql
-- =============================================================================
-- HoReCa BOSS — core schema.
--
-- Multi-restaurant from day one (every row is scoped by restaurant_id).
-- Designed to host:
--   * reservations (this milestone)
--   * orders / KDS  (future milestone — orders, order_items already declared)
--
-- All timestamps are timestamptz. Wall-clock semantics are derived from
-- restaurants.timezone via the RPC layer, never from the client.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$ begin
  create type reservation_status as enum (
    'pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type table_status as enum (
    'available', 'occupied', 'reserved', 'cleaning', 'inactive'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type staff_role as enum (
    'owner', 'manager', 'host', 'waiter', 'kitchen', 'viewer'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'open', 'sent_to_kitchen', 'preparing', 'ready', 'served', 'paid', 'cancelled'
  );
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Helpers — single shared updated_at trigger function
-- -----------------------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- restaurants  — tenant root
-- -----------------------------------------------------------------------------
create table if not exists public.restaurants (
  id          uuid primary key default gen_random_uuid(),
  slug        citext not null unique,
  name        text not null,
  timezone    text not null default 'Europe/Kyiv',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_restaurants_updated_at on public.restaurants;
create trigger trg_restaurants_updated_at
before update on public.restaurants
for each row execute function public.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- restaurant_settings — 1:1 with restaurants
-- -----------------------------------------------------------------------------
create table if not exists public.restaurant_settings (
  restaurant_id                       uuid primary key references public.restaurants(id) on delete cascade,
  default_reservation_minutes         int not null default 90,
  slot_granularity_minutes            int not null default 15,
  min_party_size                      int not null default 1,
  max_party_size                      int not null default 20,
  booking_window_days                 int not null default 60,
  min_lead_time_minutes               int not null default 0,
  allow_walkins                       boolean not null default true,
  auto_confirm_reservations           boolean not null default true,
  created_at                          timestamptz not null default now(),
  updated_at                          timestamptz not null default now()
);

drop trigger if exists trg_restaurant_settings_updated_at on public.restaurant_settings;
create trigger trg_restaurant_settings_updated_at
before update on public.restaurant_settings
for each row execute function public.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- zones — Main Hall, Terrace, VIP Room, Window Table, …
-- -----------------------------------------------------------------------------
create table if not exists public.zones (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  slug          text not null,
  name          text not null,
  description   text,
  display_order int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (restaurant_id, slug)
);

drop trigger if exists trg_zones_updated_at on public.zones;
create trigger trg_zones_updated_at
before update on public.zones
for each row execute function public.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- tables (a.k.a. restaurant tables) — physical seating
-- -----------------------------------------------------------------------------
create table if not exists public.tables (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  zone_id         uuid references public.zones(id) on delete set null,
  code            text not null,                       -- "T1", "VIP-3"
  label           text,
  seats           int  not null,
  shape           text not null default 'rect',        -- 'rect' | 'circle'
  pos_x           int  not null default 0,
  pos_y           int  not null default 0,
  status          table_status not null default 'available',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (restaurant_id, code)
);

drop trigger if exists trg_tables_updated_at on public.tables;
create trigger trg_tables_updated_at
before update on public.tables
for each row execute function public.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- reservations — main entity. Bookings live here.
--
-- guest_phone and guest_email are OPTIONAL on purpose:
--   * The product never identifies a guest by phone number.
--   * Guests are only required to provide a name and party_size.
-- -----------------------------------------------------------------------------
create table if not exists public.reservations (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  table_id        uuid references public.tables(id) on delete set null,
  zone_id         uuid references public.zones(id)  on delete set null,

  status          reservation_status not null default 'pending',
  party_size      int  not null,

  starts_at       timestamptz not null,
  ends_at         timestamptz not null,

  guest_name      text not null,
  guest_phone     text,                      -- optional
  guest_email     citext,                    -- optional
  notes           text,

  source          text not null default 'online',
  external_ref    text,

  created_by      uuid references auth.users(id) on delete set null,
  cancelled_at    timestamptz,
  cancelled_by    uuid references auth.users(id) on delete set null,
  cancellation_reason text,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_reservations_updated_at on public.reservations;
create trigger trg_reservations_updated_at
before update on public.reservations
for each row execute function public.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- reservation_status_history — audit log
-- -----------------------------------------------------------------------------
create table if not exists public.reservation_status_history (
  id              bigserial primary key,
  reservation_id  uuid not null references public.reservations(id) on delete cascade,
  from_status     reservation_status,
  to_status       reservation_status not null,
  changed_by      uuid references auth.users(id) on delete set null,
  reason          text,
  changed_at      timestamptz not null default now()
);

create or replace function public.tg_reservation_status_history()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.reservation_status_history(reservation_id, from_status, to_status, changed_by)
    values (new.id, null, new.status, new.created_by);
    return new;
  end if;

  if (tg_op = 'UPDATE' and new.status is distinct from old.status) then
    insert into public.reservation_status_history(reservation_id, from_status, to_status, changed_by, reason)
    values (new.id, old.status, new.status, auth.uid(), new.cancellation_reason);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reservations_status_history on public.reservations;
create trigger trg_reservations_status_history
after insert or update of status on public.reservations
for each row execute function public.tg_reservation_status_history();

-- -----------------------------------------------------------------------------
-- staff_profiles — staff↔restaurant↔role.
-- A user can hold roles at multiple restaurants (compound unique).
-- -----------------------------------------------------------------------------
create table if not exists public.staff_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  role            staff_role not null default 'viewer',
  full_name       text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, restaurant_id)
);

drop trigger if exists trg_staff_profiles_updated_at on public.staff_profiles;
create trigger trg_staff_profiles_updated_at
before update on public.staff_profiles
for each row execute function public.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- opening_hours — weekly recurring schedule.
-- day_of_week uses ISO style: 0 = Sunday … 6 = Saturday (matches JS Date#getDay).
-- -----------------------------------------------------------------------------
create table if not exists public.opening_hours (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  day_of_week     int  not null,
  start_time      time not null,
  end_time        time not null,
  is_closed       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_opening_hours_updated_at on public.opening_hours;
create trigger trg_opening_hours_updated_at
before update on public.opening_hours
for each row execute function public.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- blocked_slots — private events / closures, optionally scoped to a zone or table
-- -----------------------------------------------------------------------------
create table if not exists public.blocked_slots (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  zone_id         uuid references public.zones(id)  on delete cascade,
  table_id        uuid references public.tables(id) on delete cascade,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  reason          text,
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_blocked_slots_updated_at on public.blocked_slots;
create trigger trg_blocked_slots_updated_at
before update on public.blocked_slots
for each row execute function public.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- Future-ready: orders / order_items (KDS milestone — not active yet)
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  table_id        uuid references public.tables(id) on delete set null,
  reservation_id  uuid references public.reservations(id) on delete set null,
  status          order_status not null default 'open',
  opened_at       timestamptz not null default now(),
  closed_at       timestamptz,
  total_cents     int not null default 0,
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.tg_set_updated_at();

create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  name              text not null,
  qty               int  not null,
  unit_price_cents  int  not null,
  notes             text,
  created_at        timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Indexes — read paths and joins
-- -----------------------------------------------------------------------------
create index if not exists idx_zones_restaurant
  on public.zones (restaurant_id) where is_active = true;

create index if not exists idx_tables_restaurant_zone
  on public.tables (restaurant_id, zone_id) where is_active = true;

create index if not exists idx_tables_capacity
  on public.tables (restaurant_id, seats) where is_active = true;

create index if not exists idx_reservations_restaurant_starts
  on public.reservations (restaurant_id, starts_at);

create index if not exists idx_reservations_restaurant_status_starts
  on public.reservations (restaurant_id, status, starts_at);

create index if not exists idx_reservations_table_starts
  on public.reservations (table_id, starts_at) where status in ('pending','confirmed','seated');

create index if not exists idx_reservations_guest_name_trgm
  on public.reservations using gin (guest_name gin_trgm_ops);

create unique index if not exists uniq_opening_hours_day
  on public.opening_hours (restaurant_id, day_of_week, start_time);

create index if not exists idx_blocked_slots_restaurant_starts
  on public.blocked_slots (restaurant_id, starts_at, ends_at);

create index if not exists idx_staff_profiles_user
  on public.staff_profiles (user_id);

create index if not exists idx_staff_profiles_restaurant_role
  on public.staff_profiles (restaurant_id, role) where is_active = true;

create index if not exists idx_orders_restaurant_status
  on public.orders (restaurant_id, status);

create index if not exists idx_order_items_order
  on public.order_items (order_id);
