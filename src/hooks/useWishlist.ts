"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "urlaubspanda-wishlist";
const CHANGE_EVENT = "urlaubspanda-wishlist-change";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Client-only wishlist (Merkliste) backed by localStorage for this UI
 * milestone — no backend/account yet. Hearts on deal cards and the
 * `/merkliste` page share the same list.
 */
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(readIds());
    setReady(true);
    const sync = () => setIds(readIds());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    const current = readIds();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    writeIds(next);
    setIds(next);
  }, []);

  const remove = useCallback((id: string) => {
    const next = readIds().filter((item) => item !== id);
    writeIds(next);
    setIds(next);
  }, []);

  const clear = useCallback(() => {
    writeIds([]);
    setIds([]);
  }, []);

  return { ids, ready, count: ids.length, isFavorite, toggle, remove, clear };
}
