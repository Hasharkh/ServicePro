import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllBookings } from "@/app/actions/book";
import AdminView from "./AdminView";

export const metadata = {
  title: "Admin | Service Pro",
  description: "Private appointment management dashboard.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { password?: string; error?: string };
}) {
  const adminPassword = (process.env.ADMIN_PASSWORD || "servicepro-admin-2024").trim();
  const cookieStore = cookies();
  const authCookie = cookieStore.get("admin_auth");

  const isAuthenticated =
    authCookie?.value === adminPassword ||
    searchParams?.password?.trim() === adminPassword;

  if (!isAuthenticated) {
    return <AdminLoginPage hasError={searchParams?.error === "1"} />;
  }

  const bookings = await getAllBookings();

  return <AdminView bookings={bookings} />;
}

function AdminLoginPage({ hasError = false }: { hasError?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bento-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#6366f115] border border-[#6366f130] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-[#6366F1]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-black text-[#F0F6FC] mb-1">Admin Access</h1>
          <p className="text-sm text-slate-500">
            Enter the admin password to continue
          </p>
        </div>

        {hasError && (
          <div className="mb-4 rounded-xl border border-[#f43f5e40] bg-[#f43f5e15] px-4 py-3 text-sm font-medium text-[#F43F5E]">
            Incorrect password. Please try again.
          </div>
        )}

        <form
          action={async (formData: FormData) => {
            "use server";
            const pw = String(formData.get("password") || "").trim();
            const adminPw = (process.env.ADMIN_PASSWORD || "servicepro-admin-2024").trim();
            if (pw === adminPw) {
              cookies().set("admin_auth", pw, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 8, // 8 hours
              });
              redirect("/admin");
            } else {
              redirect("/admin?error=1");
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter admin password"
              className="w-full bg-[#0B0E14] border border-[#21262d] rounded-xl px-4 py-3 text-sm text-[#F0F6FC] placeholder:text-slate-600 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366f140] transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#818CF8] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_16px_rgba(99,102,241,0.3)]"
          >
            Access Dashboard →
          </button>
        </form>
      </div>
    </div>
  );
}
