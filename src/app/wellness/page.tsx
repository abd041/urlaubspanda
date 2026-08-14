import type { Metadata } from "next";
import { TravelCategoryPage } from "@/components/home/TravelCategoryPage";
import { travelCategoryMetadata } from "@/lib/travelCategoryMetadata";

export const metadata: Metadata = travelCategoryMetadata("wellness");

export default function WellnessPage() {
  return <TravelCategoryPage slug="wellness" />;
}
