"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Home, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lovable CustomerLayout — adapted for Next.js (no react-router, no CartContext).
 * Cart badge optional; cart count fixed at 0 unless you add a cart provider later.
 */
const tabs = [
  { href: "/", icon: Home, label: "Menu" },
  { href: "/book", icon: ShoppingCart, label: "Cart" },
  { href: "/reservation", icon: CalendarDays, label: "Reserve" }
] as const;

export function CustomerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const cartCount = 0;

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur-lg">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-bold">
          HoReCa <span className="text-primary">BOSS</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/90 backdrop-blur-lg">
        <div className="flex justify-around py-2">
          {tabs.map(({ href, icon: Icon, label }) => {
            const isActive = href === "/reservation" ? pathname === "/reservation" : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {label === "Cart" && cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
