import { addHours, addMinutes } from "date-fns";
import type { PrismaClient, Reservation, ReservationStatus } from "@prisma/client";
import { listTables } from "@/server/reservations/logic";

const ACTIVE: ReservationStatus[] = ["PENDING", "CONFIRMED"];

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export async function listReservationsInRange(args: {
  prisma: PrismaClient;
  from: Date;
  to: Date;
}) {
  return args.prisma.reservation.findMany({
    where: {
      OR: [
        { startAt: { gte: args.from, lt: args.to } },
        { endAt: { gt: args.from, lte: args.to } },
        { AND: [{ startAt: { lte: args.from } }, { endAt: { gte: args.to } }] }
      ]
    },
    include: { table: true },
    orderBy: { startAt: "asc" }
  });
}

export type FloorTableState = {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
  tableStatus: "FREE" | "OCCUPIED";
  visual: "free" | "reserved" | "occupied";
  reservationId?: string;
};

export async function getFloorState(args: {
  prisma: PrismaClient;
  at: Date;
  windowMinutes: number;
}): Promise<FloorTableState[]> {
  const { prisma, at, windowMinutes } = args;
  const wEnd = addMinutes(at, windowMinutes);

  const tables = await listTables(prisma);
  const resvs = await prisma.reservation.findMany({
    where: {
      status: { in: ACTIVE },
      startAt: { lt: wEnd },
      endAt: { gt: at }
    },
    select: { id: true, tableId: true, startAt: true, endAt: true }
  });

  return tables.map((t) => {
    const r = resvs.find((x) => x.tableId === t.id && overlaps(at, wEnd, x.startAt, x.endAt));
    const occupied = t.status === "OCCUPIED";
    const visual: FloorTableState["visual"] = occupied
      ? "occupied"
      : r
        ? "reserved"
        : "free";
    return {
      id: t.id,
      name: t.name,
      capacity: t.capacity,
      x: t.x,
      y: t.y,
      tableStatus: t.status,
      visual,
      reservationId: r?.id
    };
  });
}

export type AnalyticsSummary = {
  from: string;
  to: string;
  totalBookings: number;
  activeBookings: number;
  cancelledCount: number;
  noShowCount: number;
  peakHours: { hour: number; count: number }[];
  approximateOccupancyPct: number;
};

export async function getAnalytics(args: { prisma: PrismaClient; from: Date; to: Date }): Promise<AnalyticsSummary> {
  const { prisma, from, to } = args;

  const [all, byStatus] = await Promise.all([
    prisma.reservation.findMany({
      where: { startAt: { gte: from, lt: to } },
      select: { startAt: true, status: true }
    }),
    prisma.reservation.groupBy({
      by: ["status"],
      where: { startAt: { gte: from, lt: to } },
      _count: true
    })
  ]);

  const hourMap = new Map<number, number>();
  for (const r of all) {
    if (r.status === "CANCELLED") continue;
    const h = r.startAt.getHours();
    hourMap.set(h, (hourMap.get(h) ?? 0) + 1);
  }

  const peakHours = Array.from(hourMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const nTables = await prisma.restaurantTable.count();
  const hoursInRange = Math.max(1, (to.getTime() - from.getTime()) / 3600000);
  const activeBookings = all.filter((r) => r.status !== "CANCELLED").length;
  const slotsApprox = nTables * hoursInRange;
  const approximateOccupancyPct = slotsApprox > 0 ? Math.min(100, Math.round((activeBookings / slotsApprox) * 100)) : 0;

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    totalBookings: all.length,
    activeBookings,
    cancelledCount: byStatus.find((g) => g.status === "CANCELLED")?._count ?? 0,
    noShowCount: byStatus.find((g) => g.status === "NO_SHOW")?._count ?? 0,
    peakHours,
    approximateOccupancyPct
  };
}

export type UpdateReservationInput = {
  id: string;
  startAt?: Date;
  endAt?: Date;
  tableId?: string;
  status?: ReservationStatus;
  partySize?: number;
  guestName?: string;
  guestPhone?: string;
  notes?: string | null;
  tableStatus?: "FREE" | "OCCUPIED";
};

export async function updateReservation(args: {
  prisma: PrismaClient;
  input: UpdateReservationInput;
}): Promise<{ ok: true; reservation: Reservation } | { ok: false; reason: "NOT_FOUND" | "CONFLICT" }> {
  const { prisma, input } = args;
  const existing = await prisma.reservation.findUnique({
    where: { id: input.id },
    include: { table: true }
  });
  if (!existing) return { ok: false, reason: "NOT_FOUND" };

  const nextStart = input.startAt ?? existing.startAt;
  const nextEnd = input.endAt ?? existing.endAt;
  const nextTableId = input.tableId ?? existing.tableId;
  const nextParty = input.partySize ?? existing.partySize;

  if (nextEnd <= nextStart) {
    return { ok: false, reason: "CONFLICT" };
  }

  if (input.partySize != null) {
    const t = await prisma.restaurantTable.findUnique({ where: { id: nextTableId } });
    if (!t || t.capacity < nextParty) return { ok: false, reason: "CONFLICT" };
  }

  if (input.tableId || input.startAt || input.endAt) {
    const table = await prisma.restaurantTable.findUnique({ where: { id: nextTableId } });
    if (!table || table.capacity < nextParty) {
      return { ok: false, reason: "CONFLICT" };
    }
    const clash = await prisma.reservation.findFirst({
      where: {
        id: { not: existing.id },
        tableId: nextTableId,
        status: { in: ACTIVE },
        startAt: { lt: nextEnd },
        endAt: { gt: nextStart }
      }
    });
    if (clash) return { ok: false, reason: "CONFLICT" };
  }

  const res = await prisma.reservation.update({
    where: { id: input.id },
    data: {
      startAt: input.startAt,
      endAt: input.endAt,
      tableId: input.tableId,
      status: input.status,
      partySize: input.partySize,
      guestName: input.guestName,
      guestPhone: input.guestPhone,
      notes: input.notes
    }
  });

  if (input.tableStatus) {
    await prisma.restaurantTable.update({
      where: { id: nextTableId },
      data: { status: input.tableStatus }
    });
  }

  return { ok: true, reservation: res };
}

export async function setTableOccupation(args: {
  prisma: PrismaClient;
  tableId: string;
  status: "FREE" | "OCCUPIED";
}) {
  return args.prisma.restaurantTable.update({
    where: { id: args.tableId },
    data: { status: args.status }
  });
}

export async function runReminderSweep(args: {
  prisma: PrismaClient;
  sendSms: (to: string, body: string) => Promise<unknown>;
  now?: Date;
}) {
  const { prisma, sendSms, now = new Date() } = args;
  const target = addHours(now, 2);
  const fromT = addMinutes(target, -15);
  const toT = addMinutes(target, 15);

  const due = await prisma.reservation.findMany({
    where: {
      status: { in: ["CONFIRMED", "PENDING"] },
      smsReminderSentAt: null,
      startAt: { gte: fromT, lte: toT }
    }
  });

  for (const r of due) {
    const body = `Reminder: your table reservation is at ${r.startAt.toLocaleString()}. See you soon.`;
    try {
      await sendSms(r.guestPhone, body);
      await prisma.reservation.update({
        where: { id: r.id },
        data: { smsReminderSentAt: new Date() }
      });
    } catch {
      // best-effort
    }
  }
}
