import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { addMinutes } from "date-fns";
import { env } from "./env.js";
import { prisma } from "./db.js";
import { createRealtime } from "./realtime.js";
import {
  createReservationOptimized,
  findAvailableTablesForWindow,
  listTables
} from "./reservations/logic.js";
import { createSmsProvider } from "./sms/index.js";
import { buildDaySlots, buildWeekCalendars } from "./calendar.js";
import {
  getAnalytics,
  getFloorState,
  listReservationsInRange,
  runReminderSweep,
  setTableOccupation,
  updateReservation
} from "./operations.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: env.WEB_ORIGINS,
    credentials: true
  })
);

const sms = createSmsProvider();
const sendSms = (to: string, body: string) => sms.send({ to, body });

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
    day: z.string().datetime(),
    slotMinutes: z.coerce.number().int().min(5).max(60).default(15),
    durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
    partySize: z.coerce.number().int().min(1).max(20).default(2)
  });
  const parsed = Query.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = await buildDaySlots({
    prisma,
    day: new Date(parsed.data.day),
    slotMinutes: parsed.data.slotMinutes,
    durationMinutes: parsed.data.durationMinutes,
    partySize: parsed.data.partySize
  });
  res.json(data);
});

app.get("/calendar/week", async (req, res) => {
  const Query = z.object({
    week: z.string().datetime(),
    slotMinutes: z.coerce.number().int().min(5).max(60).default(30),
    durationMinutes: z.coerce.number().int().min(15).max(360).default(90),
    partySize: z.coerce.number().int().min(1).max(20).default(2)
  });
  const parsed = Query.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const out = await buildWeekCalendars({
    prisma,
    weekStart: new Date(parsed.data.week),
    slotMinutes: parsed.data.slotMinutes,
    durationMinutes: parsed.data.durationMinutes,
    partySize: parsed.data.partySize
  });
  res.json(out);
});

app.get("/floor", async (req, res) => {
  const Q = z.object({
    at: z.string().datetime(),
    windowMinutes: z.coerce.number().int().min(15).max(360).default(90)
  });
  const parsed = Q.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const at = new Date(parsed.data.at);
  const floor = await getFloorState({ prisma, at, windowMinutes: parsed.data.windowMinutes });
  res.json({ at, floor });
});

app.get("/reservations", async (req, res) => {
  const Q = z.object({
    from: z.string().datetime(),
    to: z.string().datetime()
  });
  const parsed = Q.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const from = new Date(parsed.data.from);
  const to = new Date(parsed.data.to);
  const reservations = await listReservationsInRange({ prisma, from, to });
  res.json({ reservations });
});

app.patch("/reservations/:id", async (req, res) => {
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
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const id = req.params.id;
  const p = parsed.data;
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ ok: false, reason: "NOT_FOUND" });

  let startAt = p.startAt ? new Date(p.startAt) : existing.startAt;
  let endAt: Date;
  if (p.endAt) endAt = new Date(p.endAt);
  else if (p.durationMinutes) endAt = addMinutes(startAt, p.durationMinutes);
  else if (p.startAt && !p.endAt) endAt = addMinutes(startAt, Math.round((existing.endAt.getTime() - existing.startAt.getTime()) / 60000));
  else endAt = existing.endAt;

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
  if (!r.ok) return r.reason === "NOT_FOUND" ? res.status(404).end() : res.status(409).json({ ok: false, reason: "CONFLICT" });
  if (p.status === "CANCELLED") {
    void sendSms(r.reservation.guestPhone, "Your reservation has been cancelled. We're sorry to miss you.");
  }
  broadcastAll();
  return res.json({ ok: true, reservation: r.reservation });
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

    await prisma.reservation.update({
      where: { id: result.reservation.id },
      data: { smsConfirmationSentAt: new Date() }
    });
    const updated = await prisma.reservation.findUnique({
      where: { id: result.reservation.id },
      include: { table: true }
    });

    void sendSms(
      parsed.data.guestPhone,
      `✓ Table confirmed for ${parsed.data.partySize} guests on ${startAt.toLocaleString()}. ${updated?.table.name ?? "See you at the restaurant."}`
    );

    broadcastAll();
    return res.json({ ok: true, reservation: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "CONFLICT") return res.status(409).json({ ok: false, reason: "CONFLICT" });
    return res.status(500).json({ ok: false, error: msg });
  }
});

app.post("/walkin", async (req, res) => {
  const Body = z.object({
    partySize: z.coerce.number().int().min(1).max(20),
    guestName: z.string().min(1).max(80).optional().default("Walk-in"),
    guestPhone: z.string().max(30).optional().default("—"),
    durationMinutes: z.coerce.number().int().min(30).max(240).default(90),
    preferredTableId: z.string().optional(),
    markSeated: z.coerce.boolean().default(true)
  });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const startAt = new Date();
  const endAt = addMinutes(startAt, parsed.data.durationMinutes);
  const result = await createReservationOptimized({
    prisma,
    input: {
      startAt,
      endAt,
      partySize: parsed.data.partySize,
      guestName: parsed.data.guestName!,
      guestPhone: parsed.data.guestPhone!,
      source: "walkin",
      preferredTableId: parsed.data.preferredTableId
    }
  });
  if (!result.reservation) return res.status(409).json({ ok: false, reason: result.reason });

  if (parsed.data.markSeated) {
    await setTableOccupation({ prisma, tableId: result.reservation.tableId, status: "OCCUPIED" });
  }
  broadcastAll();
  const full = await prisma.reservation.findUnique({ where: { id: result.reservation.id }, include: { table: true } });
  return res.json({ ok: true, reservation: full });
});

app.get("/waitlist", async (req, res) => {
  const Q = z.object({
    from: z.string().datetime(),
    to: z.string().datetime()
  });
  const p = Q.safeParse(req.query);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });
  const entries = await prisma.waitlistEntry.findMany({
    where: { desiredAt: { gte: new Date(p.data.from), lt: new Date(p.data.to) } },
    orderBy: { desiredAt: "asc" }
  });
  res.json({ entries });
});

app.post("/waitlist", async (req, res) => {
  const Body = z.object({
    desiredAt: z.string().datetime(),
    partySize: z.coerce.number().int().min(1).max(20),
    guestName: z.string().min(1).max(80),
    guestPhone: z.string().min(5).max(30),
    notes: z.string().max(500).optional()
  });
  const p = Body.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });
  const entry = await prisma.waitlistEntry.create({
    data: {
      desiredAt: new Date(p.data.desiredAt),
      partySize: p.data.partySize,
      guestName: p.data.guestName,
      guestPhone: p.data.guestPhone,
      notes: p.data.notes
    }
  });
  void sendSms(
    p.data.guestPhone,
    `Waitlist: we'll text you if a table opens for ${p.data.partySize} on ${new Date(p.data.desiredAt).toLocaleString()}.`
  );
  broadcastAll();
  res.json({ ok: true, entry });
});

app.get("/analytics", async (req, res) => {
  const Q = z.object({ from: z.string().datetime(), to: z.string().datetime() });
  const p = Q.safeParse(req.query);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });
  const summary = await getAnalytics({ prisma, from: new Date(p.data.from), to: new Date(p.data.to) });
  res.json(summary);
});

const server = http.createServer(app);
const realtime = createRealtime(server);

function broadcastAll() {
  realtime.io.emit("availability:update", { t: new Date().toISOString() });
  realtime.io.emit("app:sync", { t: new Date().toISOString() });
}

setInterval(() => {
  void runReminderSweep({ prisma, sendSms });
}, 60_000);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${env.PORT}`);
});
