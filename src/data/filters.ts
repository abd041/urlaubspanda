import type { FilterKey, FilterOption } from "@/types";

/** Icon components are resolved by name inside FilterChip to keep this data file JSX-free. */
export type FilterIconName =
  | "plane"
  | "martini"
  | "umbrella"
  | "user-round"
  | "users"
  | "droplets"
  | "flower"
  | "sailboat"
  | "waves"
  | "mountain"
  | "mountain-snow"
  | "thumbs-up"
  | "calendar-clock"
  | "timer"
  | "map-pin"
  | "euro"
  | "star"
  | "baggage";

/** Full catalog of every filter that exists anywhere on the site. Individual pages only render a scoped subset — see `HOMEPAGE_FILTER_KEYS` / `DESTINATION_FILTER_KEYS` below. */
export const filterOptions: (FilterOption & { icon: FilterIconName })[] = [
  { key: "mit-flug", label: "Mit Flug", icon: "plane" },
  { key: "all-inclusive", label: "All Inclusive", icon: "martini" },
  { key: "direkte-strandlage", label: "Direkte Strandlage", icon: "umbrella" },
  { key: "adults-only", label: "Adults Only", icon: "user-round" },
  { key: "familienhotel", label: "Familienhotel", icon: "users" },
  { key: "thermenurlaub", label: "Thermenurlaub", icon: "droplets" },
  { key: "wellness", label: "Wellness", icon: "flower" },
  { key: "urlaub-am-see", label: "Urlaub am See", icon: "sailboat" },
  { key: "urlaub-am-meer", label: "Urlaub am Meer", icon: "waves" },
  { key: "in-den-bergen", label: "In den Bergen", icon: "mountain" },
  { key: "skiurlaub", label: "Skiurlaub", icon: "mountain-snow" },
  {
    key: "ab-85-weiterempfehlung",
    label: "ab 85 % Weiterempfehlung",
    icon: "thumbs-up",
  },
  { key: "fruehbucher", label: "Frühbucher", icon: "calendar-clock" },
  { key: "last-minute", label: "Last Minute", icon: "timer" },
  { key: "zentrale-lage", label: "Zentrale Lage / Nähe zum Zentrum", icon: "map-pin" },
  { key: "bis-300", label: "≤ 300 €", icon: "euro" },
  { key: "top-bewertung", label: "Top Bewertung", icon: "thumbs-up" },
  { key: "fuenf-sterne", label: "5★", icon: "star" },
  { key: "kurztrips", label: "Kurztrips", icon: "baggage" },
];

/**
 * Country-page left sidebar checkboxes — fixed short list matching
 * urlaubshamster country landings (not the full travel-type catalog).
 */
export const COUNTRY_SIDEBAR_FILTER_KEYS: FilterKey[] = [
  "mit-flug",
  "all-inclusive",
  "wellness",
  "bis-300",
  "top-bewertung",
  "fuenf-sterne",
  "kurztrips",
];

/** Attribute filters are matched on deal fields, not `tags`. */
export const ATTRIBUTE_FILTER_KEYS = new Set<FilterKey>([
  "bis-300",
  "top-bewertung",
  "fuenf-sterne",
  "kurztrips",
]);


/**
 * Homepage shows deals from every destination, so per the spec it displays
 * all "general" filters — everything except `zentrale-lage`, which only
 * makes sense on the Städtereisen landing page.
 */
export const HOMEPAGE_FILTER_KEYS: FilterKey[] = filterOptions
  .filter(
    (option) =>
      option.key !== "zentrale-lage" &&
      option.key !== "bis-300" &&
      option.key !== "top-bewertung" &&
      option.key !== "fuenf-sterne" &&
      option.key !== "kurztrips"
  )
  .map((option) => option.key);

/**
 * The exact 6 filters shown in a single, non-wrapping row under "Reisearten
 * entdecken" on mobile, per the client's mockup — everything else stays one
 * tap away via "Alle Filter anzeigen".
 */
export const HOMEPAGE_MOBILE_PREVIEW_KEYS: FilterKey[] = [
  "mit-flug",
  "all-inclusive",
  "direkte-strandlage",
  "familienhotel",
  "wellness",
  "last-minute",
];

/**
 * Top 5 travel-type filters shown in the site header nav. Clicking one
 * navigates to `/angebote` with that filter already selected in the URL
 * (e.g. `/angebote?mit-flug=1`), matching the homepage filter system.
 */
export const HEADER_FILTER_KEYS: FilterKey[] = [
  "mit-flug",
  "all-inclusive",
  "direkte-strandlage",
  "adults-only",
  "familienhotel",
];

/**
 * Per the "Filters by Destination" requirement, each country landing page
 * only shows the filters relevant to that destination group, keyed by
 * `Destination.slug`.
 */
export const DESTINATION_FILTER_KEYS: Record<string, FilterKey[]> = {
  oesterreich: [
    "thermenurlaub",
    "wellness",
    "familienhotel",
    "urlaub-am-see",
    "in-den-bergen",
    "skiurlaub",
    "ab-85-weiterempfehlung",
    "fruehbucher",
    "last-minute",
  ],
  deutschland: [
    "thermenurlaub",
    "wellness",
    "familienhotel",
    "urlaub-am-see",
    "urlaub-am-meer",
    "in-den-bergen",
    "skiurlaub",
    "ab-85-weiterempfehlung",
    "fruehbucher",
    "last-minute",
  ],
  italien: [
    "mit-flug",
    "all-inclusive",
    "direkte-strandlage",
    "adults-only",
    "familienhotel",
    "ab-85-weiterempfehlung",
    "fruehbucher",
    "last-minute",
  ],
  kroatien: [
    "mit-flug",
    "all-inclusive",
    "direkte-strandlage",
    "adults-only",
    "familienhotel",
    "ab-85-weiterempfehlung",
    "fruehbucher",
    "last-minute",
  ],
  griechenland: [
    "mit-flug",
    "all-inclusive",
    "direkte-strandlage",
    "adults-only",
    "familienhotel",
    "ab-85-weiterempfehlung",
    "fruehbucher",
    "last-minute",
  ],
  aegypten: [
    "mit-flug",
    "all-inclusive",
    "direkte-strandlage",
    "adults-only",
    "familienhotel",
    "ab-85-weiterempfehlung",
    "fruehbucher",
    "last-minute",
  ],
  spanien: [
    "mit-flug",
    "all-inclusive",
    "direkte-strandlage",
    "adults-only",
    "familienhotel",
    "ab-85-weiterempfehlung",
    "fruehbucher",
    "last-minute",
  ],
  suedtirol: [
    "wellness",
    "familienhotel",
    "urlaub-am-see",
    "in-den-bergen",
    "ab-85-weiterempfehlung",
    "fruehbucher",
    "last-minute",
  ],
  staedtereisen: ["mit-flug", "ab-85-weiterempfehlung", "zentrale-lage", "fruehbucher", "last-minute"],
};

export function getFilterOption(key: string) {
  return filterOptions.find((option) => option.key === key);
}

/** All SEO-indexable destination + single-filter path combos for sitemap / SSG. */
export function getDestinationFilterSeoParams(): { slug: string; filter: FilterKey }[] {
  return Object.entries(DESTINATION_FILTER_KEYS).flatMap(([slug, keys]) =>
    keys.map((filter) => ({ slug, filter }))
  );
}
