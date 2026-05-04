"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import {
  demoCancelReservation,
  demoListReservations,
  demoReset,
  demoSubscribeToReservations
} from "@/lib/supabase/demo-client";
import { DEMO_RESTAURANT_ID, DEMO_TABLES, DEMO_ZONES } from "@/lib/supabase/demo-data";
import type { Reservation, ReservationStatus } from "@/lib/supabase/types";

/* -------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

interface ServerListRow {
  id: string;
  starts_at: string;
  ends_at: string;
  party_size: number;
  guest_name: string;
  guest_phone: string | null;
  guest_email: string | null;
  zone_id: string | null;
  zone_slug: string | null;
  zone_name: string | null;
  table_id: string | null;
  table_code: string | null;
  table_label: string | null;
  status: ReservationStatus;
  source: string;
  notes: string | null;
  created_at: string;
}

interface MergedRow extends ServerListRow {
  origin: "server" | "browser" | "seed";
}

type ZoneFilter = "all" | string;
type StatusFilter = "all" | ReservationStatus;
type DemoViewTab = "staff" | "console";

/* -------------------------------------------------------------------------
 * Lookups (zones/tables are static demo seed data)
 * ------------------------------------------------------------------------- */

const ZONE_BY_ID = new Map(DEMO_ZONES.map((z) => [z.id, z]));
const TABLE_BY_ID = new Map(DEMO_TABLES.map((t) => [t.id, t]));
const SEED_IDS = new Set(["seed-1", "seed-2", "seed-3", "seed-4"]);

function browserToServerRow(r: Reservation): ServerListRow {
  const t = r.table_id ? TABLE_BY_ID.get(r.table_id) : null;
  const z = t?.zone_id ? ZONE_BY_ID.get(t.zone_id) : null;
  return {
    id: r.id,
    starts_at: r.starts_at,
    ends_at: r.ends_at,
    party_size: r.party_size,
    guest_name: r.guest_name,
    guest_phone: r.guest_phone,
    guest_email: r.guest_email,
    zone_id: t?.zone_id ?? null,
    zone_slug: z?.slug ?? null,
    zone_name: z?.name ?? null,
    table_id: r.table_id,
    table_code: t?.code ?? null,
    table_label: t?.label ?? null,
    status: r.status,
    source: r.source,
    notes: r.notes,
    created_at: r.created_at
  };
}

/* -------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------- */

export function DemoConsole() {
  const [viewTab, setViewTab] = useState<DemoViewTab>("staff");
  const [serverRows, setServerRows] = useState<ServerListRow[] | null>(null);
  const [browserRows, setBrowserRows] = useState<Reservation[]>([]);
  const [recentlyChanged, setRecentlyChanged] = useState<Set<string>>(new Set());
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showPast, setShowPast] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // A "now" snapshot we refresh every 30s so relative timestamps stay reasonable
  // without re-rendering the whole table on every keystroke.
  const [now, setNow] = useState<number>(0);
  useEffect(() => {
    // Both updates run inside timers (callbacks) — never synchronously in the
    // effect body — to keep React's compiler-mode lint happy.
    const t = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  /* ---------- server fetch ---------- */

  const fetchServer = useCallback(async () => {
    try {
      const res = await fetch("/api/demo/reservations", { cache: "no-store" });
      if (!res.ok) return;
      const data: { ok: boolean; reservations: ServerListRow[] } = await res.json();
      if (data.ok) setServerRows(data.reservations);
    } catch {
      /* silent — page still works on browser data alone */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      if (!cancelled) await fetchServer();
    };
    tick();
    const id = setInterval(tick, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [fetchServer]);

  /* ---------- browser store + realtime ---------- */

  const flashRow = useCallback((id: string) => {
    setRecentlyChanged((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      setRecentlyChanged((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1600);
  }, []);

  useEffect(() => {
    // Initial snapshot scheduled in a microtask so the setState happens in a
    // callback (satisfying the no-setState-in-effect-body lint), then keep in
    // sync via the demo store's subscription.
    const t = setTimeout(() => setBrowserRows(demoListReservations()), 0);
    const off = demoSubscribeToReservations(DEMO_RESTAURANT_ID, ({ type, row }) => {
      setBrowserRows(demoListReservations());
      if (type === "INSERT" || type === "UPDATE") {
        flashRow(row.id);
      }
    });
    return () => {
      clearTimeout(t);
      off();
    };
  }, [flashRow]);

  /* ---------- merge ---------- */

  const merged = useMemo<MergedRow[]>(() => {
    const map = new Map<string, MergedRow>();

    if (serverRows) {
      for (const r of serverRows) {
        map.set(r.id, {
          ...r,
          origin: SEED_IDS.has(r.id) ? "seed" : "server"
        });
      }
    }

    for (const r of browserRows) {
      const flat = browserToServerRow(r);
      const existing = map.get(r.id);
      if (existing) {
        // Browser may have a fresher status (cancellations done locally).
        // Prefer cancelled over pending/confirmed.
        if (existing.status !== flat.status && flat.status === "cancelled") {
          map.set(r.id, { ...flat, origin: existing.origin });
        }
      } else {
        map.set(r.id, {
          ...flat,
          origin: SEED_IDS.has(r.id) ? "seed" : "browser"
        });
      }
    }

    let rows = Array.from(map.values()).sort(
      (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
    );

    if (!showPast && now > 0) {
      rows = rows.filter((r) => new Date(r.ends_at).getTime() >= now);
    }
    if (zoneFilter !== "all") {
      rows = rows.filter((r) => r.zone_slug === zoneFilter);
    }
    if (statusFilter !== "all") {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    return rows;
  }, [serverRows, browserRows, zoneFilter, statusFilter, showPast, now]);

  /* ---------- counts ---------- */

  const counts = useMemo(() => {
    const all = (serverRows ?? []).slice();
    const ids = new Set(all.map((r) => r.id));
    for (const r of browserRows) {
      if (!ids.has(r.id)) all.push(browserToServerRow(r));
    }
    const c: Record<ReservationStatus | "total", number> = {
      total: all.length,
      pending: 0,
      confirmed: 0,
      seated: 0,
      completed: 0,
      cancelled: 0,
      no_show: 0
    };
    for (const r of all) c[r.status] += 1;
    return c;
  }, [serverRows, browserRows]);

  /* ---------- actions ---------- */

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchServer();
    setBrowserRows(demoListReservations());
    setTimeout(() => setRefreshing(false), 300);
  }, [fetchServer]);

  const onReset = useCallback(async () => {
    const confirmed = window.confirm(
      "Reset the demo store? This clears every booking on this device and on the server demo store, then reseeds the original demo data."
    );
    if (!confirmed) return;
    try {
      await fetch("/api/demo/reset", { method: "POST" });
    } catch {
      /* ignore network errors — local reset still happens */
    }
    demoReset();
    await fetchServer();
    toast.success("Demo store reset");
  }, [fetchServer]);

  const onCancel = useCallback(
    async (id: string) => {
      const [serverRes] = await Promise.all([
        fetch("/api/demo/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        }).catch(() => null),
        demoCancelReservation(id).catch(() => ({ ok: false }))
      ]);

      const serverOk = serverRes?.ok === true;
      await fetchServer();

      if (serverOk) {
        toast.success("Reservation cancelled");
      } else {
        toast.success("Reservation cancelled (local)");
      }
    },
    [fetchServer]
  );

  /* ---------- render ---------- */

  return (
    <div className="space-y-5">
      <DemoViewTabs tab={viewTab} onTabChange={setViewTab} />

      <StatsBar counts={counts} />

      <div className="rr-card flex flex-wrap items-center justify-between gap-3 p-3">
        <Filters
          zoneFilter={zoneFilter}
          setZoneFilter={setZoneFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showPast={showPast}
          setShowPast={setShowPast}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Reset demo data
          </button>
        </div>
      </div>

      {merged.length === 0 ? (
        <EmptyState />
      ) : viewTab === "staff" ? (
        <StaffReservationTable
          rows={merged}
          recentlyChanged={recentlyChanged}
          onCancel={onCancel}
          now={now}
        />
      ) : (
        <ReservationTable
          rows={merged}
          recentlyChanged={recentlyChanged}
          onCancel={onCancel}
          now={now}
        />
      )}
    </div>
  );
}

function DemoViewTabs({
  tab,
  onTabChange
}: {
  tab: DemoViewTab;
  onTabChange: (t: DemoViewTab) => void;
}) {
  return (
    <div className="space-y-2">
      <div
        className="flex flex-wrap gap-2 rounded-xl border border-stone-200 bg-stone-50/80 p-1"
        role="tablist"
        aria-label="Demo view"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "staff"}
          onClick={() => onTabChange("staff")}
          className={
            tab === "staff"
              ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm ring-1 ring-stone-200"
              : "rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-white/70"
          }
        >
          Staff preview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "console"}
          onClick={() => onTabChange("console")}
          className={
            tab === "console"
              ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm ring-1 ring-stone-200"
              : "rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-white/70"
          }
        >
          Full console
        </button>
      </div>
      {tab === "staff" ? (
        <p className="text-xs leading-relaxed text-stone-500">
          Same live demo bookings as below, in a layout closer to what front-of-house sees: time,
          guest, party, table, status, and channel (online vs sample). Use{" "}
          <span className="font-medium text-stone-700">Full console</span> for seed / server /
          browser origin details.
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-stone-500">
          Technical view: includes <span className="font-medium text-stone-700">Origin</span>{" "}
          (seed, server, browser) for debugging the demo store.
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Subviews
 * ------------------------------------------------------------------------- */

function StatsBar({
  counts
}: {
  counts: Record<ReservationStatus | "total", number>;
}) {
  const items: Array<{ k: string; label: string; value: number; tone: string }> = [
    { k: "total", label: "Total", value: counts.total, tone: "text-stone-900" },
    { k: "confirmed", label: "Confirmed", value: counts.confirmed, tone: "text-emerald-700" },
    { k: "pending", label: "Pending", value: counts.pending, tone: "text-amber-700" },
    { k: "seated", label: "Seated", value: counts.seated, tone: "text-blue-700" },
    { k: "completed", label: "Completed", value: counts.completed, tone: "text-stone-500" },
    { k: "cancelled", label: "Cancelled", value: counts.cancelled, tone: "text-stone-400" }
  ];
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {items.map((it) => (
        <div key={it.k} className="rr-card px-3 py-2">
          <div className="text-[11px] uppercase tracking-wide text-stone-400">{it.label}</div>
          <div className={`mt-0.5 text-xl font-semibold ${it.tone}`}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function Filters({
  zoneFilter,
  setZoneFilter,
  statusFilter,
  setStatusFilter,
  showPast,
  setShowPast
}: {
  zoneFilter: ZoneFilter;
  setZoneFilter: (v: ZoneFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;
  showPast: boolean;
  setShowPast: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
          Zone
        </span>
        <Chip active={zoneFilter === "all"} onClick={() => setZoneFilter("all")}>
          All
        </Chip>
        {DEMO_ZONES.map((z) => (
          <Chip
            key={z.id}
            active={zoneFilter === z.slug}
            onClick={() => setZoneFilter(z.slug)}
          >
            {z.name}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
          Status
        </span>
        {(["all", "confirmed", "pending", "seated", "cancelled"] as StatusFilter[]).map(
          (s) => (
            <Chip
              key={s}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s}
            </Chip>
          )
        )}
      </div>
      <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 text-xs text-stone-600">
        <input
          type="checkbox"
          checked={showPast}
          onChange={(e) => setShowPast(e.target.checked)}
          className="h-3.5 w-3.5 cursor-pointer rounded border-stone-300"
        />
        Show past
      </label>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-stone-900 px-2.5 py-1 text-xs font-medium text-white"
          : "rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-600 hover:border-stone-300"
      }
    >
      {children}
    </button>
  );
}

function staffChannelLabel(r: MergedRow): { primary: string; secondary?: string } {
  if (r.origin === "seed") {
    return { primary: "Sample", secondary: "Demo seed row" };
  }
  const s = (r.source || "").toLowerCase();
  if (s === "online" || s === "web" || s === "") {
    return {
      primary: "Online",
      secondary:
        r.origin === "server" ? "Synced demo (guest flow)" : "This browser (guest flow)"
    };
  }
  if (s === "walk_in" || s === "walk-in" || s === "walkin") return { primary: "Walk-in" };
  if (s === "phone") return { primary: "Phone" };
  if (s === "staff") return { primary: "Staff / POS" };
  return { primary: r.source || "Other" };
}

function StaffChannelCell({ row }: { row: MergedRow }) {
  const { primary, secondary } = staffChannelLabel(row);
  return (
    <div>
      <div className="font-medium text-stone-800">{primary}</div>
      {secondary ? <div className="text-[11px] text-stone-500">{secondary}</div> : null}
    </div>
  );
}

function StaffReservationTable({
  rows,
  recentlyChanged,
  onCancel,
  now
}: {
  rows: MergedRow[];
  recentlyChanged: Set<string>;
  onCancel: (id: string) => void;
  now: number;
}) {
  return (
    <div className="rr-card overflow-hidden ring-1 ring-stone-200/80">
      <div className="border-b border-stone-100 bg-stone-900 px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-300">
          Staff — today&apos;s bookings
        </p>
        <p className="text-xs text-stone-400">
          Read-only preview — same data as the guest demo flows
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-[11px] uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Guest</th>
              <th className="px-3 py-2 font-medium">Party</th>
              <th className="px-3 py-2 font-medium">Table</th>
              <th className="px-3 py-2 font-medium">Zone</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Channel</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((r) => (
              <tr
                key={r.id}
                className={
                  recentlyChanged.has(r.id)
                    ? "bg-amber-50/90 transition-colors"
                    : "transition-colors"
                }
              >
                <td className="px-3 py-2 align-top">
                  <WhenCell startsAt={r.starts_at} endsAt={r.ends_at} now={now} />
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="font-medium text-stone-900">{r.guest_name}</div>
                  {r.guest_phone ? (
                    <div className="text-xs text-stone-500">{r.guest_phone}</div>
                  ) : null}
                  {r.guest_email ? (
                    <div className="text-xs text-stone-500">{r.guest_email}</div>
                  ) : null}
                  {r.notes ? (
                    <div className="mt-0.5 text-xs italic text-stone-500">
                      &ldquo;{r.notes}&rdquo;
                    </div>
                  ) : null}
                </td>
                <td className="px-3 py-2 align-top text-stone-700">{r.party_size}</td>
                <td className="px-3 py-2 align-top text-stone-700">
                  {r.table_label || r.table_code || "—"}
                </td>
                <td className="px-3 py-2 align-top text-stone-700">{r.zone_name || "—"}</td>
                <td className="px-3 py-2 align-top">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3 py-2 align-top">
                  <StaffChannelCell row={r} />
                </td>
                <td className="px-3 py-2 text-right align-top">
                  {r.status === "pending" ||
                  r.status === "confirmed" ||
                  r.status === "seated" ? (
                    <button
                      type="button"
                      onClick={() => onCancel(r.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2 py-1 text-xs font-medium text-stone-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </button>
                  ) : r.status === "cancelled" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-stone-400">
                      <CheckCircle2 className="h-3 w-3" />
                      done
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReservationTable({
  rows,
  recentlyChanged,
  onCancel,
  now
}: {
  rows: MergedRow[];
  recentlyChanged: Set<string>;
  onCancel: (id: string) => void;
  now: number;
}) {
  return (
    <div className="rr-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-[11px] uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Guest</th>
              <th className="px-3 py-2 font-medium">Party</th>
              <th className="px-3 py-2 font-medium">Table</th>
              <th className="px-3 py-2 font-medium">Zone</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Origin</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((r) => (
              <tr
                key={r.id}
                className={
                  recentlyChanged.has(r.id)
                    ? "bg-amber-50 transition-colors"
                    : "transition-colors"
                }
              >
                <td className="px-3 py-2 align-top">
                  <WhenCell startsAt={r.starts_at} endsAt={r.ends_at} now={now} />
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="font-medium text-stone-900">{r.guest_name}</div>
                  {r.guest_phone && (
                    <div className="text-xs text-stone-500">{r.guest_phone}</div>
                  )}
                  {r.guest_email && (
                    <div className="text-xs text-stone-500">{r.guest_email}</div>
                  )}
                  {r.notes && (
                    <div className="mt-0.5 text-xs italic text-stone-500">
                      &ldquo;{r.notes}&rdquo;
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 align-top text-stone-700">
                  {r.party_size}
                </td>
                <td className="px-3 py-2 align-top text-stone-700">
                  {r.table_label || r.table_code || "—"}
                </td>
                <td className="px-3 py-2 align-top text-stone-700">
                  {r.zone_name || "—"}
                </td>
                <td className="px-3 py-2 align-top">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3 py-2 align-top">
                  <OriginBadge origin={r.origin} source={r.source} />
                </td>
                <td className="px-3 py-2 text-right align-top">
                  {r.status === "pending" ||
                  r.status === "confirmed" ||
                  r.status === "seated" ? (
                    <button
                      type="button"
                      onClick={() => onCancel(r.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2 py-1 text-xs font-medium text-stone-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </button>
                  ) : r.status === "cancelled" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-stone-400">
                      <CheckCircle2 className="h-3 w-3" />
                      done
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WhenCell({
  startsAt,
  endsAt,
  now
}: {
  startsAt: string;
  endsAt: string;
  now: number;
}) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const sameDay = start.toDateString() === end.toDateString();
  const dateLabel = start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  const startTime = start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
  const endTime = end.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
  return (
    <div>
      <div className="text-xs text-stone-500">{dateLabel}</div>
      <div className="font-medium text-stone-900">
        {startTime} – {sameDay ? endTime : "+1d"}
      </div>
      <Relative startsAt={startsAt} now={now} />
    </div>
  );
}

function Relative({ startsAt, now }: { startsAt: string; now: number }) {
  if (now <= 0) return null;
  const t = new Date(startsAt).getTime();
  const diffMs = t - now;
  const absMin = Math.round(Math.abs(diffMs) / 60_000);
  let label: string;
  if (absMin < 60) label = `${absMin}m`;
  else if (absMin < 60 * 24) label = `${Math.round(absMin / 60)}h`;
  else label = `${Math.round(absMin / (60 * 24))}d`;
  const future = diffMs > 0;
  return (
    <div className="text-[11px] text-stone-400">
      {future ? `in ${label}` : `${label} ago`}
    </div>
  );
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const map: Record<ReservationStatus, string> = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    seated: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-stone-100 text-stone-600 border-stone-200",
    cancelled: "bg-stone-50 text-stone-400 border-stone-200 line-through",
    no_show: "bg-rose-50 text-rose-700 border-rose-200"
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

function OriginBadge({
  origin,
  source
}: {
  origin: MergedRow["origin"];
  source: string;
}) {
  const map = {
    seed: "Seed",
    server: "Server (/book)",
    browser: "Browser (/reservation)"
  } as const;
  const tone = {
    seed: "text-stone-500",
    server: "text-blue-700",
    browser: "text-purple-700"
  } as const;
  return (
    <div className="text-[11px]">
      <div className={tone[origin]}>{map[origin]}</div>
      <div className="text-stone-400">{source}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rr-card flex flex-col items-center gap-2 p-10 text-center">
      <p className="text-base font-medium text-stone-900">No reservations yet.</p>
      <p className="max-w-md text-sm text-stone-500">
        Head to{" "}
        <a href="/reservation" className="text-red-700 underline-offset-2 hover:underline">
          /reservation
        </a>{" "}
        or{" "}
        <a href="/book" className="text-red-700 underline-offset-2 hover:underline">
          /book
        </a>{" "}
        and create one. It will appear here within a few seconds.
      </p>
    </div>
  );
}
