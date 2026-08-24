/**
 * Shared checkout form control styles.
 *
 * Critical for iPhone/Safari: keep computed font-size at ≥16px on all
 * text/select/textarea controls so the browser does not auto-zoom on focus.
 * Do not add `text-sm` / `md:text-sm` (or any size < 16px) on these controls.
 */
export const checkoutInputClass =
  "box-border h-11 w-full max-w-full min-w-0 rounded-lg border border-[#d8dce3] bg-white px-3 text-[16px] leading-normal text-ink transition placeholder:text-muted/70 focus-visible:border-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

/** Closed look for custom selects — chevron via icon, no native popup. */
export const checkoutSelectTriggerClass = [
  checkoutInputClass,
  "flex cursor-pointer items-center justify-between gap-2 text-left",
].join(" ");

/** Quantity stepper in add-ons — same 16px type, fixed box so layout never jumps. */
export const checkoutQtyInputClass =
  "box-border h-11 w-14 shrink-0 rounded-lg border border-[#d8dce3] bg-white px-1 text-center text-[16px] leading-normal text-ink tabular-nums transition [appearance:textfield] focus-visible:border-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
