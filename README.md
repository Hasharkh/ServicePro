# ServicePro

ServicePro is a Next.js booking application for scheduling service appointments with a simple customer flow and an admin dashboard.

## What this project does

- Lets users choose a service from available options.
- Shows a date picker and service-specific available time slots.
- Prevents slot conflicts by checking availability for the selected service and date.
- Collects user name and email before showing a booking review panel.
- Creates appointments in a Supabase backend.
- Provides an admin dashboard for viewing all bookings.
- Allows admins to mark appointments as completed.
- Allows admins to delete completed appointments.
- Keeps completed appointments from blocking future slot availability.

## Key pages

- `/` — public booking interface
- `/admin` — protected admin dashboard

## Backend and data

- Uses Supabase server-side actions for booking storage.
- Stores booking fields such as `user_name`, `user_email`, `service_type`, `booking_date`, `time_slot`, and `status`.
- Prevents duplicate bookings for the same service, date, and time when the existing appointment is not completed.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Set required environment variables in a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_admin_password
```

3. Run the app:

```bash
npm run dev
```

4. Open the app at:

```
http://localhost:3000
```

5. Access the admin dashboard at:

```
http://localhost:3000/admin
```

## Notes

- The admin page currently uses a password-based check and does not require a full auth flow.
- Completed bookings are kept in the database but no longer reserve a time slot.
- The app is implemented using Next.js App Router, React, and Tailwind CSS.
