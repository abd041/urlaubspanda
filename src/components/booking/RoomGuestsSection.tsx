"use client";

import type { RoomSelection } from "@/hooks/useBookingState";
import type { RoomCategoryDetail } from "@/types";
import {
  formatRoomOccupancyHeading,
  type RoomGuestForm,
  type Salutation,
} from "@/components/booking/checkoutHelpers";
import {
  checkoutFieldErrorTextClass,
  checkoutInputClass,
  checkoutInputErrorClass,
  checkoutSalutationErrorClass,
} from "@/components/booking/checkoutFormStyles";
import {
  checkoutFieldDomId,
  type CheckoutFieldErrors,
  type CheckoutFieldKey,
} from "@/components/booking/checkoutValidation";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";
import { cn } from "@/lib/utils";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

type RoomGuestRow = {
  roomIndex: number;
  category: RoomCategoryDetail;
};

interface RoomGuestsSectionProps {
  rows: RoomGuestRow[];
  rooms: RoomSelection[];
  roomGuests: RoomGuestForm[];
  onUpdateGuest: (index: number, patch: Partial<RoomGuestForm>) => void;
  errors?: CheckoutFieldErrors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className={checkoutFieldErrorTextClass} role="alert">
      {message}
    </p>
  );
}

function GuestFormRow({
  label,
  children,
  align = "start",
  fieldId,
}: {
  label: string;
  children: React.ReactNode;
  align?: "start" | "center";
  fieldId?: string;
}) {
  return (
    <div
      id={fieldId}
      className={cn(
        "scroll-mt-24 grid gap-x-4 gap-y-1.5 border-b border-[#eef0f4] py-3 last:border-b-0 lg:grid-cols-[7.5rem_minmax(0,1fr)]",
        align === "center" ? "lg:items-center" : "lg:items-start"
      )}
    >
      <div
        className={cn(
          "text-left text-sm font-semibold text-ink lg:font-normal lg:text-body",
          align === "start" && "lg:pt-2.5"
        )}
      >
        {label}
      </div>
      <div className="min-w-0 w-full max-w-md text-left">{children}</div>
    </div>
  );
}

function RoomSalutationRadios({
  name,
  value,
  onChange,
  invalid,
}: {
  name: string;
  value: Salutation;
  onChange: (value: Salutation) => void;
  invalid?: boolean;
}) {
  const t = useT();

  return (
    <fieldset className={cn("min-w-0", invalid && checkoutSalutationErrorClass)}>
      <legend className="sr-only">{t("booking.salutation")}</legend>
      <div className="flex flex-wrap items-center gap-5">
        {(
          [
            { value: "mr" as const, label: t("booking.salutationMr") },
            { value: "ms" as const, label: t("booking.salutationMs") },
          ]
        ).map((option) => (
          <label key={option.value} className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-base text-ink">
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 accent-brand-500"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Part 3 — one editable main guest per booked room. */
export function RoomGuestsSection({
  rows,
  rooms,
  roomGuests,
  onUpdateGuest,
  errors = {},
}: RoomGuestsSectionProps) {
  const t = useT();
  const { locale } = useLocale();
  const showRoomNumbers = rows.length > 1;

  const guestKey = (index: number, part: "Salutation" | "FirstName" | "LastName"): CheckoutFieldKey =>
    `room${index}${part}`;

  return (
    <section className={cardClass}>
      <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.whoTravels")}</h2>
      <p className="mt-1 text-sm text-body">{t("booking.allFieldsRequired")}</p>

      <div className="mt-4 space-y-5">
        {rows.map((row) => {
          const room = rooms[row.roomIndex];
          const guest = roomGuests[row.roomIndex] ?? { salutation: "", firstName: "", lastName: "" };
          const heading = `${tx(row.category.name, locale)} – ${formatRoomOccupancyHeading(room, locale, t)}`;
          const salutationKey = guestKey(row.roomIndex, "Salutation");
          const firstNameKey = guestKey(row.roomIndex, "FirstName");
          const lastNameKey = guestKey(row.roomIndex, "LastName");

          return (
            <div
              key={row.roomIndex}
              className="min-w-0 rounded-xl border border-[#e8eaef] bg-[#fafbfc] p-3.5 sm:p-4"
            >
              {showRoomNumbers && (
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">
                  {t("booking.roomSectionLabel", { n: row.roomIndex + 1 })}
                </p>
              )}
              <h3 className="mb-3 text-sm font-extrabold leading-snug text-ink sm:text-base">{heading}</h3>

              <GuestFormRow
                label={`${t("booking.salutation")} *`}
                align="center"
                fieldId={checkoutFieldDomId(salutationKey)}
              >
                <RoomSalutationRadios
                  name={`room-${row.roomIndex}-salutation`}
                  value={guest.salutation}
                  onChange={(salutation) => onUpdateGuest(row.roomIndex, { salutation })}
                  invalid={Boolean(errors[salutationKey])}
                />
                <FieldError message={errors[salutationKey]} />
              </GuestFormRow>

              <GuestFormRow
                label={`${t("booking.firstName")} *`}
                fieldId={checkoutFieldDomId(firstNameKey)}
              >
                <input
                  type="text"
                  autoComplete={row.roomIndex === 0 ? "given-name" : "off"}
                  value={guest.firstName}
                  onChange={(e) => onUpdateGuest(row.roomIndex, { firstName: e.target.value })}
                  placeholder={t("booking.nameAsOnId")}
                  aria-invalid={Boolean(errors[firstNameKey]) || undefined}
                  className={cn(checkoutInputClass, errors[firstNameKey] && checkoutInputErrorClass)}
                />
                <FieldError message={errors[firstNameKey]} />
              </GuestFormRow>

              <GuestFormRow
                label={`${t("booking.lastName")} *`}
                fieldId={checkoutFieldDomId(lastNameKey)}
              >
                <input
                  type="text"
                  autoComplete={row.roomIndex === 0 ? "family-name" : "off"}
                  value={guest.lastName}
                  onChange={(e) => onUpdateGuest(row.roomIndex, { lastName: e.target.value })}
                  placeholder={t("booking.nameAsOnId")}
                  aria-invalid={Boolean(errors[lastNameKey]) || undefined}
                  className={cn(checkoutInputClass, errors[lastNameKey] && checkoutInputErrorClass)}
                />
                <FieldError message={errors[lastNameKey]} />
              </GuestFormRow>
            </div>
          );
        })}
      </div>
    </section>
  );
}
