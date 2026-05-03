/**
 * Hand-written TypeScript types for the Supabase schema.
 *
 * For long-term maintenance, regenerate via the Supabase CLI:
 *   supabase gen types typescript --schema public > src/lib/supabase/types.gen.ts
 *
 * The shapes below intentionally mirror the SQL migrations in
 * `supabase/migrations/`.
 */

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no_show";

export type TableStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "cleaning"
  | "inactive";

export type StaffRole =
  | "owner"
  | "manager"
  | "host"
  | "waiter"
  | "kitchen"
  | "viewer";

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantSettings {
  restaurant_id: string;
  default_reservation_minutes: number;
  slot_granularity_minutes: number;
  min_party_size: number;
  max_party_size: number;
  booking_window_days: number;
  min_lead_time_minutes: number;
  allow_walkins: boolean;
  auto_confirm_reservations: boolean;
}

export interface Zone {
  id: string;
  restaurant_id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export interface RestaurantTableRow {
  id: string;
  restaurant_id: string;
  zone_id: string | null;
  code: string;
  label: string | null;
  seats: number;
  shape: "rect" | "circle";
  pos_x: number;
  pos_y: number;
  status: TableStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  table_id: string | null;
  zone_id: string | null;
  status: ReservationStatus;
  party_size: number;
  starts_at: string;
  ends_at: string;
  guest_name: string;
  guest_phone: string | null;
  guest_email: string | null;
  notes: string | null;
  source: string;
  external_ref: string | null;
  created_by: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

/* ---------- RPC return types ---------- */

export interface AvailableTable {
  id: string;
  zone_id: string | null;
  zone_slug: string | null;
  zone_name: string | null;
  code: string;
  label: string | null;
  seats: number;
  shape: "rect" | "circle";
  pos_x: number;
  pos_y: number;
}

export type CreateReservationOk = {
  ok: true;
  reservation_id: string;
  table_id: string;
  zone_id: string | null;
  status: ReservationStatus;
  starts_at: string;
  ends_at: string;
};

export type CreateReservationErr = {
  ok: false;
  reason:
    | "RESTAURANT_REQUIRED"
    | "RESTAURANT_NOT_FOUND"
    | "STARTS_AT_REQUIRED"
    | "PARTY_SIZE_INVALID"
    | "PARTY_SIZE_OUT_OF_RANGE"
    | "GUEST_NAME_REQUIRED"
    | "DURATION_OUT_OF_RANGE"
    | "TOO_EARLY"
    | "OUTSIDE_BOOKING_WINDOW"
    | "OUTSIDE_OPENING_HOURS"
    | "TABLE_UNAVAILABLE"
    | "FULLY_BOOKED"
    | "CONFLICT"
    | "DB_ERROR";
  detail?: string;
};

export type CreateReservationResult = CreateReservationOk | CreateReservationErr;

/* ---------- get_day_slots ---------- */

export interface DaySlotRow {
  starts_at: string;
  ends_at: string;
  available_count: number;
  total_count: number;
  indicator: "available" | "partial" | "reserved";
}

/* ---------- get_floor_overview ---------- */

export interface FloorOverviewRow {
  id: string;
  zone_id: string | null;
  zone_slug: string | null;
  code: string;
  label: string | null;
  seats: number;
  shape: "rect" | "circle";
  pos_x: number;
  pos_y: number;
  visual: "free" | "reserved" | "occupied";
}
