import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { listTables } from "@/server/reservations/logic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tables = await listTables(prisma);
    return NextResponse.json({ tables });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

