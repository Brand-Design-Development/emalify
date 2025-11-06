import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@emalify/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to login page and API routes
  if (pathname === "/login" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(env.SESSION_COOKIE_NAME)?.value;

  // If no session token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Session validation will be done in the layout/pages via server-side auth check
  // Middleware just checks for cookie presence
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
