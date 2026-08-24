"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import type { Deal, OfferDetail } from "@/types";
import { formatEuro } from "@/lib/utils";
import { hasInternalBooking } from "@/lib/bookingRoute";
import { OfferCtaButton } from "@/components/offer/OfferCtaButton";
import { FreeCancellationBadge } from "@/components/booking/FreeCancellationBadge";
import { useOfferCountdown } from "@/components/offer/useOfferCountdown";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";
import { hasFreeCancellation } from "@/lib/freeCancellation";

/**
 * Mobile price + booking block directly under photos (req 11).
 * Optional countdown / important notice; top sticky CTA after scroll.
 */
export function MobilePriceSection({ deal, detail }: { deal: Deal; detail: OfferDetail }) {
  const t = useT();
  const { locale } = useLocale();
  const countdown = useOfferCountdown(detail.countdownEndsAt);
  const savings = Math.max(deal.oldPrice - deal.currentPrice, 0);
  const loveItems = detail.highlights;
  const includeItems = detail.inclusions;

  return (
    <div className="lg:hidden">
      <div id="mobile-cta-anchor" className="space-y-3">
        {/* 1. Optional countdown — only when configured & still active */}
        {countdown && (
          <div className="rounded-xl bg-danger px-3.5 py-2.5 text-center text-[13px] font-bold tracking-wide text-white shadow-sm">
            {t("offer.limitedOffer", { time: countdown })}
          </div>
        )}

        {/* 2. Optional important-notice box — only when set on the deal */}
        {detail.importantNotice && (
          <div className="rounded-xl border border-cal/40 bg-[#FFF8E8] px-3.5 py-2.5 text-center text-sm font-medium leading-snug text-ink">
            {tx(detail.importantNotice, locale)}
          </div>
        )}

        {/* Price card: savings → old → current */}
        <div className="rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,26,43,0.06)]">
          {savings > 0 && (
            <p className="mx-auto w-fit rounded-full bg-[#E8F6EE] px-3 py-1 text-[13px] font-semibold text-success">
              {t("deal.youSave", { amount: formatEuro(savings, locale) })}
              {deal.discountPercent > 0 ? ` (−${deal.discountPercent}%)` : ""}
            </p>
          )}

          {deal.oldPrice > deal.currentPrice && (
            <p className="mt-3 text-center text-[15px] font-semibold text-danger line-through">
              {formatEuro(deal.oldPrice, locale)}
            </p>
          )}

          <p className="mt-1.5 flex flex-wrap items-baseline justify-center gap-x-1.5">
            <span className="text-[13px] text-muted">{t("deal.from")}</span>
            <span className="text-[1.35rem] font-extrabold leading-none tracking-tight text-ink">
              {formatEuro(deal.currentPrice, locale)}
            </span>
            <span className="text-[12px] text-muted">{t("deal.perPerson")}</span>
          </p>

          {hasFreeCancellation() && (
            <div className="mt-3 flex justify-center">
              <FreeCancellationBadge variant="inline" size="sm" />
            </div>
          )}
        </div>

        {/* Booking button */}
        <OfferCtaButton
          slug={deal.slug}
          ctaMode={detail.ctaMode}
          bookingUrl={detail.bookingUrl}
          bookingUrls={detail.bookingUrls}
          ctaOptions={detail.ctaOptions}
          className="h-14 text-[15px]"
        />

        <p className="text-center text-xs leading-relaxed text-muted">
          {hasInternalBooking(deal.slug) ? t("offer.ctaHint") : t("offer.affiliateHint")}
        </p>

        <a
          href="#was-wir-lieben"
          onClick={(event) => {
            event.preventDefault();
            const el = document.getElementById("was-wir-lieben");
            if (!el) return;
            const header = document.querySelector("header");
            const sticky = document.querySelector("[data-mobile-sticky-cta]");
            const headerOffset =
              (header?.getBoundingClientRect().height ?? 72) +
              (sticky?.getBoundingClientRect().height ?? 0) +
              8;
            const top = window.scrollY + el.getBoundingClientRect().top - headerOffset;
            window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "smooth" });
          }}
          className="flex items-center justify-center gap-1 text-center text-sm font-medium text-brand-500 transition hover:text-brand-600"
        >
          {t("offer.moreInfo")}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      {/* Bullets: What we love + What’s included */}
      {(loveItems.length > 0 || includeItems.length > 0) && (
        <div id="was-wir-lieben" className="mt-6 scroll-mt-28 space-y-5">
          {loveItems.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-ink">{t("offer.whatWeLove")}</h3>
              <ul className="mt-2.5 space-y-2">
                {loveItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] leading-snug text-ink">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                    <span>{tx(item, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {includeItems.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-ink">{t("offer.included")}</h3>
              <ul className="mt-2.5 space-y-2">
                {includeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] leading-snug text-ink">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E8F6EE] text-success">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span>{tx(item, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Top sticky booking bar — only after scrolling past the in-flow CTA. */
export function MobileStickyCta({ deal, detail }: { deal: Deal; detail: OfferDetail }) {
  const t = useT();
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const target = document.getElementById("mobile-cta-anchor");
    if (!target) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    );
    observerRef.current.observe(target);
    return () => observerRef.current?.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      data-mobile-sticky-cta
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white/95 px-4 py-2.5 shadow-[0_8px_24px_rgba(15,26,43,0.1)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-ink">{deal.name}</p>
          <p className="text-sm font-extrabold text-ink">
            {t("deal.from")} {formatEuro(deal.currentPrice, locale)}
            <span className="ml-1 text-[11px] font-medium text-muted">{t("deal.perPerson")}</span>
          </p>
        </div>
        <OfferCtaButton
          slug={deal.slug}
          ctaMode={detail.ctaMode}
          bookingUrl={detail.bookingUrl}
          bookingUrls={detail.bookingUrls}
          ctaOptions={detail.ctaOptions}
          className="h-11 w-auto shrink-0 px-4 text-sm"
        />
      </div>
    </div>
  );
}
