import { AdminView } from "@/components/admin/AdminView";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-amber-800/90 hover:underline">
          ← Home
        </Link>
        <span className="text-stone-300"> | </span>
        <Link href="/book" className="text-stone-500 hover:underline">
          Book
        </Link>
      </nav>
      <AdminView />
    </div>
  );
}
