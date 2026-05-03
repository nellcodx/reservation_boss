# HoReCa BOSS — Supabase Backend

Production-ready Supabase backend for the existing **reservation_boss** frontend (no UI redesign — frontend just connects to real data).

This package contains:

```
supabase/
├── config.toml             # Supabase CLI project config
├── README.md               # this file
└── migrations/
    ├── 001_extensions.sql  # pgcrypto, citext, btree_gist, pg_trgm
    ├── 002_schema.sql      # restaurants, zones, tables, reservations, …
    ├── 003_constraints.sql # CHECKs + EXCLUDE for double-booking
    ├── 004_rls_helpers.sql # hb.* SECURITY DEFINER role helpers
    ├── 005_rls_policies.sql# RLS for every table + RLS-aware public views
    ├── 006_rpc.sql         # get_available_tables, create_reservation, …
    ├── 007_realtime.sql    # supabase_realtime publication
    └── 008_seed.sql        # demo restaurant + 4 zones + 13 tables
```

## What you get

- **Multi-tenant from day one** — every row is scoped by `restaurant_id`.
- **Database-level double-booking prevention** via a partial GiST exclusion
  constraint (`reservations_no_overlap`) — overlap protection no longer relies
  on application code.
- **Public RPCs** (`get_available_tables`, `create_reservation`,
  `get_day_slots`, `get_floor_overview`) safe for the anon key. Booking
  *cannot* bypass these — direct INSERT into `reservations` is denied by RLS.
- **Roles**: `owner`, `manager`, `host`, `waiter`, `kitchen`, `viewer` — with
  matching RLS policies (e.g. waiters can flip table status but not edit
  reservations; kitchen sees orders only).
- **Realtime** publication on `reservations`, `tables`,
  `reservation_status_history`, `orders`.
- **Future-ready** orders / order_items tables for the upcoming KDS milestone.
- **Audit log**: every status change recorded in `reservation_status_history`
  via trigger.
- **Optional fields**: `guest_phone` and `guest_email` are nullable. The
  product never identifies a guest by phone number.

---

## 1. Apply the schema

Pick **one** of:

### Option A — Supabase CLI (recommended)

```bash
# from repo root
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push                # applies every file in migrations/
```

### Option B — Hosted Supabase, manual

In **Supabase Studio → SQL editor**, run each file in `migrations/` in order
(`001_…` → `008_…`).

### Option C — Self-hosted Postgres

```bash
psql "$DATABASE_URL" -f supabase/migrations/001_extensions.sql
psql "$DATABASE_URL" -f supabase/migrations/002_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/003_constraints.sql
psql "$DATABASE_URL" -f supabase/migrations/004_rls_helpers.sql
psql "$DATABASE_URL" -f supabase/migrations/005_rls_policies.sql
psql "$DATABASE_URL" -f supabase/migrations/006_rpc.sql
psql "$DATABASE_URL" -f supabase/migrations/007_realtime.sql
psql "$DATABASE_URL" -f supabase/migrations/008_seed.sql
```

> The seed file is **idempotent** and uses a stable demo restaurant id
> `00000000-0000-0000-0000-00000000d0a1`.

---

## 2. Wire the frontend

Add the keys from **Supabase Studio → Settings → API** to
`packages/web/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon key>"

# Optional — defaults to the well-known demo UUID
NEXT_PUBLIC_DEMO_RESTAURANT_ID="00000000-0000-0000-0000-00000000d0a1"
```

The web app auto-detects these. When present:

- The mobile-style `/reservation` form submits via the
  `create_reservation` RPC.
- `/book`'s calendar + map are powered by `get_day_slots`,
  `get_available_tables`, and `get_floor_overview` (existing `/api/*` routes
  became thin Supabase adapters — same response shapes).
- Zones come from the RLS-aware `v_public_zones` view.

If env vars are missing, the existing Prisma stack is used as a fallback
(useful in local dev before linking Supabase).

---

## 3. Public RPC reference

### `get_available_tables(restaurant_id, starts_at, party_size, duration_min?, zone_id?)`

Returns rows: `(id, zone_id, zone_slug, zone_name, code, label, seats, shape,
pos_x, pos_y)`. Tightest fit first. Honors opening hours, blocked slots,
existing reservations.

### `create_reservation(restaurant_id, starts_at, party_size, guest_name, guest_phone?, guest_email?, zone_id?, table_id?, notes?, duration_min?, source?)`

Atomic. Validates everything server-side. Returns `jsonb`:

```json
{
  "ok": true,
  "reservation_id": "…",
  "table_id": "…",
  "zone_id": "…",
  "status": "confirmed",
  "starts_at": "…",
  "ends_at": "…"
}
```

or `{ "ok": false, "reason": "FULLY_BOOKED" }` (also `CONFLICT`,
`OUTSIDE_OPENING_HOURS`, `TABLE_UNAVAILABLE`, `PARTY_SIZE_OUT_OF_RANGE`,
`TOO_EARLY`, `OUTSIDE_BOOKING_WINDOW`, `GUEST_NAME_REQUIRED`, `DB_ERROR`).

### `get_day_slots(restaurant_id, day_local::date, slot_minutes?, duration_min?, party_size?)`

One row per slot in the day with availability indicator
(`available | partial | reserved`).

### `get_floor_overview(restaurant_id, at, window_min?)`

Public-safe floor map (no PII). Each row has `visual ∈ {free, reserved,
occupied}`.

### `cancel_reservation(reservation_id, reason?)`

Staff-only (`hb.can_manage_reservations`).

### `set_table_status(table_id, status)`

Floor staff convenience wrapper.

---

## 4. Invite the first staff member

After the migrations, sign up via Supabase Auth and grant a role:

```sql
-- replace with your auth.users email/id
insert into public.staff_profiles (user_id, restaurant_id, role, full_name)
values (
  (select id from auth.users where email = 'you@example.com'),
  '00000000-0000-0000-0000-00000000d0a1',
  'owner',
  'Demo Owner'
);
```

Now the same JWT can read `reservations`, manage `tables`/`zones`, and
subscribe to Realtime channels for the restaurant.

---

## 5. Realtime channels (frontend)

```ts
import { subscribeToReservations, subscribeToTableStatus } from "@/lib/supabase/realtime";

const offResv = subscribeToReservations(restaurantId, ({ type, row }) => { … });
const offFloor = subscribeToTableStatus(restaurantId, ({ type, row }) => { … });
```

Channels are filtered by `restaurant_id=eq.<id>` so multi-tenant scoping is
honored at the wire level.

---

## 6. Security checklist

- [x] RLS is `ON` (and `FORCE`d) for every table.
- [x] Public cannot SELECT raw `reservations` — only via RLS-aware views and
      RPC return values.
- [x] Public cannot INSERT/UPDATE/DELETE `reservations` directly. Booking
      goes through `create_reservation` (security definer).
- [x] No frontend uses the service-role key. The web app reads only
      `NEXT_PUBLIC_*` env vars.
- [x] Helper functions live in private schema `hb` to avoid being exposed
      through PostgREST.
- [x] Constraints + exclusion enforce: `party_size > 0`, `seats > 0`,
      `ends_at > starts_at`, `day_of_week ∈ 0..6`, no overlapping active
      reservations on a single table.

---

## 7. Performance notes

- Indexes added for: `(restaurant_id, starts_at)`, `(restaurant_id, status,
  starts_at)`, `(table_id, starts_at)` partial, `(restaurant_id, seats)`,
  `(zone_id, restaurant_id)` and `gin_trgm_ops` on `guest_name`.
- Heavy logic (slot generation, availability) lives in SQL — one network
  round-trip per page load instead of N+1.
- `get_day_slots` short-circuits when the day is closed.
