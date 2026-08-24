"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { BookingOffer, CheckoutAddon, ChildPricingRule, Deal, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { countryDisplayName, mealPlanLabel, tx } from "@/i18n/content";
import { cn } from "@/lib/utils";
import { CheckoutTravelSummary } from "@/components/booking/CheckoutTravelSummary";
import { BillingContactSection } from "@/components/booking/BillingContactSection";
import { RoomGuestsSection } from "@/components/booking/RoomGuestsSection";
import { TravelProtectionSection } from "@/components/booking/TravelProtectionSection";
import {
  CheckoutAddonsSection,
  resolveSelectedAddonLines,
  type AddonSelectionState,
} from "@/components/booking/CheckoutAddonsSection";
import { CheckoutVoucherSection } from "@/components/booking/CheckoutVoucherSection";
import { CheckoutPaymentSection } from "@/components/booking/CheckoutPaymentSection";
import { CheckoutFinalSummary } from "@/components/booking/CheckoutFinalSummary";
import { saveBookingConfirmation, type BookingConfirmationSnapshot } from "@/lib/bookingConfirmation";
import {
  emptyContact,
  emptyRoomGuest,
  formatRoomOccupancyHeading,
  validateVoucher,
  type ContactForm,
  type PaymentMethod,
  type RoomGuestForm,
} from "@/components/booking/checkoutHelpers";

interface BookingSummarySectionProps {
  deal: Deal;
  rooms: RoomSelection[];
  roomCategories: RoomCategoryDetail[];
  offers: BookingOffer[];
  arrival: Date;
  nights: number;
  childPricingRules: ChildPricingRule[];
  offerHref: string;
  /** Per-offer checkout add-ons from HotelBookingConfig (admin stand-in). */
  addons?: CheckoutAddon[];
}

type BreakdownRow = {
  roomIndex: number;
  category: RoomCategoryDetail;
  offer: BookingOffer;
  mealPlan: BookingOffer["mealPlans"][number] | undefined;
  total: number;
  travelerCount: number;
  perPerson: number;
  lines: ReturnType<typeof calculateStayPrice>["lines"];
  mealSupplement: number;
  cancellationSupplement: number;
};

export function BookingSummarySection({
  deal,
  rooms,
  roomCategories,
  offers,
  arrival,
  nights,
  childPricingRules,
  offerHref,
  addons = [],
}: BookingSummarySectionProps) {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCancellation, setAcceptedCancellation] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("invoice");
  const [addonSelection, setAddonSelection] = useState<AddonSelectionState>({});
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [voucherError, setVoucherError] = useState(false);
  const [contact, setContact] = useState<ContactForm>(emptyContact);
  const [roomGuests, setRoomGuests] = useState<RoomGuestForm[]>(() => rooms.map(() => emptyRoomGuest()));
  const [room0Touched, setRoom0Touched] = useState(false);

  const departure = useMemo(() => {
    const next = new Date(arrival);
    next.setDate(next.getDate() + nights);
    return next;
  }, [arrival, nights]);

  const breakdown = useMemo(
    () =>
      rooms.map((room, i) => {
        const category = roomCategories.find((r) => r.id === room.roomCategoryId);
        const offer = offers.find((o) => o.id === room.offerId);
        if (!category || !offer) return null;
        const mealPlan = offer.mealPlans.find((plan) => plan.id === room.mealPlanId);
        const baseStay = calculateStayPrice({
          room: category,
          arrival,
          nights,
          adults: room.adults,
          childAges: room.childAges,
          childPricingRules,
        });
        const mealSupplement = mealPlan?.supplementTotal ?? 0;
        const cancellationSupplement = room.cancellationSelected ? offer.cancellation?.supplementTotal ?? 0 : 0;
        const total = baseStay.total + mealSupplement + cancellationSupplement;
        return {
          roomIndex: i,
          category,
          offer,
          mealPlan,
          total,
          travelerCount: baseStay.travelerCount,
          perPerson: total / Math.max(baseStay.travelerCount, 1),
          lines: baseStay.lines,
          mealSupplement,
          cancellationSupplement,
        };
      }),
    [rooms, roomCategories, offers, arrival, nights, childPricingRules]
  );

  const validRows = breakdown.filter((row): row is BreakdownRow => row !== null);
  const hotelPrice = validRows.reduce((sum, row) => sum + row.total, 0);
  const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = rooms.reduce((sum, room) => sum + room.childAges.length, 0);
  const allChildAges = rooms.flatMap((room) => room.childAges);
  const region = tx(deal.destinationRegion.split(" · ")[0] ?? deal.destinationRegion, locale);
  const country = countryDisplayName(deal.destinationCountry, locale);
  const requestRef = `UP-${arrival.getFullYear()}${String(arrival.getMonth() + 1).padStart(2, "0")}${String(arrival.getDate()).padStart(2, "0")}-${nights}`;

  const extraLines = resolveSelectedAddonLines(addons, addonSelection, locale);
  const extrasTotal = extraLines.reduce((sum, line) => sum + line.amount, 0);
  const subtotal = hotelPrice + extrasTotal;

  const voucherResult = appliedVoucher ? validateVoucher(appliedVoucher) : null;
  const voucherDiscount =
    voucherResult?.valid && voucherResult.percent
      ? subtotal * voucherResult.discount
      : voucherResult?.valid
        ? voucherResult.discount
        : 0;
  const totalPrice = Math.max(0, subtotal - voucherDiscount);

  useEffect(() => {
    setRoomGuests((prev) => {
      if (prev.length === rooms.length) return prev;
      return rooms.map((_, i) => prev[i] ?? emptyRoomGuest());
    });
  }, [rooms.length]);

  useEffect(() => {
    if (room0Touched) return;
    setRoomGuests((prev) => {
      const next = [...prev];
      next[0] = {
        salutation: contact.salutation,
        firstName: contact.firstName,
        lastName: contact.lastName,
      };
      return next;
    });
  }, [contact.salutation, contact.firstName, contact.lastName, room0Touched]);

  const updateContact = <K extends keyof ContactForm>(key: K, value: ContactForm[K]) => {
    setContact((prev) => ({ ...prev, [key]: value }));
  };

  const updateRoomGuest = (index: number, patch: Partial<RoomGuestForm>) => {
    if (index === 0) setRoom0Touched(true);
    setRoomGuests((prev) => prev.map((guest, i) => (i === index ? { ...guest, ...patch } : guest)));
  };

  const applyVoucher = () => {
    const code = voucherInput.trim();
    if (!code) {
      setAppliedVoucher("");
      setVoucherError(false);
      return;
    }
    const result = validateVoucher(code);
    if (result.valid) {
      setAppliedVoucher(code.toUpperCase());
      setVoucherInput(code.toUpperCase());
      setVoucherError(false);
    } else {
      setAppliedVoucher("");
      setVoucherError(true);
    }
  };

  const clearVoucher = () => {
    setAppliedVoucher("");
    setVoucherInput("");
    setVoucherError(false);
  };

  const canSubmit = acceptedTerms && acceptedCancellation && acceptedPrivacy && !submitting;

  const buildSnapshot = (): BookingConfirmationSnapshot => ({
    version: 1,
    slug: deal.slug,
    locale,
    requestRef,
    createdAt: new Date().toISOString(),
    arrivalIso: arrival.toISOString(),
    nights,
    hotel: {
      name: deal.name,
      image: deal.images[0] ?? "",
      stars: deal.stars,
      region,
      country,
      reviewEnabled: deal.reviewEnabled,
      reviewPercent: deal.reviewPercent,
      reviewScore: deal.reviewScore,
      reviewMaxScore: deal.reviewMaxScore,
      reviewCount: deal.reviewCount,
    },
    travelers: {
      adults: totalAdults,
      children: totalChildren,
      childAges: allChildAges,
    },
    rooms: validRows.map((row) => ({
      roomIndex: row.roomIndex,
      categoryName: tx(row.category.name, locale),
      occupancy: formatRoomOccupancyHeading(rooms[row.roomIndex], locale, t),
      mainGuest: roomGuests[row.roomIndex] ?? emptyRoomGuest(),
      mealPlanLabel: row.mealPlan ? mealPlanLabel(row.mealPlan.label, locale) : null,
      mealSupplement: row.mealSupplement,
      cancellationLabel:
        row.cancellationSupplement > 0 && row.offer.cancellation
          ? tx(row.offer.cancellation.label, locale)
          : null,
      cancellationSupplement: row.cancellationSupplement,
      lines: row.lines,
      total: row.total,
    })),
    extras: extraLines.map((line) => ({
      id: line.id,
      label: line.label,
      amount: line.amount,
      quantity: 1,
    })),
    voucherCode: appliedVoucher || null,
    voucherDiscount,
    hotelPrice,
    totalPrice,
    payment,
    contact,
    remarks: contact.remarks.trim() || null,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    saveBookingConfirmation(buildSnapshot());
    router.push(`/hotel/${deal.slug}/checkout/confirmation`);
  };

  const steps = [
    { label: t("booking.checkoutStep1"), done: true },
    { label: t("booking.checkoutStep2"), done: true },
    { label: t("booking.checkoutStep3"), done: false },
  ];

  return (
    <div className="pb-4">
      <ol className="mb-4 flex items-center overflow-x-auto rounded-2xl border border-[#e8eaef] bg-white px-3 py-3 sm:px-4 lg:hidden">
        {steps.map((step, index) => {
          const current = !step.done && (index === 0 || steps[index - 1]?.done);
          return (
            <li
              key={step.label}
              aria-current={current ? "step" : undefined}
              className={cn("flex items-center", index < steps.length - 1 && "min-w-0 flex-1")}
            >
              <span className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    step.done && "bg-success text-white",
                    current && "bg-brand-500 text-white",
                    !step.done && !current && "bg-line text-muted"
                  )}
                >
                  {step.done ? <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden="true" /> : index + 1}
                </span>
                <span className={cn("whitespace-nowrap text-xs sm:text-sm", current ? "font-bold text-ink" : "text-muted")}>
                  {step.label}
                </span>
              </span>
              {index < steps.length - 1 && <span className="mx-2 h-px min-w-2 flex-1 bg-line" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      <CheckoutTravelSummary
        deal={deal}
        rows={validRows}
        arrival={arrival}
        departure={departure}
        nights={nights}
        totalAdults={totalAdults}
        totalChildren={totalChildren}
        hotelPrice={hotelPrice}
        offerHref={offerHref}
      />

      <form id="checkout-form" onSubmit={handleSubmit} className="mt-4 space-y-4">
        <BillingContactSection contact={contact} onUpdate={updateContact} />

        <RoomGuestsSection
          rows={validRows.map((row) => ({ roomIndex: row.roomIndex, category: row.category }))}
          rooms={rooms}
          roomGuests={roomGuests}
          onUpdateGuest={updateRoomGuest}
        />

        {/* Part 4 — travel protection (hidden in v1; see CHECKOUT_FEATURES.travelProtection) */}
        <TravelProtectionSection />

        {/* Part 5 — per-offer add-ons (hidden when none configured) */}
        <CheckoutAddonsSection
          addons={addons}
          selection={addonSelection}
          onChange={setAddonSelection}
        />

        {/* Part 6 — optional voucher (does not block booking) */}
        <CheckoutVoucherSection
          input={voucherInput}
          onInputChange={(value) => {
            setVoucherInput(value);
            setVoucherError(false);
          }}
          appliedCode={appliedVoucher}
          discountAmount={voucherDiscount}
          error={voucherError}
          onApply={applyVoucher}
          onClear={clearVoucher}
        />

        {/* Part 7 — payment method (no in-checkout charge) */}
        <CheckoutPaymentSection value={payment} onChange={setPayment} />

        {/* Part 8 — final price summary + consents + CTA */}
        <CheckoutFinalSummary
          rows={validRows}
          extraLines={extraLines}
          voucherDiscount={voucherDiscount}
          totalPrice={totalPrice}
          arrival={arrival}
          newsletter={newsletter}
          onNewsletterChange={setNewsletter}
          acceptedTerms={acceptedTerms}
          onAcceptedTermsChange={setAcceptedTerms}
          acceptedCancellation={acceptedCancellation}
          onAcceptedCancellationChange={setAcceptedCancellation}
          acceptedPrivacy={acceptedPrivacy}
          onAcceptedPrivacyChange={setAcceptedPrivacy}
          canSubmit={canSubmit}
          submitting={submitting}
        />
      </form>
    </div>
  );
}
