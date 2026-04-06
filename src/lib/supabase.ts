import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client — for client-side usage (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — for server-side usage only (bypasses RLS)
// NEVER expose this to the browser
export const supabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
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
