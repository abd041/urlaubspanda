"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addDays, formatDateISO, parseDateISO } from "@/lib/pricingEngine";

export interface RoomSelection {
  adults: number;
  childAges: number[];
  roomCategoryId: string | null;
  offerId: string | null;
  mealPlanId: string | null;
  cancellationSelected: boolean;
}

export interface BookingState {
  nights: number;
  arrival: Date | null;
  rooms: RoomSelection[];
}

const DEFAULT_NIGHTS = 3;
const DEFAULT_ADULTS = 2;
const MAX_ROOMS = 6;

function emptyRoom(adults = DEFAULT_ADULTS): RoomSelection {
  return { adults, childAges: [], roomCategoryId: null, offerId: null, mealPlanId: null, cancellationSelected: false };
}

function parseChildAges(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => Number(part))
    .filter((age) => Number.isFinite(age) && age >= 0 && age <= 17);
}

function parseState(searchParams: URLSearchParams): BookingState {
  const nights = Math.min(Math.max(Number(searchParams.get("nights")) || DEFAULT_NIGHTS, 1), 21);
  const arrival = parseDateISO(searchParams.get("arrival") ?? "");
  const roomsCount = Math.min(Math.max(Number(searchParams.get("rooms")) || 1, 1), MAX_ROOMS);

  const rooms: RoomSelection[] = Array.from({ length: roomsCount }, (_, i) => {
    const n = i + 1;
    const adults = Math.min(Math.max(Number(searchParams.get(`room${n}Adults`)) || DEFAULT_ADULTS, 1), 6);
    const childAges = parseChildAges(searchParams.get(`room${n}ChildAges`));
    return {
      adults,
      childAges,
      roomCategoryId: searchParams.get(`room${n}RoomCategory`) || null,
      offerId: searchParams.get(`room${n}Offer`) || null,
      mealPlanId: searchParams.get(`room${n}MealPlan`) || null,
      cancellationSelected: searchParams.get(`room${n}Cancellation`) === "1",
    };
  });

  return { nights, arrival, rooms };
}

function serializeState(state: BookingState): URLSearchParams {
  const params = new URLSearchParams();
  params.set("nights", String(state.nights));
  params.set("rooms", String(state.rooms.length));

  if (state.arrival) {
    params.set("arrival", formatDateISO(state.arrival));
    params.set("departure", formatDateISO(addDays(state.arrival, state.nights)));
  }

  state.rooms.forEach((room, i) => {
    const n = i + 1;
    params.set(`room${n}Adults`, String(room.adults));
    if (room.childAges.length > 0) {
      params.set(`room${n}Children`, String(room.childAges.length));
      params.set(`room${n}ChildAges`, room.childAges.join(","));
    }
    if (room.roomCategoryId) params.set(`room${n}RoomCategory`, room.roomCategoryId);
    if (room.offerId) params.set(`room${n}Offer`, room.offerId);
    if (room.mealPlanId) params.set(`room${n}MealPlan`, room.mealPlanId);
    if (room.cancellationSelected) params.set(`room${n}Cancellation`, "1");
  });

  return params;
}

/** Clears every room's category/offer/meal-plan/cancellation selection, since a change to dates or occupancy invalidates previously calculated prices. */
function resetRoomSelections(rooms: RoomSelection[]): RoomSelection[] {
  return rooms.map((room) => ({
    adults: room.adults,
    childAges: room.childAges,
    roomCategoryId: null,
    offerId: null,
    mealPlanId: null,
    cancellationSelected: false,
  }));
}

/**
 * Owns the entire booking-flow selection (travelers, rooms, stay length,
 * arrival date, per-room category/offer/upgrades), backed entirely by the
 * URL query string so refreshing, sharing, and using browser back/forward
 * all restore the exact same booking state — per the booking-flow spec's
 * "Selection Must Be Stored in the URL" requirement.
 *
 * The URL is only ever a *search* description; final prices are always
 * recalculated from this state (see `pricingEngine`), never trusted from
 * the URL itself.
 */
export function useBookingState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(() => parseState(searchParams), [searchParams]);

  const departure = useMemo(
    () => (state.arrival ? addDays(state.arrival, state.nights) : null),
    [state.arrival, state.nights]
  );

  /** First room index without a confirmed offer, i.e. the room currently being configured. Equals `rooms.length` once every room is done. */
  const activeRoomIndex = useMemo(() => {
    const index = state.rooms.findIndex((room) => !room.offerId);
    return index === -1 ? state.rooms.length : index;
  }, [state.rooms]);

  const allRoomsConfirmed = activeRoomIndex >= state.rooms.length;

  const commit = useCallback(
    (next: BookingState, options?: { push?: boolean }) => {
      const query = serializeState(next).toString();
      const url = query ? `${pathname}?${query}` : pathname;
      if (options?.push === false) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [pathname, router]
  );

  const setNights = useCallback(
    (nights: number) => commit({ ...state, nights, rooms: resetRoomSelections(state.rooms) }),
    [state, commit]
  );

  const setArrival = useCallback(
    (date: Date) => commit({ ...state, arrival: date, rooms: resetRoomSelections(state.rooms) }),
    [state, commit]
  );

  const setRoomsCount = useCallback(
    (count: number) => {
      const clamped = Math.min(Math.max(count, 1), MAX_ROOMS);
      const rooms = Array.from({ length: clamped }, (_, i) => state.rooms[i] ?? emptyRoom());
      commit({ ...state, rooms });
    },
    [state, commit]
  );

  const setRoomOccupancy = useCallback(
    (roomIndex: number, adults: number, childAges: number[]) => {
      const rooms = state.rooms.map((room, i) =>
        i === roomIndex
          ? { ...emptyRoom(adults), childAges }
          : room
      );
      commit({ ...state, rooms });
    },
    [state, commit]
  );

  const setRoomCategory = useCallback(
    (roomIndex: number, roomCategoryId: string | null) => {
      const rooms = state.rooms.map((room, i) =>
        i === roomIndex ? { ...room, roomCategoryId, offerId: null, mealPlanId: null, cancellationSelected: false } : room
      );
      commit({ ...state, rooms }, { push: false });
    },
    [state, commit]
  );

  const selectOffer = useCallback(
    (roomIndex: number, offerId: string, defaultMealPlanId: string | null) => {
      const rooms = state.rooms.map((room, i) =>
        i === roomIndex
          ? { ...room, offerId, mealPlanId: defaultMealPlanId, cancellationSelected: false }
          : room
      );
      commit({ ...state, rooms });
    },
    [state, commit]
  );

  /** Atomically confirms a room's category + offer + upgrades in one URL update (avoids chaining separate stale-state updates). */
  const confirmRoomOffer = useCallback(
    (roomIndex: number, roomCategoryId: string, offerId: string, mealPlanId: string, cancellationSelected: boolean) => {
      const rooms = state.rooms.map((room, i) =>
        i === roomIndex ? { ...room, roomCategoryId, offerId, mealPlanId, cancellationSelected } : room
      );
      commit({ ...state, rooms });
    },
    [state, commit]
  );

  const setMealPlan = useCallback(
    (roomIndex: number, mealPlanId: string) => {
      const rooms = state.rooms.map((room, i) => (i === roomIndex ? { ...room, mealPlanId } : room));
      commit({ ...state, rooms }, { push: false });
    },
    [state, commit]
  );

  const setCancellation = useCallback(
    (roomIndex: number, selected: boolean) => {
      const rooms = state.rooms.map((room, i) => (i === roomIndex ? { ...room, cancellationSelected: selected } : room));
      commit({ ...state, rooms }, { push: false });
    },
    [state, commit]
  );

  const editRoom = useCallback(
    (roomIndex: number) => {
      const rooms = state.rooms.map((room, i) =>
        i === roomIndex ? { ...room, offerId: null, mealPlanId: null, cancellationSelected: false } : room
      );
      commit({ ...state, rooms }, { push: false });
    },
    [state, commit]
  );

  return {
    ...state,
    departure,
    activeRoomIndex,
    allRoomsConfirmed,
    setNights,
    setArrival,
    setRoomsCount,
    setRoomOccupancy,
    setRoomCategory,
    selectOffer,
    confirmRoomOffer,
    setMealPlan,
    setCancellation,
    editRoom,
  };
}

export type UseBookingStateReturn = ReturnType<typeof useBookingState>;
