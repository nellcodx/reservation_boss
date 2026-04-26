"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { apiBaseUrl } from "@/lib/api";

/**
 * Fires on Socket.io "app:sync" / "availability:update" with the Express API, or on a poll interval to Next /api.
 */
export function useAppSync(onSync: () => void, pollMs: number = 8000) {
  const onSyncRef = useRef(onSync);
  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  useEffect(() => {
    const invoke = () => {
      onSyncRef.current();
    };
    const base = apiBaseUrl();
    if (!base) {
      invoke();
      const t = window.setInterval(invoke, pollMs);
      return () => window.clearInterval(t);
    }

    invoke();
    let s: Socket | null = null;
    let handler: (() => void) | null = null;
    try {
      s = io(base, { transports: ["websocket", "polling"], reconnection: true, reconnectionDelay: 2000 });
      const h = () => invoke();
      handler = h;
      s.on("app:sync", h);
      s.on("availability:update", h);
    } catch {
      const t = window.setInterval(invoke, pollMs);
      return () => window.clearInterval(t);
    }
    return () => {
      if (s && handler) {
        s.off("app:sync", handler);
        s.off("availability:update", handler);
      }
      s?.close();
    };
  }, [pollMs]);
}
