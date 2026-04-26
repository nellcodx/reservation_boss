"use client";

import type { FloorTableState } from "@/lib/floor";

type Props = {
  floor: FloorTableState[] | null;
  loading?: boolean;
  onSelectTable?: (id: string) => void;
  selectedId?: string;
};

const legend: { v: FloorTableState["visual"]; l: string }[] = [
  { v: "free", l: "Available" },
  { v: "reserved", l: "Reserved" },
  { v: "occupied", l: "Occupied" }
];

function cellClass(visual: FloorTableState["visual"], selected: boolean, interactive: boolean) {
  const b =
    visual === "free" ? "rr-tile-free" : visual === "reserved" ? "rr-tile-reserved" : "rr-tile-occupied";
  return `flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-center text-xs font-medium transition ${b} ${
    selected ? "ring-2 ring-amber-500/90 ring-offset-1" : ""
  } ${
    interactive
      ? "cursor-pointer hover:brightness-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500/80"
      : ""
  }`;
}

export function TableMap({ floor, loading, onSelectTable, selectedId }: Props) {
  if (loading) {
    return <div className="text-sm text-stone-500">Loading floor…</div>;
  }
  if (!floor || floor.length === 0) {
    return <p className="text-sm text-stone-500">No table layout. Seed the database.</p>;
  }

  const maxX = Math.max(...floor.map((t) => t.x), 0);
  const maxY = Math.max(...floor.map((t) => t.y), 0);
  const cols = maxX + 4;
  const rows = maxY + 4;
  const interactive = Boolean(onSelectTable);

  return (
    <div className="space-y-3">
      <div
        className="rr-card relative min-h-[200px] gap-1 bg-stone-100/50 p-3"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(2.5rem, auto))`
        }}
      >
        {floor.map((t) => (
          <div
            key={t.id}
            role={onSelectTable ? "button" : undefined}
            tabIndex={onSelectTable ? 0 : undefined}
            className={cellClass(t.visual, t.id === selectedId, interactive)}
            style={{ gridColumn: t.x + 1, gridRow: t.y + 1 }}
            onClick={onSelectTable ? () => onSelectTable(t.id) : undefined}
            onKeyDown={onSelectTable ? (e) => (e.key === "Enter" ? onSelectTable(t.id) : undefined) : undefined}
          >
            <span className="text-[0.7rem] font-semibold leading-none">{t.name}</span>
            <span className="text-[0.65rem] text-stone-600">{t.capacity} seats</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-stone-600">
        {legend.map((x) => (
          <span key={x.v} className="inline-flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-sm ${x.v === "free" ? "bg-emerald-500" : x.v === "reserved" ? "bg-amber-400" : "bg-red-500"}`}
            />
            {x.l}
          </span>
        ))}
      </div>
    </div>
  );
}
