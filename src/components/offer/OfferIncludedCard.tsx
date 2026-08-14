import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface OfferIncludedCardProps {
  icon: LucideIcon;
  heading: string;
  items: string[];
}

/** Reused for both "Das ist inklusive" and "Darauf kannst du dich freuen". */
export function OfferIncludedCard({ icon: Icon, heading, items }: OfferIncludedCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <h3 className="text-base font-bold text-ink">{heading}</h3>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-body">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
