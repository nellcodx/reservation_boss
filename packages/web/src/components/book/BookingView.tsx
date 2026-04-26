"use client";

import { addDays, format, startOfDay, startOfWeek } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { TableMap } from "@/components/TableMap";
import { apiUrl, jsonFetch, jsonFetchWithStatus } from "@/lib/api";
import { useAppSync } from "@/hooks/useAppSync";
import type { FloorTableState } from "@/lib/floor";

type DayResp = { dayStart: string; dayEnd: string; slots: SlotItem[] };
type SlotItem = {
  startAt: string;
  endAt: string;
  availableCount: number;
  totalCount: number;
  indicator: "available" | "partial" | "reserved";
};

type TableRow = { id: string; name: string; capacity: number; x: number; y: number; status: string };
type WeekDay = { dayStart: string; dayEnd: string; slots: SlotItem[] };

const DURATION = 90;
const SLOT = 15;

function inServiceHours(d: string) {
  const hour = new Date(d).getHours();
  return hour >= 10 && hour <= 23;
}

export function BookingView() {
  const [view, setView] = useState<"day" | "week">("day");
  const [day, setDay] = useState(() => startOfDay(new Date()));
  const [party, setParty] = useState(2);
  const [calendar, setCalendar] = useState<DayResp | null>(null);
  const [week, setWeek] = useState<{ days: WeekDay[]; weekStart: string } | null>(null);
  const [loadCal, setLoadCal] = useState(false);
  const [slot, setSlot] = useState<SlotItem | null>(null);
  const [tables, setTables] = useState<TableRow[] | null>(null);
  const [loadingTables, setLoadingTables] = useState(false);
  const [floor, setFloor] = useState<FloorTableState[] | null>(null);
  const [floorLoad, setFloorLoad] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; table?: string; when: string } | null>(null);
  const [waitlist, setWaitlist] = useState({ name: "", phone: "", want: "join" as "off" | "join" });

  const refreshCalendar = useCallback(async () => {
    setLoadCal(true);
    setErr(null);
    try {
      if (view === "day") {
        const q = new URLSearchParams({
          day: day.toISOString(),
          slotMinutes: String(SLOT),
          durationMinutes: String(DURATION),
          partySize: String(party)
        });
        const c = await jsonFetch<DayResp>(apiUrl(`calendar/day?${q}`));
        setCalendar(c);
        setSlot(null);
        setTables(null);
        setSelectedTable(null);
        setDone(null);
      } else {
        const q = new URLSearchParams({
          week: startOfWeek(day, { weekStartsOn: 1 }).toISOString(),
          slotMinutes: "30",
          durationMinutes: String(DURATION),
          partySize: String(party)
        });
        const w = await jsonFetch<{ weekStart: string; days: WeekDay[] }>(apiUrl(`calendar/week?${q}`));
        setWeek(w);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load calendar");
    } finally {
      setLoadCal(false);
    }
  }, [day, view, party]);

  useAppSync(refreshCalendar, 12000);

  const onPickSlot = async (s: SlotItem) => {
    setSlot(s);
    setSelectedTable(null);
    setErr(null);
    if (s.indicator === "reserved") {
      setTables([]);
      setFloor(null);
      return;
    }
    setLoadingTables(true);
    try {
      const q = new URLSearchParams({
        startAt: s.startAt,
        durationMinutes: String(DURATION),
        partySize: String(party)
      });
      const t = await jsonFetch<{ tables: TableRow[] }>(apiUrl(`availability?${q}`));
      setTables(t.tables);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load tables");
    } finally {
      setLoadingTables(false);
    }
    setFloorLoad(true);
    try {
      const fq = new URLSearchParams({
        at: s.startAt,
        windowMinutes: String(DURATION)
      });
      const f = await jsonFetch<{ floor: FloorTableState[] }>(apiUrl(`floor?${fq}`));
      setFloor(f.floor);
    } catch {
      setFloor(null);
    } finally {
      setFloorLoad(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    if (slot.indicator === "reserved" || !tables || tables.length === 0) {
      setErr("This time is not available. Choose another slot or join the waitlist.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setErr("Name and phone are required.");
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      const { res, body } = await jsonFetchWithStatus<{
        ok: boolean;
        reason?: string;
        reservation?: { id: string; table?: { name: string } };
      }>(apiUrl("reservations"), {
        method: "POST",
        body: JSON.stringify({
          startAt: slot.startAt,
          durationMinutes: DURATION,
          partySize: party,
          guestName: name.trim(),
          guestPhone: phone.trim(),
          notes: notes.trim() || undefined,
          preferredTableId: selectedTable ?? undefined
        })
      });
      if (res.ok && body.reservation) {
        setDone({
          id: body.reservation.id,
          table: body.reservation.table?.name,
          when: format(new Date(slot.startAt), "PPpp")
        });
        return;
      }
      if (res.status === 409 && body.reason === "FULLY_BOOKED" && waitlist.want === "join" && waitlist.name && waitlist.phone) {
        try {
          await jsonFetch(apiUrl("waitlist"), {
            method: "POST",
            body: JSON.stringify({
              desiredAt: slot.startAt,
              partySize: party,
              guestName: waitlist.name,
              guestPhone: waitlist.phone
            })
          });
          setErr("We added you to the waitlist. We'll text you if a table opens.");
          return;
        } catch (we) {
          setErr(we instanceof Error ? we.message : "Waitlist failed");
          return;
        }
      }
      setErr(body.reason ? `Could not book: ${body.reason}` : "This slot is no longer available. Pick another time.");
    } catch (c) {
      setErr(c instanceof Error ? c.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const daySlots = useMemo(() => {
    if (!calendar) return [];
    return calendar.slots.filter((s) => inServiceHours(s.startAt));
  }, [calendar]);

  return (
    <div className="space-y-8">
      {done && (
        <div className="rr-card max-w-md border border-emerald-200/60 bg-emerald-50/80">
          <h2 className="text-lg font-semibold text-emerald-900">You&apos;re booked</h2>
          <p className="mt-1 text-sm text-emerald-800/90">Confirmation for {done.when}</p>
          {done.table && <p className="mt-2 text-sm">Preferred table: {done.table}</p>}
          <p className="mt-3 text-xs text-emerald-800/70">A confirmation SMS is on its way (use mock Twilio in dev to see logs).</p>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reserve a table</h1>
          <p className="text-sm text-stone-500">Select date, party size, and a time. Availability updates in real time when the API is connected.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rr-card !p-0">
            <div className="inline-flex overflow-hidden rounded-xl">
              <button
                type="button"
                onClick={() => setView("day")}
                className={`px-3 py-1.5 text-sm transition ${view === "day" ? "bg-stone-900 text-white" : "bg-stone-100"}`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setView("week")}
                className={`px-3 py-1.5 text-sm transition ${view === "week" ? "bg-stone-900 text-white" : "bg-stone-100"}`}
              >
                Week
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-stone-500">Guests</span>
            <select
              className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-stone-900"
              value={party}
              onChange={(e) => setParty(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {view === "day" && (
        <div className="rr-card">
          <div className="mb-3 flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="text-stone-500">Date</span>
              <input
                type="date"
                className="ml-2 rounded-lg border border-stone-200 bg-white px-2 py-1.5"
                value={format(day, "yyyy-MM-dd")}
                onChange={(e) => setDay(startOfDay(new Date(e.target.value + "T12:00:00")))}
              />
            </label>
            {loadCal && <span className="text-xs text-stone-500">Loading…</span>}
          </div>
          <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-6">
            {daySlots.map((s) => {
              const active = slot?.startAt === s.startAt;
              return (
                <button
                  key={s.startAt}
                  type="button"
                  onClick={() => void onPickSlot(s)}
                  className={`rounded-lg px-2 py-2 text-left text-xs transition ${
                    active ? "ring-2 ring-amber-400" : "hover:opacity-90"
                  } ${
                    s.indicator === "available"
                      ? "rr-ind-available"
                      : s.indicator === "partial"
                        ? "rr-ind-partial"
                        : "rr-ind-reserved"
                  }`}
                >
                  {format(new Date(s.startAt), "p")}
                  <br />
                  <span className="text-[0.7rem] opacity-90">
                    {s.availableCount}/{s.totalCount} free
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === "week" && week && (
        <div className="rr-card max-w-full overflow-x-auto">
          <h3 className="mb-2 text-sm font-medium">Week of {format(new Date(week.weekStart), "MMM d")}</h3>
          <div className="grid min-w-[800px] grid-cols-7 gap-1">
                {week.days.map((d, i) => (
              <div key={d.dayStart} className="min-w-0 text-xs">
                <div className="mb-1 text-center font-medium text-stone-500">
                  {format(addDays(new Date(week.weekStart), i), "EEE d")}
                </div>
                <div className="max-h-48 space-y-1 overflow-y-auto">
                  {d.slots
                    .filter((s) => inServiceHours(s.startAt))
                    .filter((_, idx) => idx % 2 === 0)
                    .map((s) => (
                      <button
                        type="button"
                        key={s.startAt}
                        onClick={() => {
                          setDay(startOfDay(new Date(s.startAt)));
                          setView("day");
                        }}
                        className={`w-full rounded px-1.5 py-0.5 text-left text-[0.65rem] ${
                          s.indicator === "available"
                            ? "rr-ind-available"
                            : s.indicator === "partial"
                              ? "rr-ind-partial"
                              : "rr-ind-reserved"
                        }`}
                      >
                        {format(new Date(s.startAt), "h:mm a")}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-500">Tap a slot to switch to day view and pre-select the time.</p>
        </div>
      )}

      {slot && !done && view === "day" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rr-card">
            <h2 className="text-sm font-medium">Tables for {format(new Date(slot.startAt), "p")}</h2>
            {loadingTables ? (
              <p className="mt-2 text-sm text-stone-500">Loading availability…</p>
            ) : !tables || tables.length === 0 ? (
              <p className="mt-2 text-sm text-amber-800/90">No tables for this time. Use waitlist below.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {tables.map((t) => (
                  <li key={t.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg p-1 hover:bg-stone-50">
                      <input
                        type="radio"
                        name="tbl"
                        checked={selectedTable === t.id}
                        onChange={() => setSelectedTable(t.id)}
                      />
                      <span>
                        {t.name} · {t.capacity} seats
                      </span>
                    </label>
                  </li>
                ))}
                <li className="pt-1 text-xs text-stone-500">Leave unselected to use automatic best fit.</li>
              </ul>
            )}
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-stone-500">Name</label>
                <input
                  required
                  className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-stone-500">Phone (SMS)</label>
                <input
                  required
                  className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-stone-500">Notes (optional)</label>
                <input
                  className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              {err && <p className="text-sm text-red-600">{err}</p>}
              <div className="space-y-2 border-t border-stone-100 pt-3 text-xs text-stone-500">
                <p>Fully booked? </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    placeholder="Waitlist name"
                    className="rounded border border-stone-200 px-2 py-1"
                    value={waitlist.name}
                    onChange={(e) => setWaitlist((w) => ({ ...w, name: e.target.value }))}
                  />
                  <input
                    placeholder="Waitlist phone"
                    className="rounded border border-stone-200 px-2 py-1"
                    value={waitlist.phone}
                    onChange={(e) => setWaitlist((w) => ({ ...w, phone: e.target.value }))}
                  />
                  <label className="flex items-center gap-1 text-stone-600">
                    <input
                      type="checkbox"
                      checked={waitlist.want === "join"}
                      onChange={(e) => setWaitlist((w) => ({ ...w, want: e.target.checked ? "join" : "off" }))}
                    />
                    Auto waitlist on sold-out
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || (slot?.indicator === "reserved")}
                className="w-full rounded-xl bg-stone-900 py-2.5 text-sm font-medium text-white transition enabled:hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Confirming…" : "Confirm reservation"}
              </button>
            </form>
          </div>
          <div className="rr-card">
            <h2 className="text-sm font-medium">Floor (now / selected window)</h2>
            <TableMap floor={floor} loading={floorLoad} />
          </div>
        </div>
      )}
    </div>
  );
}
