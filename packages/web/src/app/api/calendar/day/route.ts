import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { buildDaySlots } from "@/server/calendar";
import { isDemoModeEnabled, isSupabaseConfigured } from "@/lib/supabase/env";
import { loadDaySlotsViaSupabase } from "@/server/supabase/booking";
import { demoLoadDaySlots } from "@/server/supabase/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  try {
    if (isDemoModeEnabled()) {
      const data = demoLoadDaySlots({
        day: new Date(parsed.data.day),
        slotMinutes: parsed.data.slotMinutes,
        durationMinutes: parsed.data.durationMinutes,
        partySize: parsed.data.partySize
      });
      return NextResponse.json(data);
    }
    if (isSupabaseConfigured()) {
      const data = await loadDaySlotsViaSupabase({
        day: new Date(parsed.data.day),
        slotMinutes: parsed.data.slotMinutes,
        durationMinutes: parsed.data.durationMinutes,
        partySize: parsed.data.partySize
      });
      return NextResponse.json(data);
    }
    const data = await buildDaySlots({
      prisma: getPrisma(),
      day: new Date(parsed.data.day),
      slotMinutes: parsed.data.slotMinutes,
      durationMinutes: parsed.data.durationMinutes,
      partySize: parsed.data.partySize
    });
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
