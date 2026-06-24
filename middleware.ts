import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATHS = ["/admin"];
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ananta.com";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login page without authentication
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check if route requires admin auth
  const isAdminRoute = ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (isAdminRoute) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Simple token validation - verify token contains admin email
    try {
      const decoded = JSON.parse(atob(token));
      const isValidToken = decoded.email === ADMIN_EMAIL;

      if (!isValidToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
