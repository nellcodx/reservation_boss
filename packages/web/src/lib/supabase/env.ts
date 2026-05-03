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
