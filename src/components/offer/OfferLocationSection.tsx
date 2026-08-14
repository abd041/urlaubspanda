"use client";

import type { Deal } from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { countryDisplayName, regionDisplay } from "@/i18n/content";

function getRegionLabel(destinationRegion: string) {
  return destinationRegion.split(" · ")[0] ?? destinationRegion;
}

/**
 * Lage section with card + embedded map (OpenStreetMap / Google query embed).
 */
export function OfferLocationSection({ deal }: { deal: Deal }) {
  const t = useT();
  const { locale } = useLocale();
  const region = getRegionLabel(deal.destinationRegion);
  const regionLabel = regionDisplay(region, locale);
  const country = countryDisplayName(deal.destinationCountry, locale);
  const query = encodeURIComponent(`${region}, ${deal.destinationCountry}`);
  const mapSrc = `https://maps.google.com/maps?q=${query}&hl=${locale}&z=12&output=embed`;

  return (
    <section id="lage" className="scroll-mt-24" aria-labelledby="lage-heading">
      <h2
        id="lage-heading"
        className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {t("offer.location")}
      </h2>

      <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)]">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <h3 className="text-base font-medium text-body sm:text-[17px]">{t("offer.locationTravel")}</h3>
          <p className="mt-2 text-sm text-ink sm:text-[15px]">
            <strong className="font-bold">{regionLabel}</strong>
            <span className="font-normal text-body">, {country}</span>
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full border-t border-[rgba(15,23,42,0.06)] bg-surface sm:aspect-[2/1]">
          <iframe
            title={t("offer.mapTitle", { place: `${regionLabel}, ${country}` })}
            src={mapSrc}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
