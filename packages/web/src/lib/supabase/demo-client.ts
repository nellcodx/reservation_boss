"use client";

/**
 * Browser-side demo store.
 *
 * Persists reservations to `localStorage`, syncs across tabs via the `storage`
 * event, and exposes a tiny EventTarget so realtime subscribers behave the
 * same way they would against Supabase.
 *
 * All function signatures match `lib/supabase/api.ts` so the public API can
 * delegate transparently.
 */

import {
  attemptCreateReservation,
  getAvailableTables as engineGetAvailable,
  getDaySlots as engineGetDaySlots,
  getFloorOverview as engineGetFloor,
  listTables,
  listZones
} from "./demo-engine";
import { initialDemoReservations } from "./demo-data";
import type {
  AvailableTable,
  CreateReservationResult,
  DaySlotRow,
  FloorOverviewRow,
  Reservation,
  RestaurantTableRow,
  Zone
} from "./types";

const STORAGE_KEY = "horeca-boss-demo-v1";

interface PersistShape {
  version: 1;
  reservations: Reservation[];
}

let inMemory: Reservation[] = [];
let initialized = false;

const target = typeof EventTarget !== "undefined" ? new EventTarget() : null;

type Listener = (e: {
  type: "INSERT" | "UPDATE" | "DELETE";
  row: Reservation;
}) => void;

const subscribers = new Set<Listener>();

function emit(type: "INSERT" | "UPDATE" | "DELETE", row: Reservation) {
  for (const sub of subscribers) {
    try {
      sub({ type, row });
    } catch {
      // never let one bad listener kill the others.
    }
  }
}

function readStorage(): Reservation[] | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistShape;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.reservations)) {
      return null;
    }
    return parsed.reservations;
  } catch {
    return null;
  }
}

function writeStorage(rows: Reservation[]): void {
  try {
    if (typeof localStorage === "undefined") return;
    const payload: PersistShape = { version: 1, reservations: rows };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // QuotaExceeded etc. — silent.
  }
}

function ensureInitialized() {
  if (initialized) return;
  initialized = true;

  const stored = readStorage();
  if (stored && stored.length > 0) {
    inMemory = stored;
  } else {
    inMemory = initialDemoReservations();
    writeStorage(inMemory);
  }

  // Cross-tab sync
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (ev) => {
      if (ev.key !== STORAGE_KEY || !ev.newValue) return;
      try {
        const parsed = JSON.parse(ev.newValue) as PersistShape;
        if (!parsed || parsed.version !== 1) return;
        const previousIds = new Set(inMemory.map((r) => r.id));
        inMemory = parsed.reservations;
        // Diff & emit synthetic INSERT events so realtime listeners fire.
        for (const row of inMemory) {
          if (!previousIds.has(row.id)) emit("INSERT", row);
        }
      } catch {
        /* ignore */
      }
    });
  }
}

/* -------------------------------------------------------------------------
 * Latency simulation
 * ------------------------------------------------------------------------- */

function delay(min = 120, max = 280): Promise<void> {
  const ms = Math.floor(min + Math.random() * (max - min));
  return new Promise((res) => setTimeout(res, ms));
}

/* -------------------------------------------------------------------------
 * Public API — matches lib/supabase/api.ts signatures
 * ------------------------------------------------------------------------- */

export async function demoFetchActiveZones(restaurantId: string): Promise<Zone[]> {
  void restaurantId;
  ensureInitialized();
  await delay(60, 140);
  return listZones();
}

export async function demoFetchActiveTables(
  restaurantId: string
): Promise<RestaurantTableRow[]> {
  void restaurantId;
  ensureInitialized();
  await delay(60, 140);
  return listTables();
}

export interface DemoGetAvailabilityArgs {
  startsAt: string;
  partySize: number;
  durationMinutes?: number;
  zoneId?: string | null;
}

export async function demoGetAvailableTables(
  args: DemoGetAvailabilityArgs
): Promise<AvailableTable[]> {
  ensureInitialized();
  await delay();
  const startsAt = new Date(args.startsAt);
  const duration = args.durationMinutes ?? 90;
  const endsAt = new Date(startsAt.getTime() + duration * 60_000);
  return engineGetAvailable({
    reservations: inMemory,
    startsAt,
    endsAt,
    partySize: args.partySize,
    zoneId: args.zoneId ?? null
  });
}

export interface DemoCreateReservationArgs {
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

export async function demoCreateReservation(
  args: DemoCreateReservationArgs
): Promise<CreateReservationResult> {
  ensureInitialized();
  await delay(220, 480);

  const out = attemptCreateReservation({
    reservations: inMemory,
    restaurantId: args.restaurantId,
    startsAt: new Date(args.startsAt),
    partySize: args.partySize,
    guestName: args.guestName,
    guestPhone: args.guestPhone,
    guestEmail: args.guestEmail,
    zoneId: args.zoneId,
    tableId: args.tableId,
    notes: args.notes,
    durationMinutes: args.durationMinutes,
    source: args.source
  });

  if (out.result.ok && out.inserted) {
    inMemory = out.next;
    writeStorage(inMemory);
    emit("INSERT", out.inserted);
  }
  return out.result;
}

export async function demoGetDaySlots(args: {
  day: Date;
  slotMinutes?: number;
  durationMinutes?: number;
  partySize: number;
}): Promise<DaySlotRow[]> {
  ensureInitialized();
  await delay();
  return engineGetDaySlots({ reservations: inMemory, ...args });
}

export async function demoGetFloorOverview(args: {
  at: Date;
  windowMinutes?: number;
}): Promise<FloorOverviewRow[]> {
  ensureInitialized();
  await delay();
  return engineGetFloor({ reservations: inMemory, ...args });
}

/* -------------------------------------------------------------------------
 * Realtime
 * ------------------------------------------------------------------------- */

export function demoSubscribeToReservations(
  restaurantId: string,
  onChange: Listener
): () => void {
  void restaurantId;
  ensureInitialized();
  subscribers.add(onChange);
  return () => {
    subscribers.delete(onChange);
  };
}

/* -------------------------------------------------------------------------
 * Test/dev utilities (not used by the public app)
 * ------------------------------------------------------------------------- */

/** Clear local demo data and reseed. Handy from the browser console. */
export function demoReset(): void {
  if (typeof localStorage !== "undefined") localStorage.removeItem(STORAGE_KEY);
  inMemory = initialDemoReservations();
  writeStorage(inMemory);
  if (target) target.dispatchEvent(new Event("reset"));
}

if (typeof window !== "undefined") {
  // Expose for manual debugging without polluting React state.
  (window as unknown as { __horecaDemoReset?: () => void }).__horecaDemoReset = demoReset;
}
