-- 008_seed.sql
-- =============================================================================
-- HoReCa BOSS — demo seed data.
--
-- Idempotent: re-runnable against an existing database. Inserts a single demo
-- restaurant ("HoReCa BOSS — Demo") with the four zones the frontend already
-- references (Main Hall / Terrace / VIP Room / Window Table), realistic
-- tables, opening hours, and a couple of sample blocked slots.
--
-- The demo restaurant has a stable, well-known UUID so the frontend can hard-
-- code it via NEXT_PUBLIC_DEMO_RESTAURANT_ID:
--   00000000-0000-0000-0000-00000000d0a1
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Demo restaurant
-- -----------------------------------------------------------------------------
insert into public.restaurants (id, slug, name, timezone, is_active)
values (
  '00000000-0000-0000-0000-00000000d0a1',
  'demo',
  'HoReCa BOSS — Demo',
  'Europe/Kyiv',
  true
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  timezone = excluded.timezone,
  is_active = excluded.is_active;

-- -----------------------------------------------------------------------------
-- Settings
-- -----------------------------------------------------------------------------
insert into public.restaurant_settings (
  restaurant_id,
  default_reservation_minutes,
  slot_granularity_minutes,
  min_party_size, max_party_size,
  booking_window_days, min_lead_time_minutes,
  allow_walkins, auto_confirm_reservations
) values (
  '00000000-0000-0000-0000-00000000d0a1',
  90, 15,
  1, 12,
  60, 30,
  true, true
)
on conflict (restaurant_id) do update set
  default_reservation_minutes = excluded.default_reservation_minutes,
  slot_granularity_minutes    = excluded.slot_granularity_minutes,
  min_party_size              = excluded.min_party_size,
  max_party_size              = excluded.max_party_size,
  booking_window_days         = excluded.booking_window_days,
  min_lead_time_minutes       = excluded.min_lead_time_minutes,
  allow_walkins               = excluded.allow_walkins,
  auto_confirm_reservations   = excluded.auto_confirm_reservations;

-- -----------------------------------------------------------------------------
-- Zones — slugs match RESERVATION_ZONES on the frontend
--   main, terrace, vip, window
-- -----------------------------------------------------------------------------
insert into public.zones (restaurant_id, slug, name, description, display_order, is_active)
values
  ('00000000-0000-0000-0000-00000000d0a1', 'main',    'Main Hall',    'Cozy seating in the main dining room.', 0, true),
  ('00000000-0000-0000-0000-00000000d0a1', 'terrace', 'Terrace',      'Open-air terrace, weather permitting.', 1, true),
  ('00000000-0000-0000-0000-00000000d0a1', 'vip',     'VIP Room',     'Private room for groups, by reservation.', 2, true),
  ('00000000-0000-0000-0000-00000000d0a1', 'window',  'Window Table', 'Tables along the front windows.',         3, true)
on conflict (restaurant_id, slug) do update set
  name          = excluded.name,
  description   = excluded.description,
  display_order = excluded.display_order,
  is_active     = excluded.is_active;

-- -----------------------------------------------------------------------------
-- Tables — laid out roughly to mirror the existing demo floor plan
-- -----------------------------------------------------------------------------
with z as (
  select id, slug from public.zones
  where restaurant_id = '00000000-0000-0000-0000-00000000d0a1'
)
insert into public.tables (restaurant_id, zone_id, code, label, seats, shape, pos_x, pos_y, status, is_active)
select '00000000-0000-0000-0000-00000000d0a1', z.id, t.code, t.label, t.seats, t.shape, t.pos_x, t.pos_y, 'available'::table_status, true
from (values
  -- Main Hall
  ('main', 'M1',  'Table 1',  2, 'rect',    60,  60),
  ('main', 'M2',  'Table 2',  2, 'rect',   240,  60),
  ('main', 'M3',  'Table 3',  4, 'rect',   420,  60),
  ('main', 'M4',  'Table 4',  4, 'rect',    60, 220),
  ('main', 'M5',  'Table 5',  6, 'circle', 240, 220),

  -- Terrace
  ('terrace', 'T6', 'Terrace 1', 2, 'rect',   600,  60),
  ('terrace', 'T7', 'Terrace 2', 4, 'rect',   600, 220),
  ('terrace', 'T8', 'Terrace 3', 6, 'circle', 420, 220),

  -- VIP
  ('vip', 'V9',  'VIP 9',  8, 'circle',  60, 400),
  ('vip', 'V10', 'VIP 10', 4, 'rect',   300, 400),

  -- Window
  ('window', 'W11', 'Window 1', 2, 'rect',   60, 540),
  ('window', 'W12', 'Window 2', 2, 'rect',  220, 540),
  ('window', 'W13', 'Window 3', 4, 'rect',  380, 540)
) as t(zone_slug, code, label, seats, shape, pos_x, pos_y)
join z on z.slug = t.zone_slug
on conflict (restaurant_id, code) do update set
  zone_id = excluded.zone_id,
  label   = excluded.label,
  seats   = excluded.seats,
  shape   = excluded.shape,
  pos_x   = excluded.pos_x,
  pos_y   = excluded.pos_y,
  is_active = excluded.is_active;

-- -----------------------------------------------------------------------------
-- Opening hours — Mon–Thu 12:00–23:00, Fri–Sat 12:00–24:00, Sun 12:00–22:00
-- (day_of_week: 0 = Sun, 1 = Mon … 6 = Sat)
-- -----------------------------------------------------------------------------
delete from public.opening_hours where restaurant_id = '00000000-0000-0000-0000-00000000d0a1';

insert into public.opening_hours (restaurant_id, day_of_week, start_time, end_time, is_closed) values
  ('00000000-0000-0000-0000-00000000d0a1', 0, '12:00', '22:00', false),  -- Sunday
  ('00000000-0000-0000-0000-00000000d0a1', 1, '12:00', '23:00', false),
  ('00000000-0000-0000-0000-00000000d0a1', 2, '12:00', '23:00', false),
  ('00000000-0000-0000-0000-00000000d0a1', 3, '12:00', '23:00', false),
  ('00000000-0000-0000-0000-00000000d0a1', 4, '12:00', '23:00', false),
  ('00000000-0000-0000-0000-00000000d0a1', 5, '12:00', '23:59', false),  -- Friday
  ('00000000-0000-0000-0000-00000000d0a1', 6, '12:00', '23:59', false);  -- Saturday

-- -----------------------------------------------------------------------------
-- A couple of demo blocked slots so QA can see the engine in action
-- -----------------------------------------------------------------------------
-- Block "VIP Room" for a private event tomorrow 19:00–22:00 (local)
delete from public.blocked_slots
where restaurant_id = '00000000-0000-0000-0000-00000000d0a1'
  and reason in ('Demo private event', 'Demo maintenance');

with z as (
  select id from public.zones
  where restaurant_id = '00000000-0000-0000-0000-00000000d0a1' and slug = 'vip'
)
insert into public.blocked_slots (restaurant_id, zone_id, table_id, starts_at, ends_at, reason)
select
  '00000000-0000-0000-0000-00000000d0a1',
  z.id, null,
  (date_trunc('day', (now() at time zone 'Europe/Kyiv')) + interval '1 day 19 hours') at time zone 'Europe/Kyiv',
  (date_trunc('day', (now() at time zone 'Europe/Kyiv')) + interval '1 day 22 hours') at time zone 'Europe/Kyiv',
  'Demo private event'
from z;
