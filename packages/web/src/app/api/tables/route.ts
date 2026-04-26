import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { listTables } from "@/server/reservations/logic";

export async function GET() {
  const tables = await listTables(prisma);
  return NextResponse.json({ tables });
}

