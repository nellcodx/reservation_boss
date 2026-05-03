-- 001_extensions.sql
-- =============================================================================
-- HoReCa BOSS — required PostgreSQL extensions.
--
-- pgcrypto      : gen_random_uuid()                 (UUID primary keys)
-- citext        : case-insensitive emails / slugs   (guest_email, restaurant slug)
-- btree_gist    : composite GiST indexes            (used by exclusion constraint
--                                                    that blocks overlapping
--                                                    reservations on a single
--                                                    table — see 003_constraints.sql)
-- pg_trgm       : trigram search                    (fast ILIKE on guest_name)
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";
create extension if not exists "btree_gist";
create extension if not exists "pg_trgm";
