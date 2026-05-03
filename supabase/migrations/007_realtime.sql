-- 007_realtime.sql
-- =============================================================================
-- HoReCa BOSS — Supabase Realtime publications.
--
-- We add the few tables that staff dashboards subscribe to. RLS still applies:
--   * anon will only see updates to rows their RLS would also let them SELECT
--     through the public views (effectively: tables, zones).
--   * authenticated staff will see reservations, tables, etc. for their
--     restaurant only.
--
-- Channels typically used by the frontend:
--   restaurant:<id>:reservations
--   restaurant:<id>:tables
-- =============================================================================

-- The `supabase_realtime` publication is created by Supabase itself.
-- We just attach our tables to it. `add table` is idempotent in newer versions,
-- but to be safe across CLI versions we wrap each in DO blocks.

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reservations'
  ) then
    alter publication supabase_realtime add table public.reservations;
  end if;
exception when undefined_object then
  -- supabase_realtime publication doesn't exist (e.g. running on a non-Supabase
  -- Postgres). Create it minimally so the file is replayable.
  create publication supabase_realtime for table public.reservations;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tables'
  ) then
    alter publication supabase_realtime add table public.tables;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reservation_status_history'
  ) then
    alter publication supabase_realtime add table public.reservation_status_history;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;

-- Required so REPLICA IDENTITY ships full row payloads (including primary key
-- and indexed cols), which is what the JS Realtime client expects.
alter table public.reservations              replica identity full;
alter table public.tables                    replica identity full;
alter table public.reservation_status_history replica identity full;
alter table public.orders                    replica identity full;
