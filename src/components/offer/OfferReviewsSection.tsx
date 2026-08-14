"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ChevronDown, Star } from "lucide-react";
import type { Deal, OfferDetail } from "@/types";
import { cn } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";

type ReviewFilter = "alle" | "top" | "kritisch";
type ReviewSort = "neueste" | "beste";

type CommunityReview = {
  id: string;
  name: string;
  report: string;
  trip?: string;
  ratings: Record<string, number>;
  overall: number;
  createdAt: string;
};

const FILTERS: { id: ReviewFilter; labelKey: string }[] = [
  { id: "alle", labelKey: "offer.reviewsAll" },
  { id: "top", labelKey: "offer.reviewsTopPlus" },
  { id: "kritisch", labelKey: "offer.reviewsCritical" },
];

const SORT_OPTIONS: { id: ReviewSort; labelKey: string }[] = [
  { id: "neueste", labelKey: "offer.newest" },
  { id: "beste", labelKey: "offer.best" },
];

const RATING_CATEGORIES = [
  "Gesamteindruck",
  "Hotel & Zimmer",
  "Preis / Leistung",
  "Kulinarik",
] as const;

const RATING_CATEGORY_KEYS: Record<(typeof RATING_CATEGORIES)[number], string> = {
  Gesamteindruck: "offer.overall",
  "Hotel & Zimmer": "offer.hotelRoom",
  "Preis / Leistung": "offer.priceValue",
  Kulinarik: "offer.dining",
};

function storageKey(dealId: string) {
  return `urlaubspanda-reviews:${dealId}`;
}

function readReviews(dealId: string): CommunityReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(dealId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CommunityReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReviews(dealId: string, reviews: CommunityReview[]) {
  window.localStorage.setItem(storageKey(dealId), JSON.stringify(reviews));
}

function scoreLabel(score: number, max: number, t: ReturnType<typeof useT>): string {
  const ratio = score / max;
  if (ratio >= 0.9) return t("offer.scoreExcellent");
  if (ratio >= 0.8) return t("offer.scoreOutstanding");
  if (ratio >= 0.7) return t("offer.scoreVeryGood");
  return t("offer.scoreGood");
}

/**
 * Bewertungen — HolidayCheck/Tripadvisor score first, then community.
 */
export function OfferReviewsSection({ deal, detail }: { deal: Deal; detail?: OfferDetail }) {
  const t = useT();
  const { locale } = useLocale();
  const [filter, setFilter] = useState<ReviewFilter>("alle");
  const [sort, setSort] = useState<ReviewSort>("neueste");
  const [sortOpen, setSortOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviews, setReviews] = useState<CommunityReview[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!deal.reviewEnabled) return;
    setReviews(readReviews(deal.id));
    setReady(true);
  }, [deal.id, deal.reviewEnabled]);

  const visible = useMemo(() => {
    let list = [...reviews];
    if (filter === "top") list = list.filter((r) => r.overall >= 4.5);
    if (filter === "kritisch") list = list.filter((r) => r.overall > 0 && r.overall <= 3);
    if (sort === "neueste") {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else {
      list.sort((a, b) => b.overall - a.overall);
    }
    return list;
  }, [reviews, filter, sort]);

  if (!deal.reviewEnabled) return null;

  const communityCount = reviews.length;
  const communityAvg =
    communityCount === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.overall, 0) / communityCount;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const report = String(data.get("report") ?? "").trim();
    const trip = String(data.get("trip") ?? "").trim();
    const values = RATING_CATEGORIES.map((c) => ratings[c] ?? 0).filter((v) => v > 0);
    const overall =
      values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;

    if (!name) return;

    const next: CommunityReview = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      report,
      trip: trip || undefined,
      ratings: { ...ratings },
      overall: Math.round(overall * 10) / 10,
      createdAt: new Date().toISOString(),
    };

    const updated = [next, ...reviews];
    setReviews(updated);
    writeReviews(deal.id, updated);
    setRatings({});
    setFormOpen(false);
    form.reset();
  };

  const countFormatter = new Intl.NumberFormat(localeTag(locale));
  const scoreFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const officialLabel = scoreLabel(deal.reviewScore, deal.reviewMaxScore, t);
  const showFilters = communityCount > 0;

  return (
    <section id="bewertungen" className="scroll-mt-24" aria-labelledby="bewertungen-heading">
      <h2
        id="bewertungen-heading"
        className="mt-2 text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {t("offer.reviewsHeading")}
      </h2>

      {deal.reviewCount > 0 && (
        <div className="mt-6 flex items-center gap-4 rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white p-5 shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)] sm:p-6">
          <span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F4F8FF] text-brand-600">
            <span className="text-[1.35rem] font-extrabold leading-none tabular-nums">
              {scoreFormatter.format(deal.reviewScore)}
            </span>
            <span className="mt-0.5 text-[10px] font-medium text-muted">/ {deal.reviewMaxScore}</span>
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink">{officialLabel}</p>
            <p className="mt-1 text-sm text-muted">
              {detail?.reviewSource
                ? t("offer.officialFrom", {
                    source: detail.reviewSource,
                    count: countFormatter.format(deal.reviewCount),
                  })
                : t("deal.reviews", { count: countFormatter.format(deal.reviewCount) })}
            </p>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {t("offer.reviewsCountAvg", {
              count: ready ? communityCount : "…",
              avg: communityAvg.toFixed(1).replace(".", locale === "en" ? "." : ","),
            })}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <div
              role="tablist"
              aria-label={t("offer.reviewsFilter")}
              className="inline-flex items-center rounded-full border border-line bg-white p-0.5"
            >
              {FILTERS.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition",
                      active ? "bg-ink text-white" : "text-body hover:text-ink"
                    )}
                  >
                    {t(item.labelKey)}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
                onClick={() => setSortOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface"
              >
                {t(SORT_OPTIONS.find((o) => o.id === sort)?.labelKey ?? "offer.newest")}
                <ChevronDown className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
              </button>
              {sortOpen && (
                <ul
                  role="listbox"
                  className="absolute right-0 top-full z-10 mt-1 min-w-[8rem] overflow-hidden rounded-xl border border-line bg-white py-1 shadow-md"
                >
                  {SORT_OPTIONS.map((option) => (
                    <li key={option.id} role="option" aria-selected={sort === option.id}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full px-3 py-2 text-left text-sm transition hover:bg-surface",
                          sort === option.id ? "font-semibold text-ink" : "text-body"
                        )}
                        onClick={() => {
                          setSort(option.id);
                          setSortOpen(false);
                        }}
                      >
                        {t(option.labelKey)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              aria-expanded={formOpen}
              aria-controls="bewertung-form"
              onClick={() => setFormOpen((open) => !open)}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition",
                formOpen ? "bg-brand-600 hover:bg-brand-700" : "bg-brand-500 hover:bg-brand-600"
              )}
            >
              <Star className="h-3.5 w-3.5 fill-white" aria-hidden="true" />
              {t("offer.rateAction")}
            </button>
          </div>
        </div>
      )}

      {formOpen && (
        <div
          id="bewertung-form"
          className="mt-6 rounded-[1.25rem] border-2 border-brand-500 bg-white p-5 sm:p-6"
        >
          <h3 className="text-lg font-bold text-ink">{t("offer.writeReview")}</h3>
          <p className="mt-1 text-sm text-muted">{t("offer.shareExperience")}</p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-ink">{t("offer.fieldName")}</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-ink">{t("offer.fieldEmail")}</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="font-medium text-ink">{t("offer.yourReport")}</span>
              <textarea
                name="report"
                rows={4}
                placeholder={t("offer.reportPlaceholder")}
                className="mt-1.5 w-full resize-y rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-500 focus:bg-white"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-ink">
                {t("offer.trip")} <span className="font-normal text-muted">{t("offer.optional")}</span>
              </span>
              <input
                type="text"
                name="trip"
                placeholder={t("offer.reviewPlaceholder")}
                className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-500 focus:bg-white"
              />
            </label>

            <div className="border-t border-dashed border-line pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {RATING_CATEGORIES.map((category) => (
                  <fieldset key={category} className="min-w-0">
                    <legend className="text-sm font-medium text-ink">{t(RATING_CATEGORY_KEYS[category])}</legend>
                    <div className="mt-1.5 flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => {
                        const value = i + 1;
                        const active = (ratings[category] ?? 0) >= value;
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-label={`${t(RATING_CATEGORY_KEYS[category])}: ${t("deal.stars", { count: value })}`}
                            onClick={() =>
                              setRatings((prev) => ({ ...prev, [category]: value }))
                            }
                            className="rounded p-0.5 transition hover:scale-105"
                          >
                            <Star
                              className={cn(
                                "h-5 w-5",
                                active ? "fill-ink text-ink" : "text-line"
                              )}
                              aria-hidden="true"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600"
            >
              {t("offer.submitReview")}
            </button>
          </form>
        </div>
      )}

      {ready && visible.length === 0 && (
        <div className="mt-6 rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white px-6 py-10 text-center shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)]">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F8FF] text-brand-500">
            <Star className="h-5 w-5" aria-hidden="true" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[15px] font-semibold text-ink">{t("offer.noReviews")}</p>
          <p className="mt-1 text-sm text-muted">{t("offer.communityEmptyHint")}</p>
          {!formOpen && (
            <button
              type="button"
              aria-expanded={formOpen}
              aria-controls="bewertung-form"
              onClick={() => setFormOpen(true)}
              className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              <Star className="h-3.5 w-3.5 fill-white" aria-hidden="true" />
              {t("offer.writeReview")}
            </button>
          )}
        </div>
      )}

      {visible.length > 0 && (
        <ul className="mt-6 space-y-3">
          {visible.map((review) => (
            <li
              key={review.id}
              className="rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)] sm:px-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-ink">{review.name}</p>
                <p className="text-sm font-semibold text-ink">
                  {review.overall.toFixed(1).replace(".", locale === "en" ? "." : ",")} / 5
                </p>
              </div>
              {review.trip && <p className="mt-1 text-xs text-muted">{review.trip}</p>}
              {review.report && (
                <p className="mt-2 text-sm leading-relaxed text-body">{review.report}</p>
              )}
              <p className="mt-2 text-[11px] text-muted">
                {new Date(review.createdAt).toLocaleDateString(localeTag(locale))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
