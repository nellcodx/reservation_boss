import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { getAnalytics } from "@/server/operations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Q = z.object({ from: z.string().datetime(), to: z.string().datetime() });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Q.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const summary = await getAnalytics({
      prisma: getPrisma(),
      from: new Date(parsed.data.from),
      to: new Date(parsed.data.to)
    });
    return NextResponse.json(summary);
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
