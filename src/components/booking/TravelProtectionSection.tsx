"use client";

import { CHECKOUT_FEATURES } from "@/components/booking/checkoutHelpers";

export type TravelProtectionOption = "none" | "basic" | "gold";

interface TravelProtectionSectionProps {
  /** Selected option when travel protection is enabled in a later phase. */
  value?: TravelProtectionOption;
  onChange?: (value: TravelProtectionOption) => void;
}

/**
 * Part 4 — travel insurance / protection (disabled for v1).
 *
 * Kept as a checkout extension point: when `CHECKOUT_FEATURES.travelProtection`
 * is turned on, render the selectable options here without reshaping the form.
 */
export function TravelProtectionSection(_props: TravelProtectionSectionProps) {
  if (!CHECKOUT_FEATURES.travelProtection) return null;

  // Future: render “Choose your travel protection” options (none / basic / gold).
  return null;
}
