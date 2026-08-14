import { bookingConfigs } from "@/data/bookingConfigs";

/** Existing frontend booking UI route. Does not touch pricing or booking logic. */
export function internalBookingPath(slug: string) {
  return `/hotel/${slug}`;
}

/** True when this offer already has a mock booking-flow config. */
export function hasInternalBooking(slug: string) {
  return Boolean(bookingConfigs[slug]);
}
