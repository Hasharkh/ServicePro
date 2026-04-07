import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

// Public client — for client-side usage (respects RLS)
export const supabase = () =>
  createClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );

// Admin client — for server-side usage only (bypasses RLS)
// NEVER expose this to the browser
export const supabaseAdmin = () => {
  const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export type Booking = {
  id: string;
  user_name: string;
  user_email: string;
  service_type: string;
  booking_date: string;
  time_slot: string;
  status: string;
  created_at: string;
};

export type SlotAvailability = {
  booking_date: string;
  time_slot: string;
};
