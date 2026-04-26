export type FloorTableVisual = "free" | "reserved" | "occupied";

export type FloorTableState = {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
  tableStatus: "FREE" | "OCCUPIED";
  visual: FloorTableVisual;
  reservationId?: string;
};
