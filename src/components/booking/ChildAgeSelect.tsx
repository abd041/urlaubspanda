"use client";

import { useT } from "@/i18n/LocaleProvider";

/** Ages 0–17 (under 18). Exact age is confirmed at checkout. */
const AGE_OPTIONS = Array.from({ length: 18 }, (_, age) => age);

interface ChildAgeSelectProps {
  index: number;
  age: number | undefined;
  onChange: (age: number) => void;
}

/** Age dropdown for one child, shown once "Kinder" is incremented above zero. */
export function ChildAgeSelect({ index, age, onChange }: ChildAgeSelectProps) {
  const t = useT();

  return (
    <label className="flex flex-col gap-2 rounded-lg bg-surface px-3 py-2.5 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between min-[400px]:gap-3">
      <span className="text-sm leading-snug text-body">{t("booking.childAge", { n: index + 1 })}</span>
      <select
        value={age ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-line bg-white px-2 py-2.5 text-sm font-medium text-ink min-[400px]:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <option value="" disabled>
          {t("booking.chooseAge")}
        </option>
        {AGE_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {value === 0 ? t("booking.underOne") : t("booking.years", { n: value })}
          </option>
        ))}
      </select>
    </label>
  );
}
