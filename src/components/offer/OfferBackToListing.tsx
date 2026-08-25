"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";
import { peekListingRestorePending } from "@/lib/listingScrollRestore";
import { Container } from "@/components/layout/Container";

/**
 * Returns to the previous offer listing (same scroll/filters) when the customer
 * opened this deal from a listing; otherwise falls back to the country/list href.
 */
export function OfferBackToListing({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();
  const t = useT();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (peekListingRestorePending()) {
      event.preventDefault();
      router.back();
    }
  }

  return (
    <Container className="pt-3 sm:pt-4">
      <Link
        href={fallbackHref}
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 transition hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        {t("booking.backToOfferList")}
      </Link>
    </Container>
  );
}
