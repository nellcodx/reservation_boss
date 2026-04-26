import { NextResponse } from "next/server";
import { z } from "zod";
import { addMinutes } from "date-fns";
import { prisma } from "@/server/db";
import { findAvailableTablesForWindow } from "@/server/reservations/logic";

const Query = z.object({
  startAt: z.string().datetime(),
  durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
  partySize: z.coerce.number().int().min(1).max(20)
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Query.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const startAt = new Date(parsed.data.startAt);
  const endAt = addMinutes(startAt, parsed.data.durationMinutes);
  const tables = await findAvailableTablesForWindow({
    prisma,
    startAt,
    endAt,
    partySize: parsed.data.partySize
  });

  return NextResponse.json({ startAt, endAt, tables });
}

