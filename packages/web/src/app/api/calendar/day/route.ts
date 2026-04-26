import { NextResponse } from "next/server";
import { z } from "zod";
import { addMinutes, endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/server/db";
import { findAvailableTablesForWindow } from "@/server/reservations/logic";

const Query = z.object({
  day: z.string().datetime(),
  slotMinutes: z.coerce.number().int().min(5).max(60).default(15),
  durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
  partySize: z.coerce.number().int().min(1).max(20).default(2)
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Query.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const day = new Date(parsed.data.day);
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  const allTables = await prisma.restaurantTable.findMany({
    orderBy: [{ capacity: "asc" }, { name: "asc" }]
  });

  const eligibleCount = allTables.filter((t) => t.capacity >= parsed.data.partySize).length;

  const slots: Array<{
    startAt: Date;
    endAt: Date;
    availableCount: number;
    totalCount: number;
    indicator: "available" | "partial" | "reserved";
  }> = [];

  for (let t = new Date(dayStart); t < dayEnd; t = addMinutes(t, parsed.data.slotMinutes)) {
    const startAt = new Date(t);
    const endAt = addMinutes(startAt, parsed.data.durationMinutes);

    const available = await findAvailableTablesForWindow({
      prisma,
      startAt,
      endAt,
      partySize: parsed.data.partySize
    });

    const availableCount = available.length;
    const indicator =
      availableCount === 0
        ? "reserved"
        : availableCount === eligibleCount
          ? "available"
          : "partial";

    slots.push({
      startAt,
      endAt,
      availableCount,
      totalCount: eligibleCount,
      indicator
    });
  }

  return NextResponse.json({ dayStart, dayEnd, slots });
}

