"use client";

import { useState } from "react";
import { Check, Link2, Mail, MessageCircle, MessageSquareText, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { useT } from "@/i18n/LocaleProvider";

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
  alwaysShowLabel?: boolean;
}

/**
 * Uses the native Web Share API where supported (mostly mobile). Falls back
 * to our own share modal with Link kopieren, WhatsApp, SMS, Messenger, E-Mail.
 */
export function ShareButton({
  url,
  title,
  className,
  alwaysShowLabel = false,
}: ShareButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useT();

  const handleShareClick = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed — fall back to modal.
      }
    }
    setModalOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may fail; modal still shows share options.
    }
  };

  const shareText = encodeURIComponent(`${title} – ${url}`);

  return (
    <>
      <button
        type="button"
        onClick={handleShareClick}
        aria-label={t("offer.share")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
          className
        )}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span className={cn(!alwaysShowLabel && "hidden sm:inline")}>{t("offer.shareAction")}</span>
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} ariaLabelledBy="share-modal-heading">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="share-modal-heading" className="text-base font-bold text-ink">
            {t("offer.share")}
          </h2>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            aria-label={t("offer.close")}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1 p-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-ink transition hover:bg-surface"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              {copied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
            </span>
            {copied ? t("offer.linkCopied") : t("offer.copyLink")}
          </button>

          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-ink transition hover:bg-surface"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
              <MessageCircle className="h-5 w-5" />
            </span>
            WhatsApp
          </a>

          <a
            href={`sms:?body=${shareText}`}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-ink transition hover:bg-surface"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <MessageSquareText className="h-5 w-5" />
            </span>
            SMS
          </a>

          <a
            href={`fb-messenger://share/?link=${encodeURIComponent(url)}`}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-ink transition hover:bg-surface"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <MessageCircle className="h-5 w-5" />
            </span>
            Messenger
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${shareText}`}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-ink transition hover:bg-surface"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-body">
              <Mail className="h-5 w-5" />
            </span>
            E-Mail
          </a>
        </div>
      </Modal>
    </>
  );
}
