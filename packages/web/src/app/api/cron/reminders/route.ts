import { NextResponse } from "next/server";
import { getPrisma } from "@/server/db";
import { runReminderSweep } from "@/server/operations";
import { createMockSmsProvider } from "@/server/sms-mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Optional: call from Vercel cron with Authorization: Bearer CRON_SECRET */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }
  const sms = createMockSmsProvider();
  await runReminderSweep({
    prisma: getPrisma(),
    sendSms: (to, body) => sms.send({ to, body })
  });
  return NextResponse.json({ ok: true, processed: true });
}
