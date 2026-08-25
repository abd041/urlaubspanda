import { cn } from "@/lib/utils";

/**
 * Brand styles for tour-operator wordmarks.
 * When real logo assets are available, add paths in `PROVIDER_LOGO_SRC` —
 * the UI will prefer the image and fall back to this styled name.
 */
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

/**
 * Optional image logos per tour operator / partner name.
 * Key = exact `BookingOffer.provider` / `Deal.provider` string.
 * Leave empty until assets are uploaded under `/public/images/providers/`.
 */
export const PROVIDER_LOGO_SRC: Record<string, string> = {
  // Example: DERTOUR: "/images/providers/dertour.svg",
};

/** Compact organizer wordmark used on booking offer cards and confirmation. */
export function ProviderLogo({
  name,
  className,
  size = "sm",
}: {
  name: string;
  className?: string;
  size?: "sm" | "lg";
}) {
  const src = PROVIDER_LOGO_SRC[name];
  const sizeClass =
    size === "lg"
      ? "min-h-12 px-4 py-2.5 text-sm tracking-wide"
      : "px-2 py-1 text-[10px] tracking-wide";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- partner logos from static map / CDN
      <img
        src={src}
        alt={name}
        className={cn(
          "h-10 w-auto max-w-[12rem] object-contain object-left",
          size === "lg" && "h-12 max-w-[14rem]",
          className
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded font-extrabold uppercase",
        sizeClass,
        PROVIDER_STYLES[name] ?? "border border-line bg-surface text-ink",
        className
      )}
      role="img"
      aria-label={name}
    >
      {name}
    </span>
  );
}
