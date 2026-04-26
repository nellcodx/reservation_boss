"use client";

import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { useCallback, useState } from "react";
import { TableMap } from "@/components/TableMap";
import { apiUrl, jsonFetch, jsonFetchWithStatus } from "@/lib/api";
import { useAppSync } from "@/hooks/useAppSync";
import type { FloorTableState } from "@/lib/floor";

type RRow = {
  id: string;
  startAt: string;
  endAt: string;
  partySize: number;
  status: string;
  guestName: string;
  guestPhone: string;
  notes: string | null;
  table: { id: string; name: string; capacity: number; status: string };
};

type WaitEntry = {
  id: string;
  desiredAt: string;
  partySize: number;
  guestName: string;
  guestPhone: string;
  notes: string | null;
};

const statColors: Record<string, string> = {
  PENDING: "bg-slate-100 text-slate-800",
  CONFIRMED: "bg-emerald-100 text-emerald-900",
  CANCELLED: "bg-stone-200 text-stone-600",
  NO_SHOW: "bg-red-100 text-red-900"
};

export function AdminView() {
  const [tab, setTab] = useState<"r" | "f" | "w" | "a">("r");
  const [day, setDay] = useState(() => startOfDay(new Date()));
  const [reservations, setRes] = useState<RRow[]>([]);
  const [waitlist, setW] = useState<WaitEntry[]>([]);
  const [floor, setFloor] = useState<FloorTableState[] | null>(null);
  const [analytics, setAn] = useState<{
    totalBookings: number;
    activeBookings: number;
    peakHours: { hour: number; count: number }[];
    approximateOccupancyPct: number;
    cancelledCount: number;
  } | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [walk, setWalk] = useState({ open: false, party: 2, table: "" as string, seated: true });
  const [msg, setMsg] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setMsg(null);
    const from = startOfDay(day);
    const to = endOfDay(day);
    try {
      const q1 = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
      const { reservations: r } = await jsonFetch<{ reservations: RRow[] }>(apiUrl(`reservations?${q1}`));
      setRes(r);
    } catch {
      setRes([]);
    }
    try {
      const q2 = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
      const w = await jsonFetch<{ entries: WaitEntry[] }>(apiUrl(`waitlist?${q2}`));
      setW(w.entries);
    } catch {
      setW([]);
    }
    try {
      const fq = new URLSearchParams({ at: new Date().toISOString(), windowMinutes: "90" });
      const f = await jsonFetch<{ floor: FloorTableState[] }>(apiUrl(`floor?${fq}`));
      setFloor(f.floor);
    } catch {
      setFloor(null);
    }
    try {
      const af = from.getTime() - 7 * 24 * 3600 * 1000;
      const a = await jsonFetch<{
        totalBookings: number;
        activeBookings: number;
        peakHours: { hour: number; count: number }[];
        approximateOccupancyPct: number;
        cancelledCount: number;
      }>(apiUrl(`analytics?from=${new Date(af).toISOString()}&to=${to.toISOString()}`));
      setAn(a);
    } catch {
      setAn(null);
    }
  }, [day]);

  useAppSync(loadAll, 10000);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setMsg(null);
    const { res, body: payload } = await jsonFetchWithStatus<{ ok?: boolean }>(apiUrl(`reservations/${id}`), {
      method: "PATCH",
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      setMsg("Update failed. Check conflicts.");
      return;
    }
    if (payload.ok) void loadAll();
    setEditing(null);
  };

  const doWalkin = async () => {
    setMsg(null);
    const { res } = await jsonFetchWithStatus(
      apiUrl("walkin"),
      {
        method: "POST",
        body: JSON.stringify({
          partySize: walk.party,
          preferredTableId: walk.table || undefined,
          markSeated: walk.seated
        })
      }
    );
    if (res.ok) {
      setWalk({ open: false, party: 2, table: "", seated: true });
      void loadAll();
    } else {
      setMsg("Walk-in could not be seated. Try a different table or time.");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
        <p className="text-sm text-stone-500">Reservations, floor, waitlist, and simple analytics. Syncs via WebSocket (Express API) or short polling (Next only).</p>
      </header>

      <div className="rr-card !p-0">
        <div className="inline-flex w-full max-w-md overflow-hidden rounded-2xl">
          {(
            [
              ["r", "Reservations"],
              ["f", "Floor map"],
              ["w", "Waitlist"],
              ["a", "Analytics"]
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`flex-1 px-2 py-2.5 text-xs font-medium transition sm:px-4 sm:text-sm ${
                tab === k ? "bg-stone-900 text-white" : "bg-stone-100"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="rr-card">
        <label className="text-sm text-stone-500">Day</label>
        <input
          type="date"
          className="ml-2 rounded-lg border border-stone-200 px-2 py-1.5"
          value={format(day, "yyyy-MM-dd")}
          onChange={(e) => setDay(startOfDay(new Date(e.target.value + "T12:00:00")))}
        />
        <button
          type="button"
          className="ml-2 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm"
          onClick={() => {
            setDay((d) => subDays(d, 1));
          }}
        >
          Prev
        </button>
        <button
          type="button"
          className="ml-1 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm"
          onClick={() => {
            setDay((d) => {
              const n = new Date(d);
              n.setDate(n.getDate() + 1);
              return n;
            });
          }}
        >
          Next
        </button>
        <button
          type="button"
          className="ml-2 rounded-lg bg-amber-500/90 px-2 py-1.5 text-sm text-stone-900"
          onClick={() => setWalk((w) => ({ ...w, open: true }))}
        >
          + Walk-in
        </button>
        {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
      </div>

      {walk.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rr-card w-full max-w-sm">
            <h3 className="font-medium">Seated walk-in</h3>
            <p className="text-xs text-stone-500">Books now, optionally marks the table as occupied for the floor view.</p>
            <div className="mt-2 space-y-2 text-sm">
              <div>
                <span className="text-stone-500">Party</span>
                <input
                  className="ml-2 w-20 rounded border px-1"
                  type="number"
                  min={1}
                  value={walk.party}
                  onChange={(e) => setWalk((w) => ({ ...w, party: Number(e.target.value) }))}
                />
              </div>
              <div>
                <span className="text-stone-500">Preferred table id (optional)</span>
                <input
                  className="mt-0.5 block w-full rounded border px-1 font-mono text-xs"
                  placeholder="cuid…"
                  value={walk.table}
                  onChange={(e) => setWalk((w) => ({ ...w, table: e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={walk.seated}
                  onChange={(e) => setWalk((w) => ({ ...w, seated: e.target.checked }))}
                />
                Mark as seated (occupied)
              </label>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="flex-1 rounded-lg bg-stone-900 py-1.5 text-sm text-white"
                type="button"
                onClick={() => void doWalkin()}
              >
                Create
              </button>
              <button className="rounded-lg border border-stone-200 px-3" type="button" onClick={() => setWalk((w) => ({ ...w, open: false }))}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "f" && (
        <div className="rr-card max-w-3xl">
          <h2 className="text-sm font-medium">Current floor</h2>
          <div className="mt-2">
            <TableMap floor={floor} />
          </div>
        </div>
      )}

      {tab === "r" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs text-stone-500">
                <th className="border-b border-stone-200 p-2">Time</th>
                <th className="border-b border-stone-200 p-2">Guest</th>
                <th className="border-b border-stone-200 p-2">Phone</th>
                <th className="border-b border-stone-200 p-2">Table</th>
                <th className="border-b border-stone-200 p-2">Party</th>
                <th className="border-b border-stone-200 p-2">Status</th>
                <th className="border-b border-stone-200 p-2" />
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-stone-500">
                    No reservations for this day.
                  </td>
                </tr>
              )}
              {reservations.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="border-b border-stone-100 p-2">
                    {format(new Date(r.startAt), "p")} – {format(new Date(r.endAt), "p")}
                  </td>
                  <td className="border-b border-stone-100 p-2">
                    {editing === r.id ? (
                      <input
                        className="w-40 rounded border px-1"
                        defaultValue={r.guestName}
                        id={`g-${r.id}`}
                      />
                    ) : (
                      r.guestName
                    )}
                  </td>
                  <td className="border-b border-stone-100 p-2 text-xs text-stone-600">{r.guestPhone}</td>
                  <td className="border-b border-stone-100 p-2">{r.table.name}</td>
                  <td className="border-b border-stone-100 p-2">
                    {editing === r.id ? (
                      <input className="w-10 rounded border px-0.5" type="number" min={1} defaultValue={r.partySize} id={`p-${r.id}`} />
                    ) : (
                      r.partySize
                    )}
                  </td>
                  <td className="border-b border-stone-100 p-2">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${statColors[r.status] ?? "bg-stone-100"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="border-b border-stone-100 p-1">
                    {editing === r.id ? (
                      <div className="flex flex-wrap gap-0.5">
                        <button
                          type="button"
                          className="rounded border px-1.5 text-xs"
                          onClick={() => {
                            const g = (document.getElementById(`g-${r.id}`) as HTMLInputElement)?.value;
                            const pz = (document.getElementById(`p-${r.id}`) as HTMLInputElement)?.value;
                            void patch(r.id, { guestName: g, partySize: Number(pz) || r.partySize });
                          }}
                        >
                          Save
                        </button>
                        <button type="button" className="text-xs" onClick={() => setEditing(null)}>
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5 sm:flex-row">
                        <select
                          className="max-w-full rounded border border-stone-200 bg-white px-1 text-xs"
                          value={r.status}
                          onChange={(e) => void patch(r.id, { status: e.target.value })}
                        >
                          {["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button type="button" className="whitespace-nowrap text-xs text-amber-800 underline" onClick={() => setEditing(r.id)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "w" && (
        <div className="rr-card">
          <h2 className="text-sm font-medium">Waitlist (selected day range)</h2>
          {waitlist.length === 0 ? (
            <p className="text-sm text-stone-500">No entries</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {waitlist.map((w) => (
                <li key={w.id} className="border-b border-stone-100 pb-2 last:border-0">
                  {format(new Date(w.desiredAt), "Pp")} · {w.partySize} pax — {w.guestName} ({w.guestPhone})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "a" && analytics && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rr-card">
            <h3 className="text-sm font-medium">7-day window ending today</h3>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt>Bookings</dt>
                <dd>{analytics.totalBookings}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Active (non-cancelled)</dt>
                <dd>{analytics.activeBookings}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Cancellations</dt>
                <dd>{analytics.cancelledCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Est. density</dt>
                <dd>{analytics.approximateOccupancyPct}%</dd>
              </div>
            </dl>
          </div>
          <div className="rr-card">
            <h3 className="text-sm font-medium">Peak start hours (local)</h3>
            <ol className="mt-2 list-decimal pl-4 text-sm">
              {analytics.peakHours.length === 0 && <li className="list-none pl-0 text-stone-500">No data</li>}
              {analytics.peakHours.map((h) => (
                <li key={h.hour}>
                  {h.hour}:00 – {h.count} bookings
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
