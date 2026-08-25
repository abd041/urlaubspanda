"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  COUNTRY_FLAGS,
  PHONE_PREFIX,
  type ContactForm,
  type CheckoutCountry,
} from "@/components/booking/checkoutHelpers";
import {
  checkoutFieldErrorTextClass,
  checkoutInputClass,
  checkoutInputErrorClass,
  checkoutSalutationErrorClass,
  checkoutSelectTriggerClass,
} from "@/components/booking/checkoutFormStyles";
import {
  checkoutFieldDomId,
  type CheckoutFieldErrors,
  type CheckoutFieldKey,
} from "@/components/booking/checkoutValidation";
import { useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export { checkoutInputClass } from "@/components/booking/checkoutFormStyles";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

const COUNTRY_OPTIONS: Exclude<CheckoutCountry, "">[] = ["AT", "DE", "CH"];

interface BillingContactSectionProps {
  contact: ContactForm;
  onUpdate: <K extends keyof ContactForm>(key: K, value: ContactForm[K]) => void;
  errors?: CheckoutFieldErrors;
}

function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-sm leading-relaxed text-muted lg:mt-0 lg:max-w-[15rem] lg:shrink-0 lg:pt-2.5 xl:max-w-[17rem]">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className={checkoutFieldErrorTextClass} role="alert">
      {message}
    </p>
  );
}

function FormRow({
  label,
  children,
  hint,
  className,
  align = "start",
  fieldId,
}: {
  label: string;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
  align?: "start" | "center";
  fieldId?: string;
}) {
  return (
    <div
      id={fieldId}
      className={cn(
        "scroll-mt-24 grid gap-x-4 gap-y-1.5 border-b border-[#eef0f4] py-3.5 last:border-b-0 lg:grid-cols-[minmax(7.5rem,11rem)_minmax(0,1fr)]",
        align === "center" ? "lg:items-center" : "lg:items-start",
        className
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
      <div className={cn("flex w-full min-w-0 flex-col items-stretch", hint && "lg:flex-row lg:items-start lg:gap-4")}>
        <div className={cn("w-full min-w-0 max-w-full text-left", hint ? "lg:max-w-md" : "lg:max-w-xl")}>
          {children}
        </div>
        {hint}
      </div>
    </div>
  );
}

function SalutationRadios({
  value,
  onChange,
  invalid,
}: {
  value: ContactForm["salutation"];
  onChange: (value: ContactForm["salutation"]) => void;
  invalid?: boolean;
}) {
  const t = useT();

  return (
    <fieldset className={cn("min-w-0", invalid && checkoutSalutationErrorClass)}>
      <legend className="sr-only">{t("booking.salutation")}</legend>
      <div className="flex flex-wrap items-center gap-5">
        {(
          [
            { value: "mr", label: t("booking.salutationMr") },
            { value: "ms", label: t("booking.salutationMs") },
          ] as const
        ).map((option) => (
          <label key={option.value} className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-base text-ink">
            <input
              type="radio"
              name="billing-salutation"
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
        className="flex h-11 w-[4.75rem] shrink-0 items-center justify-center rounded-lg border border-[#d8dce3] bg-[#f7f8fb] text-[16px] text-muted"
        aria-hidden="true"
      >
        —
      </span>
    );
  }

  return (
    <span
      className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-[#d8dce3] bg-[#f7f8fb] px-2.5 text-[16px] tabular-nums text-ink"
      aria-label={PHONE_PREFIX[country]}
    >
      <span aria-hidden="true">{COUNTRY_FLAGS[country]}</span>
      <span>{PHONE_PREFIX[country]}</span>
    </span>
  );
}

function countryLabel(code: Exclude<CheckoutCountry, "">, t: (key: string) => string) {
  if (code === "AT") return t("booking.countryAT");
  if (code === "DE") return t("booking.countryDE");
  return t("booking.countryCH");
}

function CountrySelect({
  value,
  onChange,
  invalid,
}: {
  value: CheckoutCountry;
  onChange: (value: CheckoutCountry) => void;
  invalid?: boolean;
}) {
  const t = useT();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full min-w-0 max-w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          checkoutSelectTriggerClass,
          open && "border-brand-500",
          value && !invalid && "border-success",
          invalid && checkoutInputErrorClass
        )}
      >
        <span className={cn("truncate", !value && "text-muted/70")}>
          {value ? countryLabel(value, t) : t("booking.chooseCountry")}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#d8dce3] bg-white py-1 shadow-[0_8px_24px_rgba(15,26,43,0.12)]"
        >
          {COUNTRY_OPTIONS.map((code) => {
            const selected = value === code;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center px-3 py-2.5 text-left text-[16px] text-ink transition hover:bg-[#F4F8FF]",
                    selected && "bg-[#F4F8FF] font-semibold"
                  )}
                  onClick={() => {
                    onChange(code);
                    setOpen(false);
                  }}
                >
                  {countryLabel(code, t)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Part 2 — billing contact form matching checkout reference layout. */
export function BillingContactSection({ contact, onUpdate, errors = {} }: BillingContactSectionProps) {
  const t = useT();
  const [remarksOpen, setRemarksOpen] = useState(false);

  const field = (key: CheckoutFieldKey) => checkoutFieldDomId(key);
  const err = (key: CheckoutFieldKey) => errors[key];

  return (
    <section className={cn(cardClass, "overflow-visible")}>
      <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.whoIsPaying")}</h2>
      <p className="mt-1 text-sm text-body">{t("booking.allFieldsRequired")}</p>

      <div className="mt-2">
        <FormRow label={`${t("booking.salutation")} *`} align="center" fieldId={field("salutation")}>
          <SalutationRadios
            value={contact.salutation}
            onChange={(value) => onUpdate("salutation", value)}
            invalid={Boolean(err("salutation"))}
          />
          <FieldError message={err("salutation")} />
        </FormRow>

        <FormRow label={`${t("booking.firstName")} *`} fieldId={field("firstName")}>
          <input
            type="text"
            autoComplete="given-name"
            value={contact.firstName}
            onChange={(e) => onUpdate("firstName", e.target.value)}
            placeholder={t("booking.nameAsOnId")}
            aria-invalid={Boolean(err("firstName")) || undefined}
            className={cn(checkoutInputClass, err("firstName") && checkoutInputErrorClass)}
          />
          <FieldError message={err("firstName")} />
        </FormRow>

        <FormRow label={`${t("booking.lastName")} *`} fieldId={field("lastName")}>
          <input
            type="text"
            autoComplete="family-name"
            value={contact.lastName}
            onChange={(e) => onUpdate("lastName", e.target.value)}
            placeholder={t("booking.nameAsOnId")}
            aria-invalid={Boolean(err("lastName")) || undefined}
            className={cn(checkoutInputClass, err("lastName") && checkoutInputErrorClass)}
          />
          <FieldError message={err("lastName")} />
        </FormRow>

        <FormRow label={`${t("booking.country")} *`} fieldId={field("country")}>
          <CountrySelect
            value={contact.country}
            onChange={(country) => onUpdate("country", country)}
            invalid={Boolean(err("country"))}
          />
          <FieldError message={err("country")} />
        </FormRow>

        <FormRow label={`${t("booking.streetAndHouseNumber")} *`}>
          <div className="flex min-w-0 items-start gap-2">
            <div id={field("street")} className="min-w-0 flex-[1_1_70%] scroll-mt-24">
              <input
                type="text"
                autoComplete="address-line1"
                value={contact.street}
                onChange={(e) => onUpdate("street", e.target.value)}
                placeholder={t("booking.streetPlaceholder")}
                aria-invalid={Boolean(err("street")) || undefined}
                className={cn(checkoutInputClass, err("street") && checkoutInputErrorClass)}
              />
              <FieldError message={err("street")} />
            </div>
            <div id={field("houseNumber")} className="w-[30%] min-w-[4.5rem] shrink-0 scroll-mt-24">
              <input
                type="text"
                autoComplete="off"
                value={contact.houseNumber}
                onChange={(e) => onUpdate("houseNumber", e.target.value)}
                placeholder={t("booking.houseNumberPlaceholder")}
                aria-invalid={Boolean(err("houseNumber")) || undefined}
                className={cn(checkoutInputClass, err("houseNumber") && checkoutInputErrorClass)}
              />
              <FieldError message={err("houseNumber")} />
            </div>
          </div>
        </FormRow>

        <FormRow label={`${t("booking.zipAndCity")} *`}>
          <div className="flex min-w-0 items-start gap-2">
            <div id={field("zip")} className="w-[35%] min-w-[5rem] shrink-0 scroll-mt-24">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={contact.zip}
                onChange={(e) => onUpdate("zip", e.target.value)}
                placeholder={t("booking.zipPlaceholder")}
                aria-invalid={Boolean(err("zip")) || undefined}
                className={cn(checkoutInputClass, err("zip") && checkoutInputErrorClass)}
              />
              <FieldError message={err("zip")} />
            </div>
            <div id={field("city")} className="min-w-0 flex-[1_1_65%] scroll-mt-24">
              <input
                type="text"
                autoComplete="address-level2"
                value={contact.city}
                onChange={(e) => onUpdate("city", e.target.value)}
                placeholder={t("booking.cityPlaceholder")}
                aria-invalid={Boolean(err("city")) || undefined}
                className={cn(checkoutInputClass, err("city") && checkoutInputErrorClass)}
              />
              <FieldError message={err("city")} />
            </div>
          </div>
        </FormRow>

        <FormRow
          label={`${t("booking.email")} *`}
          hint={<FieldHint>{t("booking.emailHint")}</FieldHint>}
          fieldId={field("email")}
        >
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={contact.email}
            onChange={(e) => onUpdate("email", e.target.value)}
            placeholder={t("booking.emailPlaceholder")}
            aria-invalid={Boolean(err("email")) || undefined}
            className={cn(checkoutInputClass, err("email") && checkoutInputErrorClass)}
          />
          <FieldError message={err("email")} />
        </FormRow>

        <FormRow
          label={`${t("booking.phone")} *`}
          hint={<FieldHint>{t("booking.phoneHint")}</FieldHint>}
          fieldId={field("phoneLocal")}
        >
          <div className="flex min-w-0 items-center gap-2">
            <PhonePrefixDisplay country={contact.country} />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={contact.phoneLocal}
              onChange={(e) => onUpdate("phoneLocal", e.target.value)}
              disabled={!contact.country}
              placeholder={contact.country ? t("booking.phonePlaceholder") : t("booking.chooseCountry")}
              aria-invalid={Boolean(err("phoneLocal")) || undefined}
              className={cn(
                checkoutInputClass,
                "min-w-0 flex-1 disabled:cursor-not-allowed disabled:bg-[#f7f8fb] disabled:text-muted",
                err("phoneLocal") && checkoutInputErrorClass
              )}
            />
          </div>
          <FieldError message={err("phoneLocal")} />
        </FormRow>
      </div>

      <div className="mt-2 border-t border-[#eef0f4] pt-3">
        <button
          type="button"
          onClick={() => setRemarksOpen((open) => !open)}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand-500 transition hover:text-brand-600"
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
              className={cn(checkoutInputClass, "h-auto min-h-[5.5rem] resize-y py-2.5")}
            />
          </label>
        )}
      </div>
    </section>
  );
}
