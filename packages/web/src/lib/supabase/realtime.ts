"use client";

/**
 * Tiny helpers around Supabase Realtime.
 *
 * Two channels are commonly used by the staff dashboard:
 *   restaurant:<id>:reservations   — INSERT/UPDATE/DELETE on `reservations`
 *   restaurant:<id>:tables         — INSERT/UPDATE/DELETE on `tables`
 *
 * RLS still applies — anon clients only see updates for rows their RLS would
 * also let them SELECT.
 */

import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./client";
import type { Reservation, RestaurantTableRow } from "./types";

type Disposer = () => void;

export function subscribeToReservations(
  restaurantId: string,
  onChange: (next: { type: "INSERT" | "UPDATE" | "DELETE"; row: Reservation }) => void
): Disposer {
  const client = getSupabaseBrowserClient();
  if (!client) return () => {};

  const channel: RealtimeChannel = client
    .channel(`restaurant:${restaurantId}:reservations`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "reservations",
        filter: `restaurant_id=eq.${restaurantId}`
      },
      (payload) => {
        const row = (payload.new ?? payload.old) as Reservation;
        if (!row) return;
        onChange({
          type: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          row
        });
      }
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

export function subscribeToTableStatus(
  restaurantId: string,
  onChange: (next: {
    type: "INSERT" | "UPDATE" | "DELETE";
    row: RestaurantTableRow;
  }) => void
): Disposer {
  const client = getSupabaseBrowserClient();
  if (!client) return () => {};

  const channel: RealtimeChannel = client
    .channel(`restaurant:${restaurantId}:tables`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tables",
        filter: `restaurant_id=eq.${restaurantId}`
      },
      (payload) => {
        const row = (payload.new ?? payload.old) as RestaurantTableRow;
        if (!row) return;
        onChange({
          type: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          row
        });
      }
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
