"use client";

import { BedDouble, Plus, Trash2, User, Users } from "lucide-react";
import type { RoomSelection } from "@/hooks/useBookingState";
import { CounterStepper } from "@/components/booking/CounterStepper";
import { ChildAgeSelect } from "@/components/booking/ChildAgeSelect";
import { useT } from "@/i18n/LocaleProvider";

const MAX_ROOMS = 6;

interface TravelerRoomSelectorProps {
  rooms: RoomSelection[];
  onRoomOccupancyChange: (roomIndex: number, adults: number, childAges: number[]) => void;
  onRoomsCountChange: (count: number) => void;
  onContinue?: () => void;
}

/**
 * Guest/room selector.
 * Desktop: adults + children + add-room share one row.
 * Mobile: stacked counters; bottom row always = Add room | Continue.
 */
export function TravelerRoomSelector({
  rooms,
  onRoomOccupancyChange,
  onRoomsCountChange,
  onContinue,
}: TravelerRoomSelectorProps) {
  const t = useT();
  const canAddRoom = rooms.length < MAX_ROOMS;
  const hasExtraRooms = rooms.length > 1;
  const nextRoomNumber = rooms.length + 1;
  const addRoomNLabel =
    nextRoomNumber === 2
      ? t("booking.addRoom2")
      : nextRoomNumber === 3
        ? t("booking.addRoom3")
        : t("booking.addRoomN", { n: nextRoomNumber });

  const updateChildAge = (roomIndex: number, childIndex: number, age: number) => {
    const room = rooms[roomIndex];
    const nextAges = [...room.childAges];
    nextAges[childIndex] = age;
    onRoomOccupancyChange(roomIndex, room.adults, nextAges);
  };

  const setChildrenCount = (roomIndex: number, count: number) => {
    const room = rooms[roomIndex];
    const nextAges = Array.from({ length: count }, (_, i) => room.childAges[i]).map((age) =>
      age === undefined ? 6 : age
    );
    onRoomOccupancyChange(roomIndex, room.adults, nextAges);
  };

  const addRoom = () => onRoomsCountChange(rooms.length + 1);

  const desktopAddRoomButton = (
    <button
      type="button"
      onClick={addRoom}
      disabled={!canAddRoom}
      aria-label={t("booking.addRoom")}
      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <BedDouble className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
      <span className="whitespace-nowrap">{t("booking.addRoom")}</span>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
        <Plus className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
      </span>
    </button>
  );

  const renderCounters = (room: RoomSelection, roomIndex: number, compact: boolean) => (
    <>
      <CounterStepper
        compact={compact}
        label={t("booking.adults")}
        sublabel={t("booking.adultsSub")}
        icon={User}
        iconClassName="lg:hidden"
        value={room.adults}
        min={1}
        max={6}
        onChange={(next) => onRoomOccupancyChange(roomIndex, next, room.childAges)}
      />
      <CounterStepper
        compact={compact}
        label={t("booking.children")}
        sublabel={t("booking.childrenSub")}
        icon={Users}
        iconClassName="lg:hidden"
        value={room.childAges.length}
        min={0}
        max={4}
        onChange={(next) => setChildrenCount(roomIndex, next)}
      />
    </>
  );

  const renderChildAges = (room: RoomSelection, roomIndex: number) =>
    room.childAges.length > 0 ? (
      <div className="mt-4 space-y-2">
        {room.childAges.map((age, i) => (
          <ChildAgeSelect
            key={i}
            index={i}
            age={age}
            onChange={(next) => updateChildAge(roomIndex, i, next)}
          />
        ))}
      </div>
    ) : null;

  return (
    <div className="min-w-0">
      <div className="min-w-0 max-w-full lg:rounded-xl lg:border lg:border-line lg:p-4">
        {rooms.map((room, roomIndex) => {
          const isLast = roomIndex === rooms.length - 1;
          const mobileAddLabel = hasExtraRooms ? addRoomNLabel : t("booking.addRoom");

          return (
            <div
              key={roomIndex}
              className={roomIndex === 0 ? undefined : "mt-6 border-t border-line pt-6 sm:mt-7 sm:pt-7"}
            >
              {hasExtraRooms && (
                <div className="mb-3.5 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink">{t("booking.roomN", { n: roomIndex + 1 })}</p>
                  {roomIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => onRoomsCountChange(rooms.length - 1)}
                      aria-label={t("booking.removeRoom", { n: roomIndex + 1 })}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="h-8 w-8" aria-hidden="true" />
                  )}
                </div>
              )}

              {/* Desktop only: adults + children + add room in one row */}
              <div className="hidden min-w-0 items-center gap-8 lg:flex xl:gap-10">
                {renderCounters(room, roomIndex, true)}
                {isLast && canAddRoom && <div className="ml-auto shrink-0">{desktopAddRoomButton}</div>}
              </div>

              {/* Mobile / tablet: counters only — actions stay in the bottom row */}
              <div className="grid min-w-0 grid-cols-1 gap-4 lg:hidden">
                {renderCounters(room, roomIndex, false)}
              </div>

              {renderChildAges(room, roomIndex)}

              {/* Mobile: Add room (left) + Continue (right) — never full-width Weiter alone */}
              {isLast && (
                <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
                  <button
                    type="button"
                    onClick={addRoom}
                    disabled={!canAddRoom}
                    aria-label={mobileAddLabel}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-white px-2 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                    <span className="truncate">{mobileAddLabel}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onContinue}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-2 py-2 text-sm font-bold text-white transition hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    {t("booking.continue")}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
