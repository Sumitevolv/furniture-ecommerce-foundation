import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency using the shop's locale/currency settings. */
export function formatCurrency(
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Slugify a product/category name for use in URLs. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Truncate text to a maximum length, appending an ellipsis if cut. */
export function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}

/** Await this to artificially delay — useful for skeleton/demo states. */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Type guard: filters out null/undefined from arrays with correct typing. */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
