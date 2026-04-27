"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home" },
  { href: "/reservation", label: "Reserve a table", labelUk: "Бронювання" },
  { href: "/book", label: "Live book" },
  { href: "/admin", label: "Staff" }
] as const;

export function PublicNav() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/90 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-stone-400">HoReCa BOSS</p>
        </div>
        <nav className="flex flex-wrap items-center gap-1" aria-label="Main">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex min-h-8 items-center justify-center gap-0.5 rounded-lg px-2.5 text-sm font-medium transition",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-200",
                  item.href === "/reservation" && "font-semibold",
                  item.href === "/reservation" && !active
                    ? "text-red-700/95 hover:bg-red-50"
                    : active
                      ? "bg-stone-100 text-stone-900"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                )}
              >
                {item.label === "Reserve a table" ? (
                  <span>
                    {item.label}{" "}
                    <span className="whitespace-nowrap text-xs font-normal text-stone-500">/ {item.labelUk}</span>
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
