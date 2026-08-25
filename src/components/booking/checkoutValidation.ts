import type { ContactForm, RoomGuestForm } from "@/components/booking/checkoutHelpers";

export type CheckoutFieldKey =
  | "salutation"
  | "firstName"
  | "lastName"
  | "country"
  | "street"
  | "houseNumber"
  | "zip"
  | "city"
  | "email"
  | "phoneLocal"
  | `room${number}Salutation`
  | `room${number}FirstName`
  | `room${number}LastName`;

export type CheckoutFieldErrors = Partial<Record<CheckoutFieldKey, string>>;

type Translate = (key: string, params?: Record<string, string | number>) => string;

const CONTACT_FIELD_ORDER: CheckoutFieldKey[] = [
  "salutation",
  "firstName",
  "lastName",
  "country",
  "street",
  "houseNumber",
  "zip",
  "city",
  "email",
  "phoneLocal",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOUSE_NUMBER_RE = /^[0-9A-Za-z/\-]+$/;

function trim(value: string) {
  return value.trim();
}

/** Validate billing + room guest required fields; returns i18n message keys. */
export function validateCheckoutForm(
  contact: ContactForm,
  roomGuests: RoomGuestForm[],
  t: Translate
): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (!contact.salutation) errors.salutation = t("booking.validationSalutation");
  if (!trim(contact.firstName)) errors.firstName = t("booking.validationFirstName");
  if (!trim(contact.lastName)) errors.lastName = t("booking.validationLastName");
  if (!contact.country) errors.country = t("booking.validationCountry");
  if (!trim(contact.street)) errors.street = t("booking.validationStreet");
  if (!trim(contact.houseNumber)) {
    errors.houseNumber = t("booking.validationHouseNumber");
  } else if (!HOUSE_NUMBER_RE.test(trim(contact.houseNumber))) {
    errors.houseNumber = t("booking.validationHouseNumberInvalid");
  }
  if (!trim(contact.zip)) errors.zip = t("booking.validationZip");
  if (!trim(contact.city)) errors.city = t("booking.validationCity");

  const email = trim(contact.email);
  if (!email) errors.email = t("booking.validationEmail");
  else if (!EMAIL_RE.test(email)) errors.email = t("booking.validationEmailInvalid");

  if (!trim(contact.phoneLocal)) errors.phoneLocal = t("booking.validationPhone");

  roomGuests.forEach((guest, index) => {
    if (!guest.salutation) {
      errors[`room${index}Salutation`] = t("booking.validationSalutation");
    }
    if (!trim(guest.firstName)) {
      errors[`room${index}FirstName`] = t("booking.validationFirstName");
    }
    if (!trim(guest.lastName)) {
      errors[`room${index}LastName`] = t("booking.validationLastName");
    }
  });

  return errors;
}

export function checkoutFieldDomId(key: CheckoutFieldKey): string {
  return `checkout-field-${key}`;
}

export function firstCheckoutErrorKey(
  errors: CheckoutFieldErrors,
  roomCount: number
): CheckoutFieldKey | null {
  for (const key of CONTACT_FIELD_ORDER) {
    if (errors[key]) return key;
  }
  for (let i = 0; i < roomCount; i++) {
    const keys: CheckoutFieldKey[] = [
      `room${i}Salutation`,
      `room${i}FirstName`,
      `room${i}LastName`,
    ];
    for (const key of keys) {
      if (errors[key]) return key;
    }
  }
  return null;
}

/** Smooth-scroll to a checkout field, accounting for the sticky header. */
export function scrollToCheckoutField(fieldKey: CheckoutFieldKey) {
  if (typeof window === "undefined") return;

  const run = () => {
    const el = document.getElementById(checkoutFieldDomId(fieldKey));
    if (!el) return;

    const header = document.querySelector("header");
    const headerOffset = (header?.getBoundingClientRect().height ?? 72) + 16;
    const top = window.scrollY + el.getBoundingClientRect().top - headerOffset;
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "smooth" });

    window.setTimeout(() => {
      const focusable =
        el.querySelector<HTMLElement>(
          'input:not([type="hidden"]):not([tabindex="-1"]), button:not([tabindex="-1"]), select, textarea'
        ) ?? (el instanceof HTMLElement && el.matches("input, button, select, textarea") ? el : null);
      focusable?.focus({ preventScroll: true });
    }, 380);
  };

  window.requestAnimationFrame(() => window.setTimeout(run, 40));
}
