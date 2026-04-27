import { BookingView } from "@/components/book/BookingView";
import { PublicNav } from "@/components/site/PublicNav";

export default function BookPage() {
  return (
    <div className="min-h-dvh bg-background">
      <PublicNav />
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <BookingView />
      </div>
    </div>
  );
}
