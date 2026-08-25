import type { ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { Locale } from "@/i18n/config";
import { localeTag } from "@/i18n/config";

/**
 * Client-side mock of the "Booking / Pricing Service" described in the
 * booking-flow spec: base rates are entered per night (weekday vs.
 * weekend), and every displayed price — nights chips, calendar cells, room
 * cards, offer totals — is recalculated from the current traveler
 * configuration instead of being a static number.
 *
 * This is UI-only: in production this logic would live behind a real
 * backend/pricing service (manual data now, external APIs later per the
 * spec's "Pricing Architecture" section) and the frontend would only ever
 * render whatever it returns. The function signatures here are written so
 * that swap is a backend change, not a frontend rewrite.
 */

/** A double-occupancy room rate covers up to this many adults before an extra-adult supplement applies. */
const BASE_OCCUPANCY_ADULTS = 2;
/**
 * Extra adults beyond the base occupancy pay this fraction of the per-night
 * room rate, per night. Deliberately higher than the 1/BASE_OCCUPANCY_ADULTS
 * "even split" (0.5) so adding travelers visibly moves the average
 * price-per-person instead of leaving it mathematically unchanged.
 */
const EXTRA_ADULT_FACTOR = 0.65;

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isWeekendNight(date: Date): boolean {
  const day = date.getDay(); // 0 = Sunday ... 6 = Saturday
  return day === 5 || day === 6; // Friday & Saturday, matching the spec's example
}

export function getNightRate(date: Date, room: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">): number {
  return isWeekendNight(date) ? room.weekendRate : room.weekdayRate;
}

/** Sums the room's own per-night rate (already covering base occupancy) across the stay. */
export function calculateBaseRoomTotal(
  arrival: Date,
  nights: number,
  room: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">
): number {
  let total = 0;
  for (let i = 0; i < nights; i++) {
    total += getNightRate(addDays(arrival, i), room);
  }
  return total;
}

function findChildRule(age: number, rules: ChildPricingRule[]): ChildPricingRule | undefined {
  return rules.find((rule) => age >= rule.minAge && age <= rule.maxAge);
}

/** Full-stay price for a single child, using whichever pricing rule matches their age. */
export function calculateChildTotal(
  age: number,
  arrival: Date,
  nights: number,
  room: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">,
  rules: ChildPricingRule[]
): number {
  const rule = findChildRule(age, rules);
  if (!rule || rule.type === "free") return 0;
  if (rule.type === "fixed") return rule.value ?? 0;

  // Percent discount off what an adult would pay for the same nights, at the extra-traveler rate.
  const adultEquivalent = calculateBaseRoomTotal(arrival, nights, room) * EXTRA_ADULT_FACTOR;
  const discount = (rule.value ?? 0) / 100;
  return adultEquivalent * (1 - discount);
}

export interface StayPriceInput {
  room: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">;
  arrival: Date;
  nights: number;
  adults: number;
  childAges: number[];
  childPricingRules: ChildPricingRule[];
}

export interface TravelerPriceLine {
  kind: "adult" | "child";
  /** 1-based index within that traveler kind (1. Adult, 2. Adult, 1. Child…). */
  index: number;
  /** Child age when `kind` is `"child"`. */
  age?: number;
  amount: number;
}

export interface StayPrice {
  total: number;
  perPerson: number;
  travelerCount: number;
  /** Per-adult / per-child share of the room stay (before meal/cancellation supplements). */
  lines: TravelerPriceLine[];
}

function averageNightRate(arrival: Date, nights: number, room: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">) {
  return calculateBaseRoomTotal(arrival, nights, room) / Math.max(nights, 1);
}

/** Adult cost pool (base room + extra-adult supplements), split evenly across adults. */
function adultUnitPrice(
  room: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">,
  arrival: Date,
  nights: number,
  adults: number
): number {
  const safeAdults = Math.max(adults, 1);
  let adultPool = calculateBaseRoomTotal(arrival, nights, room);
  const extraAdults = Math.max(adults - BASE_OCCUPANCY_ADULTS, 0);
  if (extraAdults > 0) {
    adultPool += extraAdults * nights * EXTRA_ADULT_FACTOR * averageNightRate(arrival, nights, room);
  }
  return adultPool / safeAdults;
}

/** Total + average-per-person price for one room's stay, given its current occupancy. */
export function calculateStayPrice({
  room,
  arrival,
  nights,
  adults,
  childAges,
  childPricingRules,
}: StayPriceInput): StayPrice {
  const adultPrice = adultUnitPrice(room, arrival, nights, adults);
  const lines: TravelerPriceLine[] = [];

  for (let i = 0; i < adults; i++) {
    lines.push({ kind: "adult", index: i + 1, amount: adultPrice });
  }

  for (let i = 0; i < childAges.length; i++) {
    const age = childAges[i];
    lines.push({
      kind: "child",
      index: i + 1,
      age,
      amount: calculateChildTotal(age, arrival, nights, room, childPricingRules),
    });
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  const travelerCount = Math.max(adults + childAges.length, 1);
  return { total, perPerson: total / travelerCount, travelerCount, lines };
}

/**
 * Fold a meal-plan stay supplement into per-traveler lines (equal share).
 * Meal upgrades are part of the core room price — not a separate breakdown row.
 * Cancellation upgrades / add-ons stay outside this helper.
 */
export function withMealSupplementInLines(
  lines: TravelerPriceLine[],
  mealSupplement: number
): TravelerPriceLine[] {
  if (!(mealSupplement > 0) || lines.length === 0) return lines;

  const count = lines.length;
  const totalCents = Math.round(mealSupplement * 100);
  const baseShare = Math.floor(totalCents / count);
  let remainder = totalCents - baseShare * count;

  return lines.map((line) => {
    const extraCents = baseShare + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
    return {
      ...line,
      amount: Math.round(line.amount * 100 + extraCents) / 100,
    };
  });
}


/**
 * "Ab X € p.P." starting price for a given stay length, shown on the nights
 * chips before an arrival date is chosen. Uses the cheapest room category
 * and a representative near-future date so weekday/weekend mix is realistic.
 */
export function calculateNightsChipPrice(
  nights: number,
  cheapestRoom: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">,
  adults: number,
  childAges: number[],
  childPricingRules: ChildPricingRule[],
  referenceDate: Date = new Date()
): number {
  const { perPerson } = calculateStayPrice({
    room: cheapestRoom,
    arrival: referenceDate,
    nights,
    adults,
    childAges,
    childPricingRules,
  });
  return perPerson;
}

/**
 * Per-date "ab X €" price shown inside the calendar: the average
 * price-per-person for a stay of `nights` nights starting on that date,
 * not the price of that single night.
 */
export function calculateCalendarDayPrice(
  date: Date,
  nights: number,
  cheapestRoom: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">,
  adults: number,
  childAges: number[],
  childPricingRules: ChildPricingRule[]
): number {
  const { perPerson } = calculateStayPrice({
    room: cheapestRoom,
    arrival: date,
    nights,
    adults,
    childAges,
    childPricingRules,
  });
  return Math.round(perPerson);
}

export interface RoomOccupancyLike {
  adults: number;
  childAges: number[];
}

/**
 * Blended average price-per-person across every room in the booking (not
 * just one room), used for the nights chips / calendar cells so a
 * multi-room search still shows one easy-to-read "ab X € p.P." figure.
 */
export function calculateAggregateStayPrice(
  rooms: RoomOccupancyLike[],
  room: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">,
  arrival: Date,
  nights: number,
  childPricingRules: ChildPricingRule[]
): StayPrice {
  let total = 0;
  let travelerCount = 0;
  const lines: TravelerPriceLine[] = [];
  for (const occupancy of rooms) {
    const stay = calculateStayPrice({
      room,
      arrival,
      nights,
      adults: occupancy.adults,
      childAges: occupancy.childAges,
      childPricingRules,
    });
    total += stay.total;
    travelerCount += occupancy.adults + occupancy.childAges.length;
    lines.push(...stay.lines);
  }
  travelerCount = Math.max(travelerCount, 1);
  return { total, perPerson: total / travelerCount, travelerCount, lines };
}

export function getCheapestRoom<T extends Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">>(
  rooms: T[]
): T {
  return rooms.reduce((cheapest, room) =>
    room.weekdayRate + room.weekendRate < cheapest.weekdayRate + cheapest.weekendRate ? room : cheapest
  );
}

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const WEEKDAY_LABELS_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const dateFormatterDE = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

export function formatDateDE(date: Date): string {
  return dateFormatterDE.format(date);
}

export function formatDateLocale(date: Date, locale: Locale = "de"): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Short weekday label ("Mo", "Di", ...) matching the calendar mockup's header row. */
export function getWeekdayLabel(date: Date): string {
  return WEEKDAY_LABELS_SHORT[date.getDay()];
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date.getTime() > start.getTime() && date.getTime() < end.getTime();
}

export function parseDateISO(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}
