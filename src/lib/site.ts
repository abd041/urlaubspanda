/**
 * Single source of truth for the production domain, used to build absolute
 * URLs for canonical links, Open Graph tags, structured data and the
 * sitemap. Override via `NEXT_PUBLIC_SITE_URL` for staging/preview deploys.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urlaubspanda.at";

export const SITE_NAME = "Urlaubspanda";
