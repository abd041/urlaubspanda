"use client";

import { useEffect, useRef, useState } from "react";
import { destinationsInDisplayOrder } from "@/data/destinations";
import { Container } from "@/components/layout/Container";
import { Carousel } from "@/components/ui/Carousel";
import { DestinationCard } from "@/components/home/DestinationCard";
import { useT } from "@/i18n/LocaleProvider";

const orderedDestinations = destinationsInDisplayOrder();

export function PopularDestinations() {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const [arrowTopPx, setArrowTopPx] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const carousel = root.querySelector<HTMLElement>("[data-carousel-root]");
      const image = root.querySelector<HTMLElement>("[data-carousel-item] > span:first-child");
      if (!carousel || !image) return;
      const carouselBox = carousel.getBoundingClientRect();
      const imageBox = image.getBoundingClientRect();
      // Midpoint of the photo, relative to the arrow positioning context.
      setArrowTopPx(imageBox.top - carouselBox.top + imageBox.height / 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    const image = root.querySelector<HTMLElement>("[data-carousel-item] > span:first-child");
    if (image) ro.observe(image);
    window.addEventListener("resize", measure);
    const t1 = window.setTimeout(measure, 100);
    const t2 = window.setTimeout(measure, 400);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const arrowTopClass =
    arrowTopPx == null ? "top-[6rem]" : undefined;

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

      <div ref={rootRef} className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Carousel
          className="min-w-0"
          ariaLabel={t("home.popularTitle")}
          itemsPerPageDesktop={5}
          showDots={false}
          overlayArrows
          overlayArrowsOnMobile
          alwaysShowOverlayArrows
          overlayArrowClassName={`${arrowTopClass ?? ""} -translate-y-1/2 h-11 w-11 border border-white/70 bg-white/90 text-ink shadow-[0_10px_30px_rgba(15,26,43,0.16),0_2px_6px_rgba(15,26,43,0.06)] backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.06] hover:border-white hover:bg-white hover:text-brand-500 hover:shadow-[0_14px_36px_rgba(15,26,43,0.2),0_4px_10px_rgba(15,26,43,0.08)] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100 disabled:hover:text-ink [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem] [&_svg]:stroke-[1.75]`}
          overlayArrowStyle={arrowTopPx != null ? { top: arrowTopPx } : undefined}
          overlayPrevClassName="left-1.5 lg:-left-1"
          overlayNextClassName="right-1.5 lg:-right-1"
          trackClassName="gap-3 px-0 py-2 sm:gap-4 lg:gap-5"
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
