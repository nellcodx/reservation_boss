"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  User,
  Users,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEMO_TIME_SLOTS,
  type RequestStatus,
  RESERVATION_ZONES
} from "@/components/customer/reservation-constants";

type FieldKey = "name" | "phone" | "date" | "time" | "guests" | "zone" | "comment";

const spacing = "space-y-2";

function normalizePhone(s: string) {
  return s.replace(/[\s().-]/g, "");
}

function isValidPhone(s: string) {
  const d = normalizePhone(s);
  return /^\+?[0-9]{8,15}$/.test(d);
}

/**
 * Deterministic demo outcome for UX states (not a real API).
 */
function demoRequestStatus(pick: { time: string; zone: string; guests: string }): RequestStatus {
  if (pick.time === "21:00") return "unavailable";
  if (pick.zone === "window" || pick.guests === "8") return "pending";
  return "confirmed";
}

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "idle") return null;
  const map = {
    pending: {
      label: "Pending",
      sub: "We’re checking availability",
      className: "border-amber-200/90 bg-amber-50/95 text-amber-950",
      icon: AlertCircle
    },
    confirmed: {
      label: "Confirmed",
      sub: "Your request is accepted (demo)",
      className: "border-emerald-200/90 bg-emerald-50/95 text-emerald-950",
      icon: CheckCircle2
    },
    unavailable: {
      label: "Unavailable",
      sub: "This slot is not open (demo)",
      className: "border-red-200/90 bg-red-50/95 text-red-950",
      icon: XCircle
    }
  } as const;
  const c = map[status];
  const I = c.icon;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-2xl border-2 p-2 shadow-sm",
        c.className
      )}
    >
      <I className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>
        <p className="text-sm font-semibold leading-tight">{c.label}</p>
        <p className="text-xs opacity-90">{c.sub}</p>
      </div>
    </div>
  );
}

export function CustomerReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [zone, setZone] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<RequestStatus>("idle");

  const minDate = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10);
  }, []);

  function validate() {
    const n: typeof errors = {};
    if (name.trim().length < 2) n.name = "Enter a valid name (min 2 characters).";
    if (!phone.trim()) n.phone = "Phone is required.";
    else if (!isValidPhone(phone)) n.phone = "Use 8–15 digits (optional + prefix).";
    if (!date) n.date = "Pick a date.";
    if (!time) n.time = "Pick a time.";
    if (!guests) n.guests = "How many guests?";
    if (!zone) n.zone = "Select a zone or table type.";
    setErrors(n);
    return Object.keys(n).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(false);
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setLoading(true);
    setStatus("idle");
    await new Promise((r) => setTimeout(r, 1400));
    const finalStatus = demoRequestStatus({ time, zone, guests });
    setStatus(finalStatus);
    setLoading(false);
    setSubmitted(true);
    if (finalStatus === "pending") {
      toast.message("Request received", { description: "We’ll confirm shortly (demo: Pending)." });
    } else if (finalStatus === "confirmed") {
      toast.success("Table reserved (demo: Confirmed)");
    } else {
      toast.error("No table available (demo: Unavailable)", {
        description: "Try another time or zone."
      });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <section
        className={cn(
          "animate-in fade-in-0 rounded-2xl border border-stone-200/90 bg-white p-2 shadow-sm duration-500",
          "md:p-2"
        )}
        style={{ boxShadow: "0 1px 3px rgb(0 0 0 / 0.04), 0 8px 24px rgb(0 0 0 / 0.06)" }}
      >
        <div className="p-2 md:p-2">
          <h1 className="text-xl font-semibold tracking-tight text-stone-900">Reserve a table</h1>
          <p className="mt-1 text-sm text-stone-500">
            HoReCa — minimal, mobile-first. Fields marked with * are required.
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-2" noValidate>
          <div className={spacing}>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-stone-500">
                  <User className="mb-0.5 mr-1 inline h-3.5 w-3.5" aria-hidden />
                  Full name *
                </span>
                <input
                  className={cn(
                    "w-full rounded-xl border border-stone-200 bg-white px-2 py-2 text-sm text-stone-900 outline-none transition",
                    "placeholder:text-stone-400 focus:border-red-300 focus:ring-2 focus:ring-red-200/50",
                    errors.name && "border-red-300 focus:border-red-400 focus:ring-red-200"
                  )}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Olena Shevchenko"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="pt-0.5 text-xs text-red-600">{errors.name}</p>}
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-stone-500">
                  <Phone className="mb-0.5 mr-1 inline h-3.5 w-3.5" aria-hidden />
                  Phone *
                </span>
                <input
                  className={cn(
                    "w-full rounded-xl border border-stone-200 bg-white px-2 py-2 text-sm text-stone-900 outline-none",
                    "placeholder:text-stone-400 focus:border-red-300 focus:ring-2 focus:ring-red-200/50",
                    errors.phone && "border-red-300"
                  )}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+380 67 000 00 00"
                />
                {errors.phone && <p className="pt-0.5 text-xs text-red-600">{errors.phone}</p>}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-stone-500">
                  <Calendar className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                  Date *
                </span>
                <input
                  type="date"
                  className={cn(
                    "w-full rounded-xl border border-stone-200 bg-white px-2 py-2 text-sm text-stone-900",
                    "focus:border-red-300 focus:ring-2 focus:ring-red-200/50",
                    errors.date && "border-red-300"
                  )}
                  value={date}
                  min={minDate}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && <p className="pt-0.5 text-xs text-red-600">{errors.date}</p>}
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-stone-500">
                  <Clock className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                  Time *
                </span>
                <select
                  className={cn(
                    "w-full appearance-none rounded-xl border border-stone-200 bg-white px-2 py-2 text-sm",
                    "focus:border-red-300 focus:ring-2 focus:ring-red-200/50",
                    errors.time && "border-red-300"
                  )}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">Select time</option>
                  {DEMO_TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.time && <p className="pt-0.5 text-xs text-red-600">{errors.time}</p>}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-stone-500">
                  <Users className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                  Guests *
                </span>
                <select
                  className={cn(
                    "w-full rounded-xl border border-stone-200 bg-white px-2 py-2 text-sm",
                    "focus:border-red-300 focus:ring-2 focus:ring-red-200/50",
                    errors.guests && "border-red-300"
                  )}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>
                      {n}
                    </option>
                  ))}
                </select>
                {errors.guests && <p className="pt-0.5 text-xs text-red-600">{errors.guests}</p>}
              </label>

              <label className="block sm:col-span-1">
                <span className="mb-2 block text-xs font-medium text-stone-500">
                  <MapPin className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                  Preferred zone / table type *
                </span>
                <select
                  className={cn(
                    "w-full rounded-xl border border-stone-200 bg-white px-2 py-2 text-sm",
                    "focus:border-red-300 focus:ring-2 focus:ring-red-200/50",
                    errors.zone && "border-red-300"
                  )}
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                >
                  <option value="">Choose…</option>
                  {RESERVATION_ZONES.map((z) => (
                    <option key={z.value} value={z.value}>
                      {z.label}
                    </option>
                  ))}
                </select>
                {errors.zone && <p className="pt-0.5 text-xs text-red-600">{errors.zone}</p>}
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-stone-500">
                <MessageSquare className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                Comment / special request
              </span>
              <textarea
                className={cn(
                  "w-full min-h-20 resize-y rounded-xl border border-stone-200 bg-white px-2 py-2 text-sm",
                  "placeholder:text-stone-400 focus:border-red-300 focus:ring-2 focus:ring-red-200/50 focus:outline-none"
                )}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Anniversary, high chair, allergies…"
                rows={3}
              />
            </label>
          </div>

          <div className="mt-2 border-t border-stone-100 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-2 py-2.5",
                "text-sm font-semibold text-white transition",
                "bg-red-600 shadow-sm hover:bg-red-700 active:scale-[0.99]",
                "disabled:cursor-not-allowed disabled:opacity-70"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Sending request…
                </>
              ) : (
                "Submit request"
              )}
            </button>
            <p className="mt-2 text-center text-xs text-stone-400">Demo: no data stored on a server.</p>
          </div>
        </form>
      </section>

      <aside
        className="animate-in fade-in-0 slide-in-from-bottom-2 h-fit rounded-2xl border border-stone-200/90 bg-white p-2 shadow-sm duration-500"
        style={{ boxShadow: "0 1px 3px rgb(0 0 0 / 0.04), 0 8px 24px rgb(0 0 0 / 0.05)" }}
      >
        <div className="p-2">
          <h2 className="text-sm font-semibold text-stone-900">Request summary</h2>
          <p className="text-xs text-stone-500">Updates after you submit. Status is simulated for the UI.</p>
        </div>
        <div className="space-y-2 p-2 pt-0 text-sm text-stone-600">
          <p>
            <span className="text-stone-400">Name:</span> {name || "—"}
          </p>
          <p>
            <span className="text-stone-400">Phone:</span> {phone || "—"}
          </p>
          <p>
            <span className="text-stone-400">When:</span> {date || "—"} {time && `· ${time}`}
          </p>
          <p>
            <span className="text-stone-400">Guests:</span> {guests}
          </p>
          <p>
            <span className="text-stone-400">Zone:</span>{" "}
            {RESERVATION_ZONES.find((z) => z.value === zone)?.label ?? "—"}
          </p>
          {comment.trim() ? (
            <p>
              <span className="text-stone-400">Note:</span> {comment}
            </p>
          ) : null}
        </div>
        {loading ? (
          <div className="flex items-center gap-2 p-2 pt-0 text-sm text-stone-500">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
            Sending your request…
          </div>
        ) : submitted && status !== "idle" ? (
          <div className="p-2 pt-0">
            <StatusBadge status={status} />
            <p className="mt-2 text-xs text-stone-400">
              <strong>Pending</strong> — Awaiting response · <strong>Confirmed</strong> — Table held ·{" "}
              <strong>Unavailable</strong> — No capacity (demo only).
            </p>
          </div>
        ) : (
          <p className="p-2 pt-0 text-xs text-stone-400">Submit the form to see status here and in a toast.</p>
        )}
      </aside>
    </div>
  );
}
