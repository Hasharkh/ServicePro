"use client";

import { DayPicker } from "react-day-picker";
import { format, parseISO, startOfToday, isBefore } from "date-fns";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  fullyBookedDates: string[];
}

export default function BookingCalendar({
  selectedDate,
  onSelectDate,
  fullyBookedDates,
}: BookingCalendarProps) {
  const today = startOfToday();

  // Parse fully booked dates
  const disabledDates = fullyBookedDates
    .map((d) => {
      try {
        return parseISO(d);
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Date[];

  // Disable past dates AND fully booked dates
  const isDisabled = (date: Date) => {
    if (isBefore(date, today)) return true;
    return disabledDates.some(
      (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="flex flex-col items-center">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        disabled={isDisabled}
        showOutsideDays={false}
        fromDate={today}
        modifiersClassNames={{
          selected: "rdp-day_selected",
          disabled: "rdp-day_disabled",
          today: "rdp-day_today",
        }}
      />

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
          <span className="text-slate-400">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span className="text-slate-400">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4d5566]" />
          <span className="text-slate-400">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
