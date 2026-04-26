export default function Home() {
  return (
    <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Reservation system (Vercel-only)</h1>
          <p className="text-sm text-zinc-600">
            Backend runs as Next.js API routes. Realtime is replaced by client refetch/polling.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-sm font-medium text-zinc-900">Quick checks</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <a className="underline" href="/api/health">
              /api/health
            </a>
            <a className="underline" href="/api/tables">
              /api/tables
            </a>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            To fully enable these endpoints, set <code className="rounded bg-zinc-100 px-1">DATABASE_URL</code>{" "}
            in Vercel and run Prisma migrations against your hosted Postgres.
          </p>
        </section>
      </main>
    </div>
  );
}
