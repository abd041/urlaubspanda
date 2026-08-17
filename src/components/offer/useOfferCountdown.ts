"use client";

import { useEffect, useState } from "react";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Live DD:HH:MM:SS countdown. Returns null when the deadline is missing or already passed. */
export function useOfferCountdown(endsAt?: string) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!endsAt) {
      setLabel(null);
      return;
    }

    const end = new Date(endsAt).getTime();
    if (!Number.isFinite(end)) {
      setLabel(null);
      return;
    }

    const tick = () => {
      const remaining = end - Date.now();
      setLabel(remaining > 0 ? formatRemaining(remaining) : null);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return label;
}
