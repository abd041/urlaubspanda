import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DESTINATION_FILTER_KEYS } from "@/data/filters";
import {
  countrySearchRedirect,
  countrySearchShouldNoIndex,
  DESTINATION_SLUGS,
} from "@/lib/countryFilterUrl";
import type { FilterKey } from "@/types";

const DESTINATION_SLUG_SET = new Set(DESTINATION_SLUGS);

function parseCountryPath(pathname: string): { slug: string; pathFilter: FilterKey | null } | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0 || parts.length > 2) return null;
  const slug = parts[0];
  if (!DESTINATION_SLUG_SET.has(slug)) return null;
  const allowed = DESTINATION_FILTER_KEYS[slug] ?? [];
  if (parts.length === 1) return { slug, pathFilter: null };
  const filter = parts[1] as FilterKey;
  if (!allowed.includes(filter)) return null;
  return { slug, pathFilter: filter };
}

export function proxy(request: NextRequest) {
  const parsed = parseCountryPath(request.nextUrl.pathname);
  if (!parsed) return NextResponse.next();

  const { slug, pathFilter } = parsed;
  const redirectTo = countrySearchRedirect(
    slug,
    request.nextUrl.pathname,
    request.nextUrl.searchParams,
    pathFilter
  );
  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 308);
  }

  if (countrySearchShouldNoIndex(request.nextUrl.searchParams, pathFilter)) {
    const response = NextResponse.next();
    response.headers.set("x-robots-tag", "noindex, follow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/oesterreich",
    "/oesterreich/:filter",
    "/deutschland",
    "/deutschland/:filter",
    "/italien",
    "/italien/:filter",
    "/kroatien",
    "/kroatien/:filter",
    "/griechenland",
    "/griechenland/:filter",
    "/aegypten",
    "/aegypten/:filter",
    "/spanien",
    "/spanien/:filter",
    "/suedtirol",
    "/suedtirol/:filter",
    "/staedtereisen",
    "/staedtereisen/:filter",
  ],
};
