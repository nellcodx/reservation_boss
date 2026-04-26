import { NextResponse } from "next/server";
import { z } from "zod";
import { addMinutes } from "date-fns";
import { getPrisma } from "@/server/db";
import { updateReservation } from "@/server/operations";
import { createMockSmsProvider } from "@/server/sms-mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  durationMinutes: z.coerce.number().int().min(15).max(360).optional(),
  tableId: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW"]).optional(),
  partySize: z.coerce.number().int().min(1).max(20).optional(),
  guestName: z.string().min(1).max(80).optional(),
  guestPhone: z.string().min(5).max(30).optional(),
  notes: z.string().max(500).nullable().optional(),
  tableStatus: z.enum(["FREE", "OCCUPIED"]).optional()
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const p = parsed.data;
  const prisma = getPrisma();
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ ok: false, reason: "NOT_FOUND" }, { status: 404 });

  const startAt = p.startAt ? new Date(p.startAt) : existing.startAt;
  let endAt: Date;
  if (p.endAt) endAt = new Date(p.endAt);
  else if (p.durationMinutes) endAt = addMinutes(startAt, p.durationMinutes);
  else if (p.startAt && !p.endAt)
    endAt = addMinutes(startAt, Math.round((existing.endAt.getTime() - existing.startAt.getTime()) / 60000));
  else endAt = existing.endAt;

  const sms = createMockSmsProvider();
  const r = await updateReservation({
    prisma,
    input: {
      id,
      startAt: p.startAt ? startAt : undefined,
      endAt: p.endAt != null || p.durationMinutes != null || p.startAt != null ? endAt : undefined,
      tableId: p.tableId,
      status: p.status,
      partySize: p.partySize,
      guestName: p.guestName,
      guestPhone: p.guestPhone,
      notes: p.notes,
      tableStatus: p.tableStatus
    }
  });
  if (!r.ok) {
    return r.reason === "NOT_FOUND"
      ? new NextResponse(null, { status: 404 })
      : NextResponse.json({ ok: false, reason: "CONFLICT" }, { status: 409 });
  }
  if (p.status === "CANCELLED") {
    void sms.send({
      to: r.reservation.guestPhone,
      body: "Your reservation has been cancelled. We're sorry to miss you."
    });
  }
  return NextResponse.json({ ok: true, reservation: r.reservation });
}
