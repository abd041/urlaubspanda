"use client";

import { useEffect } from "react";

/**
 * Sets `<meta name="robots" content="noindex, follow">` while mounted so
 * multi-filter query combinations stay shareable but are not indexed —
 * per the Homepage-details SEO section.
 */
export function NoIndexMeta({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;

    const existing = document.querySelector('meta[name="robots"]');
    const previous = existing?.getAttribute("content") ?? null;
    let meta = existing as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, follow");

    return () => {
      if (!meta) return;
      if (previous === null && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (previous !== null) {
        meta.setAttribute("content", previous);
      }
    };
  }, [active]);

  return null;
}
