import type { PrismaClient, ReservationStatus, RestaurantTable } from "@prisma/client";

export type CreateReservationInput = {
  startAt: Date;
  endAt: Date;
  partySize: number;
  guestName: string;
  guestPhone: string;
  notes?: string;
  source?: string;
  preferredTableId?: string;
};

const ACTIVE_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED"];

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export async function listTables(prisma: PrismaClient) {
  return prisma.restaurantTable.findMany({ orderBy: [{ capacity: "asc" }, { name: "asc" }] });
}

export async function findAvailableTablesForWindow(args: {
  prisma: PrismaClient;
  startAt: Date;
  endAt: Date;
  partySize: number;
}) {
  const { prisma, startAt, endAt, partySize } = args;

  const tables = await prisma.restaurantTable.findMany({
    where: { capacity: { gte: partySize } },
    orderBy: [{ capacity: "asc" }, { name: "asc" }]
  });

  if (tables.length === 0) return [];

  const tableIds = tables.map((t) => t.id);
  const conflicts = await prisma.reservation.findMany({
    where: {
      tableId: { in: tableIds },
      status: { in: ACTIVE_STATUSES },
      startAt: { lt: endAt },
      endAt: { gt: startAt }
    },
    select: { tableId: true, startAt: true, endAt: true }
  });

  const conflicted = new Set<string>();
  for (const c of conflicts) {
    if (overlaps(startAt, endAt, c.startAt, c.endAt)) conflicted.add(c.tableId);
  }

  return tables.filter((t) => !conflicted.has(t.id));
}

export function pickBestTable(args: { tables: RestaurantTable[]; partySize: number }) {
  const { tables, partySize } = args;
  const sorted = [...tables].sort((a, b) => (a.capacity - b.capacity) || a.name.localeCompare(b.name));
  return sorted.find((t) => t.capacity >= partySize) ?? null;
}

export async function createReservationOptimized(args: {
  prisma: PrismaClient;
  input: CreateReservationInput;
}) {
  const { prisma, input } = args;
  const source = input.source ?? "online";

  if (input.endAt <= input.startAt) {
    throw new Error("Invalid time window");
  }

  const eligibleTables = await prisma.restaurantTable.findMany({
    where: { capacity: { gte: input.partySize } },
    orderBy: [{ capacity: "asc" }, { name: "asc" }]
  });

  if (eligibleTables.length === 0) {
    return { reservation: null, reason: "NO_TABLES_FOR_PARTY_SIZE" as const };
  }

  const preferred = input.preferredTableId
    ? eligibleTables.find((t) => t.id === input.preferredTableId) ?? null
    : null;

  const available = await findAvailableTablesForWindow({
    prisma,
    startAt: input.startAt,
    endAt: input.endAt,
    partySize: input.partySize
  });

  const chosen =
    (preferred && available.some((t) => t.id === preferred.id) ? preferred : null) ??
    pickBestTable({ tables: available, partySize: input.partySize });

  if (!chosen) {
    return { reservation: null, reason: "FULLY_BOOKED" as const };
  }

  // NOTE: Stronger conflict prevention should be backed by a DB-level constraint or SERIALIZABLE tx.
  // Here we do a transaction + re-check to prevent double-bookings under race in most cases.
  const reservation = await prisma.$transaction(async (tx) => {
    const conflict = await tx.reservation.findFirst({
      where: {
        tableId: chosen.id,
        status: { in: ACTIVE_STATUSES },
        startAt: { lt: input.endAt },
        endAt: { gt: input.startAt }
      },
      select: { id: true }
    });
    if (conflict) throw new Error("CONFLICT");

    return tx.reservation.create({
      data: {
        tableId: chosen.id,
        startAt: input.startAt,
        endAt: input.endAt,
        partySize: input.partySize,
        guestName: input.guestName,
        guestPhone: input.guestPhone,
        notes: input.notes,
        source
      }
    });
  });

  return { reservation, reason: null as const };
}

