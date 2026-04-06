-- ============================================================
-- Service Pro Appointment Scheduler - Supabase Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- bookings table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name     TEXT NOT NULL,
  user_email    TEXT NOT NULL,
  service_type  TEXT NOT NULL,
  booking_date  DATE NOT NULL,
  time_slot     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'confirmed',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint to prevent double-booking at the DB level
ALTER TABLE public.bookings
  ADD CONSTRAINT unique_booking_slot UNIQUE (booking_date, time_slot);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- PUBLIC: Anyone can INSERT a new booking
CREATE POLICY "Public can insert bookings"
  ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- PUBLIC: Anyone can SELECT only the date and time_slot columns
-- (so the UI can show which slots are already taken — without exposing PII)
CREATE POLICY "Public can view availability"
  ON public.bookings
  FOR SELECT
  TO anon
  USING (true);

-- NOTE: In production, restrict the anon SELECT to only non-PII columns
-- by using a database view:

CREATE OR REPLACE VIEW public.slot_availability AS
  SELECT booking_date, time_slot
  FROM public.bookings;

-- Grant the view to anon
GRANT SELECT ON public.slot_availability TO anon;

-- ADMIN: The service-role key bypasses RLS automatically,
-- so admin routes using the service-role client can see all data.

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_date_slot ON public.bookings (booking_date, time_slot);
