/**
 * Demo seed data — mirrors `supabase/migrations/008_seed.sql`.
 *
 * Pure module: no I/O, safe to import from client and server.
 *
 * Stable IDs (`zone-main`, `tbl-m1`, …) make demo state easy to reason about
 * across client/server stores and across page reloads.
 */

import type {
  Reservation,
  ReservationStatus,
  RestaurantTableRow,
  Zone
} from "./types";

export const DEMO_RESTAURANT_ID = "00000000-0000-0000-0000-00000000d0a1";

/* ---------------------------- Restaurant settings ------------------------ */

export const DEMO_SETTINGS = {
  default_reservation_minutes: 90,
  slot_granularity_minutes: 15,
  min_party_size: 1,
  max_party_size: 12,
  booking_window_days: 60,
  min_lead_time_minutes: 30,
  auto_confirm_reservations: true
} as const;

/* ---------------------------- Opening hours ------------------------------ */
/* day_of_week: 0 = Sunday … 6 = Saturday (matches JS Date#getDay) */

export interface DemoOpeningHours {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

export const DEMO_OPENING_HOURS: Record<number, DemoOpeningHours> = {
  0: { start: "12:00", end: "22:00" }, // Sunday
  1: { start: "12:00", end: "23:00" },
  2: { start: "12:00", end: "23:00" },
  3: { start: "12:00", end: "23:00" },
  4: { start: "12:00", end: "23:00" },
  5: { start: "12:00", end: "23:59" }, // Friday
  6: { start: "12:00", end: "23:59" } // Saturday
};

/* ---------------------------- Zones -------------------------------------- */

export const DEMO_ZONES: readonly Zone[] = Object.freeze([
  {
    id: "zone-main",
    restaurant_id: DEMO_RESTAURANT_ID,
    slug: "main",
    name: "Main Hall",
    description: "Cozy seating in the main dining room.",
    display_order: 0,
    is_active: true
  },
  {
    id: "zone-terrace",
    restaurant_id: DEMO_RESTAURANT_ID,
    slug: "terrace",
    name: "Terrace",
    description: "Open-air terrace, weather permitting.",
    display_order: 1,
    is_active: true
  },
  {
    id: "zone-vip",
    restaurant_id: DEMO_RESTAURANT_ID,
    slug: "vip",
    name: "VIP Room",
    description: "Private room for groups, by reservation.",
    display_order: 2,
    is_active: true
  },
  {
    id: "zone-window",
    restaurant_id: DEMO_RESTAURANT_ID,
    slug: "window",
    name: "Window Table",
    description: "Tables along the front windows.",
    display_order: 3,
    is_active: true
  }
]);

/* ---------------------------- Tables ------------------------------------- */

interface TableSeed {
  id: string;
  zone_id: string;
  code: string;
  label: string;
  seats: number;
  shape: "rect" | "circle";
  pos_x: number;
  pos_y: number;
}

const TABLE_SEEDS: TableSeed[] = [
  // Main Hall
  { id: "tbl-m1", zone_id: "zone-main", code: "M1", label: "Table 1", seats: 2, shape: "rect", pos_x: 60, pos_y: 60 },
  { id: "tbl-m2", zone_id: "zone-main", code: "M2", label: "Table 2", seats: 2, shape: "rect", pos_x: 240, pos_y: 60 },
  { id: "tbl-m3", zone_id: "zone-main", code: "M3", label: "Table 3", seats: 4, shape: "rect", pos_x: 420, pos_y: 60 },
  { id: "tbl-m4", zone_id: "zone-main", code: "M4", label: "Table 4", seats: 4, shape: "rect", pos_x: 60, pos_y: 220 },
  { id: "tbl-m5", zone_id: "zone-main", code: "M5", label: "Table 5", seats: 6, shape: "circle", pos_x: 240, pos_y: 220 },
  // Terrace
  { id: "tbl-t6", zone_id: "zone-terrace", code: "T6", label: "Terrace 1", seats: 2, shape: "rect", pos_x: 600, pos_y: 60 },
  { id: "tbl-t7", zone_id: "zone-terrace", code: "T7", label: "Terrace 2", seats: 4, shape: "rect", pos_x: 600, pos_y: 220 },
  { id: "tbl-t8", zone_id: "zone-terrace", code: "T8", label: "Terrace 3", seats: 6, shape: "circle", pos_x: 420, pos_y: 220 },
  // VIP
  { id: "tbl-v9", zone_id: "zone-vip", code: "V9", label: "VIP 9", seats: 8, shape: "circle", pos_x: 60, pos_y: 400 },
  { id: "tbl-v10", zone_id: "zone-vip", code: "V10", label: "VIP 10", seats: 4, shape: "rect", pos_x: 300, pos_y: 400 },
  // Window
  { id: "tbl-w11", zone_id: "zone-window", code: "W11", label: "Window 1", seats: 2, shape: "rect", pos_x: 60, pos_y: 540 },
  { id: "tbl-w12", zone_id: "zone-window", code: "W12", label: "Window 2", seats: 2, shape: "rect", pos_x: 220, pos_y: 540 },
  { id: "tbl-w13", zone_id: "zone-window", code: "W13", label: "Window 3", seats: 4, shape: "rect", pos_x: 380, pos_y: 540 }
];

export const DEMO_TABLES: readonly RestaurantTableRow[] = Object.freeze(
  TABLE_SEEDS.map<RestaurantTableRow>((t) => ({
    id: t.id,
    restaurant_id: DEMO_RESTAURANT_ID,
    zone_id: t.zone_id,
    code: t.code,
    label: t.label,
    seats: t.seats,
    shape: t.shape,
    pos_x: t.pos_x,
    pos_y: t.pos_y,
    status: "available",
    is_active: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString()
  }))
);

/* ---------------------------- Initial reservations ----------------------- */
/**
 * A handful of pre-made bookings so the demo "feels alive" the first time
 * someone visits. Time-relative to *now* so the demo always shows fresh data.
 */
export function initialDemoReservations(now: Date = new Date()): Reservation[] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  function at(daysFromToday: number, hour: number, minute = 0) {
    const d = new Date(today);
    d.setDate(d.getDate() + daysFromToday);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  function reservation(args: {
    suffix: string;
    table: string;
    zone: string;
    start: Date;
    durationMin?: number;
    party: number;
    name: string;
    status?: ReservationStatus;
  }): Reservation {
    const ends = new Date(args.start.getTime() + (args.durationMin ?? 90) * 60_000);
    return {
      id: `seed-${args.suffix}`,
      restaurant_id: DEMO_RESTAURANT_ID,
      table_id: args.table,
      zone_id: args.zone,
      status: args.status ?? "confirmed",
      party_size: args.party,
      starts_at: args.start.toISOString(),
      ends_at: ends.toISOString(),
      guest_name: args.name,
      guest_phone: null,
      guest_email: null,
      notes: null,
      source: "online",
      external_ref: null,
      created_by: null,
      cancelled_at: null,
      cancelled_by: null,
      cancellation_reason: null,
      created_at: new Date(args.start.getTime() - 86400_000).toISOString(),
      updated_at: new Date(args.start.getTime() - 86400_000).toISOString()
    };
  }

  return [
    reservation({
      suffix: "1",
      table: "tbl-m4",
      zone: "zone-main",
      start: at(0, 19, 30),
      party: 4,
      name: "Olena P."
    }),
    reservation({
      suffix: "2",
      table: "tbl-v10",
      zone: "zone-vip",
      start: at(0, 20, 0),
      party: 4,
      name: "Petrenko V."
    }),
    reservation({
      suffix: "3",
      table: "tbl-t8",
      zone: "zone-terrace",
      start: at(1, 18, 30),
      party: 5,
      name: "Vasylenko O.",
      status: "pending"
    }),
    reservation({
      suffix: "4",
      table: "tbl-m5",
      zone: "zone-main",
      start: at(1, 20, 30),
      party: 6,
      name: "Hrytsenko M."
    })
  ];
}
