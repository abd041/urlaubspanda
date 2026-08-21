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
 * Mobile (req 16): “Add Nth Room” + “Weiter” under the latest room;
 * Continue scrolls to Reisedauer. Desktop Add Room also under the last room.
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

  const addBtnClass =
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40";

  const renderOccupancy = (room: RoomSelection, roomIndex: number) => (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="min-w-0">
        <CounterStepper
          label={t("booking.adults")}
          sublabel={t("booking.adultsSub")}
          icon={User}
          iconClassName="lg:hidden"
          value={room.adults}
          min={1}
          max={6}
          onChange={(next) => onRoomOccupancyChange(roomIndex, next, room.childAges)}
        />
      </div>
      <div className="min-w-0">
        <CounterStepper
          label={t("booking.children")}
          sublabel={t("booking.childrenSub")}
          icon={Users}
          iconClassName="lg:hidden"
          value={room.childAges.length}
          min={0}
          max={4}
          onChange={(next) => setChildrenCount(roomIndex, next)}
        />
      </div>
      {room.childAges.length > 0 && (
        <div className="col-span-full space-y-1.5 sm:col-span-2">
          {room.childAges.map((age, i) => (
            <ChildAgeSelect
              key={i}
              index={i}
              age={age}
              onChange={(next) => updateChildAge(roomIndex, i, next)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-w-0">
      <div className="min-w-0 max-w-full lg:rounded-xl lg:border lg:border-line lg:p-4">
        {rooms.map((room, roomIndex) => {
          const isLast = roomIndex === rooms.length - 1;
          return (
            <div
              key={roomIndex}
              className={roomIndex === 0 ? undefined : "mt-5 border-t border-line pt-5"}
            >
              {hasExtraRooms && (
                <div className="mb-3 flex items-center justify-between gap-3">
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

              {renderOccupancy(room, roomIndex)}

              {/* Desktop: Add Room under the latest room */}
              {isLast && canAddRoom && (
                <button
                  type="button"
                  onClick={addRoom}
                  disabled={!canAddRoom}
                  aria-label={t("booking.addRoom")}
                  className={`${addBtnClass} mt-4 hidden lg:inline-flex`}
                >
                  <BedDouble className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  <span className="whitespace-nowrap">{t("booking.addRoom")}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                </button>
              )}

              {/* Mobile: Add Nth Room (left) + Continue (right) under the latest room */}
              {isLast && (
                <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
                  <button
                    type="button"
                    onClick={addRoom}
                    disabled={!canAddRoom}
                    aria-label={addRoomNLabel}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-2 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                    <span className="truncate">{addRoomNLabel}</span>
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
