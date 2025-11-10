import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    // Uses EMALIFY_LMS_API_KEY
    pathname.startsWith("/api/leads/new") ||
    // Uses CRON_SECRET
    pathname.startsWith("/api/cron/cleanup-sessions") ||
    pathname.startsWith("/login") ||
    // Custom handling of auth
    pathname.startsWith("/api/trpc")
  ) {
    return NextResponse.next();
  }

  const session = await getSession();
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

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

  runtime: "nodejs",
};
