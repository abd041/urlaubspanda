import { cn } from "@/lib/utils";

const PROVIDER_STYLES: Record<string, string> = {
  DERTOUR: "bg-[#E30613] text-white",
  "5vorFlug": "bg-[#FF6600] text-white",
  TUI: "bg-[#0B2D5B] text-white",
  HolidayCheck: "bg-[#FFD100] text-ink",
  Expedia: "bg-[#FFCC00] text-[#00355F]",
  "Hofer Reisen": "bg-[#E30613] text-white",
  "Alpenwelt Reisen": "bg-[#1B4F72] text-white",
  "Sonnenklar.TV": "bg-[#E84E0F] text-white",
  "Secret Escapes": "bg-[#111111] text-white",
};

/** Compact organizer wordmark used on booking offer cards. */
export function ProviderLogo({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded px-2 py-1 text-[10px] font-extrabold tracking-wide uppercase",
        PROVIDER_STYLES[name] ?? "border border-line bg-surface text-ink",
        className
      )}
    >
      {name}
    </span>
  );
}
