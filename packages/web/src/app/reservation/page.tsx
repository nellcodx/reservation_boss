import type { Metadata } from "next";
import { CustomerReservationForm } from "@/components/customer/CustomerReservationForm";

export const metadata: Metadata = {
  title: "Reserve a table — HoReCa BOSS",
  description: "Book a table: name, phone, date, time, zone, and special requests (demo UI)."
};

/**
 * Lovable `CustomerReservation` + `CustomerLayout` (Next.js, no Vite / react-router).
 * Route: /reservation
 */
export default function CustomerReservationPage() {
  return <CustomerReservationForm />;
}
