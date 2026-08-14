import type { Metadata } from "next";
import { TravelCategoryPage } from "@/components/home/TravelCategoryPage";
import { travelCategoryMetadata } from "@/lib/travelCategoryMetadata";

export const metadata: Metadata = travelCategoryMetadata("last-minute");

export default function LastMinutePage() {
  return <TravelCategoryPage slug="last-minute" />;
}
