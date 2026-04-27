export const RESERVATION_ZONES = [
  { value: "main", label: "Main Hall" },
  { value: "terrace", label: "Terrace" },
  { value: "vip", label: "VIP Room" },
  { value: "window", label: "Window Table" }
] as const;

export const DEMO_TIME_SLOTS = ["12:00", "13:30", "15:00", "18:00", "19:30", "21:00"] as const;

export type RequestStatus = "idle" | "pending" | "confirmed" | "unavailable";
