import { NextResponse } from "next/server";
import { z } from "zod";
import { addMinutes } from "date-fns";
import { prisma } from "@/server/db";
import { createReservationOptimized } from "@/server/reservations/logic";

const Body = z.object({
  startAt: z.string().datetime(),
  durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
  partySize: z.number().int().min(1).max(20),
  guestName: z.string().min(1).max(80),
  guestPhone: z.string().min(5).max(30),
  notes: z.string().max(500).optional(),
  preferredTableId: z.string().optional()
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const startAt = new Date(parsed.data.startAt);
  const endAt = addMinutes(startAt, parsed.data.durationMinutes);

  try {
    const result = await createReservationOptimized({
      prisma,
      input: {
        startAt,
        endAt,
        partySize: parsed.data.partySize,
        guestName: parsed.data.guestName,
        guestPhone: parsed.data.guestPhone,
        notes: parsed.data.notes,
        preferredTableId: parsed.data.preferredTableId,
        source: "online"
      }
    });

    if (!result.reservation) {
      return NextResponse.json({ ok: false, reason: result.reason }, { status: 409 });
    }

    // Realtime is replaced by client refetch/polling in Option A.
    return NextResponse.json({ ok: true, reservation: result.reservation });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "CONFLICT") return NextResponse.json({ ok: false, reason: "CONFLICT" }, { status: 409 });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

