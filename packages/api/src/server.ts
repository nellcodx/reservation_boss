import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { addMinutes, startOfDay, endOfDay } from "date-fns";
import { env } from "./env.js";
import { prisma } from "./db.js";
import { createRealtime } from "./realtime.js";
import {
  createReservationOptimized,
  findAvailableTablesForWindow,
  listTables
} from "./reservations/logic.js";
import { createSmsProvider } from "./sms/index.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: env.WEB_ORIGINS,
    credentials: true
  })
);

const sms = createSmsProvider();

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/tables", async (_req, res) => {
  const tables = await listTables(prisma);
  res.json({ tables });
});

app.get("/availability", async (req, res) => {
  const Query = z.object({
    startAt: z.string().datetime(),
    durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
    partySize: z.coerce.number().int().min(1).max(20)
  });

  const parsed = Query.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const startAt = new Date(parsed.data.startAt);
  const endAt = addMinutes(startAt, parsed.data.durationMinutes);

  const tables = await findAvailableTablesForWindow({
    prisma,
    startAt,
    endAt,
    partySize: parsed.data.partySize
  });

  res.json({ startAt, endAt, tables });
});

app.get("/calendar/day", async (req, res) => {
  const Query = z.object({
    day: z.string().datetime(), // any datetime; normalized to local day boundary
    slotMinutes: z.coerce.number().int().min(5).max(60).default(15),
    durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
    partySize: z.coerce.number().int().min(1).max(20).default(2)
  });
  const parsed = Query.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const day = new Date(parsed.data.day);
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  const allTables = await prisma.restaurantTable.findMany({
    orderBy: [{ capacity: "asc" }, { name: "asc" }]
  });

  const slots: Array<{
    startAt: Date;
    endAt: Date;
    availableCount: number;
    totalCount: number;
    indicator: "available" | "partial" | "reserved";
  }> = [];

  for (let t = new Date(dayStart); t < dayEnd; t = addMinutes(t, parsed.data.slotMinutes)) {
    const startAt = new Date(t);
    const endAt = addMinutes(startAt, parsed.data.durationMinutes);

    const available = await findAvailableTablesForWindow({
      prisma,
      startAt,
      endAt,
      partySize: parsed.data.partySize
    });

    const totalEligible = allTables.filter((x) => x.capacity >= parsed.data.partySize).length;
    const availableCount = available.length;
    const indicator =
      availableCount === 0 ? "reserved" : availableCount === totalEligible ? "available" : "partial";

    slots.push({ startAt, endAt, availableCount, totalCount: totalEligible, indicator });
  }

  res.json({ dayStart, dayEnd, slots });
});

app.post("/reservations", async (req, res) => {
  const Body = z.object({
    startAt: z.string().datetime(),
    durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
    partySize: z.number().int().min(1).max(20),
    guestName: z.string().min(1).max(80),
    guestPhone: z.string().min(5).max(30),
    notes: z.string().max(500).optional(),
    preferredTableId: z.string().optional()
  });

  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

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
      return res.status(409).json({ ok: false, reason: result.reason });
    }

    // Fire-and-forget SMS confirmation (mock by default).
    void sms.send({
      to: parsed.data.guestPhone,
      body: `Reservation received for ${parsed.data.partySize} at ${startAt.toLocaleString()}.`
    });

    realtime.broadcastAvailability({ startAt, endAt });
    return res.json({ ok: true, reservation: result.reservation });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "CONFLICT") return res.status(409).json({ ok: false, reason: "CONFLICT" });
    return res.status(500).json({ ok: false, error: msg });
  }
});

const server = http.createServer(app);
const realtime = createRealtime(server);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${env.PORT}`);
});

