import type { Metadata } from "next";
import { TravelCategoryPage } from "@/components/home/TravelCategoryPage";
import { travelCategoryMetadata } from "@/lib/travelCategoryMetadata";

export const metadata: Metadata = travelCategoryMetadata("pauschalreisen");

export default function PauschalreisenPage() {
  return <TravelCategoryPage slug="pauschalreisen" />;
}
