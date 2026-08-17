"use client";

import Image from "next/image";
import { Check, ChevronRight, Grid2x2, Info, Maximize, Users } from "lucide-react";
import type { RoomCategoryDetail } from "@/types";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { tx } from "@/i18n/content";

interface RoomCategoryCardProps {
  room: RoomCategoryDetail;
  selected: boolean;
  unavailable: boolean;
  unavailableReason?: string;
  pricePerPerson: number;
  pricePerRoom: number;
  onSelect: () => void;
  onShowDetails: () => void;
}

export function RoomCategoryCard({
  room,
  selected,
  unavailable,
  unavailableReason,
  pricePerPerson,
  pricePerRoom,
  onSelect,
  onShowDetails,
}: RoomCategoryCardProps) {
  const t = useT();
  const { locale } = useLocale();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 });

  return (
    <div
      data-carousel-item
      className={cn(
        "relative flex shrink-0 snap-start overflow-hidden rounded-xl border bg-white transition",
        "w-[92%] min-w-[18rem] flex-row sm:w-[24rem] lg:w-auto lg:min-w-0 lg:flex-col",
        selected ? "border-brand-500 shadow-sm ring-1 ring-brand-500" : "border-line",
        unavailable && "opacity-60"
      )}
    >
      <button
        type="button"
        onClick={unavailable ? undefined : onSelect}
        disabled={unavailable}
        aria-pressed={selected}
        className="relative h-[5.75rem] w-[6.5rem] shrink-0 disabled:cursor-not-allowed sm:h-[6.5rem] sm:w-[7.25rem] lg:h-36 lg:w-full lg:self-auto"
      >
        <Image
          src={room.images[0]}
          alt={tx(room.name, locale)}
          fill
          sizes="(min-width: 1024px) 240px, 128px"
          className={cn("object-cover", unavailable && "grayscale")}
        />
        {selected && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm lg:h-7 lg:w-7">
            <Check className="h-3.5 w-3.5 lg:h-4 lg:w-4" aria-hidden="true" strokeWidth={2.6} />
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 p-2.5 sm:p-3 lg:gap-1.5 lg:p-3.5">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold leading-snug text-ink">{tx(room.name, locale)}</h4>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted lg:text-xs">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {tx(room.occupancyLabel, locale)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5" aria-hidden="true" />
              {tx(room.sizeLabel, locale)}
            </span>
          </p>
          {room.badge && !unavailable && (
            <span className="mt-1 inline-flex w-fit items-center rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success lg:text-[11px]">
              {tx(room.badge, locale)}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          {unavailable ? (
            <div className="min-w-0">
              <p className="text-sm font-bold text-danger">{t("booking.unavailable")}</p>
              {unavailableReason && <p className="mt-0.5 text-[11px] text-muted">{unavailableReason}</p>}
            </div>
          ) : (
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight text-ink">
                {t("booking.ppAmount", { price: priceFormatter.format(Math.round(pricePerPerson)) })}
              </p>
              <p className="text-[11px] text-muted">
                {t("booking.gesamtpreisLine", { price: priceFormatter.format(Math.round(pricePerRoom)) })}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onShowDetails}
            aria-label={t("booking.roomDetailsNamed", { name: tx(room.name, locale) })}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-muted transition hover:border-brand-400 hover:text-brand-500"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ShowAllRoomsCardProps {
  onClick: () => void;
  layout?: "tile" | "row";
}

/** The trailing "Weitere Zimmer anzeigen" control — clearing the room-category filter shows offers from every category again. */
export function ShowAllRoomsCard({ onClick, layout = "tile" }: ShowAllRoomsCardProps) {
  const t = useT();

  if (layout === "row") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 text-left transition hover:border-brand-400 hover:bg-brand-50"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <Grid2x2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">{t("booking.showMoreRooms")}</span>
          <span className="block text-xs text-muted">{t("booking.allRooms")}</span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      data-carousel-item
      onClick={onClick}
      className="flex w-[38%] min-w-[150px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-white p-6 text-center transition hover:border-brand-400 hover:bg-brand-50 sm:w-[240px] lg:w-auto"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Grid2x2 className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold text-ink">{t("booking.showMoreRooms")}</span>
      <span className="text-xs text-muted">{t("booking.allRooms")}</span>
    </button>
  );
}
