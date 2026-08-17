"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { useT } from "@/i18n/LocaleProvider";

interface DealImageSliderProps {
  images: string[];
  alt: string;
  discountPercent: number;
  provider: string;
  /** Deal id used to persist the heart toggle in the shared Merkliste. */
  dealId: string;
  priority?: boolean;
}

const SWIPE_THRESHOLD_PX = 40;

export function DealImageSlider({
  images,
  alt,
  discountPercent,
  provider,
  dealId,
  priority = false,
}: DealImageSliderProps) {
  const [index, setIndex] = useState(0);
  const { isFavorite, toggle, ready } = useWishlist();
  const favorite = ready && isFavorite(dealId);
  const t = useT();
  const touchStartX = useRef<number | null>(null);

  const goTo = (next: number) => {
    const total = images.length;
    setIndex(((next % total) + total) % total);
  };

  const handlePrev = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    goTo(index - 1);
  };

  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    goTo(index + 1);
  };

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(dealId);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      goTo(delta > 0 ? index - 1 : index + 1);
    }
    touchStartX.current = null;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  };

  return (
    <div
      className="group relative aspect-4/3 w-full overflow-hidden bg-surface"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-roledescription={t("offer.gallery")}
      aria-label={t("offer.imagesOf", { name: alt })}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} – ${t("offer.imageNof", { n: i + 1, total: images.length })}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority && i === 0}
          className={cn(
            "object-cover transition-[opacity,transform] duration-700 ease-out group-hover/card:scale-[1.04]",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        />
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />

      {discountPercent > 0 && (
        <span className="absolute left-3 top-3 z-20 rounded-full bg-white px-3 py-1 text-[15px] font-extrabold tracking-tight text-danger shadow-sm">
          −{discountPercent}%
        </span>
      )}

      <button
        type="button"
        onClick={handleFavoriteClick}
        aria-label={favorite ? t("wishlist.remove") : t("wishlist.add")}
        aria-pressed={favorite}
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-[0_1px_4px_rgba(15,23,42,0.10)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <Heart
          className={cn("h-4 w-4", favorite && "fill-danger text-danger")}
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label={t("offer.prevImage")}
            className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 sm:h-9 sm:w-9 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label={t("offer.nextImage")}
            className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 sm:h-9 sm:w-9 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium tabular-nums text-white">
            {index + 1} / {images.length}
          </span>
        </>
      )}

      <span className="absolute bottom-3 left-3 z-20 rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white">
        {provider}
      </span>
    </div>
  );
}
