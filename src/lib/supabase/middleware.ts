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