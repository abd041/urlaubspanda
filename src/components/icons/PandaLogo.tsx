import { cn } from "@/lib/utils";

/** Official Urlaubspanda lockup (panda + wordmark) from the live brand SVG. */
export function PandaLogo({ className }: { className?: string }) {
  return (
    <img
      src="/urlaubspanda-logo.svg"
      alt="Urlaubspanda"
      width={155}
      height={50}
      className={cn("h-8 w-auto", className)}
      decoding="async"
    />
  );
}
