-- 004_rls_helpers.sql
-- =============================================================================
-- HoReCa BOSS — RLS helper functions.
--
-- All helpers are SECURITY DEFINER so RLS policies can call them from any role
-- without recursive policy evaluation. They live in a private schema so they
-- are NOT directly callable through PostgREST / Supabase API.
-- =============================================================================

create schema if not exists hb;

-- Lock down helper schema: anon/authenticated only get access via SECURITY
-- DEFINER policies; they cannot CALL these functions directly through the API.
revoke all on schema hb from public;
grant  usage on schema hb to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- hb.is_authenticated() — convenience
-- -----------------------------------------------------------------------------
create or replace function hb.is_authenticated()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null;
$$;

-- -----------------------------------------------------------------------------
-- hb.staff_role(restaurant_id) -> staff_role | null
--
-- Returns the role of the currently authenticated user for a given restaurant,
-- or NULL if the user is not staff there (or not signed in at all).
-- -----------------------------------------------------------------------------
create or replace function hb.staff_role(p_restaurant_id uuid)
returns staff_role
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select sp.role
  from public.staff_profiles sp
  where sp.user_id = auth.uid()
    and sp.restaurant_id = p_restaurant_id
    and sp.is_active = true
  limit 1;
$$;

-- -----------------------------------------------------------------------------
-- hb.is_staff(restaurant_id)  — any active role at this restaurant
-- -----------------------------------------------------------------------------
create or replace function hb.is_staff(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select hb.staff_role(p_restaurant_id) is not null;
$$;

-- -----------------------------------------------------------------------------
-- hb.has_role_in(restaurant_id, roles[])
--
--   hb.has_role_in('uuid', array['owner','manager']::staff_role[])
-- -----------------------------------------------------------------------------
create or replace function hb.has_role_in(p_restaurant_id uuid, p_roles staff_role[])
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select hb.staff_role(p_restaurant_id) = any(p_roles);
$$;

-- -----------------------------------------------------------------------------
-- Convenience predicates
-- -----------------------------------------------------------------------------
create or replace function hb.is_owner(p_restaurant_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select hb.staff_role(p_restaurant_id) = 'owner'; $$;

create or replace function hb.is_manager_or_above(p_restaurant_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select hb.has_role_in(p_restaurant_id, array['owner','manager']::staff_role[]); $$;

create or replace function hb.can_manage_reservations(p_restaurant_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select hb.has_role_in(p_restaurant_id, array['owner','manager','host']::staff_role[]); $$;

create or replace function hb.can_update_table_status(p_restaurant_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select hb.has_role_in(p_restaurant_id, array['owner','manager','host','waiter']::staff_role[]); $$;

create or replace function hb.can_view_orders(p_restaurant_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select hb.has_role_in(p_restaurant_id, array['owner','manager','host','waiter','kitchen']::staff_role[]); $$;
