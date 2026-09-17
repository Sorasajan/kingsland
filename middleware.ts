import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { hasPermission, methodToAction, resourceForPath, type Role } from "@/lib/permissions";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const isAdminPage = pathname.startsWith("/admin");
  const isPublicAdminPage = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isAdminApi = pathname.startsWith("/api/admin");

  // Every /api/admin/* and /admin/* route requires a valid session.
  if (isAdminApi && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (isAdminPage && !isPublicAdminPage && !session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Fine-grained permission gate: map the path to a resource (leads,
  // blog, users, ...) and the HTTP method to an action (read/write/
  // delete), then check the session's role actually grants it. This
  // covers every admin API route and admin page except the dashboard
  // shell itself (/admin, /admin/login) which any logged-in admin can see.
  if (session && (isAdminApi || (isAdminPage && !isPublicAdminPage))) {
    const resource = resourceForPath(pathname);
    if (resource) {
      const action = methodToAction(req.method);
      const allowed = hasPermission(session.role as Role, `${resource}:${action}`);
      if (!allowed) {
        if (isAdminApi) {
          return NextResponse.json(
            { error: "Forbidden — your role doesn't have access to this." },
            { status: 403 }
          );
        }
        // UI page the user can't view — send them back to the dashboard home.
        return NextResponse.redirect(new URL("/admin?forbidden=1", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
