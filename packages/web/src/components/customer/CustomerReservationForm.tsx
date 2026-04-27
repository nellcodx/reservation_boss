"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { RESERVATION_ZONES } from "@/components/customer/reservation-constants";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

/**
 * Lovable `CustomerReservation.tsx` layout: card, labels, red primary button with Send.
 * Extras: zone + comment in the same card (optional fields).
 */
export function CustomerReservationForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    zone: "",
    comment: ""
  });

  const minDate = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reservation request sent! ✅");
    setForm({ name: "", phone: "", date: "", time: "", guests: "2", zone: "", comment: "" });
  };

  return (
    <CustomerLayout>
      <div className="px-4 pt-4">
        <h2 className="mb-4 font-heading text-xl font-bold">Reserve a Table</h2>
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
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Phone</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className={inputClass}
                placeholder="+380..."
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
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Preferred zone</label>
              <select
                value={form.zone}
                onChange={(e) => setForm((p) => ({ ...p, zone: e.target.value }))}
                className={inputClass}
              >
                <option value="">Any</option>
                {RESERVATION_ZONES.map((z) => (
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
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Send className="h-5 w-5" />
            Reserve
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
