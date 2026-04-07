"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { ALL_TIME_SLOTS } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export type BookingResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function getBookedSlots(date: string, service_type: string): Promise<string[]> {
  try {
    const client = supabase();
    const { data, error } = await client
      .from("bookings")
      .select("time_slot")
      .eq("booking_date", date)
      .eq("service_type", service_type)
      .neq("status", "completed");

    if (error) {
      console.error("Error fetching booked slots:", error);
      return [];
    }

    return (data ?? []).map((booking) => booking.time_slot);
  } catch (error) {
    console.error("Unexpected error fetching booked slots:", error);
    return [];
  }
}

export async function getFullyBookedDates(service_type: string): Promise<string[]> {
  if (!service_type) {
    return [];
  }

  try {
    const client = supabase();
    const { data, error } = await client
      .from("bookings")
      .select("booking_date, time_slot")
      .eq("service_type", service_type)
      .neq("status", "completed");

    if (error) {
      console.error("Error fetching booked dates:", error);
      return [];
    }

    const dateCounts: Record<string, number> = {};
    for (const row of data ?? []) {
      dateCounts[row.booking_date] = (dateCounts[row.booking_date] || 0) + 1;
    }

    return Object.entries(dateCounts)
      .filter(([, count]) => count >= ALL_TIME_SLOTS.length)
      .map(([date]) => date);
  } catch (error) {
    console.error("Unexpected error fetching booked dates:", error);
    return [];
  }
}

export async function createBooking(formData: {
  user_name: string;
  user_email: string;
  service_type: string;
  booking_date: string;
  time_slot: string;
}): Promise<BookingResult> {
  try {
    const { user_name, user_email, service_type, booking_date, time_slot } = formData;

    if (!user_name || !user_email || !service_type || !booking_date || !time_slot) {
      return { success: false, error: "All fields are required." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (!ALL_TIME_SLOTS.includes(time_slot)) {
      return { success: false, error: "Invalid time slot selected." };
    }

    const client = supabase();

    const { data: existing, error: checkError } = await client
      .from("bookings")
      .select("id")
      .eq("booking_date", booking_date)
      .eq("time_slot", time_slot)
      .neq("status", "completed")
      .maybeSingle();

    if (checkError) {
      console.error("Check error:", checkError);
      return { success: false, error: "Could not verify slot availability. Please try again." };
    }

    if (existing) {
      return {
        success: false,
        error: "This slot was just taken! Please choose another time.",
      };
    }

    const { error: insertError } = await client.from("bookings").insert({
      user_name,
      user_email,
      service_type,
      booking_date,
      time_slot,
      status: "confirmed",
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return {
          success: false,
          error: "This slot was just taken by someone else. Please choose another time.",
        };
      }
      console.error("Insert error:", insertError);
      return { success: false, error: "Failed to create booking. Please try again." };
    }

    try {
      revalidatePath("/");
    } catch (error) {
      console.error("Could not revalidate booking page:", error);
    }

    try {
      revalidatePath("/admin");
    } catch (error) {
      console.error("Could not revalidate admin page:", error);
    }

    return { success: true, message: `Booking confirmed for ${booking_date} at ${time_slot}!` };
  } catch (error) {
    console.error("Unexpected booking error:", error);
    return { success: false, error: "Booking could not be completed. Please try again." };
  }
}

export async function markBookingCompleted(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  if (!bookingId) {
    return;
  }

  const admin = supabaseAdmin();
  const { error } = await admin
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId);

  if (error) {
    console.error("Could not mark booking completed:", error);
  }

  revalidatePath("/admin");
}

export async function deleteBooking(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  if (!bookingId) {
    return;
  }

  const admin = supabaseAdmin();
  const { error } = await admin.from("bookings").delete().eq("id", bookingId);

  if (error) {
    console.error("Could not delete booking:", error);
  }

  revalidatePath("/admin");
}

export async function getAllBookings() {
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: true })
      .order("time_slot", { ascending: true });

    if (error) {
      console.error("Error fetching all bookings:", error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("Unexpected error fetching all bookings:", error);
    return [];
  }
}
