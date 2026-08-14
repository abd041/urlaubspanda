import { permanentRedirect } from "next/navigation";
import { destinations } from "@/data/destinations";
import { destinationPath } from "@/lib/destinationPaths";

/** Legacy `/reiseziele/{slug}` → canonical `/oesterreich` style URLs. */
export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export default async function LegacyCountryRedirect({
  params,
}: PageProps<"/reiseziele/[slug]">) {
  const { slug } = await params;
  permanentRedirect(destinationPath(slug));
}
