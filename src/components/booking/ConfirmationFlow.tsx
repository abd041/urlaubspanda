"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Deal } from "@/types";
import { BookingConfirmationView } from "@/components/booking/BookingConfirmationView";
import { loadBookingConfirmation, type BookingConfirmationSnapshot } from "@/lib/bookingConfirmation";

interface ConfirmationFlowProps {
  deal: Deal;
}

export function ConfirmationFlow({ deal }: ConfirmationFlowProps) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<BookingConfirmationSnapshot | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const data = loadBookingConfirmation(deal.slug);
    if (!data) {
      router.replace(`/hotel/${deal.slug}/checkout`);
      return;
    }
    setSnapshot(data);
    setReady(true);
  }, [deal.slug, router]);

  if (!ready || !snapshot) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto w-[calc(100%-2rem)] max-w-[960px] animate-pulse py-10 sm:w-[calc(100%-3rem)]">
          <div className="h-64 rounded-2xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-surface pb-8 lg:pb-12">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[960px] pt-4 sm:w-[calc(100%-3rem)] sm:pt-5">
        <BookingConfirmationView snapshot={snapshot} />
      </div>
    </main>
  );
}
