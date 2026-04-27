import Link from "next/link";
import { PublicNav } from "@/components/site/PublicNav";

export default function Home() {
  return (
    <div className="min-h-dvh bg-stone-50/30">
      <PublicNav />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.18em] text-amber-700/90">HoReCa BOSS</p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Book a table in a few steps.</h1>
        <p className="max-w-xl text-sm leading-relaxed text-stone-600">
          Built for <strong>guests</strong>: choose date, time, party size — then tap a table on the live floor map or pick from the list.
          Tables that match your booking window are highlighted; dim tiles aren&apos;t offered for your slot.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/reservation"
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
          >
            Reserve a table
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:border-stone-300"
          >
            Live calendar / floor
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-500 transition hover:border-stone-300"
          >
            For staff
          </Link>
        </div>
      </header>
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rr-card min-h-24 p-4">
          <h2 className="text-sm font-medium text-stone-900">For guests</h2>
          <p className="mt-1 text-xs text-stone-500">Day or week view, 15-minute slots, capacity-aware tables, and mock SMS in development — same flow you could ship to diners.</p>
        </div>
        <div className="rr-card min-h-24 p-4">
          <h2 className="text-sm font-medium text-stone-900">Behind the scenes</h2>
          <p className="mt-1 text-xs text-stone-500">Next.js + PostgreSQL; team dashboard, table map, waitlist, and optional realtime updates for operations.</p>
        </div>
      </section>
    </div>
    </div>
  );
}
