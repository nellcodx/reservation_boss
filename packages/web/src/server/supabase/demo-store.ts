/**
 * Server-side demo store — module-singleton (also pinned to `globalThis` so
 * dev HMR doesn't reset the cache between requests).
 *
 * The shape of every function below mirrors what the legacy Prisma- and
 * Supabase-backed adapters in `server/supabase/booking.ts` expose, so the
 * `/api/*` route handlers can plug a third path in without changing.
 */

import { addDays, addMinutes, startOfWeek } from "date-fns";
import {
  attemptCreateReservation,
  getAvailableTables as engineGetAvailable,
  getDaySlots as engineGetDaySlots,
  getFloorOverview as engineGetFloor
} from "@/lib/supabase/demo-engine";
import {
  DEMO_RESTAURANT_ID,
  DEMO_TABLES,
  initialDemoReservations
} from "@/lib/supabase/demo-data";
import type { Reservation } from "@/lib/supabase/types";
import type {
  LegacyAvailabilityTable,
  LegacyDayResp,
  LegacyFloorTable
} from "./booking";

interface ServerDemoState {
  reservations: Reservation[];
}

const GLOBAL_KEY = "__horeca_demo_state__";

function getState(): ServerDemoState {
  const g = globalThis as unknown as Record<string, unknown>;
  let state = g[GLOBAL_KEY] as ServerDemoState | undefined;
  if (!state) {
    state = { reservations: initialDemoReservations() };
    g[GLOBAL_KEY] = state;
  }
  return state;
}

/* -------------------------------------------------------------------------
 * Tiny helpers
 * ------------------------------------------------------------------------- */

function tableLabelFor(code: string, label: string | null) {
  return label && label.trim().length > 0 ? label : code;
}

function findTable(id: string) {
  return DEMO_TABLES.find((t) => t.id === id);
}

/* -------------------------------------------------------------------------
 * Adapter outputs that match the legacy /api/* response shapes
 * ------------------------------------------------------------------------- */

export function demoLoadDaySlots(args: {
  day: Date;
  slotMinutes: number;
  durationMinutes: number;
  partySize: number;
}): LegacyDayResp {
  const state = getState();

  const dayStart = new Date(args.day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const slots = engineGetDaySlots({
    reservations: state.reservations,
    day: args.day,
    slotMinutes: args.slotMinutes,
    durationMinutes: args.durationMinutes,
    partySize: args.partySize
  });

  return {
    dayStart: dayStart.toISOString(),
    dayEnd: dayEnd.toISOString(),
    slots: slots.map((s) => ({
      startAt: s.starts_at,
      endAt: s.ends_at,
      availableCount: s.available_count,
      totalCount: s.total_count,
      indicator: s.indicator
    }))
  };
}

export function demoLoadWeek(args: {
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
      demoLoadDaySlots({
        day: d,
        slotMinutes: args.slotMinutes,
        durationMinutes: args.durationMinutes,
        partySize: args.partySize
      })
    );
  }
  return { weekStart: monday.toISOString(), days };
}

export function demoLoadAvailability(args: {
  startAt: Date;
  durationMinutes: number;
  partySize: number;
}): { startAt: string; endAt: string; tables: LegacyAvailabilityTable[] } {
  const state = getState();
  const endAt = addMinutes(args.startAt, args.durationMinutes);
  const rows = engineGetAvailable({
    reservations: state.reservations,
    startsAt: args.startAt,
    endsAt: endAt,
    partySize: args.partySize,
    zoneId: null
  });
  return {
    startAt: args.startAt.toISOString(),
    endAt: endAt.toISOString(),
    tables: rows.map((r) => ({
      id: r.id,
      name: tableLabelFor(r.code, r.label),
      capacity: r.seats,
      x: r.pos_x,
      y: r.pos_y,
      status: "FREE"
    }))
  };
}

export function demoLoadFloor(args: { at: Date; windowMinutes: number }) {
  const state = getState();
  const rows = engineGetFloor({
    reservations: state.reservations,
    at: args.at,
    windowMinutes: args.windowMinutes
  });
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

export function demoLoadTables() {
  return {
    tables: DEMO_TABLES.map((t) => ({
      id: t.id,
      name: tableLabelFor(t.code, t.label),
      capacity: t.seats,
      x: t.pos_x,
      y: t.pos_y,
      status: t.status === "occupied" ? "OCCUPIED" : "FREE"
    }))
  };
}

export function demoCreateReservation(args: {
  startAt: Date;
  durationMinutes: number;
  partySize: number;
  guestName: string;
  guestPhone?: string | null;
  guestEmail?: string | null;
  notes?: string | null;
  preferredTableId?: string | null;
  zoneId?: string | null;
}):
  | { ok: true; reservation: { id: string; table: { name: string } | null } }
  | { ok: false; reason: string; status: number } {
  const state = getState();
  const out = attemptCreateReservation({
    reservations: state.reservations,
    restaurantId: DEMO_RESTAURANT_ID,
    startsAt: args.startAt,
    partySize: args.partySize,
    guestName: args.guestName,
    guestPhone: args.guestPhone,
    guestEmail: args.guestEmail,
    zoneId: args.zoneId,
    tableId: args.preferredTableId,
    notes: args.notes,
    durationMinutes: args.durationMinutes,
    source: "online"
  });

  if (!out.result.ok) {
    const status =
      out.result.reason === "FULLY_BOOKED" ||
      out.result.reason === "CONFLICT" ||
      out.result.reason === "TABLE_UNAVAILABLE"
        ? 409
        : 400;
    return { ok: false, reason: out.result.reason, status };
  }

  // Commit to module state.
  state.reservations = out.next;

  const t = out.inserted?.table_id ? findTable(out.inserted.table_id) : null;
  return {
    ok: true,
    reservation: {
      id: out.result.reservation_id,
      table: t ? { name: tableLabelFor(t.code, t.label) } : null
    }
  };
}

/* -------------------------------------------------------------------------
 * Lifecycle helpers
 * ------------------------------------------------------------------------- */

export function demoServerReset() {
  const g = globalThis as unknown as Record<string, unknown>;
  g[GLOBAL_KEY] = { reservations: initialDemoReservations() };
}
