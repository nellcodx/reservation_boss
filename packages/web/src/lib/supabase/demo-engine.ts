/**
 * Demo engine — pure functions that mirror the SQL in
 * `supabase/migrations/006_rpc.sql`.
 *
 * No I/O, no React, no globals. Both the client store and the server store
 * call into these helpers, so business logic only lives in one place.
 */

import {
  DEMO_OPENING_HOURS,
  DEMO_RESTAURANT_ID,
  DEMO_SETTINGS,
  DEMO_TABLES,
  DEMO_ZONES
} from "./demo-data";
import type {
  AvailableTable,
  CreateReservationResult,
  DaySlotRow,
  FloorOverviewRow,
  Reservation,
  ReservationStatus,
  RestaurantTableRow,
  Zone
} from "./types";

/* --------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

const ACTIVE_STATUSES: ReservationStatus[] = ["pending", "confirmed", "seated"];

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Last-resort fallback — shouldn't fire in any modern browser/Node 14+.
  return `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function rangesOverlap(s1: Date, e1: Date, s2: Date, e2: Date): boolean {
  return s1 < e2 && s2 < e1;
}

function nonBlank(s: string | null | undefined): string | null {
  if (s == null) return null;
  const t = s.trim();
  return t.length === 0 ? null : t;
}

/* --------------------------------------------------------------------------
 * Public, pure read-only helpers
 * -------------------------------------------------------------------------- */

export function listZones(): Zone[] {
  return DEMO_ZONES.slice().sort((a, b) => a.display_order - b.display_order);
}

export function listTables(): RestaurantTableRow[] {
  return DEMO_TABLES.slice();
}

export function findZoneBySlug(slug: string): Zone | null {
  return DEMO_ZONES.find((z) => z.slug === slug) ?? null;
}

export function findTableById(id: string): RestaurantTableRow | null {
  return DEMO_TABLES.find((t) => t.id === id) ?? null;
}

export function isWithinOpeningHours(starts: Date, ends: Date): boolean {
  // No overnight bookings — both endpoints must fall on the same local day.
  if (
    starts.getFullYear() !== ends.getFullYear() ||
    starts.getMonth() !== ends.getMonth() ||
    starts.getDate() !== ends.getDate()
  ) {
    return false;
  }

  const dow = starts.getDay();
  const hours = DEMO_OPENING_HOURS[dow];
  if (!hours) return false;

  const startMinutes = starts.getHours() * 60 + starts.getMinutes();
  const endMinutes = ends.getHours() * 60 + ends.getMinutes();
  const open = parseTimeToMinutes(hours.start);
  const close = parseTimeToMinutes(hours.end);

  return startMinutes >= open && endMinutes <= close;
}

/* --------------------------------------------------------------------------
 * get_available_tables (RPC) — pure
 * -------------------------------------------------------------------------- */

export interface GetAvailableInput {
  reservations: Reservation[];
  startsAt: Date;
  endsAt: Date;
  partySize: number;
  zoneId?: string | null;
}

export function getAvailableTables(args: GetAvailableInput): AvailableTable[] {
  const { reservations, startsAt, endsAt, partySize, zoneId } = args;

  if (!isWithinOpeningHours(startsAt, endsAt)) return [];

  const blockedTableIds = new Set(
    reservations
      .filter(
        (r) =>
          r.table_id != null &&
          ACTIVE_STATUSES.includes(r.status) &&
          rangesOverlap(
            startsAt,
            endsAt,
            new Date(r.starts_at),
            new Date(r.ends_at)
          )
      )
      .map((r) => r.table_id as string)
  );

  return DEMO_TABLES.filter(
    (t) =>
      t.is_active &&
      t.status !== "inactive" &&
      t.seats >= partySize &&
      (zoneId == null || t.zone_id === zoneId) &&
      !blockedTableIds.has(t.id)
  )
    .map<AvailableTable>((t) => {
      const zone = DEMO_ZONES.find((z) => z.id === t.zone_id) ?? null;
      return {
        id: t.id,
        zone_id: t.zone_id,
        zone_slug: zone?.slug ?? null,
        zone_name: zone?.name ?? null,
        code: t.code,
        label: t.label,
        seats: t.seats,
        shape: t.shape,
        pos_x: t.pos_x,
        pos_y: t.pos_y
      };
    })
    .sort((a, b) => a.seats - b.seats || a.code.localeCompare(b.code));
}

/* --------------------------------------------------------------------------
 * create_reservation (RPC) — pure ("attempt" returns next state + result)
 * -------------------------------------------------------------------------- */

export interface CreateReservationInput {
  reservations: Reservation[];
  restaurantId: string;
  startsAt: Date;
  partySize: number;
  guestName: string;
  guestPhone?: string | null;
  guestEmail?: string | null;
  zoneId?: string | null;
  tableId?: string | null;
  notes?: string | null;
  durationMinutes?: number | null;
  source?: string;
  /** When set, the reservation row's `created_at` is taken from here (tests). */
  now?: Date;
}

export interface CreateReservationOutput {
  result: CreateReservationResult;
  /** Updated reservations list (only changes on success). */
  next: Reservation[];
  /** The new row, when ok. Useful for callers that want to emit realtime. */
  inserted?: Reservation;
}

export function attemptCreateReservation(
  input: CreateReservationInput
): CreateReservationOutput {
  const reservations = input.reservations;
  const now = input.now ?? new Date();

  // ---- 1. Required-field validation ----------------------------------------
  if (input.restaurantId !== DEMO_RESTAURANT_ID) {
    return {
      result: { ok: false, reason: "RESTAURANT_NOT_FOUND" },
      next: reservations
    };
  }
  if (Number.isNaN(input.startsAt.getTime())) {
    return {
      result: { ok: false, reason: "STARTS_AT_REQUIRED" },
      next: reservations
    };
  }
  if (!Number.isFinite(input.partySize) || input.partySize < 1) {
    return {
      result: { ok: false, reason: "PARTY_SIZE_INVALID" },
      next: reservations
    };
  }
  if (!input.guestName || input.guestName.trim().length === 0) {
    return {
      result: { ok: false, reason: "GUEST_NAME_REQUIRED" },
      next: reservations
    };
  }

  // ---- 2. Settings policy --------------------------------------------------
  const duration = input.durationMinutes ?? DEMO_SETTINGS.default_reservation_minutes;
  if (duration < 15 || duration > 360) {
    return {
      result: { ok: false, reason: "DURATION_OUT_OF_RANGE" },
      next: reservations
    };
  }
  const endsAt = new Date(input.startsAt.getTime() + duration * 60_000);

  if (
    input.partySize < DEMO_SETTINGS.min_party_size ||
    input.partySize > DEMO_SETTINGS.max_party_size
  ) {
    return {
      result: { ok: false, reason: "PARTY_SIZE_OUT_OF_RANGE" },
      next: reservations
    };
  }

  if (
    input.startsAt.getTime() <
    now.getTime() + DEMO_SETTINGS.min_lead_time_minutes * 60_000
  ) {
    return { result: { ok: false, reason: "TOO_EARLY" }, next: reservations };
  }

  if (
    input.startsAt.getTime() >
    now.getTime() + DEMO_SETTINGS.booking_window_days * 86_400_000
  ) {
    return {
      result: { ok: false, reason: "OUTSIDE_BOOKING_WINDOW" },
      next: reservations
    };
  }

  // ---- 3. Opening hours ----------------------------------------------------
  if (!isWithinOpeningHours(input.startsAt, endsAt)) {
    return {
      result: { ok: false, reason: "OUTSIDE_OPENING_HOURS" },
      next: reservations
    };
  }

  // ---- 4. Pick a table -----------------------------------------------------
  let chosenTable: RestaurantTableRow | null = null;

  if (input.tableId) {
    const t = findTableById(input.tableId);
    if (
      !t ||
      !t.is_active ||
      t.status === "inactive" ||
      t.seats < input.partySize
    ) {
      return {
        result: { ok: false, reason: "TABLE_UNAVAILABLE" },
        next: reservations
      };
    }
    const conflicts = reservations.some(
      (r) =>
        r.table_id === t.id &&
        ACTIVE_STATUSES.includes(r.status) &&
        rangesOverlap(
          input.startsAt,
          endsAt,
          new Date(r.starts_at),
          new Date(r.ends_at)
        )
    );
    if (conflicts) {
      return {
        result: { ok: false, reason: "TABLE_UNAVAILABLE" },
        next: reservations
      };
    }
    chosenTable = t;
  } else {
    const candidates = getAvailableTables({
      reservations,
      startsAt: input.startsAt,
      endsAt,
      partySize: input.partySize,
      zoneId: input.zoneId ?? null
    });

    let pick = candidates[0];

    // If a zone was requested but none fits there, fall back to any zone.
    if (!pick && input.zoneId) {
      const allZones = getAvailableTables({
        reservations,
        startsAt: input.startsAt,
        endsAt,
        partySize: input.partySize,
        zoneId: null
      });
      pick = allZones[0];
    }

    if (!pick) {
      return { result: { ok: false, reason: "FULLY_BOOKED" }, next: reservations };
    }
    chosenTable = findTableById(pick.id);
  }

  if (!chosenTable) {
    return { result: { ok: false, reason: "FULLY_BOOKED" }, next: reservations };
  }

  // ---- 5. Build the row ----------------------------------------------------
  const status: ReservationStatus = DEMO_SETTINGS.auto_confirm_reservations
    ? "confirmed"
    : "pending";

  const row: Reservation = {
    id: uuid(),
    restaurant_id: DEMO_RESTAURANT_ID,
    table_id: chosenTable.id,
    zone_id: chosenTable.zone_id,
    status,
    party_size: input.partySize,
    starts_at: input.startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    guest_name: input.guestName.trim(),
    guest_phone: nonBlank(input.guestPhone),
    guest_email: nonBlank(input.guestEmail),
    notes: nonBlank(input.notes),
    source: input.source ?? "online",
    external_ref: null,
    created_by: null,
    cancelled_at: null,
    cancelled_by: null,
    cancellation_reason: null,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };

  return {
    result: {
      ok: true,
      reservation_id: row.id,
      table_id: row.table_id as string,
      zone_id: row.zone_id,
      status: row.status,
      starts_at: row.starts_at,
      ends_at: row.ends_at
    },
    next: [...reservations, row],
    inserted: row
  };
}

/* --------------------------------------------------------------------------
 * get_day_slots (RPC) — pure
 * -------------------------------------------------------------------------- */

export interface GetDaySlotsInput {
  reservations: Reservation[];
  /** A date inside the target local day. */
  day: Date;
  slotMinutes?: number;
  durationMinutes?: number;
  partySize: number;
}

export function getDaySlots(input: GetDaySlotsInput): DaySlotRow[] {
  const slotMinutes = input.slotMinutes ?? DEMO_SETTINGS.slot_granularity_minutes;
  const duration = input.durationMinutes ?? DEMO_SETTINGS.default_reservation_minutes;
  const dow = input.day.getDay();
  const hours = DEMO_OPENING_HOURS[dow];
  if (!hours) return [];

  const totalEligible = DEMO_TABLES.filter(
    (t) => t.is_active && t.status !== "inactive" && t.seats >= input.partySize
  ).length;

  const dayStart = new Date(input.day);
  dayStart.setHours(0, 0, 0, 0);

  const open = parseTimeToMinutes(hours.start);
  const close = parseTimeToMinutes(hours.end);
  const lastStart = close - duration;

  const slots: DaySlotRow[] = [];
  for (let m = open; m <= lastStart; m += slotMinutes) {
    const startsAt = new Date(dayStart);
    startsAt.setMinutes(m);
    const endsAt = new Date(startsAt.getTime() + duration * 60_000);

    const available = getAvailableTables({
      reservations: input.reservations,
      startsAt,
      endsAt,
      partySize: input.partySize,
      zoneId: null
    }).length;

    let indicator: DaySlotRow["indicator"];
    if (available === 0) indicator = "reserved";
    else if (available === totalEligible) indicator = "available";
    else indicator = "partial";

    slots.push({
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      available_count: available,
      total_count: totalEligible,
      indicator
    });
  }
  return slots;
}

/* --------------------------------------------------------------------------
 * get_floor_overview (RPC) — pure
 * -------------------------------------------------------------------------- */

export interface GetFloorOverviewInput {
  reservations: Reservation[];
  at: Date;
  windowMinutes?: number;
}

export function getFloorOverview(input: GetFloorOverviewInput): FloorOverviewRow[] {
  const windowMin = input.windowMinutes ?? DEMO_SETTINGS.default_reservation_minutes;
  const endsAt = new Date(input.at.getTime() + windowMin * 60_000);

  const overlappingTableIds = new Set(
    input.reservations
      .filter(
        (r) =>
          r.table_id != null &&
          ACTIVE_STATUSES.includes(r.status) &&
          rangesOverlap(input.at, endsAt, new Date(r.starts_at), new Date(r.ends_at))
      )
      .map((r) => r.table_id as string)
  );

  return DEMO_TABLES.filter((t) => t.is_active && t.status !== "inactive").map(
    (t) => {
      const zone = DEMO_ZONES.find((z) => z.id === t.zone_id) ?? null;
      const visual: FloorOverviewRow["visual"] =
        t.status === "occupied"
          ? "occupied"
          : overlappingTableIds.has(t.id)
            ? "reserved"
            : "free";
      return {
        id: t.id,
        zone_id: t.zone_id,
        zone_slug: zone?.slug ?? null,
        code: t.code,
        label: t.label,
        seats: t.seats,
        shape: t.shape,
        pos_x: t.pos_x,
        pos_y: t.pos_y,
        visual
      };
    }
  );
}
