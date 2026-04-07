"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Users,
  Calendar,
  Clock,
  Mail,
  CheckCircle2,
  Zap,
  ArrowLeft,
} from "lucide-react";
import type { Booking } from "@/lib/supabase";
import { adminLogout } from "@/app/actions/auth";
import { markBookingCompleted, deleteBooking } from "@/app/actions/book";

interface AdminViewProps {
  bookings: Booking[];
}

const SERVICE_ICONS: Record<string, string> = {
  consultation: "💬",
  haircut: "✂️",
  massage: "🧘",
  dental: "🦷",
  coaching: "🎯",
  tutoring: "📚",
};

export default function AdminView({ bookings }: AdminViewProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleMarkCompleted = async (formData: FormData) => {
    const id = formData.get("bookingId") as string;
    setPendingId(id);
    try {
      await markBookingCompleted(formData);
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (formData: FormData) => {
    const id = formData.get("bookingId") as string;
    setPendingId(id);
    try {
      await deleteBooking(formData);
    } finally {
      setPendingId(null);
    }
  };
  const today = format(new Date(), "yyyy-MM-dd");
  const upcoming = bookings.filter((b) => b.status !== "completed");
  const completed = bookings.filter((b) => b.status === "completed");

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: Users, color: "#6366F1" },
    { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "#10B981" },
    { label: "Completed", value: completed.length, icon: CheckCircle2, color: "#818CF8" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-[#F0F6FC]">
            Service<span className="text-[#6366F1]">Pro</span>
          </span>
          <span className="ml-2 px-2 py-0.5 rounded-md bg-[#6366f120] text-[#818CF8] text-[10px] font-semibold tracking-widest uppercase border border-[#6366f130]">
            Admin
          </span>
        </div>
        <a
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#6366F1] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Booking
        </a>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-black text-[#F0F6FC] mb-1">
            Appointment <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm">
            All upcoming and past appointments — {format(new Date(), "MMMM d, yyyy")}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="bento-card p-5 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color }}>
                  {value}
                </p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[#21262d] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#6366F1]" />
            <h2 className="font-bold text-[#F0F6FC]">All Appointments</h2>
            <span className="ml-auto text-xs text-slate-500">{bookings.length} records</span>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-600">
              <Calendar className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No appointments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#21262d]">
                    {["Customer", "Email", "Service", "Date", "Time", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, i) => {
                    const isPast = booking.booking_date < today;
                    const isToday = booking.booking_date === today;
                    return (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * i }}
                        className="border-b border-[#21262d]/50 hover:bg-[#1C2230]/40 transition-colors"
                      >
                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#6366f115] border border-[#6366f130] flex items-center justify-center text-xs font-bold text-[#818CF8]">
                              {booking.user_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-[#F0F6FC]">
                              {booking.user_name}
                            </span>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail className="w-3.5 h-3.5 opacity-60" />
                            {booking.user_email}
                          </div>
                        </td>
                        {/* Service */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span>{SERVICE_ICONS[booking.service_type] || "📋"}</span>
                            <span className="text-sm text-[#F0F6FC] font-medium capitalize">
                              {booking.service_type}
                            </span>
                          </div>
                        </td>
                        {/* Date */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span
                              className={
                                isToday
                                  ? "text-[#10B981] font-semibold"
                                  : isPast
                                  ? "text-slate-600"
                                  : "text-[#F0F6FC]"
                              }
                            >
                              {format(parseISO(booking.booking_date), "MMM d, yyyy")}
                              {isToday && (
                                <span className="ml-1.5 text-[9px] bg-[#10b98120] text-[#10B981] px-1.5 py-0.5 rounded-full border border-[#10b98130] font-bold tracking-wide uppercase">
                                  Today
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        {/* Time */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-[#F0F6FC]">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {booking.time_slot}
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full uppercase ${
                                booking.status === "completed"
                                  ? "bg-[#21262d] text-slate-500 border border-[#30363d]"
                                  : "bg-[#10b98115] text-[#10B981] border border-[#10b98130]"
                              }`}
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {booking.status === "completed" ? "Completed" : "Confirmed"}
                            </span>

                            {booking.status !== "completed" ? (
                              <form action={handleMarkCompleted} className="mt-1">
                                <input type="hidden" name="bookingId" value={booking.id} />
                                <button
                                  type="submit"
                                  disabled={pendingId === booking.id}
                                  className="text-[11px] font-semibold text-[#6366F1] hover:text-[#818CF8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {pendingId === booking.id ? "Processing..." : "Mark completed"}
                                </button>
                              </form>
                            ) : (
                              <form action={handleDelete} className="mt-1">
                                <input type="hidden" name="bookingId" value={booking.id} />
                                <button
                                  type="submit"
                                  disabled={pendingId === booking.id}
                                  className="text-[11px] font-semibold text-[#F43F5E] hover:text-[#FB7185] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {pendingId === booking.id ? "Deleting..." : "Delete completed"}
                                </button>
                              </form>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Logout */}
        <div className="mt-6 text-center">
          <form action={adminLogout}>
            <button
              type="submit"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Sign out of admin
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
