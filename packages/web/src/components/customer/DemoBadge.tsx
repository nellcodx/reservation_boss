"use client";

import { isDemoModeEnabled } from "@/lib/supabase/env";

/**
 * Tiny inline pill that lets a visitor know the booking is hitting a
 * simulated backend. Renders nothing in production-Supabase mode.
 *
 * Intentionally minimal so it slots into the existing UI without redesign.
 *
 * NEXT_PUBLIC_* env vars are inlined at build time, so server and client
 * always agree on the value — no hydration mismatch and no useEffect needed.
 */
export function DemoBadge() {
  if (!isDemoModeEnabled()) return null;

  return (
    <p
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">●</span>
      Demo mode — bookings stored in your browser
    </p>
  );
}
