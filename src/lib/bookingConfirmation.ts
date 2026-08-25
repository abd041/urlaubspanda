import type { Locale } from "@/i18n/config";
import type { ContactForm, PaymentMethod, RoomGuestForm, Salutation } from "@/components/booking/checkoutHelpers";
import type { TravelerPriceLine } from "@/lib/pricingEngine";

const STORAGE_PREFIX = "urlaubspanda:booking-confirmation:";

export interface ConfirmationRoomSnapshot {
  roomIndex: number;
  categoryName: string;
  occupancy: string;
  mainGuest: RoomGuestForm;
  mealPlanLabel: string | null;
  mealSupplement: number;
  cancellationLabel: string | null;
  cancellationSupplement: number;
  lines: TravelerPriceLine[];
  total: number;
}

export interface ConfirmationExtraSnapshot {
  id: string;
  label: string;
  amount: number;
  quantity?: number;
}

export interface BookingConfirmationSnapshot {
  version: 1;
  slug: string;
  locale: Locale;
  requestRef: string;
  createdAt: string;
  arrivalIso: string;
  nights: number;
  /** Tour operator / partner for the booked offer (drives logo on confirmation). */
  tourOperator: string;
  hotel: {
    name: string;
    image: string;
    stars: number;
    region: string;
    country: string;
    reviewEnabled: boolean;
    reviewPercent: number;
    reviewScore: number;
    reviewMaxScore: number;
    reviewCount: number;
  };
  travelers: {
    adults: number;
    children: number;
    childAges: number[];
  };
  rooms: ConfirmationRoomSnapshot[];
  extras: ConfirmationExtraSnapshot[];
  voucherCode: string | null;
  voucherDiscount: number;
  hotelPrice: number;
  totalPrice: number;
  payment: PaymentMethod;
  contact: ContactForm;
  remarks: string | null;
}

type Translate = (key: string, params?: Record<string, string | number>) => string;

export function formatGuestName(
  guest: { salutation: Salutation; firstName: string; lastName: string },
  t: Translate
): string {
  const title =
    guest.salutation === "mr"
      ? t("booking.salutationMr")
      : guest.salutation === "ms"
        ? t("booking.salutationMs")
        : "";
  return [title, guest.firstName, guest.lastName].filter(Boolean).join(" ");
}

export function formatContactAddress(contact: ContactForm, t: Translate): string {
  const countryLabel =
    contact.country === "DE"
      ? t("booking.countryDE")
      : contact.country === "AT"
        ? t("booking.countryAT")
        : contact.country === "CH"
          ? t("booking.countryCH")
          : "";
  const streetLine = [contact.street, contact.houseNumber].filter(Boolean).join(" ");
  const cityLine = [contact.zip, contact.city].filter(Boolean).join(" ");
  return [streetLine, cityLine, countryLabel].filter(Boolean).join(", ");
}

function storageKey(slug: string) {
  return `${STORAGE_PREFIX}${slug}`;
}

/** Persist the final checkout totals + guest data for the confirmation page (demo, session-scoped). */
export function saveBookingConfirmation(snapshot: BookingConfirmationSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey(snapshot.slug), JSON.stringify(snapshot));
  } catch {
    // Quota / private mode — confirmation page will redirect back to checkout.
  }
}

export function loadBookingConfirmation(slug: string): BookingConfirmationSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey(slug));
    if (!raw) return null;
    const data = JSON.parse(raw) as BookingConfirmationSnapshot & { tourOperator?: string };
    if (!data || data.version !== 1 || data.slug !== slug) return null;
    return {
      ...data,
      tourOperator: typeof data.tourOperator === "string" ? data.tourOperator : "",
    };
  } catch {
    return null;
  }
}

export function clearBookingConfirmation(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(storageKey(slug));
  } catch {
    // ignore
  }
}
