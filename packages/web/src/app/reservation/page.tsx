import type { Metadata } from "next";
import { CustomerReservationForm } from "@/components/customer/CustomerReservationForm";
import { PublicNav } from "@/components/site/PublicNav";

export const metadata: Metadata = {
  title: "Reserve a table — HoReCa BOSS",
  description: "Book a table: name, phone, date, time, zone, and special requests (demo UI)."
};

/**
 * Lovable-style customer reservation card, adapted for Next.js App Router (not Vite/react-router).
 * Route: /reservation
 */
export default function CustomerReservationPage() {
  return (
    <div className="min-h-dvh bg-stone-50/90">
      <PublicNav />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <CustomerReservationForm />
      </main>
    </div>
  );
}
