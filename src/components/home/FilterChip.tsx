"use client";

import { cn } from "@/lib/utils";
import { filterIconColor, filterIconMap } from "@/components/home/filterIcons";
import type { FilterIconName } from "@/data/filters";
import { easePremium, motion, useReducedMotion } from "@/components/motion/Reveal";

interface FilterChipProps {
  label: string;
  icon: FilterIconName;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

export function FilterChip({ label, icon, selected, onToggle, className }: FilterChipProps) {
  const Icon = filterIconMap[icon];
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      whileHover={reduce || selected ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18, ease: easePremium }}
      className={cn(
        "flex size-[5.75rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-[#eeeef2] bg-white px-1.5 text-center shadow-[0_2px_10px_rgba(15,26,43,0.06)] transition-[box-shadow,border-color,background-color,color] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:size-24",
        selected
          ? "border-2 border-brand-500 bg-white text-ink shadow-[0_2px_10px_rgba(27,99,235,0.08)]"
          : "hover:shadow-[0_6px_16px_rgba(15,26,43,0.1)]",
        className
      )}
    >
      <Icon
        className={cn(
          "h-[22px] w-[22px] shrink-0 sm:h-6 sm:w-6",
          selected ? "text-brand-500" : filterIconColor[icon]
        )}
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <span className="line-clamp-2 max-w-full text-[11px] font-medium leading-tight tracking-tight text-ink">
        {label}
      </span>
    </motion.button>
  );
}
