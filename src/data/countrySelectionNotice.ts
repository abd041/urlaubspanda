/**
 * Country-selection popup info box — frontend stand-in for admin settings.
 *
 * Admin (later) will edit:
 * - `enabled` — show / hide the orange box
 * - `message` — text inside the box (DE primary; EN via phrases)
 *
 * Rules (same as admin behaviour):
 * - `enabled: false` → box hidden
 * - empty / whitespace-only `message` → box hidden
 * - otherwise → orange box above the country list
 *
 * Optional per-offer override via `OfferDetail.countrySelectionNotice`.
 */
export type CountrySelectionNoticeConfig = {
  enabled: boolean;
  message: string;
};

export const countrySelectionNotice: CountrySelectionNoticeConfig = {
  enabled: true,
  message:
    "Bitte wähle dein Wohnsitzland aus, damit wir dir die richtigen Preise und Verfügbarkeiten anzeigen können.",
};

/** Resolve whether the orange notice should render, and with which text. */
export function resolveCountrySelectionNotice(
  override?: Partial<CountrySelectionNoticeConfig> | null
): string | null {
  const enabled = override?.enabled ?? countrySelectionNotice.enabled;
  if (!enabled) return null;

  const message = (override?.message ?? countrySelectionNotice.message).trim();
  if (!message) return null;

  return message;
}
