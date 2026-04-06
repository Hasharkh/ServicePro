"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";
import { ALL_TIME_SLOTS } from "@/lib/constants";
import { clsx } from "clsx";

interface TimeSlotPickerProps {
  bookedSlots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  isLoading: boolean;
}

export default function TimeSlotPicker({
  bookedSlots,
  selectedSlot,
  onSelectSlot,
  isLoading,
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#6366F1]" />
        <span className="text-sm font-medium">Loading availability...</span>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="timeslots"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-3 gap-2.5"
      >
        {ALL_TIME_SLOTS.map((slot, i) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;

          return (
            <motion.button
              key={slot}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: i * 0.04,
              }}
              whileTap={!isBooked ? { scale: 0.93 } : {}}
              whileHover={!isBooked ? { scale: 1.04 } : {}}
              onClick={() => !isBooked && onSelectSlot(slot)}
              disabled={isBooked}
              className={clsx(
                "relative flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none",
                {
                  // Selected state
                  "bg-[#6366F1] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-[#818CF8]/50":
                    isSelected && !isBooked,
                  // Available state
                  "bg-[#10b98115] text-[#10B981] border border-[#10b98130] hover:bg-[#10b98125] hover:border-[#10b98160]":
                    !isBooked && !isSelected,
                  // Booked/Occupied state
                  "bg-[#161B22] text-[#4d5566] border border-[#21262d] cursor-not-allowed opacity-60":
                    isBooked,
                }
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="slot-glow"
                  className="absolute inset-0 rounded-xl bg-[#6366F1]/20 blur-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Clock className="w-3 h-3 mb-1 opacity-70" />
              <span className="relative z-10">{slot}</span>
              {isBooked && (
                <span className="text-[9px] mt-0.5 opacity-70 font-normal">Occupied</span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
