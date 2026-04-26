import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { buildWeekCalendars } from "@/server/calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Query = z.object({
  week: z.string().datetime(),
  slotMinutes: z.coerce.number().int().min(5).max(60).default(30),
  durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
  partySize: z.coerce.number().int().min(1).max(20).default(2)
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Query.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const prisma = getPrisma();
    const out = await buildWeekCalendars({
      prisma,
      weekStart: new Date(parsed.data.week),
      slotMinutes: parsed.data.slotMinutes,
      durationMinutes: parsed.data.durationMinutes,
      partySize: parsed.data.partySize
    });
    return NextResponse.json(out);
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
