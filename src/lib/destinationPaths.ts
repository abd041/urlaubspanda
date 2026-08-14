/** Canonical country landing URL per Homepage-details examples (`/oesterreich/`). */
export function destinationPath(slug: string) {
  return `/${slug}`;
}

/** Dedicated SEO URL for a single destination + filter (`/oesterreich/wellness`). */
export function destinationFilterPath(slug: string, filter: string) {
  return `/${slug}/${filter}`;
}

/** Country/category H1 from Homepage-details (“Urlaub in Österreich”). */
export function destinationH1(name: string) {
  if (name === "Städtereisen") return "Städtereisen";
  return `Urlaub in ${name}`;
}

/** Deal-section heading on a country landing. */
export function destinationDealsHeading(name: string) {
  if (name === "Städtereisen") return "Angebote für Städtereisen";
  return `Angebote in ${name}`;
}
