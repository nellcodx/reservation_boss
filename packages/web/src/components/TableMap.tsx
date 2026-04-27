"use client";

import type { FloorTableState } from "@/lib/floor";

type Props = {
  floor: FloorTableState[] | null;
  loading?: boolean;
  onSelectTable?: (id: string) => void;
  selectedId?: string;
  /**
   * Guest booking: only IDs returned by availability can be tapped.
   * Omit for staff views — every tile stays clickable when `onSelectTable` is set.
   */
  selectableIds?: ReadonlySet<string>;
};

const legend: { v: FloorTableState["visual"]; l: string }[] = [
  { v: "free", l: "Available" },
  { v: "reserved", l: "Reserved" },
  { v: "occupied", l: "Occupied" }
];

function cellClass(
  visual: FloorTableState["visual"],
  selected: boolean,
  clickable: boolean,
  muted: boolean
) {
  const b =
    visual === "free" ? "rr-tile-free" : visual === "reserved" ? "rr-tile-reserved" : "rr-tile-occupied";
  return `flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-center text-xs font-medium transition ${b} ${
    selected ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-stone-100" : ""
  } ${muted ? "opacity-[0.42] saturate-[0.65]" : ""} ${
    clickable
      ? "cursor-pointer hover:brightness-[0.97] hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500/90"
      : ""
  }`;
}

export function TableMap({ floor, loading, onSelectTable, selectedId, selectableIds }: Props) {
  if (loading) {
    return <div className="text-sm text-stone-500">Loading floor…</div>;
  }
  if (!floor || floor.length === 0) {
    return <p className="text-sm text-stone-500">No table layout. Seed the database.</p>;
  }

  const restrictSelection = selectableIds !== undefined;

  const maxX = Math.max(...floor.map((t) => t.x), 0);
  const maxY = Math.max(...floor.map((t) => t.y), 0);
  const cols = maxX + 4;
  const rows = maxY + 4;

  return (
    <div className="space-y-3">
      <div
        className="rr-card relative min-h-[220px] gap-1 bg-gradient-to-b from-stone-50 to-amber-50/30 p-4"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(2.5rem, auto))`
        }}
      >
        {floor.map((t) => {
          const allowed = !restrictSelection || selectableIds!.has(t.id);
          const clickable = Boolean(onSelectTable) && allowed;
          const muted = restrictSelection && !allowed;
          return (
            <div
              key={t.id}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              title={
                muted && restrictSelection
                  ? "Not available for your party at this date and time"
                  : `${t.name}, ${t.capacity} seats — tap to choose`
              }
              className={`${cellClass(t.visual, t.id === selectedId, clickable, muted)} ${muted ? "pointer-events-none" : ""}`}
              style={{ gridColumn: t.x + 1, gridRow: t.y + 1 }}
              onClick={clickable ? () => onSelectTable!(t.id) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectTable!(t.id);
                      }
                    }
                  : undefined
              }
            >
              <span className="text-[0.72rem] font-semibold leading-none">{t.name}</span>
              <span className="text-[0.65rem] text-stone-700">{t.capacity} seats</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-stone-600">
        {legend.map((x) => (
          <span key={x.v} className="inline-flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-sm ${x.v === "free" ? "bg-emerald-500" : x.v === "reserved" ? "bg-amber-400" : "bg-red-500"}`}
            />
            {x.l}
          </span>
        ))}
        {restrictSelection && (
          <span className="inline-flex items-center gap-1.5 text-stone-500">
            <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-stone-400 bg-stone-200/80" />
            Dimmed — not for your booking
          </span>
        )}
      </div>
    </div>
  );
}
