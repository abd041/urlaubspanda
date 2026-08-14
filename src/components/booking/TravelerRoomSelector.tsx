"use client";

import { useState } from "react";
import { BedDouble, ChevronDown, Info, Plus, Trash2, User, Users } from "lucide-react";
import type { RoomSelection } from "@/hooks/useBookingState";
import { CounterStepper } from "@/components/booking/CounterStepper";
import { ChildAgeSelect } from "@/components/booking/ChildAgeSelect";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

const MAX_ROOMS = 6;

interface TravelerRoomSelectorProps {
  rooms: RoomSelection[];
  onRoomOccupancyChange: (roomIndex: number, adults: number, childAges: number[]) => void;
  onRoomsCountChange: (count: number) => void;
}

export function TravelerRoomSelector({
  rooms,
  onRoomOccupancyChange,
  onRoomsCountChange,
}: TravelerRoomSelectorProps) {
  const t = useT();
  const [panelOpen, setPanelOpen] = useState(false);
  const firstRoom = rooms[0];
  const extraRooms = rooms.slice(1);

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

  return (
    <div className="min-w-0">
      <div className="min-w-0 max-w-full lg:rounded-xl lg:border lg:border-line lg:p-4">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(11.5rem,auto)] lg:items-center">
          <CounterStepper
            label={t("booking.adults")}
            sublabel={t("booking.adultsSub")}
            icon={User}
            iconClassName="lg:hidden"
            value={firstRoom.adults}
            min={1}
            max={6}
            onChange={(next) => onRoomOccupancyChange(0, next, firstRoom.childAges)}
          />
          <CounterStepper
            label={t("booking.children")}
            sublabel={t("booking.childrenSub")}
            icon={Users}
            iconClassName="lg:hidden"
            value={firstRoom.childAges.length}
            min={0}
            max={4}
            onChange={(next) => setChildrenCount(0, next)}
          />
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
            className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-line px-3 py-2.5 text-left text-sm font-medium text-ink transition hover:border-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:col-span-2 lg:col-span-1"
          >
            <span className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-brand-500" aria-hidden="true" />
              {rooms.length > 1 ? t("booking.roomsCount", { count: rooms.length }) : t("booking.addRoom")}
            </span>
            <ChevronDown
              className={cn("h-4 w-4 text-muted transition-transform", panelOpen && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        </div>

        {panelOpen && (
          <div className="mt-3 space-y-3 rounded-xl border border-line bg-white p-4 shadow-sm">
            {extraRooms.map((room, extraIndex) => {
              const roomIndex = extraIndex + 1;
              return (
                <div key={roomIndex} className="rounded-lg border border-line p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">{t("booking.roomN", { n: roomIndex + 1 })}</p>
                    <button
                      type="button"
                      onClick={() => onRoomsCountChange(rooms.length - 1)}
                      aria-label={t("booking.removeRoom", { n: roomIndex + 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <CounterStepper
                      label={t("booking.adults")}
                      icon={User}
                      value={room.adults}
                      min={1}
                      max={6}
                      onChange={(next) => onRoomOccupancyChange(roomIndex, next, room.childAges)}
                    />
                    <CounterStepper
                      label={t("booking.children")}
                      icon={Users}
                      value={room.childAges.length}
                      min={0}
                      max={4}
                      onChange={(next) => setChildrenCount(roomIndex, next)}
                    />
                  </div>
                  {room.childAges.length > 0 && (
                    <div className="mt-2 space-y-1.5">
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
            })}

            {rooms.length < MAX_ROOMS && (
              <button
                type="button"
                onClick={() => onRoomsCountChange(rooms.length + 1)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-line py-2.5 text-sm font-semibold text-brand-500 transition hover:bg-brand-50"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t("booking.addAnotherRoom")}
              </button>
            )}

            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="flex w-full items-center justify-center rounded-lg bg-ink py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              {t("booking.done")}
            </button>
          </div>
        )}

        {firstRoom.childAges.length === 0 ? (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#FFF6D8] px-3 py-2.5 text-sm leading-relaxed text-[#8A6A00]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{t("booking.childAgeHint")}</p>
          </div>
        ) : (
          <div className="mt-3 space-y-1.5">
            {firstRoom.childAges.map((age, i) => (
              <ChildAgeSelect key={i} index={i} age={age} onChange={(next) => updateChildAge(0, i, next)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

