import type { RoomSelection } from "@/hooks/useBookingState";
import type { Locale } from "@/i18n/config";

export type CheckoutCountry = "" | "DE" | "AT" | "CH";
export type Salutation = "" | "mr" | "ms";
export type PaymentMethod = "invoice" | "card";

export const PHONE_PREFIX: Record<Exclude<CheckoutCountry, "">, string> = {
  DE: "+49",
  AT: "+43",
  CH: "+41",
};

export const COUNTRY_FLAGS: Record<Exclude<CheckoutCountry, "">, string> = {
  DE: "🇩🇪",
  AT: "🇦🇹",
  CH: "🇨🇭",
};

/** Demo local tourist tax shown in checkout travel summary (pay on site, not in total). */
export const CHECKOUT_TOURIST_TAX_PER_ROOM = 43.2;

/**
 * Checkout feature flags — keep optional sections off until the product phase is ready.
 * Flip `travelProtection` to true later and implement options in TravelProtectionSection.
 */
export const CHECKOUT_FEATURES = {
  travelProtection: false,
} as const;

/** Demo voucher codes (UI-only). */
export function validateVoucher(code: string): { valid: boolean; discount: number; percent: boolean } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, discount: 0, percent: false };
  if (normalized === "URLAUB10") return { valid: true, discount: 0.1, percent: true };
  if (normalized === "PANDA50") return { valid: true, discount: 50, percent: false };
  return { valid: false, discount: 0, percent: false };
}

export interface ContactForm {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  country: CheckoutCountry;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  email: string;
  phoneLocal: string;
  remarks: string;
}

export interface RoomGuestForm {
  salutation: Salutation;
  firstName: string;
  lastName: string;
}

export function emptyContact(): ContactForm {
  return {
    salutation: "",
    firstName: "",
    lastName: "",
    country: "",
    street: "",
    houseNumber: "",
    zip: "",
    city: "",
    email: "",
    phoneLocal: "",
    remarks: "",
  };
}

export function emptyRoomGuest(): RoomGuestForm {
  return { salutation: "", firstName: "", lastName: "" };
}

type Translate = (key: string, params?: Record<string, string | number>) => string;

/** e.g. "2 Adults + 1 Child (7 years)" / "2 Adults + 2 Children (4 and 8 years)" */
export function formatRoomOccupancyHeading(
  room: RoomSelection,
  locale: Locale,
  t: Translate
): string {
  const adultLabel =
    room.adults === 1
      ? locale === "de"
        ? "1 Erwachsener"
        : "1 Adult"
      : t("booking.adultsCount", { count: room.adults });

  if (room.childAges.length === 0) return adultLabel;

  const ageNumbers = room.childAges.map((age) =>
    age === 0 ? t("booking.underOne") : String(age)
  );
  const yearsWord = locale === "de" ? "Jahre" : "years";
  const andWord = locale === "de" ? "und" : "and";

  const agesJoined =
    ageNumbers.length === 1
      ? ageNumbers[0]
      : ageNumbers.length === 2
        ? `${ageNumbers[0]} ${andWord} ${ageNumbers[1]}`
        : `${ageNumbers.slice(0, -1).join(", ")} ${andWord} ${ageNumbers[ageNumbers.length - 1]}`;

  const agesWithUnit =
    room.childAges.length === 1 && room.childAges[0] === 0
      ? agesJoined
      : `${agesJoined} ${yearsWord}`;

  const childLabel =
    room.childAges.length === 1
      ? locale === "de"
        ? `1 Kind (${agesWithUnit})`
        : `1 Child (${agesWithUnit})`
      : locale === "de"
        ? `${room.childAges.length} Kinder (${agesWithUnit})`
        : `${room.childAges.length} Children (${agesWithUnit})`;

  return `${adultLabel} + ${childLabel}`;
}
