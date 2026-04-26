import { NextResponse } from "next/server";
import { z } from "zod";
import { addMinutes } from "date-fns";
import { getPrisma } from "@/server/db";
import { createReservationOptimized } from "@/server/reservations/logic";
import { setTableOccupation } from "@/server/operations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  partySize: z.coerce.number().int().min(1).max(20),
  guestName: z.string().min(1).max(80).optional().default("Walk-in"),
  guestPhone: z.string().max(30).optional().default("—"),
  durationMinutes: z.coerce.number().int().min(30).max(240).default(90),
  preferredTableId: z.string().optional(),
  markSeated: z.coerce.boolean().default(true)
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const prisma = getPrisma();
  const startAt = new Date();
  const endAt = addMinutes(startAt, parsed.data.durationMinutes);
  const result = await createReservationOptimized({
    prisma,
    input: {
      startAt,
      endAt,
      partySize: parsed.data.partySize,
      guestName: parsed.data.guestName,
      guestPhone: parsed.data.guestPhone,
      source: "walkin",
      preferredTableId: parsed.data.preferredTableId
    }
  });
  if (!result.reservation) return NextResponse.json({ ok: false, reason: result.reason }, { status: 409 });
  if (parsed.data.markSeated) {
    await setTableOccupation({ prisma, tableId: result.reservation.tableId, status: "OCCUPIED" });
  }
  const full = await prisma.reservation.findUnique({
    where: { id: result.reservation.id },
    include: { table: true }
  });
  return NextResponse.json({ ok: true, reservation: full });
}
