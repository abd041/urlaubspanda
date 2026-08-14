"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Deal } from "@/types";
import { DealGrid } from "@/components/home/DealGrid";
import { useWishlist } from "@/hooks/useWishlist";
import { useT } from "@/i18n/LocaleProvider";

export function WishlistView({ deals }: { deals: Deal[] }) {
  const { ids, ready, count, clear } = useWishlist();
  const savedDeals = deals.filter((deal) => ids.includes(deal.id));
  const t = useT();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-16 text-center">
        <p className="text-sm text-body">{t("wishlist.loading")}</p>
      </div>
    );
  }

  if (savedDeals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-16 text-center">
        <Heart className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
        <p className="mt-4 text-base font-semibold text-ink">{t("wishlist.emptyTitle")}</p>
        <p className="mt-1.5 text-sm text-body">{t("wishlist.emptyText")}</p>
        <Link
          href="/angebote"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {t("wishlist.discover")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-body">
          {count === 1 ? t("wishlist.countOne") : t("wishlist.countMany", { count })}
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-sm font-semibold text-body underline-offset-2 transition hover:text-ink hover:underline"
        >
          {t("wishlist.clear")}
        </button>
      </div>
      <DealGrid
        deals={savedDeals}
        emptyTitle={t("wishlist.emptyTitle")}
        emptyDescription={t("wishlist.emptyText")}
      />
    </div>
  );
}
