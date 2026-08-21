"use client";

import Image from "next/image";
import { Check, Info, Maximize, Users } from "lucide-react";
import type { KeyboardEvent } from "react";
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

/**
 * Whole card is the hit target (except the details button).
 * Selected border uses box-shadow so it is never clipped (req 14 + 18).
 */
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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (unavailable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={unavailable ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={unavailable || undefined}
      onClick={unavailable ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/room relative flex w-full min-w-0 flex-col rounded-2xl bg-white transition duration-150",
        unavailable ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        selected
          ? "border-2 border-brand-500 shadow-[0_0_0_2px_rgba(27,99,235,0.2),0_8px_24px_rgba(27,99,235,0.16)]"
          : "border border-line shadow-sm hover:border-brand-400 hover:shadow-[0_12px_28px_rgba(15,26,43,0.1)] lg:hover:-translate-y-0.5",
        !unavailable && "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      )}
    >
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-t-[0.9rem] sm:h-44 lg:h-48">
        <Image
          src={room.images[0]}
          alt={tx(room.name, locale)}
          fill
          sizes="(min-width: 1280px) 420px, (min-width: 1024px) 360px, 100vw"
          className={cn(
            "object-cover transition duration-200",
            unavailable && "grayscale",
            !unavailable && "lg:group-hover/room:scale-[1.02]"
          )}
        />
        {selected && (
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white shadow-md">
            <Check className="h-4 w-4" aria-hidden="true" strokeWidth={2.6} />
          </span>
        )}
        {room.badge && !unavailable && (
          <span className="absolute left-3 top-3 inline-flex max-w-[85%] truncate rounded-md bg-success/95 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
            {tx(room.badge, locale)}
          </span>
        )}
      </div>

      <div className="flex min-h-44 flex-1 flex-col gap-3 p-4 sm:p-5 lg:min-h-50">
        <div className="min-w-0">
          <h4 className="text-base font-bold leading-snug text-ink lg:text-lg">{tx(room.name, locale)}</h4>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-body sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0 text-ink" aria-hidden="true" />
              {tx(room.occupancyLabel, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="h-3.5 w-3.5 shrink-0 text-ink" aria-hidden="true" />
              {tx(room.sizeLabel, locale)}
            </span>
          </p>
          <div className="mt-3 space-y-1.5 border-t border-[rgba(15,23,42,0.06)] pt-3">
            {room.view && (
              <p className="text-xs leading-snug text-body sm:text-[13px]">{tx(room.view, locale)}</p>
            )}
            {room.amenities.slice(0, 3).length > 0 && (
              <p className="text-xs leading-snug text-muted sm:text-[13px]">
                {room.amenities.slice(0, 3).map((item) => tx(item, locale)).join(" · ")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[rgba(15,23,42,0.06)] pt-3">
          {unavailable ? (
            <div className="min-w-0">
              <p className="text-sm font-bold text-danger">{t("booking.unavailable")}</p>
              {unavailableReason && <p className="mt-0.5 text-xs text-muted">{unavailableReason}</p>}
            </div>
          ) : (
            <div className="min-w-0">
              <p className="text-base font-extrabold leading-tight text-ink lg:text-lg">
                {t("booking.ppAmount", { price: priceFormatter.format(Math.round(pricePerPerson)) })}
              </p>
              <p className="mt-0.5 text-xs text-muted sm:text-[13px]">
                {t("booking.gesamtpreisLine", { price: priceFormatter.format(Math.round(pricePerRoom)) })}
              </p>
              <p
                className={cn(
                  "mt-2 text-xs font-semibold sm:text-sm",
                  selected ? "text-brand-600" : "text-brand-500 group-hover/room:text-brand-600"
                )}
              >
                {selected ? t("booking.roomSelected") : t("booking.selectRoom")}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onShowDetails();
            }}
            aria-label={t("booking.roomDetailsNamed", { name: tx(room.name, locale) })}
            className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
