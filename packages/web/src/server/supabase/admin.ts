import { getSupabaseAdminOrAnonServerClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Resolve the demo restaurant id for server routes.
 *
 * Defaults to the well-known UUID seeded in 008_seed.sql. Override per
 * deployment via NEXT_PUBLIC_DEMO_RESTAURANT_ID.
 */
export function getDemoRestaurantId(): string {
  return (
    process.env.NEXT_PUBLIC_DEMO_RESTAURANT_ID?.trim() ||
    "00000000-0000-0000-0000-00000000d0a1"
  );
}

/**
 * Returns the Supabase server client used by API routes. Throws a 503-ish
 * error when env vars are missing so callers can return a proper HTTP error.
 */
export function getApiSupabaseClient(): SupabaseClient {
  const c = getSupabaseAdminOrAnonServerClient();
  if (!c) {
    throw new Error(
      "Supabase is not configured on the server. Set SUPABASE_URL + SUPABASE_ANON_KEY (or SERVICE_ROLE)."
    );
  }
  return c;
}
