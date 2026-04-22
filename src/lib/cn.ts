import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn()` — egyesíti a Tailwind osztályneveket, kezeli a feltételes és
 * egymásnak ellentmondó class-okat (pl. `px-4 px-6` → `px-6`).
 *
 * @example
 *   cn("px-4 py-2", isActive && "bg-orange-500", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
