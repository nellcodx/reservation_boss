/**
 * Browser-side Supabase client.
 *
 * Uses the anon key only. Lazy singleton: the client is created on first
 * access so we don't crash builds when env vars aren't set yet (e.g. during
 * `next build` for the static marketing page).
 */
"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "./env";

let _client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (_client) return _client;
  const env = getPublicSupabaseEnv();
  if (!env) return null;

  _client = createClient(env.url, env.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "horeca-boss-auth"
    },
    realtime: { params: { eventsPerSecond: 10 } }
  });
  return _client;
}

/**
 * Throwing variant for components that absolutely require Supabase.
 * Most call sites should prefer `getSupabaseBrowserClient()` and gracefully
 * fall back to the legacy REST API when null.
 */
export function requireSupabaseBrowserClient(): SupabaseClient {
  const c = getSupabaseBrowserClient();
  if (!c) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return c;
}
