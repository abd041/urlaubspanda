import { deals } from "@/data/deals";
import { bookingConfigs } from "@/data/bookingConfigs";

export function getHotelBooking(slug: string) {
  const deal = deals.find((item) => item.slug === slug);
  const config = bookingConfigs[slug];
  if (!deal || !config) return null;
  return { deal, config };
}
