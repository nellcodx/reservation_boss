"use client";

/**
 * Browser-friendly typed wrappers around our Supabase RPCs and views.
 *
 * Every function gracefully returns `null`/empty when Supabase isn't configured
 * so the existing UI keeps working with its legacy /api/* routes.
 */

import { getSupabaseBrowserClient } from "./client";
import type {
  AvailableTable,
  CreateReservationResult,
  Zone,
  Restaurant,
  RestaurantTableRow,
  TableStatus
} from "./types";

/* --------------------------------------------------------------------------
 * Reads (RLS-aware public views)
 * -------------------------------------------------------------------------- */

export async function fetchActiveZones(restaurantId: string): Promise<Zone[]> {
  const c = getSupabaseBrowserClient();
  if (!c) return [];
  const { data, error } = await c
    .from("v_public_zones")
    .select("id, restaurant_id, slug, name, description, display_order, is_active")
    .eq("restaurant_id", restaurantId)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((z) => ({
    ...z,
    is_active: true
  })) as Zone[];
}

export async function fetchActiveTables(
  restaurantId: string
): Promise<RestaurantTableRow[]> {
  const c = getSupabaseBrowserClient();
  if (!c) return [];
  const { data, error } = await c
    .from("v_public_tables")
    .select(
      "id, restaurant_id, zone_id, code, label, seats, shape, pos_x, pos_y, status"
    )
    .eq("restaurant_id", restaurantId)
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as RestaurantTableRow[];
}

export async function fetchRestaurant(slug: string): Promise<Restaurant | null> {
  const c = getSupabaseBrowserClient();
  if (!c) return null;
  const { data, error } = await c
    .from("v_public_restaurants")
    .select("id, slug, name, timezone")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Restaurant) ?? null;
}

/* --------------------------------------------------------------------------
 * Availability
 * -------------------------------------------------------------------------- */

export interface GetAvailabilityArgs {
  restaurantId: string;
  /** ISO timestamp (UTC). Combine date + time on the client and pass `.toISOString()`. */
  startsAt: string;
  partySize: number;
  durationMinutes?: number;
  zoneId?: string | null;
}

export async function getAvailableTables(
  args: GetAvailabilityArgs
): Promise<AvailableTable[]> {
  const c = getSupabaseBrowserClient();
  if (!c) return [];
  const { data, error } = await c.rpc("get_available_tables", {
    p_restaurant_id: args.restaurantId,
    p_starts_at: args.startsAt,
    p_party_size: args.partySize,
    p_duration_min: args.durationMinutes ?? null,
    p_zone_id: args.zoneId ?? null
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as AvailableTable[];
}

/* --------------------------------------------------------------------------
 * Booking
 * -------------------------------------------------------------------------- */

export interface CreateReservationArgs {
  restaurantId: string;
  startsAt: string;
  partySize: number;
  guestName: string;
  guestPhone?: string | null;
  guestEmail?: string | null;
  zoneId?: string | null;
  tableId?: string | null;
  notes?: string | null;
  durationMinutes?: number;
  source?: "online" | "phone" | "walk_in" | "staff";
}

export async function createReservation(
  args: CreateReservationArgs
): Promise<CreateReservationResult> {
  const c = getSupabaseBrowserClient();
  if (!c) {
    return { ok: false, reason: "DB_ERROR", detail: "Supabase not configured" };
  }
  const { data, error } = await c.rpc("create_reservation", {
    p_restaurant_id: args.restaurantId,
    p_starts_at: args.startsAt,
    p_party_size: args.partySize,
    p_guest_name: args.guestName,
    p_guest_phone: args.guestPhone ?? null,
    p_guest_email: args.guestEmail ?? null,
    p_zone_id: args.zoneId ?? null,
    p_table_id: args.tableId ?? null,
    p_notes: args.notes ?? null,
    p_duration_min: args.durationMinutes ?? null,
    p_source: args.source ?? "online"
  });
  if (error) {
    return { ok: false, reason: "DB_ERROR", detail: error.message };
  }
  return data as CreateReservationResult;
}

/* --------------------------------------------------------------------------
 * Table status (staff)
 * -------------------------------------------------------------------------- */

export async function setTableStatus(tableId: string, status: TableStatus) {
  const c = getSupabaseBrowserClient();
  if (!c) throw new Error("Supabase not configured");
  const { data, error } = await c.rpc("set_table_status", {
    p_table_id: tableId,
    p_status: status
  });
  if (error) throw new Error(error.message);
  return data as { ok: boolean; reason?: string };
}

/* --------------------------------------------------------------------------
 * Friendly mapping for create_reservation error reasons
 * -------------------------------------------------------------------------- */

export function reservationErrorMessage(reason: string): string {
  switch (reason) {
    case "GUEST_NAME_REQUIRED":
      return "Please enter your name.";
    case "PARTY_SIZE_INVALID":
    case "PARTY_SIZE_OUT_OF_RANGE":
      return "Party size is out of range for this restaurant.";
    case "STARTS_AT_REQUIRED":
      return "Please pick a date and time.";
    case "TOO_EARLY":
      return "This time is too soon — please pick a later slot.";
    case "OUTSIDE_BOOKING_WINDOW":
      return "We don't take reservations that far in advance.";
    case "OUTSIDE_OPENING_HOURS":
      return "The restaurant isn't open at that time.";
    case "TABLE_UNAVAILABLE":
      return "That table just became unavailable. Try another option.";
    case "FULLY_BOOKED":
      return "Sorry — we're fully booked at that time.";
    case "CONFLICT":
      return "Just missed it — that table was booked a moment ago. Try again.";
    case "RESTAURANT_NOT_FOUND":
      return "Restaurant not found.";
    case "DURATION_OUT_OF_RANGE":
      return "Reservation duration is invalid.";
    default:
      return "Could not create reservation. Please try again.";
  }
}
