import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "../_components/AdminSidebar";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import type { Role } from "@/lib/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  // middleware.ts already enforces this for every request, but guard here
  // too so this layout never renders without a session (e.g. direct RSC
  // navigation edge cases).
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar role={session.role as Role} name={session.name} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
    </div>
  );
}
