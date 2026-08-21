"use client";

import { destinationsInDisplayOrder } from "@/data/destinations";
import { Container } from "@/components/layout/Container";
import { Carousel } from "@/components/ui/Carousel";
import { DestinationCard } from "@/components/home/DestinationCard";
import { useT } from "@/i18n/LocaleProvider";

const orderedDestinations = destinationsInDisplayOrder();

export function PopularDestinations() {
  const t = useT();
  return (
    <section
      aria-labelledby="beliebte-reiseziele-heading"
      className="bg-surface pb-4 pt-2 sm:pb-5 lg:pb-6"
    >
      <Container>
        <h2
          id="beliebte-reiseziele-heading"
          className="mb-4 text-[24px] font-bold leading-tight tracking-tight text-ink sm:mb-5"
        >
          {t("home.popularTitle")}
        </h2>
      </Container>

      {/* Match Container horizontal padding so first/last cards align with page edges. */}
      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <Carousel
          className="min-w-0"
          ariaLabel={t("home.popularTitle")}
          itemsPerPageDesktop={6}
          showDots={false}
          overlayArrows
          overlayArrowsOnMobile
          alwaysShowOverlayArrows
          overlayArrowClassName="top-1/2 h-9 w-9 border-0 bg-white text-brand-500 shadow-[0_6px_18px_rgba(15,26,43,0.12)] hover:bg-white hover:text-brand-600 disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4"
          overlayPrevClassName="left-0"
          overlayNextClassName="right-0"
          trackClassName="gap-4 px-10 py-3 sm:gap-5 sm:px-11 lg:gap-5"
        >
          {orderedDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              variant="catalog"
              priority={index < 6}
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
