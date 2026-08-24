"use client";

import type { RoomSelection } from "@/hooks/useBookingState";
import type { RoomCategoryDetail } from "@/types";
import {
  formatRoomOccupancyHeading,
  type RoomGuestForm,
  type Salutation,
} from "@/components/booking/checkoutHelpers";
import { checkoutInputClass } from "@/components/booking/BillingContactSection";
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
}

function GuestFormRow({
  label,
  children,
  align = "start",
}: {
  label: string;
  children: React.ReactNode;
  align?: "start" | "center";
}) {
  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-1.5 border-b border-[#eef0f4] py-3 last:border-b-0 lg:grid-cols-[7.5rem_minmax(0,1fr)]",
        align === "center" ? "lg:items-center" : "lg:items-start"
      )}
    >
      <div className={cn("text-left text-sm text-body", align === "start" && "lg:pt-2.5")}>{label}</div>
      <div className="min-w-0 w-full max-w-md text-left">{children}</div>
    </div>
  );
}

function RoomSalutationRadios({
  name,
  value,
  onChange,
}: {
  name: string;
  value: Salutation;
  onChange: (value: Salutation) => void;
}) {
  const t = useT();

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{t("booking.salutation")}</legend>
      <div className="flex flex-wrap items-center gap-5">
        {(
          [
            { value: "mr" as const, label: t("booking.salutationMr") },
            { value: "ms" as const, label: t("booking.salutationMs") },
          ]
        ).map((option) => (
          <label key={option.value} className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name={name}
              required
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
}: RoomGuestsSectionProps) {
  const t = useT();
  const { locale } = useLocale();
  const showRoomNumbers = rows.length > 1;

  return (
    <section className={cardClass}>
      <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.whoTravels")}</h2>
      <p className="mt-1 text-sm text-body">{t("booking.allFieldsRequired")}</p>

      <div className="mt-4 space-y-5">
        {rows.map((row) => {
          const room = rooms[row.roomIndex];
          const guest = roomGuests[row.roomIndex] ?? { salutation: "", firstName: "", lastName: "" };
          const heading = `${tx(row.category.name, locale)} – ${formatRoomOccupancyHeading(room, locale, t)}`;

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

              <GuestFormRow label={`${t("booking.salutation")} *`} align="center">
                <RoomSalutationRadios
                  name={`room-${row.roomIndex}-salutation`}
                  value={guest.salutation}
                  onChange={(salutation) => onUpdateGuest(row.roomIndex, { salutation })}
                />
              </GuestFormRow>

              <GuestFormRow label={`${t("booking.firstName")} *`}>
                <input
                  type="text"
                  required
                  autoComplete={row.roomIndex === 0 ? "given-name" : "off"}
                  value={guest.firstName}
                  onChange={(e) => onUpdateGuest(row.roomIndex, { firstName: e.target.value })}
                  placeholder={t("booking.nameAsOnId")}
                  className={checkoutInputClass}
                />
              </GuestFormRow>

              <GuestFormRow label={`${t("booking.lastName")} *`}>
                <input
                  type="text"
                  required
                  autoComplete={row.roomIndex === 0 ? "family-name" : "off"}
                  value={guest.lastName}
                  onChange={(e) => onUpdateGuest(row.roomIndex, { lastName: e.target.value })}
                  placeholder={t("booking.nameAsOnId")}
                  className={checkoutInputClass}
                />
              </GuestFormRow>
            </div>
          );
        })}
      </div>
    </section>
  );
}
