"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

interface OfferGalleryProps {
  images: string[];
  alt: string;
  discountPercent: number;
  totalPhotoCount: number;
}

const SWIPE_THRESHOLD_PX = 40;

/**
 * Desktop: mosaic with prev/next on the main image — browse in place.
 * Mobile: compact Booking-style crop, swipe-only (no tap / lightbox).
 */
export function OfferGallery({ images, alt, discountPercent, totalPhotoCount }: OfferGalleryProps) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const desktopMainRef = useRef<HTMLDivElement>(null);

  const photoCount = images.length;
  const displayTotal = Math.max(photoCount, totalPhotoCount);

  const goTo = useCallback(
    (next: number) => {
      if (photoCount < 1) return;
      setIndex(((next % photoCount) + photoCount) % photoCount);
    },
    [photoCount]
  );

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      goTo(delta > 0 ? index - 1 : index + 1);
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const node = desktopMainRef.current;
    if (!node || photoCount < 2) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [goTo, index, photoCount]);

  const mainSrc = images[index] ?? images[0];
  const thumbnails = images.slice(0, 4);
  const activeThumb = index < 4 ? index : -1;

  return (
    <>
      {/* Mobile — compact crop; swipe or arrow buttons only (no tap-to-enlarge) */}
      <div
        className="relative -mx-4 h-[220px] w-[calc(100%+2rem)] touch-pan-y overflow-hidden bg-surface font-sans sm:-mx-6 sm:h-[240px] sm:w-[calc(100%+3rem)] lg:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="group"
        aria-roledescription={t("offer.gallery")}
        aria-label={t("offer.imagesOf", { name: alt })}
      >
        {images.map((src, i) => (
          <div
            key={src}
            aria-hidden={i !== index}
            className={cn("absolute inset-0 select-none", i === index ? "opacity-100" : "pointer-events-none opacity-0")}
          >
            <Image
              src={src}
              alt={`${alt} – ${t("offer.imageNof", { n: i + 1, total: displayTotal })}`}
              fill
              sizes="100vw"
              priority={i === 0}
              draggable={false}
              className="pointer-events-none object-cover"
            />
          </div>
        ))}

        {discountPercent > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-3 py-1 font-sans text-[14px] font-extrabold tracking-tight text-success shadow-sm">
            {t("deal.upToDiscount", { percent: discountPercent })}
          </span>
        )}

        {photoCount > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo(index - 1);
              }}
              aria-label={t("offer.prevImage")}
              className="absolute left-1.5 top-1/2 z-20 flex h-14 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-white/70 text-ink shadow-sm backdrop-blur-[2px] transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500"
            >
              <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo(index + 1);
              }}
              aria-label={t("offer.nextImage")}
              className="absolute right-1.5 top-1/2 z-20 flex h-14 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-white/70 text-ink shadow-sm backdrop-blur-[2px] transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500"
            >
              <ChevronRight className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
            </button>
          </>
        )}

        <span className="absolute bottom-2.5 right-2.5 z-20 rounded-sm bg-black/45 px-2 py-0.75 font-sans text-[12px] font-medium tabular-nums leading-none text-white">
          {index + 1}/{photoCount}
        </span>
      </div>

      {/* Desktop — mosaic; arrows browse all photos in place */}
      <div
        className="hidden overflow-hidden rounded-[1.25rem] lg:grid lg:h-[420px] lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:gap-2 xl:h-[480px]"
        role="group"
        aria-label={t("offer.imagesOf", { name: alt })}
      >
        <div
          ref={desktopMainRef}
          tabIndex={0}
          className="relative overflow-hidden bg-surface outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
        >
          <Image
            src={mainSrc}
            alt={`${alt} – ${t("offer.mainImage")}`}
            fill
            sizes="(min-width: 1280px) 55vw, 60vw"
            priority
            className="object-cover transition-opacity duration-200"
          />
          {discountPercent > 0 && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-[15px] font-extrabold tracking-tight text-success shadow-sm">
              {t("deal.upToDiscount", { percent: discountPercent })}
            </span>
          )}
          {photoCount > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label={t("offer.prevImage")}
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_4px_16px_rgba(15,26,43,0.22)] transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label={t("offer.nextImage")}
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_4px_16px_rgba(15,26,43,0.22)] transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
              </button>
            </>
          )}
          <span className="absolute bottom-4 left-4 z-10 rounded-full bg-white px-3 py-1.5 text-sm font-semibold tabular-nums text-ink shadow-md">
            {index + 1}/{photoCount}
          </span>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {thumbnails.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("offer.imageNof", { n: i + 1, total: photoCount })}
              aria-pressed={activeThumb === i}
              className={cn(
                "relative overflow-hidden bg-surface transition",
                activeThumb === i ? "ring-2 ring-inset ring-brand-500" : "hover:opacity-95"
              )}
            >
              <Image
                src={src}
                alt={`${alt} – ${t("offer.imageNof", { n: i + 1, total: photoCount })}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
