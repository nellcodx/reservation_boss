/**
 * Centralized access to Supabase environment variables.
 *
 * Browser code should ONLY ever read NEXT_PUBLIC_* variables. The service-role
 * key must never be bundled — it is only read from the Node runtime via
 * `getServiceRoleEnv()` in `src/lib/supabase/server.ts`.
 */

export interface PublicSupabaseEnv {
  /** e.g. https://xyzcompany.supabase.co */
  url: string;
  /** Anon (publishable) key */
  anonKey: string;
  /** Stable demo restaurant id used to scope RPCs from the public marketing UI. */
  demoRestaurantId: string;
}

/** Reads NEXT_PUBLIC_* vars. Safe in client components. */
export function getPublicSupabaseEnv(): PublicSupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const demoRestaurantId =
    process.env.NEXT_PUBLIC_DEMO_RESTAURANT_ID?.trim() ||
    "00000000-0000-0000-0000-00000000d0a1"; // matches 008_seed.sql

  if (!url || !anonKey) return null;
  return { url, anonKey, demoRestaurantId };
}

/** True when both NEXT_PUBLIC_* vars are present. */
export function isSupabaseConfigured(): boolean {
  return getPublicSupabaseEnv() !== null;
}

/**
 * Demo mode runs the booking flow against an in-memory + localStorage store
 * that mirrors the SQL contracts. Useful for previewing the system without
 * spinning up a real Supabase project.
 *
 *   * Auto-on when Supabase isn't configured (zero-setup demo).
 *   * Force on with NEXT_PUBLIC_DEMO_MODE=on (use even with Supabase env set).
 *   * Force off with NEXT_PUBLIC_DEMO_MODE=off (always require real backend).
 */
export function isDemoModeEnabled(): boolean {
  const flag = (process.env.NEXT_PUBLIC_DEMO_MODE ?? "").trim().toLowerCase();
  if (flag === "on" || flag === "true" || flag === "1") return true;
  if (flag === "off" || flag === "false" || flag === "0") return false;
  return !isSupabaseConfigured();
}
