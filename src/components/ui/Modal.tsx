"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabelledBy: string;
  className?: string;
}

/**
 * Shared bottom-sheet-on-mobile / centered-dialog-on-desktop chrome, reused
 * by the share and country-selection modals so backdrop, escape-key, focus
 * and scroll-lock behaviour only needs to be implemented once.
 */
export function Modal({ open, onClose, children, ariaLabelledBy, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t("offer.close")}
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-[1px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl outline-none sm:max-w-md sm:rounded-3xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
