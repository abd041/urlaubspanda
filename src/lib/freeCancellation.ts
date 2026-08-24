import type { Locale } from "@/i18n/config";
import { localeTag } from "@/i18n/config";
import { addDays } from "@/lib/pricingEngine";

/**
 * Platform free-cancellation policy used by HotelSummarySidebar copy
 * (`booking.cancelFreeUntil` = “bis 14 Tage vor Anreise”).
 * Single source of truth for deadline calculation — do not duplicate elsewhere.
 */
export const FREE_CANCEL_DAYS_BEFORE_ARRIVAL = 14;

/** Noon local time on the last free-cancel day (matches product example “…, 12:00”). */
const FREE_CANCEL_HOUR = 12;

/**
 * Listings/offer detail: free cancellation is the base booking policy shown in
 * the hotel sidebar. Paid “Günstige Stornierung” upgrades are separate.
 */
export function hasFreeCancellation(): boolean {
  return true;
}

/** Last moment free cancellation is allowed for a stay starting on `arrival`. */
export function getFreeCancellationDeadline(arrival: Date): Date {
  const day = addDays(arrival, -FREE_CANCEL_DAYS_BEFORE_ARRIVAL);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), FREE_CANCEL_HOUR, 0, 0, 0);
}

/** e.g. "28.08.2026, 12:00" */
export function formatFreeCancellationDeadline(arrival: Date, locale: Locale): string {
  const deadline = getFreeCancellationDeadline(arrival);
  const datePart = new Intl.DateTimeFormat(localeTag(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(deadline);
  const timePart = new Intl.DateTimeFormat(localeTag(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(deadline);
  return `${datePart}, ${timePart}`;
}

/** Checkout summary line, e.g. "01.11.2026, 11:59" (used with "Bis …"). */
export function formatCheckoutCancellationDeadline(arrival: Date, locale: Locale): string {
  return formatFreeCancellationDeadline(arrival, locale);
}
