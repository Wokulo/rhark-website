import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

/**
 * Middleware runs on every matched request before it reaches the page/API.
 *
 * Current responsibilities:
 * 1. Block suspicious bot patterns on API routes (empty User-Agent)
 * 2. Protect admin routes and API endpoints with session authentication
 * 3. Placeholder for rate limiting (implement with Upstash Redis when needed)
 *
 * Security headers are set in next.config.ts (applies to all responses).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Block empty User-Agent on API routes (basic bot protection) ─────────────
  if (pathname.startsWith("/api/")) {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (!userAgent || userAgent.trim() === "") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // ── Protect admin API routes ────────────────────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("rhark_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  // ── Protect admin pages ─────────────────────────────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/auth")) {
    const token = request.cookies.get("rhark_admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }

    const session = await verifySession(token);
    if (!session) {
      const response = NextResponse.redirect(new URL("/admin/auth/login", request.url));
      response.cookies.delete("rhark_admin_session");
      return response;
    }
  }

  // ── Future: Rate limiting ────────────────────────────────────────────────────
  // Uncomment and configure with Upstash Redis when contact/donate forms go live:
  // if (pathname.startsWith("/api/contact") || pathname.startsWith("/api/newsletter")) {
  //   const ip = request.ip ?? "unknown";
  //   const { success } = await ratelimit.limit(ip);
  //   if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|documents).*)",
  ],
};
