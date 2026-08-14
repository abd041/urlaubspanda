"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

interface GalleryLightboxProps {
  images: string[];
  alt: string;
  index: number;
  totalPhotoCount: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_THRESHOLD_PX = 40;

/**
 * Full-screen dark gallery viewer opened from "Alle X Bilder ansehen" / any
 * gallery thumbnail. Cycles through the same mock `images` array while the
 * counter shows the (larger) virtual `totalPhotoCount`, matching the
 * approved mockup's "1 / 45" style counter.
 */
export function GalleryLightbox({
  images,
  alt,
  index,
  totalPhotoCount,
  onIndexChange,
  onClose,
}: GalleryLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const t = useT();

  const goTo = (next: number) => {
    const total = images.length;
    onIndexChange(((next % total) + total) % total);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${t("offer.gallery")} – ${alt}`}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95"
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > SWIPE_THRESHOLD_PX) goTo(delta > 0 ? index - 1 : index + 1);
        touchStartX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 text-white sm:px-6">
        <span className="text-sm font-medium text-white/80">
          {index + 1} / {totalPhotoCount}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("offer.closeGallery")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} – ${t("offer.imageNof", { n: i + 1, total: totalPhotoCount })}`}
            fill
            sizes="100vw"
            className={
              i === index
                ? "object-contain opacity-100"
                : "pointer-events-none object-contain opacity-0"
            }
          />
        ))}

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label={t("offer.prevImage")}
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:left-4"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label={t("offer.nextImage")}
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:right-4"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
