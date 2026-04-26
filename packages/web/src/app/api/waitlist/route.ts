import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { createMockSmsProvider } from "@/server/sms-mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Q = z.object({
  from: z.string().datetime(),
  to: z.string().datetime()
});

const PostBody = z.object({
  desiredAt: z.string().datetime(),
  partySize: z.coerce.number().int().min(1).max(20),
  guestName: z.string().min(1).max(80),
  guestPhone: z.string().min(5).max(30),
  notes: z.string().max(500).optional()
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Q.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const entries = await getPrisma().waitlistEntry.findMany({
      where: { desiredAt: { gte: new Date(parsed.data.from), lt: new Date(parsed.data.to) } },
      orderBy: { desiredAt: "asc" }
    });
    return NextResponse.json({ entries });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = PostBody.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const sms = createMockSmsProvider();
  try {
    const entry = await getPrisma().waitlistEntry.create({
      data: {
        desiredAt: new Date(parsed.data.desiredAt),
        partySize: parsed.data.partySize,
        guestName: parsed.data.guestName,
        guestPhone: parsed.data.guestPhone,
        notes: parsed.data.notes
      }
    });
    void sms.send({
      to: parsed.data.guestPhone,
      body: `Waitlist: we'll text you if a table opens for ${parsed.data.partySize} on ${new Date(parsed.data.desiredAt).toLocaleString()}.`
    });
    return NextResponse.json({ ok: true, entry });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
