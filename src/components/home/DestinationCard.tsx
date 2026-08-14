"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/types";
import { destinationPath } from "@/lib/destinationPaths";
import { cn } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { destinationName, destinationSubtitle } from "@/i18n/content";

/** Crop so the subject sits below the top type and pale sky is minimised where possible. */
export const destinationImagePosition: Record<string, string> = {
  oesterreich: "object-[center_46%]",
  deutschland: "object-[center_62%]",
  italien: "object-[center_42%]",
  kroatien: "object-[center_48%]",
  griechenland: "object-[center_40%]",
  aegypten: "object-[center_42%]",
  spanien: "object-[center_48%]",
  suedtirol: "object-[center_42%]",
  staedtereisen: "object-[center_42%]",
};

function formatFromPrice(value: number, locale: "de" | "en") {
  return `${new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 }).format(value)} €`;
}

export function DestinationCard({
  destination,
  priority = false,
  className,
  variant = "carousel",
  offerCount,
  fromPrice,
}: {
  destination: Destination;
  priority?: boolean;
  /** Overrides the default carousel-slide sizing, e.g. for a full-width grid layout on the "Alle Reiseziele" overview page. */
  className?: string;
  variant?: "carousel" | "grid";
  offerCount?: number;
  fromPrice?: number | null;
}) {
  const { locale } = useLocale();
  const t = useT();
  const name = destinationName(destination.slug, locale);
  const subtitle = destinationSubtitle(destination.slug, locale);
  const isGrid = variant === "grid";
  const showMeta = isGrid && offerCount !== undefined;

  return (
    <Link
      href={destinationPath(destination.slug)}
      data-carousel-item
      className={cn(
        "group relative isolate overflow-hidden rounded-[12px] bg-ink shadow-[0_8px_24px_rgba(15,23,42,0.12),0_2px_6px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-500 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.16),0_4px_10px_rgba(15,23,42,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
        isGrid
          ? "block aspect-4/5 h-full w-full sm:aspect-3/4"
          : "block aspect-2/3 w-[calc((100%-0.75rem)/1.6)] shrink-0 snap-start md:w-[calc((100%-2*1.25rem)/3)] xl:w-[calc((100%-4*1.5rem)/5)]",
        className
      )}
    >
      <Image
        src={destination.image}
        alt={`${name} – ${subtitle}`}
        fill
        quality={92}
        sizes={
          isGrid
            ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            : "(min-width: 1280px) 230px, (min-width: 768px) 32vw, 65vw"
        }
        priority={priority}
        className={cn(
          "destination-photo z-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.04]",
          destinationImagePosition[destination.slug] ?? "object-center"
        )}
      />

      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42%] bg-[linear-gradient(to_top,rgba(8,12,20,0.58)_0%,rgba(8,12,20,0.26)_40%,rgba(8,12,20,0.06)_72%,transparent_100%)]"
        aria-hidden="true"
      />

      {showMeta && (
        <span className="absolute left-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold tracking-tight text-ink shadow-sm sm:left-5 sm:top-5">
          {offerCount > 0
            ? t("pages.destinationsOfferCount", {
                count: offerCount,
                word: offerCount === 1 ? t("deals.offer") : t("deals.offers"),
              })
            : t("pages.destinationsSoon")}
        </span>
      )}

      <span className="absolute inset-x-5 bottom-5 z-20 flex flex-col sm:inset-x-6 sm:bottom-6">
        <h3
          className={cn(
            "font-semibold leading-[1.05] tracking-[-0.02em] text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.45)]",
            isGrid ? "text-[1.65rem] sm:text-[1.75rem]" : "text-[1.5rem] sm:text-[26px]"
          )}
        >
          {name}
        </h3>
        <p className="mt-1 text-[11px] font-medium uppercase leading-[1.25] tracking-[0.12em] text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)] sm:text-[12px]">
          {subtitle}
        </p>
        <span className="mt-2 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium tracking-[0.08em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.35)]">
          <span className="inline-flex items-center gap-1">
            {t("home.discover")}
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-in-out group-hover:translate-x-0.75"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
          {showMeta && fromPrice != null && (
            <span className="text-white/85">
              {t("deal.from")} {formatFromPrice(fromPrice, locale)}
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}
