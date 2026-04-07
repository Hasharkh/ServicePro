"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock, CheckCircle2, Zap, Shield, Star, Briefcase, User } from "lucide-react";
import BookingCalendar from "@/components/BookingCalendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import ConfirmationModal from "@/components/ConfirmationModal";
import { getBookedSlots, getFullyBookedDates, createBooking } from "@/app/actions/book";

const SERVICES = [
  { id: "consultation", label: "Consultation", icon: "💬", duration: "60 min" },
  { id: "haircut", label: "Haircut & Styling", icon: "✂️", duration: "45 min" },
  { id: "massage", label: "Massage Therapy", icon: "🧘", duration: "90 min" },
  { id: "dental", label: "Dental Checkup", icon: "🦷", duration: "30 min" },
  { id: "coaching", label: "Life Coaching", icon: "🎯", duration: "60 min" },
  { id: "tutoring", label: "Tutoring Session", icon: "📚", duration: "60 min" },
];

type Step = "service" | "datetime" | "details";

export default function BookingPage() {
  const [step, setStep] = useState<Step>("service");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [fullyBookedDates, setFullyBookedDates] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Load service-specific fully booked dates when the selected service changes
  useEffect(() => {
    if (!selectedService) {
      setFullyBookedDates([]);
      return;
    }

    getFullyBookedDates(selectedService).then(setFullyBookedDates);
  }, [selectedService]);

  // Load service-specific booked slots when date or service changes
  useEffect(() => {
    let isMounted = true;

    if (!selectedDate || !selectedService) {
      setBookedSlots([]);
      setSelectedSlot(null);
      setIsLoadingSlots(false);
      return;
    }

    setIsLoadingSlots(true);
    setSelectedSlot(null);

    (async () => {
      try {
        const slots = await getBookedSlots(format(selectedDate, "yyyy-MM-dd"), selectedService);
        if (!isMounted) return;
        setBookedSlots(slots);
      } catch {
        if (!isMounted) return;
        setBookedSlots([]);
        setErrorMsg("Could not load time slots. Please try again.");
      } finally {
        if (isMounted) {
          setIsLoadingSlots(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedService]);

  useEffect(() => {
    if (!successMsg && !errorMsg) return;

    const timeout = window.setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 4200);

    return () => window.clearTimeout(timeout);
  }, [successMsg, errorMsg]);

  const handleReviewBooking = () => {
    if (!name || !email || !selectedService || !selectedDate || !selectedSlot) return;
    setModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot || !selectedService) return;
    setErrorMsg("");

    startTransition(async () => {
      const result = await createBooking({
        user_name: name,
        user_email: email,
        service_type: selectedService,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        time_slot: selectedSlot,
      });

      if (result.success) {
        setModalOpen(false);
        setSuccessMsg(result.message);
        // Reset
        setSelectedDate(undefined);
        setSelectedSlot(null);
        setSelectedService("");
        setFullyBookedDates([]);
        setName("");
        setEmail("");
        setStep("service");
      } else {
        setModalOpen(false);
        setErrorMsg(result.error);
        // Refresh slots to reflect updated state
        if (selectedDate && selectedService) {
          getBookedSlots(format(selectedDate, "yyyy-MM-dd"), selectedService).then(setBookedSlots);
        }
      }
    });
  };

  const stepIndex = { service: 0, datetime: 1, details: 2 };
  const canProceedToDateTime = !!selectedService;
  const canProceedToDetails = !!selectedDate && !!selectedSlot;
  const canSubmit = !!name && !!email;

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-30 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-base sm:text-lg tracking-tight text-[#F0F6FC]">
            Service<span className="text-[#6366F1]">Pro</span>
          </span>
        </div>
        <div className="hidden min-[360px]:flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
          <Shield className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Secure Booking</span>
        </div>
        <a
          href="/admin"
          className="text-xs font-semibold text-slate-500 hover:text-[#6366F1] transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-[#6366f130]"
        >
          Admin →
        </a>
      </nav>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6366f115] border border-[#6366f130] text-[#818CF8] text-xs font-semibold mb-4 tracking-widest uppercase">
            <Star className="w-3 h-3" />
            Premium Scheduling
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F0F6FC] leading-tight mb-3">
            Book Your{" "}
            <span className="gradient-text">Appointment</span>
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
            Reserve your slot in seconds. No sign-up required. Instant confirmation.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-10 px-2.5">
          <div className="flex flex-nowrap max-[360px]:flex-wrap items-center justify-center gap-0 max-[360px]:gap-2">
          {(["service", "datetime", "details"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => {
                  if (i === 0) setStep("service");
                  if (i === 1 && canProceedToDateTime) setStep("datetime");
                  if (i === 2 && canProceedToDateTime && canProceedToDetails) setStep("details");
                }}
                className={`flex items-center gap-1 min-[520px]:gap-2 px-2 min-[520px]:px-4 py-2 rounded-full text-[11px] min-[520px]:text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                  stepIndex[step] === i
                    ? "bg-[#6366F1] text-white shadow-[0_0_16px_rgba(99,102,241,0.5)]"
                    : stepIndex[step] > i
                    ? "bg-[#10b98120] text-[#10B981] border border-[#10b98140]"
                    : "bg-[#161B22] text-slate-500 border border-[#21262d]"
                }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-white/10">
                  {stepIndex[step] > i ? "✓" : i + 1}
                </span>
                {s === "service" ? "Service" : s === "datetime" ? <><span className="min-[520px]:hidden">Date</span><span className="hidden min-[520px]:inline">Date & Time</span></> : <><span className="min-[520px]:hidden">Details</span><span className="hidden min-[520px]:inline">Your Details</span></>}
              </button>
              {i < 2 && (
                <div
                  className={`block max-[360px]:hidden w-4 min-[520px]:w-8 h-px mx-1 transition-all ${
                    stepIndex[step] > i ? "bg-[#10B981]/40" : "bg-[#21262d]"
                  }`}
                />
              )}
            </div>
          ))}
          </div>
        </div>

        {/* Success / Error toast */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#10b98115] border border-[#10b98140] text-[#10B981] text-sm font-semibold shadow-lg max-w-lg w-[min(95vw,420px)]"
            >
              <CheckCircle2 className="w-5 h-5" />
              {successMsg}
              <button onClick={() => setSuccessMsg("")} className="ml-2 text-xs text-[#10B981]/60 hover:text-[#10B981]">✕</button>
            </motion.div>
          )}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#f43f5e15] border border-[#f43f5e40] text-[#F43F5E] text-sm font-semibold shadow-lg max-w-lg w-[min(95vw,420px)]"
            >
              ⚠️ {errorMsg}
              <button onClick={() => setErrorMsg("")} className="ml-2 text-xs text-[#F43F5E]/60 hover:text-[#F43F5E]">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Step 1: Service Selection */}
          <AnimatePresence mode="wait">
            {step === "service" && (
              <motion.div
                key="service-step"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-3"
              >
                <div className="bento-card p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="w-4 h-4 text-[#6366F1]" />
                    <h2 className="font-bold text-[#F0F6FC]">Select a Service</h2>
                    <span className="ml-auto text-xs text-slate-500">Step 1 of 3</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SERVICES.map((service) => (
                      <motion.button
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedService(service.id)}
                        className={`relative flex flex-col items-start gap-2 p-5 rounded-xl border text-left transition-all duration-200 ${
                          selectedService === service.id
                            ? "bg-[#6366f115] border-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                            : "bg-[#0B0E14] border-[#21262d] hover:border-[#6366f150]"
                        }`}
                      >
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <p className="font-bold text-sm text-[#F0F6FC]">{service.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{service.duration}</p>
                        </div>
                        {selectedService === service.id && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#6366F1] flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => canProceedToDateTime && setStep("datetime")}
                      disabled={!canProceedToDateTime}
                      className="px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#818CF8] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_16px_rgba(99,102,241,0.3)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                      Continue →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === "datetime" && (
              <motion.div
                key="datetime-step"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* Calendar Tile */}
                <div className="bento-card p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Calendar className="w-4 h-4 text-[#6366F1]" />
                    <h2 className="font-bold text-[#F0F6FC]">Pick a Date</h2>
                  </div>
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    fullyBookedDates={fullyBookedDates}
                  />
                </div>

                {/* Time Slots Tile */}
                <div className="bento-card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Clock className="w-4 h-4 text-[#6366F1]" />
                    <h2 className="font-bold text-[#F0F6FC]">
                      {selectedDate
                        ? `Slots for ${format(selectedDate, "MMM d")}`
                        : "Select a Date First"}
                    </h2>
                  </div>
                  {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-600 text-sm gap-2">
                      <Calendar className="w-8 h-8 opacity-30" />
                      <span>Choose a date to see available times</span>
                    </div>
                  ) : (
                    <TimeSlotPicker
                      bookedSlots={bookedSlots}
                      selectedSlot={selectedSlot}
                      onSelectSlot={setSelectedSlot}
                      isLoading={isLoadingSlots}
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="md:col-span-2 flex flex-col min-[360px]:flex-row gap-2.5 min-[360px]:gap-0 justify-between">
                  <button
                    onClick={() => setStep("service")}
                    className="px-5 py-2.5 rounded-xl border border-[#21262d] text-slate-400 hover:text-white hover:border-[#30363d] text-sm font-medium transition-all"
                  >
                    ← Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => canProceedToDetails && setStep("details")}
                    disabled={!canProceedToDetails}
                    className="px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#818CF8] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_16px_rgba(99,102,241,0.3)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Continue →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Details */}
            {step === "details" && (
              <motion.div
                key="details-step"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* Form */}
                <div className="bento-card p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <User className="w-4 h-4 text-[#6366F1]" />
                    <h2 className="font-bold text-[#F0F6FC]">Your Details</h2>
                    <span className="ml-auto text-xs text-slate-500">Step 3 of 3</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#0B0E14] border border-[#21262d] rounded-xl px-4 py-3 text-sm text-[#F0F6FC] placeholder:text-slate-600 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366f140] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-[#0B0E14] border border-[#21262d] rounded-xl px-4 py-3 text-sm text-[#F0F6FC] placeholder:text-slate-600 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366f140] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Sidebar */}
                <div className="bento-card p-4 sm:p-6 bg-[#0d1117] border-[#6366f120]">
                  <h3 className="text-xs font-semibold tracking-widest text-[#6366F1] uppercase mb-4">
                    Appointment Summary
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Service",
                        value: SERVICES.find((s) => s.id === selectedService)?.label || "",
                      },
                      {
                        label: "Date",
                        value: selectedDate ? format(selectedDate, "MMMM d, yyyy") : "",
                      },
                      { label: "Time", value: selectedSlot || "" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center py-2.5 border-b border-[#21262d]">
                        <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                          {label}
                        </span>
                        <span className="text-sm font-bold text-[#F0F6FC]">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-3 rounded-xl bg-[#10b98110] border border-[#10b98130] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs text-[#10B981] font-medium">
                      Your data is secure and never shared.
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="md:col-span-2 flex flex-col min-[360px]:flex-row gap-2.5 min-[360px]:gap-0 justify-between">
                  <button
                    onClick={() => setStep("datetime")}
                    className="px-5 py-2.5 rounded-xl border border-[#21262d] text-slate-400 hover:text-white hover:border-[#30363d] text-sm font-medium transition-all"
                  >
                    ← Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReviewBooking}
                    disabled={!canSubmit}
                    className="px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#818CF8] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Review Booking →
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmBooking}
        isSubmitting={isPending}
        data={{
          name,
          email,
          service: selectedService,
          date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
          slot: selectedSlot || "",
        }}
      />
    </div>
  );
}

