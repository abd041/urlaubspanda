"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  COUNTRY_FLAGS,
  PHONE_PREFIX,
  type ContactForm,
  type CheckoutCountry,
} from "@/components/booking/checkoutHelpers";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export const checkoutInputClass =
  "h-11 w-full max-w-full rounded-lg border border-[#d8dce3] bg-white px-3 text-base text-ink transition placeholder:text-muted/70 focus-visible:border-[#1B63EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:text-sm";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

interface BillingContactSectionProps {
  contact: ContactForm;
  onUpdate: <K extends keyof ContactForm>(key: K, value: ContactForm[K]) => void;
}

function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted lg:max-w-[15rem] lg:shrink-0 lg:pt-2.5 xl:max-w-[17rem]">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

function FormRow({
  label,
  children,
  hint,
  className,
  align = "start",
}: {
  label: string;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
  /** Vertical alignment between label and field column. */
  align?: "start" | "center";
}) {
  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-1.5 border-b border-[#eef0f4] py-3.5 last:border-b-0 lg:grid-cols-[minmax(7.5rem,11rem)_minmax(0,1fr)]",
        align === "center" ? "lg:items-center" : "lg:items-start",
        className
      )}
    >
      <div
        className={cn(
          "text-left text-sm text-body",
          align === "start" && "lg:pt-2.5"
        )}
      >
        {label}
      </div>
      <div className={cn("flex w-full min-w-0 flex-col items-stretch gap-2", hint && "lg:flex-row lg:items-start lg:gap-4")}>
        <div className={cn("w-full min-w-0 text-left", hint ? "lg:max-w-md" : "lg:max-w-xl")}>{children}</div>
        {hint}
      </div>
    </div>
  );
}

function SalutationRadios({
  value,
  onChange,
}: {
  value: ContactForm["salutation"];
  onChange: (value: ContactForm["salutation"]) => void;
}) {
  const t = useT();

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{t("booking.salutation")}</legend>
      <div className="flex flex-wrap items-center gap-5">
        {(
          [
            { value: "mr", label: t("booking.salutationMr") },
            { value: "ms", label: t("booking.salutationMs") },
          ] as const
        ).map((option) => (
          <label key={option.value} className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="billing-salutation"
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

function PhonePrefixDisplay({ country }: { country: CheckoutCountry }) {
  if (!country) {
    return (
      <span
        className="flex h-11 shrink-0 items-center rounded-lg border border-[#d8dce3] bg-[#f7f8fb] px-3 text-sm text-muted"
        aria-hidden="true"
      >
        —
      </span>
    );
  }

  return (
    <span
      className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-[#d8dce3] bg-[#f7f8fb] px-3 text-sm tabular-nums text-ink"
      aria-label={PHONE_PREFIX[country]}
    >
      <span aria-hidden="true">{COUNTRY_FLAGS[country]}</span>
      <span>{PHONE_PREFIX[country]}</span>
    </span>
  );
}

/** Part 2 — billing contact form matching checkout reference layout. */
export function BillingContactSection({ contact, onUpdate }: BillingContactSectionProps) {
  const t = useT();
  const { locale } = useLocale();
  const [remarksOpen, setRemarksOpen] = useState(false);

  const handleCountryChange = (country: CheckoutCountry) => {
    onUpdate("country", country);
  };

  return (
    <section className={cardClass}>
      <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.whoIsPaying")}</h2>
      <p className="mt-1 text-sm text-body">{t("booking.allFieldsRequired")}</p>

      <div className="mt-2">
        <FormRow label={`${t("booking.salutation")} *`} align="center">
          <SalutationRadios value={contact.salutation} onChange={(value) => onUpdate("salutation", value)} />
        </FormRow>

        <FormRow label={`${t("booking.firstName")} *`} hint={<FieldHint>{t("booking.firstNameHint")}</FieldHint>}>
          <input
            type="text"
            required
            autoComplete="given-name"
            value={contact.firstName}
            onChange={(e) => onUpdate("firstName", e.target.value)}
            className={checkoutInputClass}
          />
        </FormRow>

        <FormRow label={`${t("booking.lastName")} *`}>
          <input
            type="text"
            required
            autoComplete="family-name"
            value={contact.lastName}
            onChange={(e) => onUpdate("lastName", e.target.value)}
            className={checkoutInputClass}
          />
        </FormRow>

        <FormRow label={`${t("booking.country")} *`}>
          <select
            required
            value={contact.country}
            onChange={(e) => handleCountryChange(e.target.value as CheckoutCountry)}
            className={cn(
              checkoutInputClass,
              contact.country && "border-success focus-visible:border-success"
            )}
          >
            <option value="" disabled>
              {t("booking.chooseCountry")}
            </option>
            <option value="AT">{t("booking.countryAT")}</option>
            <option value="DE">{t("booking.countryDE")}</option>
            <option value="CH">{t("booking.countryCH")}</option>
          </select>
        </FormRow>

        <FormRow label={`${t("booking.streetAndHouseNumber")} *`}>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              required
              autoComplete="address-line1"
              value={contact.street}
              onChange={(e) => onUpdate("street", e.target.value)}
              placeholder={t("booking.streetPlaceholder")}
              className={cn(checkoutInputClass, "min-w-0 flex-1")}
            />
            <input
              type="text"
              required
              autoComplete="off"
              value={contact.houseNumber}
              onChange={(e) => onUpdate("houseNumber", e.target.value)}
              placeholder={t("booking.houseNumberPlaceholder")}
              pattern="[0-9A-Za-z/\\-]+"
              title={locale === "de" ? "z. B. 12/3, 12-14, 5/7A" : "e.g. 12/3, 12-14, 5/7A"}
              className={cn(checkoutInputClass, "w-full sm:w-28")}
            />
          </div>
        </FormRow>

        <FormRow label={`${t("booking.zipAndCity")} *`}>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              required
              autoComplete="postal-code"
              value={contact.zip}
              onChange={(e) => onUpdate("zip", e.target.value)}
              className={cn(checkoutInputClass, "w-full sm:w-28")}
            />
            <input
              type="text"
              required
              autoComplete="address-level2"
              value={contact.city}
              onChange={(e) => onUpdate("city", e.target.value)}
              className={cn(checkoutInputClass, "min-w-0 flex-1")}
            />
          </div>
        </FormRow>

        <FormRow label={`${t("booking.email")} *`} hint={<FieldHint>{t("booking.emailHint")}</FieldHint>}>
          <input
            type="email"
            required
            autoComplete="email"
            value={contact.email}
            onChange={(e) => onUpdate("email", e.target.value)}
            className={checkoutInputClass}
          />
        </FormRow>

        <FormRow label={`${t("booking.phone")} *`} hint={<FieldHint>{t("booking.phoneHint")}</FieldHint>}>
          <div className="flex min-w-0 gap-2">
            <PhonePrefixDisplay country={contact.country} />
            <input
              type="tel"
              required={Boolean(contact.country)}
              autoComplete="tel-national"
              value={contact.phoneLocal}
              onChange={(e) => onUpdate("phoneLocal", e.target.value)}
              disabled={!contact.country}
              placeholder={contact.country ? "" : t("booking.chooseCountry")}
              className={cn(checkoutInputClass, "min-w-0 flex-1 disabled:cursor-not-allowed disabled:bg-[#f7f8fb] disabled:text-muted")}
            />
          </div>
        </FormRow>
      </div>

      <div className="mt-2 border-t border-[#eef0f4] pt-3">
        <button
          type="button"
          onClick={() => setRemarksOpen((open) => !open)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 transition hover:text-brand-600"
          aria-expanded={remarksOpen}
        >
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform", remarksOpen && "rotate-180")}
            aria-hidden="true"
          />
          {t("booking.remarksToggle")}
        </button>
        {remarksOpen && (
          <label className="mt-3 block">
            <span className="sr-only">{t("booking.specialRequests")}</span>
            <textarea
              rows={3}
              value={contact.remarks}
              onChange={(e) => onUpdate("remarks", e.target.value)}
              className={cn(
                checkoutInputClass,
                "h-auto min-h-[5.5rem] resize-y py-2.5"
              )}
            />
          </label>
        )}
      </div>
    </section>
  );
}
