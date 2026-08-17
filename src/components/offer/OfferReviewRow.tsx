"use client";

import { ReviewBadge } from "@/components/home/ReviewBadge";

interface OfferReviewRowProps {
  reviewPercent: number;
  reviewScore: number;
  reviewMaxScore: number;
  reviewCount: number;
  reviewSource?: string;
}

/** Offer-detail review summary — same badge as deal cards, linking to reviews. */
export function OfferReviewRow({
  reviewPercent,
  reviewScore,
  reviewMaxScore,
  reviewCount,
  reviewSource,
}: OfferReviewRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ReviewBadge
        reviewPercent={reviewPercent}
        reviewScore={reviewScore}
        reviewMaxScore={reviewMaxScore}
        reviewCount={reviewCount}
        href="#bewertungen"
        size="md"
      />
      {reviewSource ? <span className="text-sm text-body">{reviewSource}</span> : null}
    </div>
  );
}
