"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { TravelerPriceLine } from "@/lib/pricingEngine";
import type { BookingOffer, RoomCategoryDetail } from "@/types";
import { CHECKOUT_TOURIST_TAX_PER_ROOM } from "@/components/booking/checkoutHelpers";
import {
  formatCheckoutCancellationDeadline,
  hasFreeCancellation,
} from "@/lib/freeCancellation";
import { formatEuro } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { mealPlanLabel, tx } from "@/i18n/content";
import { cn } from "@/lib/utils";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

export type FinalSummaryRow = {
  roomIndex: number;
  category: RoomCategoryDetail;
  offer: BookingOffer;
  mealPlan: BookingOffer["mealPlans"][number] | undefined;
  total: number;
  lines: TravelerPriceLine[];
  mealSupplement: number;
  cancellationSupplement: number;
};

type ExtraLine = { id?: string; label: string; amount: number; quantity?: number };

interface CheckoutFinalSummaryProps {
  rows: FinalSummaryRow[];
  extraLines: ExtraLine[];
  voucherDiscount: number;
  totalPrice: number;
  arrival: Date;
  newsletter: boolean;
  onNewsletterChange: (value: boolean) => void;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (value: boolean) => void;
  acceptedCancellation: boolean;
  onAcceptedCancellationChange: (value: boolean) => void;
  acceptedPrivacy: boolean;
  onAcceptedPrivacyChange: (value: boolean) => void;
  canSubmit: boolean;
  submitting: boolean;
}

function lineLabel(
  line: TravelerPriceLine,
  t: (key: string, params?: Record<string, string | number>) => string
) {
  if (line.kind === "adult") return t("booking.summaryAdultLine");
  return t("booking.summaryChildLine", {
    age: line.age === 0 ? t("booking.underOne") : t("booking.years", { n: line.age ?? 0 }),
  });
}

/** Part 8 — final price overview, consents, and book CTA (reference layout). */
export function CheckoutFinalSummary({
  rows,
  extraLines,
  voucherDiscount,
  totalPrice,
  arrival,
  newsletter,
  onNewsletterChange,
  acceptedTerms,
  onAcceptedTermsChange,
  acceptedCancellation,
  onAcceptedCancellationChange,
  acceptedPrivacy,
  onAcceptedPrivacyChange,
  canSubmit,
  submitting,
}: CheckoutFinalSummaryProps) {
  const t = useT();
  const { locale } = useLocale();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const deadline = formatCheckoutCancellationDeadline(arrival, locale);
  // "01.11.2026, 11:59" → "01.11.2026 (11:59)" for cancel-no-risk line
  const deadlineDisplay = deadline.includes(",")
    ? deadline.replace(", ", " (") + ")"
    : deadline;

  return (
    <section className={cardClass}>
      <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        {t("booking.priceBreakdown")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-body">{t("booking.finalPriceIntro")}</p>

      <div className="mt-5 rounded-xl border border-[#e8eaef] bg-white p-4 sm:p-5">
        <div className="space-y-5">
          {rows.map((row) => (
            <div key={row.roomIndex} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 text-sm font-extrabold leading-snug text-ink">
                  {tx(row.category.name, locale)}
                </p>
                <span className="shrink-0 text-sm font-extrabold tabular-nums text-ink">
                  {priceFormatter.format(row.total)} €
                </span>
              </div>
              <ul className="space-y-1">
                {row.lines.map((line) => (
                  <li key={`${line.kind}-${line.index}`} className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0 text-body">{lineLabel(line, t)}</span>
                    <span className="shrink-0 tabular-nums text-ink">
                      {priceFormatter.format(line.amount)} €
                    </span>
                  </li>
                ))}
                {row.mealSupplement > 0 && row.mealPlan && (
                  <li className="flex justify-between gap-3 text-sm">
                    <span className="text-body">{mealPlanLabel(row.mealPlan.label, locale)}</span>
                    <span className="shrink-0 tabular-nums text-ink">
                      +{priceFormatter.format(row.mealSupplement)} €
                    </span>
                  </li>
                )}
                {row.cancellationSupplement > 0 && row.offer.cancellation && (
                  <li className="flex justify-between gap-3 text-sm">
                    <span className="text-body">{tx(row.offer.cancellation.label, locale)}</span>
                    <span className="shrink-0 tabular-nums text-ink">
                      +{priceFormatter.format(row.cancellationSupplement)} €
                    </span>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {extraLines.length > 0 && (
          <ul className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
            {extraLines.map((line) => (
              <li key={line.id ?? line.label} className="flex justify-between gap-3">
                <span className="text-body">
                  {line.quantity && line.quantity > 1
                    ? t("booking.addonQtyLabel", { label: line.label, count: line.quantity })
                    : line.label}
                </span>
                <span className="shrink-0 tabular-nums text-ink">
                  +{priceFormatter.format(line.amount)} €
                </span>
              </li>
            ))}
          </ul>
        )}

        {voucherDiscount > 0 && (
          <div className="mt-3 flex justify-between gap-3 text-sm font-semibold text-success">
            <span>{t("booking.voucherDiscount")}</span>
            <span className="tabular-nums">−{priceFormatter.format(voucherDiscount)} €</span>
          </div>
        )}

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
          <span className="text-sm font-extrabold text-ink sm:text-base">{t("booking.yourTravelPrice")}</span>
          <span className="text-[1.85rem] font-extrabold leading-none tabular-nums tracking-tight text-ink">
            {formatEuro(totalPrice, locale)}
          </span>
        </div>

        <ul className="mt-4 space-y-1 text-sm">
          {rows.map((row) => (
            <li key={`tax-${row.roomIndex}`} className="flex justify-between gap-3">
              <span className="min-w-0 text-body">{t("booking.touristTaxLine")}</span>
              <span className="shrink-0 tabular-nums text-ink">
                {priceFormatter.format(CHECKOUT_TOURIST_TAX_PER_ROOM)} €
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-base font-extrabold text-ink">{t("booking.marketingConsentTitle")}</h3>
        <label className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-body">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => onNewsletterChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
          />
          <span>
            {t("booking.newsletterOptInLong")}{" "}
            <Link href="/datenschutz" className="font-semibold text-brand-500 underline-offset-2 hover:underline">
              {t("booking.newsletterMoreInfo")}
            </Link>
          </span>
        </label>
      </div>

      <div className="mt-6 space-y-3 border-t border-[#eef0f4] pt-5">
        <p className="text-sm leading-relaxed text-body">
          {t("booking.legalAcceptLead")}{" "}
          <Link href="/agb" className="font-semibold text-brand-500 underline-offset-2 hover:underline">
            {t("booking.legalAgbLink")}
          </Link>
          {", "}
          <Link href="/agb" className="font-semibold text-brand-500 underline-offset-2 hover:underline">
            {t("booking.legalCancelLink")}
          </Link>
          {" "}
          {t("booking.legalAcceptMid")}{" "}
          <Link href="/datenschutz" className="font-semibold text-brand-500 underline-offset-2 hover:underline">
            {t("booking.legalPrivacyLink")}
          </Link>
          .
        </p>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-body">
          <input
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(e) => onAcceptedTermsChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
          />
          {t("booking.acceptTermsAgb")}
        </label>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-body">
          <input
            type="checkbox"
            required
            checked={acceptedCancellation}
            onChange={(e) => onAcceptedCancellationChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
          />
          {t("booking.acceptCancellation")}
        </label>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-body">
          <input
            type="checkbox"
            required
            checked={acceptedPrivacy}
            onChange={(e) => onAcceptedPrivacyChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
          />
          {t("booking.acceptPrivacy")}
        </label>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#2d8a4e] text-base font-bold text-white shadow-[0_8px_20px_rgba(45,138,78,0.28)] transition",
          "hover:bg-[#247a42] disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d8a4e]"
        )}
      >
        {submitting ? t("booking.bookNowSubmitting") : t("booking.bookNow")}
        {!submitting && <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" strokeWidth={2.5} />}
      </button>

      {hasFreeCancellation() && (
        <p className="mt-3 text-center text-sm font-extrabold leading-snug text-success">
          {t("booking.cancelNoRisk", { date: deadlineDisplay })}
        </p>
      )}
    </section>
  );
}
