"use client";

import Image from "next/image";
import { X, Maximize, Wind, Wifi, Users, Ruler, BedDouble, Eye, ShowerHead } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { RoomCategoryDetail } from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

interface RoomDetailsModalProps {
  room: RoomCategoryDetail | null;
  onClose: () => void;
}

export function RoomDetailsModal({ room, onClose }: RoomDetailsModalProps) {
  const t = useT();
  const { locale } = useLocale();
  if (!room) return null;

  const facts: { icon: typeof Ruler; label: string; value: string }[] = [
    { icon: Ruler, label: t("booking.roomSize"), value: tx(room.sizeLabel, locale) },
    { icon: Users, label: t("booking.maxOccupancy"), value: t("booking.persons", { count: room.maxOccupancy }) },
    { icon: BedDouble, label: t("booking.beds"), value: tx(room.bedConfiguration, locale) },
    { icon: Eye, label: t("booking.view"), value: tx(room.view, locale) },
    { icon: ShowerHead, label: t("booking.bath"), value: tx(room.bathroom, locale) },
    {
      icon: Wind,
      label: t("booking.ac"),
      value: room.airConditioning ? t("booking.present") : t("booking.notPresent"),
    },
  ];

  return (
    <Modal open={Boolean(room)} onClose={onClose} ariaLabelledBy="room-details-title" className="sm:max-w-2xl">
      <div className="flex items-center justify-between border-b border-line p-4">
        <h2 id="room-details-title" className="text-base font-bold text-ink">
          {tx(room.name, locale)}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("offer.close")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-y-auto p-4">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {room.images.map((src, i) => (
            <div key={i} className="relative h-40 w-56 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={src}
                alt={t("booking.imageN", { name: room.name, n: i + 1 })}
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-body">{tx(room.description, locale)}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-surface p-3">
              <dt className="flex items-center gap-1.5 text-[11px] text-muted">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <p className="text-xs font-semibold text-muted">{t("booking.amenities")}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {room.balcony && (
              <li className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-body">
                <Maximize className="h-3 w-3" aria-hidden="true" /> {t("booking.balcony")}
              </li>
            )}
            {room.wifi && (
              <li className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-body">
                <Wifi className="h-3 w-3" aria-hidden="true" /> {t("booking.wifi")}
              </li>
            )}
            {room.amenities.map((amenity) => (
              <li key={amenity} className="inline-flex items-center rounded-full border border-line px-3 py-1 text-xs text-body">
                {tx(amenity, locale)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
