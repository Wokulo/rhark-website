/**
 * Supabase Middleware Client
 * Used in middleware.ts to refresh sessions and protect routes.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/auth")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin")) {
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  // Block empty User-Agent on API routes
  if (pathname.startsWith("/api/")) {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (!userAgent || userAgent.trim() === "") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return supabaseResponse;
}

/**
 * Role-based route protection helper.
 * Checks if the authenticated user has one of the required roles.
 * Intended for use in route handlers and middleware extensions.
 */
export async function getUserRole(
  request: NextRequest
): Promise<string | null> {
  const cookieValue = request.cookies.get("rhark_admin_session")?.value;
  if (!cookieValue) return null;

  try {
    const [encoded] = cookieValue.split(".");
    if (!encoded) return null;
    const decoded = atob(encoded);
    const [, role] = decoded.split(":");
    return role ?? null;
  } catch {
    return null;
  }
}

export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<{ authorized: boolean; role?: string }> {
  const userRole = await getUserRole(request);
  if (!userRole) {
    return { authorized: false };
  }
  if (!allowedRoles.includes(userRole)) {
    return { authorized: false, role: userRole };
  }
  return { authorized: true, role: userRole };
}