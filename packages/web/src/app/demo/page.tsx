import { Suspense } from "react";
import Link from "next/link";
import { PublicNav } from "@/components/site/PublicNav";
import { isDemoModeEnabled } from "@/lib/supabase/env";
import { DemoConsole } from "@/components/demo/DemoConsole";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  const enabled = isDemoModeEnabled();
  return (
    <div className="min-h-dvh bg-background">
      <PublicNav />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-700/90">
            DEMO CONSOLE
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Demo bookings
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-stone-600">
            All reservations currently held in the simulated backend. Use{" "}
            <span className="font-medium text-stone-800">Staff preview</span> to see a
            host-stand style list, or <span className="font-medium text-stone-800">Full console</span>{" "}
            for technical origin columns. Bookings you create on{" "}
            <Link href="/reservation" className="text-red-700 underline-offset-2 hover:underline">
              /reservation
            </Link>{" "}
            and{" "}
            <Link href="/book" className="text-red-700 underline-offset-2 hover:underline">
              /book
            </Link>{" "}
            appear here in real time, alongside the seed data shipped with the project.
          </p>
        </header>

        {enabled ? (
          <Suspense fallback={<div className="rr-card p-6 text-sm text-stone-500">Loading…</div>}>
            <DemoConsole />
          </Suspense>
        ) : (
          <DemoDisabledNotice />
        )}
      </div>
    </div>
  );
}

function DemoDisabledNotice() {
  return (
    <div className="rr-card space-y-2 p-6">
      <h2 className="text-base font-semibold text-stone-900">Demo mode is off</h2>
      <p className="text-sm text-stone-600">
        This page only renders data from the in-memory demo store, which is
        currently disabled. Either:
      </p>
      <ul className="ml-5 list-disc text-sm text-stone-600">
        <li>
          Unset <code className="rounded bg-stone-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          (the project will auto-fall-back to demo), or
        </li>
        <li>
          Set <code className="rounded bg-stone-100 px-1.5 py-0.5">NEXT_PUBLIC_DEMO_MODE=on</code>{" "}
          to force demo on top of a configured Supabase project.
        </li>
      </ul>
    </div>
  );
}
