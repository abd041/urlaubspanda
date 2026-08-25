"use client";

import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  LegalDocumentSections,
  legalDocIntroKey,
  legalDocTitleKey,
  type LegalDocKind,
} from "@/components/legal/LegalDocumentSections";
import { useT } from "@/i18n/LocaleProvider";

interface LegalDocumentModalProps {
  kind: LegalDocKind | null;
  onClose: () => void;
}

/** Checkout legal popup — keeps the booking form mounted underneath. */
export function LegalDocumentModal({ kind, onClose }: LegalDocumentModalProps) {
  const t = useT();
  const open = kind !== null;
  const titleId = "checkout-legal-title";

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabelledBy={titleId}
      className="max-h-[90vh] sm:max-h-[85vh] sm:max-w-2xl lg:max-w-3xl"
    >
      {kind && (
        <div className="flex min-h-0 max-h-[90vh] flex-col sm:max-h-[85vh]">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
            <div className="min-w-0 pt-0.5">
              <h2 id={titleId} className="text-base font-bold leading-snug text-ink sm:text-lg">
                {t(legalDocTitleKey(kind))}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                {t(legalDocIntroKey(kind))}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("offer.close")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
            <div className="space-y-4 sm:space-y-5">
              <LegalDocumentSections kind={kind} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
