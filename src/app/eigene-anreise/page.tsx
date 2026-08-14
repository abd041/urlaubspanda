import type { Metadata } from "next";
import { TravelCategoryPage } from "@/components/home/TravelCategoryPage";
import { travelCategoryMetadata } from "@/lib/travelCategoryMetadata";

export const metadata: Metadata = travelCategoryMetadata("eigene-anreise");

export default function EigeneAnreisePage() {
  return <TravelCategoryPage slug="eigene-anreise" />;
}
