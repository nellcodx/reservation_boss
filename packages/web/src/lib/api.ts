/**
 * When NEXT_PUBLIC_API_BASE_URL is set (e.g. http://127.0.0.1:4000), the client talks to the
 * standalone Express + Socket.io API. Otherwise, requests use same-origin /api (Next.js routes).
 */
function stripTrailing(v: string) {
  return v.replace(/\/$/, "");
}

export function apiBaseUrl(): string {
  if (typeof process === "undefined") return "";
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path.slice(1) : path;
  const b = apiBaseUrl();
  if (b) return `${stripTrailing(b)}/${p}`;
  return `/${p.startsWith("api/") ? p : `api/${p}`}`;
}

export async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: unknown; reason?: string };
    throw new Error(
      res.status + " " + (err.reason ?? (typeof err.error === "string" ? err.error : "Request failed"))
    );
  }
  return res.json() as Promise<T>;
}

export async function jsonFetchWithStatus<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const body = (await res.json().catch(() => ({}))) as T;
  return { res, body };
}
