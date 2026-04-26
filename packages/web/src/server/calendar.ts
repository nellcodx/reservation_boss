import { addDays, addMinutes, endOfDay, startOfDay, startOfWeek } from "date-fns";
import type { PrismaClient } from "@prisma/client";
import { findAvailableTablesForWindow } from "@/server/reservations/logic";

export type SlotInfo = {
  startAt: Date;
  endAt: Date;
  availableCount: number;
  totalCount: number;
  indicator: "available" | "partial" | "reserved";
};

export async function buildDaySlots(args: {
  prisma: PrismaClient;
  day: Date;
  slotMinutes: number;
  durationMinutes: number;
  partySize: number;
}): Promise<{ dayStart: Date; dayEnd: Date; slots: SlotInfo[] }> {
  const { prisma, day, slotMinutes, durationMinutes, partySize } = args;
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  const allTables = await prisma.restaurantTable.findMany({
    orderBy: [{ capacity: "asc" }, { name: "asc" }]
  });
  const eligibleCount = allTables.filter((t) => t.capacity >= partySize).length;
  const slots: SlotInfo[] = [];

  for (let t = new Date(dayStart); t < dayEnd; t = addMinutes(t, slotMinutes)) {
    const startAt = new Date(t);
    const endAt = addMinutes(startAt, durationMinutes);
    const available = await findAvailableTablesForWindow({ prisma, startAt, endAt, partySize });
    const availableCount = available.length;
    const indicator =
      availableCount === 0
        ? "reserved"
        : availableCount === eligibleCount
          ? "available"
          : "partial";
    slots.push({ startAt, endAt, availableCount, totalCount: eligibleCount, indicator });
  }

  return { dayStart, dayEnd, slots };
}

export async function buildWeekCalendars(args: {
  prisma: PrismaClient;
  weekStart: Date;
  slotMinutes: number;
  durationMinutes: number;
  partySize: number;
}) {
  const monday = startOfWeek(new Date(args.weekStart), { weekStartsOn: 1 });
  const days: Awaited<ReturnType<typeof buildDaySlots>>[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = addDays(monday, i);
    days.push(
      await buildDaySlots({
        prisma: args.prisma,
        day: d,
        slotMinutes: args.slotMinutes,
        durationMinutes: args.durationMinutes,
        partySize: args.partySize
      })
    );
  }
  return { weekStart: monday, days };
}
