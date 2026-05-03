import { NextResponse } from "next/server";
import { getPrisma } from "@/server/db";
import { listTables } from "@/server/reservations/logic";
import { isDemoModeEnabled, isSupabaseConfigured } from "@/lib/supabase/env";
import { loadTablesViaSupabase } from "@/server/supabase/booking";
import { demoLoadTables } from "@/server/supabase/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (isDemoModeEnabled()) {
      return NextResponse.json(demoLoadTables());
    }
    if (isSupabaseConfigured()) {
      const out = await loadTablesViaSupabase();
      return NextResponse.json(out);
    }
    const prisma = getPrisma();
    const tables = await listTables(prisma);
    return NextResponse.json({ tables });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
