/**
 * Server-side Supabase wrappers used by the legacy /api/* routes.
 *
 * These functions return data in the SAME shape the existing Prisma-backed
 * routes returned, so the React components in /book don't need to change.
 */

import { addDays, addMinutes, format, startOfWeek } from "date-fns";
import { getApiSupabaseClient, getDemoRestaurantId } from "./admin";
import type {
  AvailableTable,
  CreateReservationResult,
  DaySlotRow,
  FloorOverviewRow,
  TableStatus
} from "@/lib/supabase/types";

/* ------------------------- shared mappers ------------------------- */

function mapTableStatusToLegacy(status: TableStatus): "FREE" | "OCCUPIED" {
  return status === "occupied" ? "OCCUPIED" : "FREE";
}

function tableLabelFor(code: string, label: string | null) {
  return label && label.trim().length > 0 ? label : code;
}

/* ------------------------- /api/calendar/day ------------------------- */

export interface LegacySlot {
  startAt: string;
  endAt: string;
  availableCount: number;
  totalCount: number;
  indicator: "available" | "partial" | "reserved";
}

export interface LegacyDayResp {
  dayStart: string;
  dayEnd: string;
  slots: LegacySlot[];
}

export async function loadDaySlotsViaSupabase(args: {
  day: Date;
  slotMinutes: number;
  durationMinutes: number;
  partySize: number;
}): Promise<LegacyDayResp> {
  const c = getApiSupabaseClient();
  const restaurantId = getDemoRestaurantId();

  const dayStart = new Date(args.day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const dayLocal = format(args.day, "yyyy-MM-dd");

  const { data, error } = await c.rpc("get_day_slots", {
    p_restaurant_id: restaurantId,
    p_day_local: dayLocal,
    p_slot_minutes: args.slotMinutes,
    p_duration_min: args.durationMinutes,
    p_party_size: args.partySize
  });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as DaySlotRow[];
  return {
    dayStart: dayStart.toISOString(),
    dayEnd: dayEnd.toISOString(),
    slots: rows.map((r) => ({
      startAt: new Date(r.starts_at).toISOString(),
      endAt: new Date(r.ends_at).toISOString(),
      availableCount: r.available_count,
      totalCount: r.total_count,
      indicator: r.indicator
    }))
  };
}

/* ------------------------- /api/calendar/week ------------------------- */

export async function loadWeekViaSupabase(args: {
  weekStart: Date;
  slotMinutes: number;
  durationMinutes: number;
  partySize: number;
}) {
  const monday = startOfWeek(args.weekStart, { weekStartsOn: 1 });
  const days: LegacyDayResp[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = addDays(monday, i);
    days.push(
      await loadDaySlotsViaSupabase({
        day: d,
        slotMinutes: args.slotMinutes,
        durationMinutes: args.durationMinutes,
        partySize: args.partySize
      })
    );
  }
  return { weekStart: monday.toISOString(), days };
}

/* ------------------------- /api/availability ------------------------- */

export interface LegacyAvailabilityTable {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
  status: "FREE" | "OCCUPIED";
}

export async function loadAvailabilityViaSupabase(args: {
  startAt: Date;
  durationMinutes: number;
  partySize: number;
}) {
  const c = getApiSupabaseClient();
  const restaurantId = getDemoRestaurantId();
  const endAt = addMinutes(args.startAt, args.durationMinutes);

  const { data, error } = await c.rpc("get_available_tables", {
    p_restaurant_id: restaurantId,
    p_starts_at: args.startAt.toISOString(),
    p_party_size: args.partySize,
    p_duration_min: args.durationMinutes,
    p_zone_id: null
  });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as AvailableTable[];
  const tables: LegacyAvailabilityTable[] = rows.map((r) => ({
    id: r.id,
    name: tableLabelFor(r.code, r.label),
    capacity: r.seats,
    x: r.pos_x,
    y: r.pos_y,
    status: "FREE"
  }));

  return { startAt: args.startAt.toISOString(), endAt: endAt.toISOString(), tables };
}

/* ------------------------- /api/floor ------------------------- */

export interface LegacyFloorTable {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
  tableStatus: "FREE" | "OCCUPIED";
  visual: "free" | "reserved" | "occupied";
}

export async function loadFloorViaSupabase(args: {
  at: Date;
  windowMinutes: number;
}) {
  const c = getApiSupabaseClient();
  const restaurantId = getDemoRestaurantId();

  const { data, error } = await c.rpc("get_floor_overview", {
    p_restaurant_id: restaurantId,
    p_at: args.at.toISOString(),
    p_window_min: args.windowMinutes
  });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as FloorOverviewRow[];
  const floor: LegacyFloorTable[] = rows.map((r) => ({
    id: r.id,
    name: tableLabelFor(r.code, r.label),
    capacity: r.seats,
    x: r.pos_x,
    y: r.pos_y,
    tableStatus: r.visual === "occupied" ? "OCCUPIED" : "FREE",
    visual: r.visual
  }));

  return { at: args.at.toISOString(), floor };
}

/* ------------------------- /api/tables ------------------------- */

export async function loadTablesViaSupabase() {
  const c = getApiSupabaseClient();
  const restaurantId = getDemoRestaurantId();

  const { data, error } = await c
    .from("v_public_tables")
    .select("id, code, label, seats, pos_x, pos_y, status")
    .eq("restaurant_id", restaurantId)
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);

  return {
    tables: (data ?? []).map((t) => ({
      id: t.id,
      name: tableLabelFor(t.code, t.label),
      capacity: t.seats,
      x: t.pos_x,
      y: t.pos_y,
      status: mapTableStatusToLegacy(t.status as TableStatus)
    }))
  };
}

/* ------------------------- /api/reservations POST ------------------------- */

export async function createReservationViaSupabase(args: {
  startAt: Date;
  durationMinutes: number;
  partySize: number;
  guestName: string;
  guestPhone?: string | null;
  guestEmail?: string | null;
  notes?: string | null;
  preferredTableId?: string | null;
  zoneId?: string | null;
}): Promise<
  | { ok: true; reservation: { id: string; table: { name: string } | null } }
  | { ok: false; reason: string; status: number }
> {
  const c = getApiSupabaseClient();
  const restaurantId = getDemoRestaurantId();

  const { data, error } = await c.rpc("create_reservation", {
    p_restaurant_id: restaurantId,
    p_starts_at: args.startAt.toISOString(),
    p_party_size: args.partySize,
    p_guest_name: args.guestName,
    p_guest_phone: args.guestPhone ?? null,
    p_guest_email: args.guestEmail ?? null,
    p_zone_id: args.zoneId ?? null,
    p_table_id: args.preferredTableId ?? null,
    p_notes: args.notes ?? null,
    p_duration_min: args.durationMinutes,
    p_source: "online"
  });
  if (error) {
    return { ok: false, reason: "DB_ERROR", status: 500 };
  }

  const result = data as CreateReservationResult;
  if (!result.ok) {
    const status = result.reason === "FULLY_BOOKED" || result.reason === "CONFLICT" || result.reason === "TABLE_UNAVAILABLE"
      ? 409
      : 400;
    return { ok: false, reason: result.reason, status };
  }

  // Fetch the assigned table label so the UI confirmation can show "Table M5".
  let tableName: string | null = null;
  if (result.table_id) {
    const { data: t } = await c
      .from("v_public_tables")
      .select("code, label")
      .eq("id", result.table_id)
      .maybeSingle();
    if (t) tableName = tableLabelFor(t.code, t.label);
  }

  return {
    ok: true,
    reservation: {
      id: result.reservation_id,
      table: tableName ? { name: tableName } : null
    }
  };
}
