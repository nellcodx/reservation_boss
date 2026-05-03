/**
 * Server-side Supabase clients (Node.js runtime only).
 *
 * Two flavours:
 *   * `getSupabaseAnonServerClient()` — uses the anon key. Safe by default;
 *     RLS still applies. Useful for server components and Route Handlers
 *     that talk to public RPCs (e.g. `get_available_tables`,
 *     `create_reservation`).
 *
 *   * `getSupabaseServiceRoleClient()` — uses the SERVICE_ROLE key, which
 *     bypasses RLS. NEVER expose to the browser. Use only for trusted server
 *     code: cron, admin migrations, integration-test seeding.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _anon: SupabaseClient | null = null;
let _service: SupabaseClient | null = null;

interface ServerEnv {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

function readServerEnv(): ServerEnv | null {
  const url =
    process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey, serviceRoleKey };
}

export function getSupabaseAnonServerClient(): SupabaseClient | null {
  if (_anon) return _anon;
  const env = readServerEnv();
  if (!env) return null;
  _anon = createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return _anon;
}

/**
 * Trusted server client. Returns null if the service-role key is missing so
 * callers can degrade gracefully (e.g. fall back to the anon client during
 * local dev).
 */
export function getSupabaseServiceRoleClient(): SupabaseClient | null {
  if (_service) return _service;
  const env = readServerEnv();
  if (!env || !env.serviceRoleKey) return null;
  _service = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return _service;
}

/** Service-role first, anon fallback. Use for server code that prefers RLS-bypass. */
export function getSupabaseAdminOrAnonServerClient(): SupabaseClient | null {
  return getSupabaseServiceRoleClient() ?? getSupabaseAnonServerClient();
}
