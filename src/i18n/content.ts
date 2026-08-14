import type { FilterKey } from "@/types";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/lookup";
import { phrasesEn } from "@/i18n/phrases";

const GERMAN_COUNTRY_TO_SLUG: Record<string, string> = {
  Österreich: "oesterreich",
  Deutschland: "deutschland",
  Italien: "italien",
  Kroatien: "kroatien",
  Griechenland: "griechenland",
  Ägypten: "aegypten",
  Spanien: "spanien",
  Südtirol: "suedtirol",
  Städtereisen: "staedtereisen",
};

export function destinationName(slug: string, locale: Locale) {
  return translate(locale, `dest.${slug}.name`);
}

export function destinationSubtitle(slug: string, locale: Locale) {
  return translate(locale, `dest.${slug}.sub`);
}

export function countryDisplayName(germanName: string, locale: Locale) {
  const slug = GERMAN_COUNTRY_TO_SLUG[germanName];
  return slug ? destinationName(slug, locale) : tx(germanName, locale);
}

export function regionDisplay(region: string, locale: Locale) {
  const [place, country] = region.split(" · ");
  if (!country) return tx(place, locale);
  return `${tx(place, locale)} · ${countryDisplayName(country, locale)}`;
}

export function filterLabel(key: FilterKey, locale: Locale) {
  return translate(locale, `filter.${key}`);
}

export function mealPlanLabel(plan: string, locale: Locale) {
  const fromMessages = translate(locale, `meal.${plan}`);
  if (fromMessages !== `meal.${plan}`) return fromMessages;
  return tx(plan, locale);
}

export function nightLabel(count: number, locale: Locale) {
  const key = count === 1 ? "deal.night" : "deal.nights";
  return translate(locale, key, { count });
}

export function destinationH1Localized(slug: string, locale: Locale) {
  const name = destinationName(slug, locale);
  if (slug === "staedtereisen") return name;
  return translate(locale, "country.holidayIn", { name });
}

export function destinationDealsHeadingLocalized(slug: string, locale: Locale) {
  if (slug === "staedtereisen") return translate(locale, "deals.cityDeals");
  return translate(locale, "deals.inCountry", { name: destinationName(slug, locale) });
}

/** Translate CMS/data strings. German is the source; English uses the phrase map. */
export function tx(text: string, locale: Locale) {
  if (locale === "de") return text;
  return phrasesEn[text] ?? text;
}

export function txList(items: string[], locale: Locale) {
  return items.map((item) => tx(item, locale));
}
