import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-700/90">Tavolo</p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Reservations, live.</h1>
        <p className="max-w-xl text-sm leading-relaxed text-stone-600">
          Book time slots, see table availability, and run service from a focused staff view. The stack is Next.js, PostgreSQL,
          and optional Express + Socket.io for push updates, with mock SMS in development.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Book a table
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:border-stone-300"
          >
            Staff
          </Link>
        </div>
      </header>
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rr-card min-h-24 p-4">
          <h2 className="text-sm font-medium text-stone-900">Guest flow</h2>
          <p className="mt-1 text-xs text-stone-500">Day or week view, 15-minute slots, capacity-aware tables, and confirmation with SMS (mocked locally).</p>
        </div>
        <div className="rr-card min-h-24 p-4">
          <h2 className="text-sm font-medium text-stone-900">Operations</h2>
          <p className="mt-1 text-xs text-stone-500">Modify bookings, mark no-shows, walk-ins, waitlist, and a simple 7-day analytics slice.</p>
        </div>
      </section>
    </div>
  );
}
