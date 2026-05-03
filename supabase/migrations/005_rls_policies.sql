-- 005_rls_policies.sql
-- =============================================================================
-- HoReCa BOSS — Row Level Security policies.
--
-- Principles:
--
--   1. RLS is ON for every table.
--   2. Public (anon) cannot SELECT raw `reservations`; safe SELECTs go through
--      RLS-aware views (`v_public_zones`, `v_public_tables`) so guests can see
--      the floor without leaking guest PII.
--   3. Public NEVER inserts directly into `reservations`. Booking goes
--      through `public.create_reservation()` (security definer) — see 006_rpc.sql.
--   4. Staff (authenticated) only access rows that belong to their restaurant.
--   5. Roles within a restaurant gate write access:
--        owner / manager  -> full
--        host             -> reservations + table status
--        waiter           -> table status only (+ orders)
--        kitchen          -> orders only (read/update prep state)
--        viewer           -> read-only at restaurant scope
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enable RLS everywhere
-- -----------------------------------------------------------------------------
alter table public.restaurants            enable row level security;
alter table public.restaurant_settings    enable row level security;
alter table public.zones                  enable row level security;
alter table public.tables                 enable row level security;
alter table public.reservations           enable row level security;
alter table public.reservation_status_history enable row level security;
alter table public.staff_profiles         enable row level security;
alter table public.opening_hours          enable row level security;
alter table public.blocked_slots          enable row level security;
alter table public.orders                 enable row level security;
alter table public.order_items            enable row level security;

-- Note: We deliberately do NOT enable `force row level security`. Our public
-- booking RPC `public.create_reservation()` is SECURITY DEFINER and must be
-- able to insert into `reservations` on behalf of an unauthenticated guest.
-- Forcing RLS would block that path unless the function's owner has BYPASSRLS,
-- which we don't want to rely on across deployments.
--
-- All untrusted access already goes through:
--   * `anon` / `authenticated` JWTs   -> RLS applies (these can't bypass).
--   * `create_reservation`(SD)         -> server-side validated, then INSERT.
--   * `service_role` (admin)           -> intentionally bypasses RLS.

-- -----------------------------------------------------------------------------
-- Public, RLS-aware views.
--
-- security_invoker = true means PostgREST evaluates the underlying tables'
-- RLS policies as the calling role (anon/authenticated). The views simply
-- project safe columns so guests can render the floor.
-- -----------------------------------------------------------------------------
create or replace view public.v_public_restaurants
  with (security_invoker = true) as
  select id, slug, name, timezone
  from public.restaurants
  where is_active = true;

create or replace view public.v_public_zones
  with (security_invoker = true) as
  select id, restaurant_id, slug, name, description, display_order
  from public.zones
  where is_active = true;

create or replace view public.v_public_tables
  with (security_invoker = true) as
  select id, restaurant_id, zone_id, code, label, seats, shape, pos_x, pos_y, status
  from public.tables
  where is_active = true;

grant select on public.v_public_restaurants to anon, authenticated;
grant select on public.v_public_zones       to anon, authenticated;
grant select on public.v_public_tables      to anon, authenticated;

-- -----------------------------------------------------------------------------
-- restaurants
-- -----------------------------------------------------------------------------
drop policy if exists "restaurants_select_active_public" on public.restaurants;
create policy "restaurants_select_active_public"
  on public.restaurants for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "restaurants_modify_owner" on public.restaurants;
create policy "restaurants_modify_owner"
  on public.restaurants for all
  to authenticated
  using (hb.is_owner(id))
  with check (hb.is_owner(id));

-- -----------------------------------------------------------------------------
-- restaurant_settings — staff-only.
-- -----------------------------------------------------------------------------
drop policy if exists "rs_select_staff" on public.restaurant_settings;
create policy "rs_select_staff"
  on public.restaurant_settings for select
  to authenticated
  using (hb.is_staff(restaurant_id));

drop policy if exists "rs_write_manager" on public.restaurant_settings;
create policy "rs_write_manager"
  on public.restaurant_settings for all
  to authenticated
  using (hb.is_manager_or_above(restaurant_id))
  with check (hb.is_manager_or_above(restaurant_id));

-- -----------------------------------------------------------------------------
-- zones
-- -----------------------------------------------------------------------------
drop policy if exists "zones_select_public_active" on public.zones;
create policy "zones_select_public_active"
  on public.zones for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "zones_select_staff_all" on public.zones;
create policy "zones_select_staff_all"
  on public.zones for select
  to authenticated
  using (hb.is_staff(restaurant_id));

drop policy if exists "zones_write_manager" on public.zones;
create policy "zones_write_manager"
  on public.zones for all
  to authenticated
  using (hb.is_manager_or_above(restaurant_id))
  with check (hb.is_manager_or_above(restaurant_id));

-- -----------------------------------------------------------------------------
-- tables
-- -----------------------------------------------------------------------------
drop policy if exists "tables_select_public_active" on public.tables;
create policy "tables_select_public_active"
  on public.tables for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "tables_select_staff_all" on public.tables;
create policy "tables_select_staff_all"
  on public.tables for select
  to authenticated
  using (hb.is_staff(restaurant_id));

drop policy if exists "tables_write_manager" on public.tables;
create policy "tables_write_manager"
  on public.tables for all
  to authenticated
  using (hb.is_manager_or_above(restaurant_id))
  with check (hb.is_manager_or_above(restaurant_id));

-- Waiters/hosts can only flip table status (available/occupied/cleaning/...).
-- They cannot create/delete tables or change seats / position.
drop policy if exists "tables_update_status_floor_staff" on public.tables;
create policy "tables_update_status_floor_staff"
  on public.tables for update
  to authenticated
  using (hb.can_update_table_status(restaurant_id))
  with check (hb.can_update_table_status(restaurant_id));

-- -----------------------------------------------------------------------------
-- reservations
--
-- Public CANNOT select reservations (PII). They go through RPC for booking.
-- -----------------------------------------------------------------------------
drop policy if exists "reservations_select_staff" on public.reservations;
create policy "reservations_select_staff"
  on public.reservations for select
  to authenticated
  using (hb.is_staff(restaurant_id));

-- Hosts/managers/owners can manage reservations.
drop policy if exists "reservations_insert_host" on public.reservations;
create policy "reservations_insert_host"
  on public.reservations for insert
  to authenticated
  with check (hb.can_manage_reservations(restaurant_id));

drop policy if exists "reservations_update_host" on public.reservations;
create policy "reservations_update_host"
  on public.reservations for update
  to authenticated
  using (hb.can_manage_reservations(restaurant_id))
  with check (hb.can_manage_reservations(restaurant_id));

drop policy if exists "reservations_delete_manager" on public.reservations;
create policy "reservations_delete_manager"
  on public.reservations for delete
  to authenticated
  using (hb.is_manager_or_above(restaurant_id));

-- -----------------------------------------------------------------------------
-- reservation_status_history (read-only audit log for staff)
-- -----------------------------------------------------------------------------
drop policy if exists "rsh_select_staff" on public.reservation_status_history;
create policy "rsh_select_staff"
  on public.reservation_status_history for select
  to authenticated
  using (
    exists (
      select 1
      from public.reservations r
      where r.id = reservation_status_history.reservation_id
        and hb.is_staff(r.restaurant_id)
    )
  );

-- (No INSERT/UPDATE/DELETE policies. Inserts happen only through the trigger,
-- which runs SECURITY DEFINER as the trigger owner and bypasses RLS.)

-- -----------------------------------------------------------------------------
-- staff_profiles
-- -----------------------------------------------------------------------------
-- Each staff member can see their own row.
drop policy if exists "sp_select_self" on public.staff_profiles;
create policy "sp_select_self"
  on public.staff_profiles for select
  to authenticated
  using (user_id = auth.uid());

-- Managers/owners see the whole staff list of their restaurant.
drop policy if exists "sp_select_manager" on public.staff_profiles;
create policy "sp_select_manager"
  on public.staff_profiles for select
  to authenticated
  using (hb.is_manager_or_above(restaurant_id));

-- Only owners may modify staff (invite / change role / deactivate).
drop policy if exists "sp_write_owner" on public.staff_profiles;
create policy "sp_write_owner"
  on public.staff_profiles for all
  to authenticated
  using (hb.is_owner(restaurant_id))
  with check (hb.is_owner(restaurant_id));

-- -----------------------------------------------------------------------------
-- opening_hours
-- -----------------------------------------------------------------------------
drop policy if exists "oh_select_public" on public.opening_hours;
create policy "oh_select_public"
  on public.opening_hours for select
  to anon, authenticated
  using (true);

drop policy if exists "oh_write_manager" on public.opening_hours;
create policy "oh_write_manager"
  on public.opening_hours for all
  to authenticated
  using (hb.is_manager_or_above(restaurant_id))
  with check (hb.is_manager_or_above(restaurant_id));

-- -----------------------------------------------------------------------------
-- blocked_slots
-- -----------------------------------------------------------------------------
drop policy if exists "bs_select_staff" on public.blocked_slots;
create policy "bs_select_staff"
  on public.blocked_slots for select
  to authenticated
  using (hb.is_staff(restaurant_id));

drop policy if exists "bs_write_manager" on public.blocked_slots;
create policy "bs_write_manager"
  on public.blocked_slots for all
  to authenticated
  using (hb.is_manager_or_above(restaurant_id))
  with check (hb.is_manager_or_above(restaurant_id));

-- -----------------------------------------------------------------------------
-- orders / order_items (future KDS milestone)
-- -----------------------------------------------------------------------------
drop policy if exists "orders_select_staff" on public.orders;
create policy "orders_select_staff"
  on public.orders for select
  to authenticated
  using (hb.can_view_orders(restaurant_id));

drop policy if exists "orders_write_floor" on public.orders;
create policy "orders_write_floor"
  on public.orders for all
  to authenticated
  using (hb.can_view_orders(restaurant_id))
  with check (hb.can_view_orders(restaurant_id));

drop policy if exists "order_items_select_staff" on public.order_items;
create policy "order_items_select_staff"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and hb.can_view_orders(o.restaurant_id)
    )
  );

drop policy if exists "order_items_write_floor" on public.order_items;
create policy "order_items_write_floor"
  on public.order_items for all
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and hb.can_view_orders(o.restaurant_id)
    )
  )
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and hb.can_view_orders(o.restaurant_id)
    )
  );
