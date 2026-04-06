"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Mail, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  data: {
    name: string;
    email: string;
    service: string;
    date: string;
    slot: string;
  };
}

const SERVICE_LABELS: Record<string, string> = {
  consultation: "Consultation",
  haircut: "Haircut & Styling",
  massage: "Massage Therapy",
  dental: "Dental Checkup",
  coaching: "Life Coaching",
  tutoring: "Tutoring Session",
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  data,
}: ConfirmationModalProps) {
  const formattedDate = data.date
    ? format(parseISO(data.date), "EEEE, MMMM d, yyyy")
    : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
          >
            <div className="glass-strong h-full flex flex-col rounded-l-2xl border-l border-[#6366f130] shadow-[0_0_60px_rgba(99,102,241,0.15)]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#21262d]">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[#6366F1] uppercase mb-1">
                    Review Your Appointment
                  </p>
                  <h2 className="text-xl font-bold text-[#F0F6FC]">Booking Summary</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#21262d] text-slate-400 hover:text-white hover:bg-[#30363d] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {/* Glow accent */}
                <div className="absolute top-24 right-8 w-32 h-32 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none" />

                {[
                  { icon: User, label: "Name", value: data.name },
                  { icon: Mail, label: "Email", value: data.email },
                  {
                    icon: Briefcase,
                    label: "Service",
                    value: SERVICE_LABELS[data.service] || data.service,
                  },
                  { icon: Calendar, label: "Date", value: formattedDate },
                  { icon: Clock, label: "Time", value: data.slot },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#0B0E14]/60 border border-[#21262d]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#6366f115] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#6366F1]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-[#F0F6FC]">{value}</p>
                    </div>
                  </div>
                ))}

                {/* Notice */}
                <div className="flex gap-3 p-4 rounded-xl bg-[#10b98110] border border-[#10b98130]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#10B981] leading-relaxed">
                    Your slot will be reserved immediately. A confirmation will be sent to your email.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#21262d] space-y-3">
                <motion.button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-[#6366F1] hover:bg-[#818CF8] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Booking
                    </>
                  )}
                </motion.button>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl border border-[#21262d] text-slate-400 hover:text-white hover:border-[#30363d] text-sm font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
