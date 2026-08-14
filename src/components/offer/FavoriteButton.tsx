"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { useT } from "@/i18n/LocaleProvider";

/** "Merken" heart toggle — shares state with `/merkliste`. */
export function FavoriteButton({
  dealId,
  className,
  alwaysShowLabel = false,
  iconOnly = false,
}: {
  dealId: string;
  className?: string;
  alwaysShowLabel?: boolean;
  iconOnly?: boolean;
}) {
  const { isFavorite, toggle, ready } = useWishlist();
  const favorite = ready && isFavorite(dealId);
  const t = useT();

  return (
    <button
      type="button"
      onClick={() => toggle(dealId)}
      aria-pressed={favorite}
      aria-label={favorite ? t("wishlist.remove") : t("wishlist.add")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
        className
      )}
    >
      <Heart
        className={cn("h-4 w-4", favorite && "fill-danger text-danger")}
        aria-hidden="true"
      />
      {!iconOnly && (
        <span className={cn(!alwaysShowLabel && "hidden sm:inline")}>
          {favorite ? t("wishlist.saved") : t("wishlist.save")}
        </span>
      )}
    </button>
  );
}
