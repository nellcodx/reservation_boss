-- 003_constraints.sql
-- =============================================================================
-- HoReCa BOSS — domain constraints + double-booking prevention.
--
-- We use a partial GiST exclusion constraint so the database itself rejects
-- overlapping reservations on the same physical table:
--
--     status IN ('pending','confirmed','seated')   ->  blocks
--     status IN ('completed','cancelled','no_show') ->  ignored (free again)
--
-- This is enforced no matter how the row was inserted — RPC, direct SQL,
-- another microservice — so production safety does NOT depend on the API layer.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- restaurants
-- -----------------------------------------------------------------------------
alter table public.restaurants
  drop constraint if exists restaurants_name_not_blank,
  add  constraint restaurants_name_not_blank
       check (length(btrim(name)) > 0);

-- -----------------------------------------------------------------------------
-- restaurant_settings
-- -----------------------------------------------------------------------------
alter table public.restaurant_settings
  drop constraint if exists rs_default_minutes_pos,
  add  constraint rs_default_minutes_pos
       check (default_reservation_minutes between 15 and 360),
  drop constraint if exists rs_slot_minutes_pos,
  add  constraint rs_slot_minutes_pos
       check (slot_granularity_minutes between 5 and 120),
  drop constraint if exists rs_min_max_party,
  add  constraint rs_min_max_party
       check (min_party_size >= 1 and max_party_size >= min_party_size),
  drop constraint if exists rs_booking_window,
  add  constraint rs_booking_window
       check (booking_window_days between 1 and 365),
  drop constraint if exists rs_lead_time,
  add  constraint rs_lead_time
       check (min_lead_time_minutes >= 0);

-- -----------------------------------------------------------------------------
-- zones
-- -----------------------------------------------------------------------------
alter table public.zones
  drop constraint if exists zones_slug_not_blank,
  add  constraint zones_slug_not_blank
       check (length(btrim(slug)) > 0),
  drop constraint if exists zones_name_not_blank,
  add  constraint zones_name_not_blank
       check (length(btrim(name)) > 0);

-- -----------------------------------------------------------------------------
-- tables
-- -----------------------------------------------------------------------------
alter table public.tables
  drop constraint if exists tables_seats_positive,
  add  constraint tables_seats_positive
       check (seats > 0),
  drop constraint if exists tables_shape_valid,
  add  constraint tables_shape_valid
       check (shape in ('rect','circle')),
  drop constraint if exists tables_code_not_blank,
  add  constraint tables_code_not_blank
       check (length(btrim(code)) > 0);

-- -----------------------------------------------------------------------------
-- reservations: data quality
-- -----------------------------------------------------------------------------
alter table public.reservations
  drop constraint if exists reservations_party_size_positive,
  add  constraint reservations_party_size_positive
       check (party_size > 0),
  drop constraint if exists reservations_time_window,
  add  constraint reservations_time_window
       check (ends_at > starts_at),
  drop constraint if exists reservations_guest_name_not_blank,
  add  constraint reservations_guest_name_not_blank
       check (length(btrim(guest_name)) > 0),
  drop constraint if exists reservations_email_format,
  add  constraint reservations_email_format
       check (guest_email is null or guest_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- -----------------------------------------------------------------------------
-- reservations: prevent double-booking on a physical table
--
-- The exclusion constraint forbids any two rows where:
--   * table_id is the same
--   * tstzrange(starts_at, ends_at, '[)') overlaps an existing range
--   * status is one of ('pending','confirmed','seated')
--
-- Cancelled, completed, and no_show reservations are ignored (the table is
-- considered free again).
-- -----------------------------------------------------------------------------
alter table public.reservations
  drop constraint if exists reservations_no_overlap;

alter table public.reservations
  add constraint reservations_no_overlap
  exclude using gist (
    table_id     with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  )
  where (table_id is not null and status in ('pending','confirmed','seated'));

-- -----------------------------------------------------------------------------
-- staff_profiles
-- -----------------------------------------------------------------------------
-- (role enum already constrains values; nothing extra needed.)

-- -----------------------------------------------------------------------------
-- opening_hours
-- -----------------------------------------------------------------------------
alter table public.opening_hours
  drop constraint if exists opening_hours_day_of_week_range,
  add  constraint opening_hours_day_of_week_range
       check (day_of_week between 0 and 6),
  drop constraint if exists opening_hours_window,
  add  constraint opening_hours_window
       check (is_closed or end_time > start_time);

-- -----------------------------------------------------------------------------
-- blocked_slots
-- -----------------------------------------------------------------------------
alter table public.blocked_slots
  drop constraint if exists blocked_slots_window,
  add  constraint blocked_slots_window
       check (ends_at > starts_at);

-- -----------------------------------------------------------------------------
-- orders / order_items (future-ready)
-- -----------------------------------------------------------------------------
alter table public.orders
  drop constraint if exists orders_total_non_negative,
  add  constraint orders_total_non_negative
       check (total_cents >= 0);

alter table public.order_items
  drop constraint if exists order_items_qty_positive,
  add  constraint order_items_qty_positive
       check (qty > 0),
  drop constraint if exists order_items_price_non_negative,
  add  constraint order_items_price_non_negative
       check (unit_price_cents >= 0);
