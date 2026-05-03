"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { DemoBadge } from "@/components/customer/DemoBadge";
import { RESERVATION_ZONES } from "@/components/customer/reservation-constants";
import {
  createReservation,
  fetchActiveZones,
  reservationErrorMessage
} from "@/lib/supabase/api";
import { getPublicSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import type { Zone } from "@/lib/supabase/types";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

/**
 * Lovable `CustomerReservation.tsx` layout: card, labels, red primary button with Send.
 * Extras: zone + comment in the same card (optional fields).
 *
 * Backend wiring:
 *   - Real zones come from Supabase (`v_public_zones`); we fall back to the
 *     hardcoded RESERVATION_ZONES if Supabase isn't configured (e.g. on the
 *     static GitHub Pages preview).
 *   - Submit goes through the `create_reservation` RPC with full server-side
 *     validation (opening hours, capacity, double-booking).
 *   - Phone is OPTIONAL by design — no phone-based flows in this product.
 */
export function CustomerReservationForm() {
  const env = getPublicSupabaseEnv();
  const supaReady = isSupabaseConfigured();

  type ZoneOption = { value: string; label: string; id?: string };
  const fallbackOptions: ZoneOption[] = useMemo(
    () => RESERVATION_ZONES.map((z) => ({ value: z.value, label: z.label })),
    []
  );

  const [zones, setZones] = useState<ZoneOption[]>(fallbackOptions);
  const [zonesLoading, setZonesLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    zone: "",
    comment: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const minDate = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    if (!env) return;
    let cancelled = false;
    const load = async () => {
      setZonesLoading(true);
      try {
        const rows: Zone[] = await fetchActiveZones(env.demoRestaurantId);
        if (cancelled) return;
        if (rows.length > 0) {
          setZones(rows.map((z) => ({ value: z.slug, label: z.name, id: z.id })));
        }
      } catch {
        // Silent fall-through: keep hardcoded RESERVATION_ZONES.
      } finally {
        if (!cancelled) setZonesLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [env]);

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: "2",
      zone: "",
      comment: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const partySize = Number(form.guests);
    if (!Number.isFinite(partySize) || partySize < 1) {
      setErrorMsg("Please enter a valid number of guests.");
      return;
    }
    if (!form.name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!form.date || !form.time) {
      setErrorMsg("Please pick a date and time.");
      return;
    }

    if (!supaReady || !env) {
      // Static demo fallback — preserves the original UX.
      toast.success("Reservation request sent! ✅");
      resetForm();
      return;
    }

    const startsAt = new Date(`${form.date}T${form.time}:00`);
    if (Number.isNaN(startsAt.getTime())) {
      setErrorMsg("Invalid date/time.");
      return;
    }

    setSubmitting(true);
    try {
      const zoneOpt = zones.find((z) => z.value === form.zone);
      const result = await createReservation({
        restaurantId: env.demoRestaurantId,
        startsAt: startsAt.toISOString(),
        partySize,
        guestName: form.name.trim(),
        guestPhone: form.phone.trim() || null,
        guestEmail: form.email.trim() || null,
        zoneId: zoneOpt?.id ?? null,
        notes: form.comment.trim() || null,
        source: "online"
      });

      if (result.ok) {
        toast.success("Reservation confirmed! ✅");
        resetForm();
      } else {
        const msg = reservationErrorMessage(result.reason);
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Reservation failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="px-4 pt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-bold">Reserve a Table</h2>
          <DemoBadge />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Phone <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className={inputClass}
                placeholder="+380..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Email <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Date</label>
                <input
                  required
                  type="date"
                  min={minDate}
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Time</label>
                <input
                  required
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Number of Guests</label>
              <input
                required
                type="number"
                min="1"
                max="20"
                value={form.guests}
                onChange={(e) => setForm((p) => ({ ...p, guests: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Preferred zone
                {zonesLoading && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">loading…</span>
                )}
              </label>
              <select
                value={form.zone}
                onChange={(e) => setForm((p) => ({ ...p, zone: e.target.value }))}
                className={inputClass}
              >
                <option value="">Any</option>
                {zones.map((z) => (
                  <option key={z.value} value={z.value}>
                    {z.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Comment / special request</label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                className={`${inputClass} min-h-20 resize-y`}
                rows={3}
                placeholder="Optional"
              />
            </div>
            {errorMsg && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
              >
                {errorMsg}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-5 w-5" />
            {submitting ? "Reserving…" : "Reserve"}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
