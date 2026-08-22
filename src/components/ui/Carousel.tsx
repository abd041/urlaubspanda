"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

export type CarouselControls = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
};

interface CarouselProps {
  children: ReactNode[];
  ariaLabel: string;
  /** Used to approximate a sensible number of pagination dots. */
  itemsPerPageDesktop?: number;
  showDots?: boolean;
  /** Overlay prev/next on the track. Default true. Set false when arrows live in a header. */
  overlayArrows?: boolean;
  /** Show overlay arrows on small screens too (homepage keeps desktop-only arrows). */
  overlayArrowsOnMobile?: boolean;
  /** Extra classes for overlay prev/next buttons. */
  overlayArrowClassName?: string;
  /** Inline styles for overlay arrows (e.g. measured vertical center). */
  overlayArrowStyle?: CSSProperties;
  overlayPrevClassName?: string;
  overlayNextClassName?: string;
  /** Keep both overlay arrows visible even at the start/end of the track. */
  alwaysShowOverlayArrows?: boolean;
  /** Optional heading/toolbar rendered above the track, with scroll controls. */
  header?: (controls: CarouselControls) => ReactNode;
  trackClassName?: string;
  className?: string;
}

/**
 * Lightweight, dependency-free horizontal carousel built on native CSS
 * scroll-snap. Edge padding keeps first/last cards fully visible (no clipped
 * borders/rings) while remaining swipeable on mobile.
 */
export function Carousel({
  children,
  ariaLabel,
  itemsPerPageDesktop = 5,
  showDots = true,
  overlayArrows = true,
  overlayArrowsOnMobile = false,
  overlayArrowClassName,
  overlayArrowStyle,
  overlayPrevClassName,
  overlayNextClassName,
  alwaysShowOverlayArrows = false,
  header,
  trackClassName,
  className,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const t = useT();

  const dotCount = Math.max(children.length - itemsPerPageDesktop + 1, 1);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < maxScroll - 8);
    if (maxScroll > 0) {
      setActiveDot(Math.round((el.scrollLeft / maxScroll) * (dotCount - 1)));
    } else {
      setActiveDot(0);
    }
  }, [dotCount]);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByDirection = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstItem = el.querySelector<HTMLElement>("[data-carousel-item]");
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 16;
    const amount = firstItem
      ? firstItem.getBoundingClientRect().width + gap
      : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const scrollPrev = () => scrollByDirection(-1);
  const scrollNext = () => scrollByDirection(1);

  const scrollToDot = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const denom = dotCount - 1 || 1;
    el.scrollTo({ left: (index / denom) * maxScroll, behavior: "smooth" });
  };

  const controls: CarouselControls = {
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
  };

  return (
    <div data-carousel-root className={cn("relative min-w-0", className)}>
      {header?.(controls)}

      <div
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          // Equal edge insets + vertical room so borders/rings are never clipped.
          "no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth",
          "px-0.5 py-2.5 scroll-px-0.5",
          trackClassName
        )}
      >
        {children}
      </div>

      {overlayArrows && (alwaysShowOverlayArrows || canScrollPrev) && (
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label={t("carousel.prev")}
          style={overlayArrowStyle}
          className={cn(
            "absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-[0_8px_24px_rgba(15,26,43,0.10)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-35",
            overlayArrowsOnMobile ? "flex" : "hidden lg:flex",
            overlayArrowClassName,
            overlayPrevClassName
          )}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
      {overlayArrows && (alwaysShowOverlayArrows || canScrollNext) && (
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label={t("carousel.next")}
          style={overlayArrowStyle}
          className={cn(
            "absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-[0_8px_24px_rgba(15,26,43,0.10)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-35",
            overlayArrowsOnMobile ? "flex" : "hidden lg:flex",
            overlayArrowClassName,
            overlayNextClassName
          )}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      {showDots && dotCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToDot(i)}
              aria-label={`Zu Position ${i + 1} springen`}
              aria-current={i === activeDot}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === activeDot ? "w-5 bg-brand-500" : "w-1.5 bg-line"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
