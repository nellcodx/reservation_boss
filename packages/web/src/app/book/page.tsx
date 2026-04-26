import { BookingView } from "@/components/book/BookingView";
import Link from "next/link";

export default function BookPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-amber-800/90 hover:underline">
          ← Home
        </Link>
        <span className="text-stone-300"> | </span>
        <Link href="/admin" className="text-stone-500 hover:underline">
          Staff
        </Link>
      </nav>
      <BookingView />
    </div>
  );
}
