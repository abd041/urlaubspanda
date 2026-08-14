import { ATTRIBUTE_FILTER_KEYS, DESTINATION_FILTER_KEYS, filterOptions } from "@/data/filters";
import { destinationFilterPath, destinationPath } from "@/lib/destinationPaths";
import { ORT_QUERY_KEY } from "@/lib/ortFilter";
import type { FilterKey } from "@/types";

const VALID_KEYS = new Set<string>(filterOptions.map((option) => option.key));

export const DESTINATION_SLUGS = Object.keys(DESTINATION_FILTER_KEYS);

export type QueryLike = URLSearchParams | Record<string, string | string[] | undefined>;

function queryEntries(query: QueryLike): [string, string][] {
  if (query instanceof URLSearchParams) {
    return Array.from(query.entries());
  }
  const entries: [string, string][] = [];
  for (const [key, value] of Object.entries(query)) {
    if (value == null) continue;
    const raw = Array.isArray(value) ? value[0] : value;
    if (raw != null) entries.push([key, raw]);
  }
  return entries;
}

export function readQueryParam(query: QueryLike, key: string): string | null {
  if (query instanceof URLSearchParams) return query.get(key);
  const value = query[key];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function parseFilterKeys(query: QueryLike): FilterKey[] {
  const keys: FilterKey[] = [];
  for (const [key, value] of queryEntries(query)) {
    if (value === "1" && VALID_KEYS.has(key)) {
      keys.push(key as FilterKey);
    }
  }
  return keys;
}

function isSeoPathFilter(slug: string, key: FilterKey) {
  const allowed = DESTINATION_FILTER_KEYS[slug];
  return Boolean(allowed?.includes(key)) && !ATTRIBUTE_FILTER_KEYS.has(key);
}

function asSearchParams(query: QueryLike): URLSearchParams {
  if (query instanceof URLSearchParams) return new URLSearchParams(query.toString());
  const params = new URLSearchParams();
  for (const [key, value] of queryEntries(query)) {
    params.set(key, value);
  }
  return params;
}

/**
 * Canonical country URL for a filter selection.
 * One relevant filter → `/{slug}/{filter}`. Otherwise `/{slug}?a=1&b=1`.
 * Unknown params (utm, ort) are preserved.
 */
export function buildCountryFilterHref(
  slug: string,
  filters: FilterKey[],
  currentSearch: QueryLike
): string {
  const params = asSearchParams(currentSearch);
  VALID_KEYS.forEach((key) => params.delete(key));
  const unique = Array.from(new Set(filters)).sort();

  if (unique.length === 1 && isSeoPathFilter(slug, unique[0])) {
    const path = destinationFilterPath(slug, unique[0]);
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  }

  unique.forEach((key) => params.set(key, "1"));
  const path = destinationPath(slug);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function countrySearchShouldNoIndex(
  query: QueryLike,
  pathFilter?: FilterKey | null
): boolean {
  const filters = parseFilterKeys(query);
  const ort = readQueryParam(query, ORT_QUERY_KEY);
  if (ort) return true;
  const combined = new Set(pathFilter ? [pathFilter, ...filters] : filters);
  return combined.size > 1 || Boolean(pathFilter && filters.some((key) => key !== pathFilter));
}

/** Preferred href for this country request, or null if the URL is already canonical. */
export function countrySearchRedirect(
  slug: string,
  pathname: string,
  query: QueryLike,
  pathFilter?: FilterKey | null
): string | null {
  const filters = parseFilterKeys(query);
  const unique = Array.from(new Set(pathFilter ? [pathFilter, ...filters] : filters));
  const target = buildCountryFilterHref(slug, unique, query);
  const currentQuery = asSearchParams(query).toString();
  const current = currentQuery ? `${pathname}?${currentQuery}` : pathname;
  return target !== current ? target : null;
}
