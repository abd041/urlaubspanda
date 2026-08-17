"use client";

import { destinationsInDisplayOrder } from "@/data/destinations";
import { Container } from "@/components/layout/Container";
import { Carousel } from "@/components/ui/Carousel";
import { DestinationCard } from "@/components/home/DestinationCard";
import { useT } from "@/i18n/LocaleProvider";
import { Reveal } from "@/components/motion/Reveal";

const orderedDestinations = destinationsInDisplayOrder();

export function PopularDestinations() {
  const t = useT();
  return (
    <section
      aria-labelledby="beliebte-reiseziele-heading"
      className="bg-surface pb-14 pt-2 sm:pb-16 lg:pb-[4.5rem]"
    >
      <Container>
        <Reveal fade>
          <h2
            id="beliebte-reiseziele-heading"
            className="mb-[52px] text-[24px] font-bold leading-tight tracking-tight text-ink"
          >
            {t("home.popularTitle")}
          </h2>
          <Carousel
            className="overflow-visible"
            ariaLabel={t("home.popularTitle")}
            itemsPerPageDesktop={6}
            showDots={false}
            overlayArrows
            overlayArrowsOnMobile
            alwaysShowOverlayArrows
            overlayArrowClassName="top-1/2 h-9 w-9 border-0 bg-white text-brand-500 shadow-[0_6px_18px_rgba(15,26,43,0.12)] hover:bg-white hover:text-brand-600 disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4"
            overlayPrevClassName="left-0 -translate-x-1/2"
            overlayNextClassName="right-0 translate-x-1/2"
            trackClassName="gap-6 py-2 lg:mx-0 lg:px-0"
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
        </Reveal>
      </Container>
    </section>
  );
}
