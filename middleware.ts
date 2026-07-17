/**
 * Middleware — Supabase session refresh + route protection
 *
 * 1. Refreshes Supabase auth session on every request
 * 2. Redirects unauthenticated users away from /admin
 * 3. Blocks bot-like traffic on API routes
 * 4. Placeholder for rate limiting (Upstash Redis)
 */
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|documents|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};