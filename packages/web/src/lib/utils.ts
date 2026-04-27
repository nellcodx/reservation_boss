import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely (Lovable / shadcn-style).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
