"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calculateAggregateStayPrice, isDateInRange, isSameDay } from "@/lib/pricingEngine";
import type { ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";

const WEEKDAY_HEADER_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEKDAY_HEADER_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getMonthCells(year: number, monthIndex: number): (Date | null)[] {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = (first.getDay() + 6) % 7;
  const cells: (Date | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

interface BookingCalendarProps {
  arrival: Date | null;
  departure: Date | null;
  nights: number;
  rooms: RoomSelection[];
  cheapestRoom: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">;
  childPricingRules: ChildPricingRule[];
  onSelectArrival: (date: Date) => void;
  onContinue: () => void;
}

export function BookingCalendar({
  arrival,
  departure,
  nights,
  rooms,
  cheapestRoom,
  childPricingRules,
  onSelectArrival,
  onContinue,
}: BookingCalendarProps) {
  const t = useT();
  const { locale } = useLocale();
  const weekdayHeader = locale === "en" ? WEEKDAY_HEADER_EN : WEEKDAY_HEADER_DE;
  const monthLabel = new Intl.DateTimeFormat(localeTag(locale), { month: "long", year: "numeric" });
  const today = useMemo(() => startOfDay(new Date()), []);
  const initialView = arrival ?? today;
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  const canGoBack = new Date(viewYear, viewMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  const goToMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const months = useMemo(() => {
    const first = { year: viewYear, month: viewMonth, cells: getMonthCells(viewYear, viewMonth) };
    const secondDate = new Date(viewYear, viewMonth + 1, 1);
    const second = {
      year: secondDate.getFullYear(),
      month: secondDate.getMonth(),
      cells: getMonthCells(secondDate.getFullYear(), secondDate.getMonth()),
    };
    return [first, second];
  }, [viewYear, viewMonth]);

  const priceForDate = (date: Date) =>
    Math.round(calculateAggregateStayPrice(rooms, cheapestRoom, date, nights, childPricingRules).perPerson);

  const monthPrices = (cells: (Date | null)[]) => {
    const prices = cells.filter((d): d is Date => d !== null && d >= today).map(priceForDate);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const renderMonth = (year: number, month: number, cells: (Date | null)[], hideOnMobile: boolean) => {
    const cheapest = monthPrices(cells);
    return (
      <div key={`${year}-${month}`} className={cn("min-w-0 w-full px-1.5 pb-2 sm:px-2 sm:pb-3", hideOnMobile && "hidden md:block")}>
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              {weekdayHeader.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="w-[14.28%] py-1.5 text-center text-[11px] font-semibold text-ink sm:text-xs"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cells.length / 7 }, (_, week) => (
              <tr key={week}>
                {cells.slice(week * 7, week * 7 + 7).map((date, i) => {
                  if (!date) return <td key={`${week}-${i}`} className="p-0.5" />;
                  const isPast = date < today;
                  const isArrival = arrival && isSameDay(date, arrival);
                  const isDeparture = departure && isSameDay(date, departure);
                  const inRange = arrival && departure && isDateInRange(date, arrival, departure);
                  const price = isPast ? null : priceForDate(date);
                  const isCheapest = !isPast && cheapest !== null && price === cheapest;
                  const highlighted = isArrival || isDeparture;

                  return (
                    <td key={`${week}-${i}`} className="p-px sm:p-0.5">
                      <button
                        type="button"
                        disabled={isPast}
                        onClick={() => onSelectArrival(date)}
                        aria-pressed={Boolean(isArrival)}
                        aria-label={`${date.getDate()}. ${monthLabel.format(date)}${price !== null ? `, ${t("booking.calendarPrice", { price })}` : ""}`}
                        className={cn(
                          "flex min-h-11 w-full min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md px-0 py-1 text-sm leading-none transition disabled:cursor-not-allowed sm:min-h-12 sm:gap-1 sm:text-base",
                          isPast && "text-muted",
                          !isPast && !highlighted && !inRange && "text-black hover:bg-surface",
                          inRange && !highlighted && "bg-[#D6E4FF] text-black",
                          isArrival && "bg-[#1B63EB] text-white",
                          isDeparture && !isArrival && "bg-[#1B63EB] text-white"
                        )}
                      >
                        <span className="font-semibold tabular-nums">{date.getDate()}</span>
                        {price !== null && (
                          <span
                            className={cn(
                              "block w-full truncate text-xs font-medium tabular-nums sm:text-sm",
                              highlighted
                                ? "text-white/90"
                                : isCheapest
                                  ? "font-bold text-success"
                                  : "text-black"
                            )}
                          >
                            {price} €
                          </span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-w-0 w-full max-w-full">
      <h2 className="text-sm font-bold text-ink">{t("booking.calendarTitle")}</h2>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">{t("booking.calendarText")}</p>
      <div className="mt-3 min-w-0 max-w-full overflow-hidden rounded-xl border-4 border-[#FDB919]">
        <div className="flex items-center gap-2 bg-[#FDB919] px-2 py-2 sm:px-3 sm:py-2.5">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            disabled={!canGoBack}
            aria-label={t("booking.prevMonth")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="grid min-w-0 flex-1 grid-cols-1 md:grid-cols-2">
            <p className="text-center text-sm font-bold capitalize text-ink">
              {monthLabel.format(new Date(months[0].year, months[0].month, 1))}
            </p>
            <p className="hidden text-center text-sm font-bold capitalize text-ink md:block">
              {monthLabel.format(new Date(months[1].year, months[1].month, 1))}
            </p>
          </div>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label={t("booking.nextMonth")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink transition hover:bg-white/80"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid bg-white md:grid-cols-2">
          {renderMonth(months[0].year, months[0].month, months[0].cells, false)}
          {renderMonth(months[1].year, months[1].month, months[1].cells, true)}
        </div>

        <div className="flex flex-col gap-3 border-t border-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="hidden flex-wrap items-center gap-x-4 gap-y-2 text-xs text-body md:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-sm bg-[#1B63EB]" aria-hidden="true" />
              {t("booking.selected")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-sm bg-[#D6E4FF]" aria-hidden="true" />
              {t("booking.departure")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
              {t("booking.cheapest")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-body md:hidden">
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-sm bg-[#1B63EB]" aria-hidden="true" />
              {t("booking.arrival")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-sm bg-[#D6E4FF]" aria-hidden="true" />
              {t("booking.stopovers")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-sm bg-[#1B63EB]" aria-hidden="true" />
              {t("booking.departure")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
              {t("booking.cheapest")}
            </span>
          </div>
          <button
            type="button"
            onClick={onContinue}
            disabled={!arrival}
            className="hidden min-w-[13.5rem] items-center justify-center gap-1.5 rounded-lg bg-[#1B63EB] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#0F52D6] disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex"
          >
            {t("booking.selectRoom")}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onContinue}
        disabled={!arrival}
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#1B63EB] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#0F52D6] disabled:cursor-not-allowed disabled:opacity-40 md:hidden"
      >
        {t("booking.selectRoom")}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
