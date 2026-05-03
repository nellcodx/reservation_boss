-- 006_rpc.sql
-- =============================================================================
-- HoReCa BOSS — public RPC API.
--
-- Two endpoints are designed to be safe to expose to the anonymous public role:
--
--   * get_available_tables(...)   — returns tables free for a given window.
--   * create_reservation(...)     — atomically books a table after validating
--                                   opening hours, blocked slots, party size
--                                   and overlap. Frontend MUST go through this
--                                   RPC (no direct insert into reservations).
--
-- Both are SECURITY DEFINER so they can read/write while bypassing RLS, but
-- they hard-validate every parameter against the restaurant scope before doing
-- anything.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Internal helper: window in opening hours? (timezone-aware)
-- -----------------------------------------------------------------------------
create or replace function hb.window_in_opening_hours(
  p_restaurant_id uuid,
  p_starts_at     timestamptz,
  p_ends_at       timestamptz
) returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_tz   text;
  v_local_start timestamp;
  v_local_end   timestamp;
  v_dow         int;
  v_open  time;
  v_close time;
begin
  select timezone into v_tz from public.restaurants where id = p_restaurant_id;
  if v_tz is null then v_tz := 'UTC'; end if;

  v_local_start := (p_starts_at at time zone v_tz);
  v_local_end   := (p_ends_at   at time zone v_tz);

  -- ISO-style weekday: 0 = Sunday … 6 = Saturday (matches JS Date#getDay).
  v_dow := extract(dow from v_local_start)::int;

  -- A booking that crosses midnight isn't supported by single-row hours;
  -- restaurants that close after 00:00 should encode multiple rows or we
  -- relax the rule below. For now: require both endpoints inside one day.
  if v_local_start::date <> v_local_end::date then
    return false;
  end if;

  select start_time, end_time
  into v_open, v_close
  from public.opening_hours
  where restaurant_id = p_restaurant_id
    and day_of_week = v_dow
    and is_closed = false
  order by start_time asc
  limit 1;

  if v_open is null then return false; end if;

  return v_local_start::time >= v_open and v_local_end::time <= v_close;
end;
$$;

-- -----------------------------------------------------------------------------
-- Internal helper: compute conflicts for a window.
-- Returns table_ids that are blocked by either an active reservation or a
-- blocked_slot.
-- -----------------------------------------------------------------------------
create or replace function hb.blocked_table_ids(
  p_restaurant_id uuid,
  p_starts_at     timestamptz,
  p_ends_at       timestamptz
) returns table (table_id uuid)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select r.table_id
  from public.reservations r
  where r.restaurant_id = p_restaurant_id
    and r.table_id is not null
    and r.status in ('pending','confirmed','seated')
    and tstzrange(r.starts_at, r.ends_at, '[)')
        && tstzrange(p_starts_at, p_ends_at, '[)')

  union

  select t.id
  from public.tables t
  join public.blocked_slots b on b.restaurant_id = t.restaurant_id
  where t.restaurant_id = p_restaurant_id
    and (b.table_id is null or b.table_id = t.id)
    and (b.zone_id  is null or b.zone_id  = t.zone_id)
    and tstzrange(b.starts_at, b.ends_at, '[)')
        && tstzrange(p_starts_at, p_ends_at, '[)');
$$;

-- -----------------------------------------------------------------------------
-- public.get_available_tables(...)
--
-- Args:
--   p_restaurant_id  required
--   p_starts_at      required - timestamptz
--   p_party_size     required - int
--   p_duration_min   optional - defaults to restaurant_settings.default_reservation_minutes
--   p_zone_id        optional - restrict to one zone
--
-- Returns the set of bookable tables (active, capacity ≥ party_size, no
-- overlap, not in a blocked slot). Order: smallest sufficient capacity first
-- so we always offer the tightest fit.
-- -----------------------------------------------------------------------------
create or replace function public.get_available_tables(
  p_restaurant_id uuid,
  p_starts_at     timestamptz,
  p_party_size    int,
  p_duration_min  int  default null,
  p_zone_id       uuid default null
)
returns table (
  id          uuid,
  zone_id     uuid,
  zone_slug   text,
  zone_name   text,
  code        text,
  label       text,
  seats       int,
  shape       text,
  pos_x       int,
  pos_y       int
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_duration int;
  v_ends_at  timestamptz;
begin
  if p_restaurant_id is null then
    raise exception 'p_restaurant_id is required' using errcode = '22023';
  end if;

  if p_party_size is null or p_party_size < 1 then
    raise exception 'p_party_size must be >= 1' using errcode = '22023';
  end if;

  if p_starts_at is null then
    raise exception 'p_starts_at is required' using errcode = '22023';
  end if;

  select coalesce(p_duration_min, rs.default_reservation_minutes, 90)
  into v_duration
  from public.restaurant_settings rs
  where rs.restaurant_id = p_restaurant_id;

  if v_duration is null then
    v_duration := coalesce(p_duration_min, 90);
  end if;

  v_ends_at := p_starts_at + make_interval(mins => v_duration);

  if not hb.window_in_opening_hours(p_restaurant_id, p_starts_at, v_ends_at) then
    -- Outside opening hours -> no availability (don't raise; the UI will show
    -- "no slots" naturally).
    return;
  end if;

  return query
    select t.id, t.zone_id, z.slug, z.name, t.code, t.label, t.seats, t.shape, t.pos_x, t.pos_y
    from public.tables t
    left join public.zones z on z.id = t.zone_id
    where t.restaurant_id = p_restaurant_id
      and t.is_active = true
      and t.status <> 'inactive'
      and t.seats >= p_party_size
      and (p_zone_id is null or t.zone_id = p_zone_id)
      and not exists (
        select 1 from hb.blocked_table_ids(p_restaurant_id, p_starts_at, v_ends_at) bt
        where bt.table_id = t.id
      )
    order by t.seats asc, t.code asc;
end;
$$;

revoke all on function public.get_available_tables(uuid, timestamptz, int, int, uuid) from public;
grant execute on function public.get_available_tables(uuid, timestamptz, int, int, uuid)
  to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- public.create_reservation(...)
--
-- One-shot booking endpoint. Public-safe (anon key). Validates everything
-- server-side; never trusts the client.
--
-- Args:
--   p_restaurant_id  required
--   p_starts_at      required - timestamptz (UTC; client converts from local)
--   p_party_size     required - int > 0
--   p_guest_name     required - text
--   p_guest_phone    optional - text (no phone-based flows!)
--   p_guest_email    optional - text
--   p_zone_id        optional - prefer this zone
--   p_table_id       optional - request a specific table
--   p_notes          optional - text
--   p_duration_min   optional - defaults to restaurant_settings.default_reservation_minutes
--   p_source         optional - 'online' | 'phone' | 'walk_in' | 'staff'
--
-- Behaviour:
--   * If p_table_id is provided: that exact table must be eligible.
--   * Otherwise: tightest-fit eligible table is chosen automatically.
--   * Status starts at 'confirmed' if restaurant_settings.auto_confirm_reservations,
--     else 'pending'.
--
-- Returns: jsonb { ok, reservation_id, table_id, status, starts_at, ends_at }
--          or  { ok: false, reason }.
-- -----------------------------------------------------------------------------
create or replace function public.create_reservation(
  p_restaurant_id uuid,
  p_starts_at     timestamptz,
  p_party_size    int,
  p_guest_name    text,
  p_guest_phone   text default null,
  p_guest_email   text default null,
  p_zone_id       uuid default null,
  p_table_id      uuid default null,
  p_notes         text default null,
  p_duration_min  int  default null,
  p_source        text default 'online'
) returns jsonb
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_settings        public.restaurant_settings%rowtype;
  v_duration        int;
  v_ends_at         timestamptz;
  v_chosen_table    uuid;
  v_chosen_zone     uuid;
  v_initial_status  reservation_status;
  v_reservation_id  uuid;
begin
  -- ---- 1. Required-field validation -----------------------------------------
  if p_restaurant_id is null then
    return jsonb_build_object('ok', false, 'reason', 'RESTAURANT_REQUIRED');
  end if;
  if p_starts_at is null then
    return jsonb_build_object('ok', false, 'reason', 'STARTS_AT_REQUIRED');
  end if;
  if p_party_size is null or p_party_size < 1 then
    return jsonb_build_object('ok', false, 'reason', 'PARTY_SIZE_INVALID');
  end if;
  if p_guest_name is null or length(btrim(p_guest_name)) = 0 then
    return jsonb_build_object('ok', false, 'reason', 'GUEST_NAME_REQUIRED');
  end if;

  -- ---- 2. Restaurant + settings ---------------------------------------------
  if not exists (
    select 1 from public.restaurants where id = p_restaurant_id and is_active = true
  ) then
    return jsonb_build_object('ok', false, 'reason', 'RESTAURANT_NOT_FOUND');
  end if;

  select * into v_settings
  from public.restaurant_settings
  where restaurant_id = p_restaurant_id;

  if not found then
    -- Fall back to safe defaults if a restaurant has no settings row yet.
    v_settings.default_reservation_minutes := 90;
    v_settings.min_party_size              := 1;
    v_settings.max_party_size              := 20;
    v_settings.booking_window_days         := 60;
    v_settings.min_lead_time_minutes       := 0;
    v_settings.auto_confirm_reservations   := true;
  end if;

  v_duration := coalesce(p_duration_min, v_settings.default_reservation_minutes, 90);
  if v_duration < 15 or v_duration > 360 then
    return jsonb_build_object('ok', false, 'reason', 'DURATION_OUT_OF_RANGE');
  end if;
  v_ends_at := p_starts_at + make_interval(mins => v_duration);

  -- ---- 3. Range / size policy -----------------------------------------------
  if p_party_size < v_settings.min_party_size or p_party_size > v_settings.max_party_size then
    return jsonb_build_object('ok', false, 'reason', 'PARTY_SIZE_OUT_OF_RANGE');
  end if;

  if p_starts_at < now() + make_interval(mins => v_settings.min_lead_time_minutes) then
    return jsonb_build_object('ok', false, 'reason', 'TOO_EARLY');
  end if;

  if p_starts_at > now() + make_interval(days => v_settings.booking_window_days) then
    return jsonb_build_object('ok', false, 'reason', 'OUTSIDE_BOOKING_WINDOW');
  end if;

  -- ---- 4. Opening hours -----------------------------------------------------
  if not hb.window_in_opening_hours(p_restaurant_id, p_starts_at, v_ends_at) then
    return jsonb_build_object('ok', false, 'reason', 'OUTSIDE_OPENING_HOURS');
  end if;

  -- ---- 5. Pick a table ------------------------------------------------------
  if p_table_id is not null then
    -- Specific table requested. Must belong to this restaurant, be active,
    -- have enough seats, and be free for the window.
    select t.id, t.zone_id
    into v_chosen_table, v_chosen_zone
    from public.tables t
    where t.id = p_table_id
      and t.restaurant_id = p_restaurant_id
      and t.is_active = true
      and t.status <> 'inactive'
      and t.seats >= p_party_size
      and not exists (
        select 1 from hb.blocked_table_ids(p_restaurant_id, p_starts_at, v_ends_at) bt
        where bt.table_id = t.id
      );

    if v_chosen_table is null then
      return jsonb_build_object('ok', false, 'reason', 'TABLE_UNAVAILABLE');
    end if;
  else
    select t.id, t.zone_id
    into v_chosen_table, v_chosen_zone
    from public.get_available_tables(
      p_restaurant_id, p_starts_at, p_party_size, v_duration, p_zone_id
    ) t
    order by t.seats asc, t.code asc
    limit 1;

    if v_chosen_table is null then
      -- If a zone was requested, fall back to any zone.
      if p_zone_id is not null then
        select t.id, t.zone_id
        into v_chosen_table, v_chosen_zone
        from public.get_available_tables(
          p_restaurant_id, p_starts_at, p_party_size, v_duration, null
        ) t
        order by t.seats asc, t.code asc
        limit 1;
      end if;
    end if;

    if v_chosen_table is null then
      return jsonb_build_object('ok', false, 'reason', 'FULLY_BOOKED');
    end if;
  end if;

  -- ---- 6. Initial status ----------------------------------------------------
  v_initial_status := case
    when coalesce(v_settings.auto_confirm_reservations, true) then 'confirmed'::reservation_status
    else 'pending'::reservation_status
  end;

  -- ---- 7. Insert (the EXCLUDE constraint is the final overlap guard) --------
  begin
    insert into public.reservations (
      restaurant_id, table_id, zone_id, status, party_size,
      starts_at, ends_at,
      guest_name, guest_phone, guest_email, notes,
      source, created_by
    ) values (
      p_restaurant_id, v_chosen_table, v_chosen_zone, v_initial_status, p_party_size,
      p_starts_at, v_ends_at,
      btrim(p_guest_name), nullif(btrim(coalesce(p_guest_phone,'')),''),
      nullif(btrim(coalesce(p_guest_email,'')),''), nullif(btrim(coalesce(p_notes,'')),''),
      coalesce(p_source, 'online'),
      auth.uid()
    )
    returning id into v_reservation_id;
  exception
    when exclusion_violation then
      -- Race condition: another request grabbed the table between our check
      -- and our insert. Tell the client to retry.
      return jsonb_build_object('ok', false, 'reason', 'CONFLICT');
    when others then
      return jsonb_build_object('ok', false, 'reason', 'DB_ERROR', 'detail', sqlerrm);
  end;

  return jsonb_build_object(
    'ok', true,
    'reservation_id', v_reservation_id,
    'table_id', v_chosen_table,
    'zone_id', v_chosen_zone,
    'status', v_initial_status,
    'starts_at', p_starts_at,
    'ends_at', v_ends_at
  );
end;
$$;

revoke all on function public.create_reservation(
  uuid, timestamptz, int, text, text, text, uuid, uuid, text, int, text
) from public;
grant execute on function public.create_reservation(
  uuid, timestamptz, int, text, text, text, uuid, uuid, text, int, text
) to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- public.cancel_reservation(reservation_id, reason?)
--   * Guests cannot cancel directly (no token in this milestone).
--   * Staff with reservation-management role can cancel.
-- -----------------------------------------------------------------------------
create or replace function public.cancel_reservation(
  p_reservation_id uuid,
  p_reason         text default null
) returns jsonb
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_restaurant uuid;
begin
  select restaurant_id into v_restaurant
  from public.reservations
  where id = p_reservation_id;

  if v_restaurant is null then
    return jsonb_build_object('ok', false, 'reason', 'NOT_FOUND');
  end if;

  if not hb.can_manage_reservations(v_restaurant) then
    return jsonb_build_object('ok', false, 'reason', 'FORBIDDEN');
  end if;

  update public.reservations
  set status              = 'cancelled',
      cancelled_at        = now(),
      cancelled_by        = auth.uid(),
      cancellation_reason = p_reason
  where id = p_reservation_id
    and status in ('pending','confirmed','seated');

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.cancel_reservation(uuid, text) to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- public.set_table_status(table_id, status)
--   Floor staff convenience wrapper. RLS would already allow `update tables
--   set status = ...`, but this RPC adds a single audited path for the UI.
-- -----------------------------------------------------------------------------
create or replace function public.set_table_status(
  p_table_id uuid,
  p_status   table_status
) returns jsonb
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_restaurant uuid;
begin
  select restaurant_id into v_restaurant
  from public.tables where id = p_table_id;

  if v_restaurant is null then
    return jsonb_build_object('ok', false, 'reason', 'NOT_FOUND');
  end if;

  if not hb.can_update_table_status(v_restaurant) then
    return jsonb_build_object('ok', false, 'reason', 'FORBIDDEN');
  end if;

  update public.tables set status = p_status where id = p_table_id;
  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.set_table_status(uuid, table_status) to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- public.get_day_slots(...)
--
-- Bulk variant of get_available_tables for an entire day. Returns one row per
-- slot, with how many tables (of sufficient capacity) are free in the window.
-- Used by the calendar UI on /book.
-- -----------------------------------------------------------------------------
create or replace function public.get_day_slots(
  p_restaurant_id  uuid,
  p_day_local      date,
  p_slot_minutes   int  default 15,
  p_duration_min   int  default null,
  p_party_size     int  default 2
)
returns table (
  starts_at        timestamptz,
  ends_at          timestamptz,
  available_count  int,
  total_count      int,
  indicator        text   -- 'available' | 'partial' | 'reserved'
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_tz             text;
  v_settings       public.restaurant_settings%rowtype;
  v_duration       int;
  v_slot_minutes   int;
  v_total_eligible int;
  v_local_start    timestamp;
  v_local_end      timestamp;
  v_dow            int;
  v_open           time;
  v_close          time;
begin
  if p_restaurant_id is null then
    raise exception 'p_restaurant_id is required' using errcode = '22023';
  end if;

  if p_party_size is null or p_party_size < 1 then
    p_party_size := 1;
  end if;

  select timezone into v_tz
  from public.restaurants where id = p_restaurant_id;
  if v_tz is null then v_tz := 'UTC'; end if;

  select * into v_settings
  from public.restaurant_settings where restaurant_id = p_restaurant_id;

  v_duration := coalesce(
    p_duration_min,
    v_settings.default_reservation_minutes,
    90
  );
  v_slot_minutes := coalesce(p_slot_minutes, v_settings.slot_granularity_minutes, 15);

  -- Total eligible tables (capacity >= party_size, active) for this restaurant.
  select count(*)::int into v_total_eligible
  from public.tables t
  where t.restaurant_id = p_restaurant_id
    and t.is_active = true
    and t.status <> 'inactive'
    and t.seats >= p_party_size;

  -- Day window in restaurant local time.
  v_local_start := p_day_local::timestamp;
  v_local_end   := (p_day_local + 1)::timestamp;
  v_dow         := extract(dow from v_local_start)::int;

  select start_time, end_time
  into v_open, v_close
  from public.opening_hours
  where restaurant_id = p_restaurant_id
    and day_of_week = v_dow
    and is_closed = false
  order by start_time asc
  limit 1;

  if v_open is null then
    return;
  end if;

  -- Iterate slots from open_time to close_time - duration.
  for v_local_start in
    select gs::timestamp
    from generate_series(
      (p_day_local::timestamp + v_open),
      (p_day_local::timestamp + v_close - make_interval(mins => v_duration)),
      make_interval(mins => v_slot_minutes)
    ) gs
  loop
    declare
      v_start_tz timestamptz;
      v_end_tz   timestamptz;
      v_avail    int;
      v_ind      text;
    begin
      v_start_tz := v_local_start at time zone v_tz;
      v_end_tz   := v_start_tz + make_interval(mins => v_duration);

      select count(*)::int into v_avail
      from public.get_available_tables(
        p_restaurant_id, v_start_tz, p_party_size, v_duration, null
      );

      v_ind := case
        when v_avail = 0                  then 'reserved'
        when v_avail = v_total_eligible   then 'available'
        else 'partial'
      end;

      starts_at       := v_start_tz;
      ends_at         := v_end_tz;
      available_count := v_avail;
      total_count     := coalesce(v_total_eligible, 0);
      indicator       := v_ind;
      return next;
    end;
  end loop;

  return;
end;
$$;

revoke all on function public.get_day_slots(uuid, date, int, int, int) from public;
grant execute on function public.get_day_slots(uuid, date, int, int, int)
  to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- public.get_floor_overview(...)
--
-- Public-safe floor map for a given window. Returns table position + a single
-- visual flag ('free' | 'reserved' | 'occupied'). No reservation PII.
-- Used by /book and by the marketing dashboard.
-- -----------------------------------------------------------------------------
create or replace function public.get_floor_overview(
  p_restaurant_id uuid,
  p_at            timestamptz,
  p_window_min    int default 90
)
returns table (
  id        uuid,
  zone_id   uuid,
  zone_slug text,
  code      text,
  label     text,
  seats     int,
  shape     text,
  pos_x     int,
  pos_y     int,
  visual    text   -- 'free' | 'reserved' | 'occupied'
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_ends_at timestamptz;
begin
  if p_restaurant_id is null then
    raise exception 'p_restaurant_id is required' using errcode = '22023';
  end if;
  v_ends_at := p_at + make_interval(mins => coalesce(p_window_min, 90));

  return query
    with blocked as (
      select bt.table_id from hb.blocked_table_ids(p_restaurant_id, p_at, v_ends_at) bt
    ),
    overlapping as (
      select r.table_id
      from public.reservations r
      where r.restaurant_id = p_restaurant_id
        and r.table_id is not null
        and r.status in ('pending','confirmed','seated')
        and tstzrange(r.starts_at, r.ends_at, '[)')
            && tstzrange(p_at, v_ends_at, '[)')
    )
    select
      t.id,
      t.zone_id,
      z.slug,
      t.code,
      t.label,
      t.seats,
      t.shape,
      t.pos_x,
      t.pos_y,
      case
        when t.status = 'occupied' then 'occupied'
        when t.id in (select table_id from overlapping where table_id is not null)
          or t.id in (select table_id from blocked      where table_id is not null) then 'reserved'
        else 'free'
      end as visual
    from public.tables t
    left join public.zones z on z.id = t.zone_id
    where t.restaurant_id = p_restaurant_id
      and t.is_active = true
      and t.status <> 'inactive'
    order by t.code;
end;
$$;

revoke all on function public.get_floor_overview(uuid, timestamptz, int) from public;
grant execute on function public.get_floor_overview(uuid, timestamptz, int)
  to anon, authenticated, service_role;
