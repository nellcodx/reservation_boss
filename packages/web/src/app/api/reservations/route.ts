import { NextResponse } from "next/server";
import { z } from "zod";
import { addMinutes } from "date-fns";
import { getPrisma } from "@/server/db";
import { createReservationOptimized } from "@/server/reservations/logic";
import { listReservationsInRange } from "@/server/operations";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createReservationViaSupabase } from "@/server/supabase/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Q = z.object({
  from: z.string().datetime(),
  to: z.string().datetime()
});

const Body = z.object({
  startAt: z.string().datetime(),
  durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
  partySize: z.number().int().min(1).max(20),
  guestName: z.string().min(1).max(80),
  // Phone is OPTIONAL — no phone-based flows.
  guestPhone: z.string().min(0).max(30).optional(),
  guestEmail: z.string().max(120).optional(),
  notes: z.string().max(500).optional(),
  preferredTableId: z.string().optional(),
  zoneId: z.string().uuid().optional()
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Q.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const from = new Date(parsed.data.from);
    const to = new Date(parsed.data.to);
    const reservations = await listReservationsInRange({ prisma: getPrisma(), from, to });
    return NextResponse.json({ reservations });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = Body.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const startAt = new Date(parsed.data.startAt);

    if (isSupabaseConfigured()) {
      const result = await createReservationViaSupabase({
        startAt,
        durationMinutes: parsed.data.durationMinutes,
        partySize: parsed.data.partySize,
        guestName: parsed.data.guestName,
        guestPhone: parsed.data.guestPhone,
        guestEmail: parsed.data.guestEmail,
        notes: parsed.data.notes,
        preferredTableId: parsed.data.preferredTableId,
        zoneId: parsed.data.zoneId
      });
      if (!result.ok) {
        return NextResponse.json(
          { ok: false, reason: result.reason },
          { status: result.status }
        );
      }
      return NextResponse.json(result);
    }

    // Legacy Prisma fallback
    const endAt = addMinutes(startAt, parsed.data.durationMinutes);
    const prisma = getPrisma();

    try {
      const result = await createReservationOptimized({
        prisma,
        input: {
          startAt,
          endAt,
          partySize: parsed.data.partySize,
          guestName: parsed.data.guestName,
          guestPhone: parsed.data.guestPhone ?? "",
          notes: parsed.data.notes,
          preferredTableId: parsed.data.preferredTableId,
          source: "online"
        }
      });

      if (!result.reservation) {
        return NextResponse.json({ ok: false, reason: result.reason }, { status: 409 });
      }

      const withTable = await prisma.reservation.findUnique({
        where: { id: result.reservation.id },
        include: { table: true }
      });
      return NextResponse.json({ ok: true, reservation: withTable });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "UNKNOWN";
      if (msg === "CONFLICT") return NextResponse.json({ ok: false, reason: "CONFLICT" }, { status: 409 });
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
