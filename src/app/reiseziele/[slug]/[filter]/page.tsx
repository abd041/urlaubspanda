import { permanentRedirect } from "next/navigation";
import { getDestinationFilterSeoParams } from "@/data/filters";
import { destinationFilterPath } from "@/lib/destinationPaths";

/** Legacy `/reiseziele/{slug}/{filter}` → canonical `/{slug}/{filter}`. */
export function generateStaticParams() {
  return getDestinationFilterSeoParams();
}

export default async function LegacyCountryFilterRedirect({
  params,
}: PageProps<"/reiseziele/[slug]/[filter]">) {
  const { slug, filter } = await params;
  permanentRedirect(destinationFilterPath(slug, filter));
}
