# Supabase backend for `reservation_boss`

A production-ready Supabase backend for the existing frontend.
Full documentation: [`supabase/README.md`](./supabase/README.md).

The frontend is **not** redesigned. Existing UI keeps working —
only the data layer changes.

## What's new

```
supabase/
├── config.toml
├── README.md
└── migrations/
    ├── 001_extensions.sql      # pgcrypto, citext, btree_gist, pg_trgm
    ├── 002_schema.sql          # multi-restaurant schema (incl. KDS-ready orders)
    ├── 003_constraints.sql     # CHECKs + EXCLUDE for double-booking
    ├── 004_rls_helpers.sql     # role/permission helpers in `hb` schema
    ├── 005_rls_policies.sql    # RLS for every table + safe public views
    ├── 006_rpc.sql             # get_available_tables, create_reservation, …
    ├── 007_realtime.sql        # supabase_realtime publication
    └── 008_seed.sql            # demo restaurant + 4 zones + 13 tables

packages/web/src/lib/supabase/
├── client.ts          # browser client (anon)
├── server.ts          # server clients (anon + service-role)
├── env.ts             # NEXT_PUBLIC_* readers + isDemoModeEnabled()
├── api.ts             # typed wrappers around RPC + views
├── realtime.ts        # subscribe to reservations / table status
├── types.ts           # TypeScript types matching the SQL schema
├── demo-data.ts       # pre-seeded zones / tables / opening hours
├── demo-engine.ts     # pure functions mirroring SQL RPC business rules
└── demo-client.ts     # browser-side demo store (localStorage + cross-tab)

packages/web/src/server/supabase/
├── admin.ts           # server-side client + restaurant id helpers
├── booking.ts         # adapters preserving legacy /api/* response shapes
└── demo-store.ts      # server-side demo store (globalThis singleton)
```

## Quick start

### Option A — zero setup (demo mode)

```bash
npm run dev -w @rr/web
# open http://localhost:3000/reservation
```

When `NEXT_PUBLIC_SUPABASE_URL` is unset the app auto-runs in **demo mode**:

- Pre-seeded restaurant, 4 zones, 13 tables, opening hours, and a few
  example reservations.
- `create_reservation`, `get_available_tables`, `get_day_slots`,
  `get_floor_overview` are simulated by a pure JS engine that mirrors the
  SQL business rules (overlap detection, opening hours, party size …).
- Browser bookings persist to `localStorage` and sync across tabs via the
  `storage` event; server-side bookings live in a `globalThis` singleton.
- A subtle "Demo mode" pill appears next to the form heading.

### Option B — real Supabase

1. Apply migrations to your Supabase project (see
   [`supabase/README.md` §1](./supabase/README.md#1-apply-the-schema)).
2. Add Supabase env vars to `packages/web/.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon key>"
   ```

3. `npm run dev` — the web app auto-detects Supabase and switches the
   `/reservation` form and `/book` calendar to the new backend.

> Force demo mode while Supabase is configured: `NEXT_PUBLIC_DEMO_MODE=on`.
> Disable demo entirely: `NEXT_PUBLIC_DEMO_MODE=off`.

## Key behaviours

- `guest_phone` and `guest_email` are **optional**. The product never
  identifies a guest by phone number.
- Booking is **atomic and validated server-side**. The frontend never inserts
  into `reservations` directly — it calls `create_reservation()`.
- Double bookings are blocked at the **database level** by an EXCLUDE
  constraint, not in application code.
- `pending`, `confirmed`, `seated` block the table; `completed`, `cancelled`,
  `no_show` free it again — exactly matching the spec.
- Realtime channels are scoped by `restaurant_id` so multi-tenant deployments
  are safe out of the box.

## Roles

| Role     | Reservations | Tables (status) | Tables (CRUD) | Orders        |
| -------- | ------------ | --------------- | ------------- | ------------- |
| owner    | full         | full            | full          | full          |
| manager  | full         | full            | full          | full          |
| host     | full         | update status   | read          | read          |
| waiter   | read         | update status   | read          | full          |
| kitchen  | read         | read            | read          | full (KDS)    |
| viewer   | read         | read            | read          | read          |
| guest    | only via RPC | none            | none          | none          |
