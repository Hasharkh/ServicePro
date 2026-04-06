"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogout() {
  (await cookies()).delete("admin_auth");
  redirect("/admin");
}
