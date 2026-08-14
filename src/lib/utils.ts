import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/i18n/config";
import { localeTag } from "@/i18n/config";

/** Merge Tailwind class names, resolving conflicts sensibly (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a number as a euro amount, e.g. 548.5 -> "548,50 €" (de) or "548.50 €" (en). */
export function formatEuro(value: number, locale: Locale = "de") {
  return `${new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} €`;
}
