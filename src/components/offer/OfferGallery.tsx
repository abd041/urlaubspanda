"use client";

import { useRef, useState } from "react";
import type { TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryLightbox } from "@/components/offer/GalleryLightbox";
import { useT } from "@/i18n/LocaleProvider";

interface OfferGalleryProps {
  images: string[];
  alt: string;
  discountPercent: number;
  totalPhotoCount: number;
}

const SWIPE_THRESHOLD_PX = 40;

/**
 * urlaubshamster-style gallery:
 * Mobile slider · Desktop large left image + 2×2 thumbs, “Alle X Fotos” CTA.
 */
export function OfferGallery({ images, alt, discountPercent, totalPhotoCount }: OfferGalleryProps) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = (next: number) => {
    const total = images.length;
    setIndex(((next % total) + total) % total);
  };

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

  const openLightboxAt = (i: number) => {
    setIndex(i);
    setLightboxOpen(true);
  };

  const mainSrc = images[index] ?? images[0];
  const thumbnails = images.slice(0, 4);
  const activeThumb = index < 4 ? index : 0;

  return (
    <>
      {/* Mobile */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-surface lg:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="group"
        aria-roledescription={t("offer.gallery")}
        aria-label={t("offer.imagesOf", { name: alt })}
      >
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => openLightboxAt(i)}
            aria-label={t("offer.enlarge", { n: i + 1, total: totalPhotoCount })}
            className={cn(
              "absolute inset-0",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <Image
              src={src}
              alt={`${alt} – ${t("offer.imageNof", { n: i + 1, total: totalPhotoCount })}`}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
          </button>
        ))}

        {discountPercent > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-3 py-1 text-[15px] font-extrabold tracking-tight text-danger shadow-sm">
            −{discountPercent}%
          </span>
        )}

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label={t("offer.prevImage")}
          className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label={t("offer.nextImage")}
          className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => openLightboxAt(index)}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-md"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          {t("offer.allPhotos", { count: totalPhotoCount })}
        </button>
      </div>

      {/* Desktop — mosaic: large left (~65%) + 2×2 right, clipped outer radius */}
      <div
        className="hidden overflow-hidden rounded-[1.25rem] lg:grid lg:h-[420px] lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:gap-2 xl:h-[480px]"
        role="group"
        aria-label={t("offer.imagesOf", { name: alt })}
      >
        <button
          type="button"
          onClick={() => openLightboxAt(index)}
          aria-label={t("offer.allPhotos", { count: totalPhotoCount })}
          className="relative overflow-hidden bg-surface"
        >
          <Image
            src={mainSrc}
            alt={`${alt} – ${t("offer.mainImage")}`}
            fill
            sizes="(min-width: 1280px) 55vw, 60vw"
            priority
            className="object-cover"
          />
          {discountPercent > 0 && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-[15px] font-extrabold tracking-tight text-danger shadow-sm">
              −{discountPercent}%
            </span>
          )}
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2.5 text-sm font-semibold text-ink shadow-md">
            <Expand className="h-3.5 w-3.5" aria-hidden="true" />
            {t("offer.allPhotos", { count: totalPhotoCount })}
          </span>
        </button>

        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {thumbnails.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              onDoubleClick={() => openLightboxAt(i)}
              aria-label={t("offer.imageNof", { n: i + 1, total: totalPhotoCount })}
              aria-pressed={activeThumb === i}
              className={cn(
                "relative overflow-hidden bg-surface transition",
                activeThumb === i ? "ring-2 ring-inset ring-brand-500" : "hover:opacity-95"
              )}
            >
              <Image
                src={src}
                alt={`${alt} – ${t("offer.imageNof", { n: i + 1, total: totalPhotoCount })}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <GalleryLightbox
          images={images}
          alt={alt}
          index={index}
          totalPhotoCount={totalPhotoCount}
          onIndexChange={setIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
