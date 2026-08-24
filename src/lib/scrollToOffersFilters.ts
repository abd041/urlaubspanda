/** Scroll to the travel-types / filters section headline (above the chips). */
export function scrollToOffersFiltersHeadline() {
  const run = () => {
    const el = document.getElementById("filters");
    if (!el) return;
    const header = document.querySelector("header");
    const headerOffset = header?.getBoundingClientRect().height ?? 72;
    const top = window.scrollY + el.getBoundingClientRect().top - headerOffset;
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "smooth" });
  };
  window.setTimeout(run, 120);
}
