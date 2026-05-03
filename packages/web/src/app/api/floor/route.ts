import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { getFloorState } from "@/server/operations";
import { isDemoModeEnabled, isSupabaseConfigured } from "@/lib/supabase/env";
import { loadFloorViaSupabase } from "@/server/supabase/booking";
import { demoLoadFloor } from "@/server/supabase/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Q = z.object({
  at: z.string().datetime(),
  windowMinutes: z.coerce.number().int().min(15).max(360).default(90)
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Q.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const at = new Date(parsed.data.at);

    if (isDemoModeEnabled()) {
      const out = demoLoadFloor({
        at,
        windowMinutes: parsed.data.windowMinutes
      });
      return NextResponse.json(out);
    }
    if (isSupabaseConfigured()) {
      const out = await loadFloorViaSupabase({
        at,
        windowMinutes: parsed.data.windowMinutes
      });
      return NextResponse.json(out);
    }

    const floor = await getFloorState({
      prisma: getPrisma(),
      at,
      windowMinutes: parsed.data.windowMinutes
    });
    return NextResponse.json({ at, floor });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
