export const LOCALES = ["de", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "de";

export const LOCALE_COOKIE = "urlaubspanda-locale";
export const LOCALE_STORAGE = "urlaubspanda-locale";

export function parseLocale(value: string | null | undefined): Locale {
  return value === "en" ? "en" : "de";
}

export function localeTag(locale: Locale) {
  return locale === "en" ? "en-GB" : "de-AT";
}
