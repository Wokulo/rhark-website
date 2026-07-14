import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validations";
import { store } from "@/lib/store";
import { createSession, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const admin = store.getAdminByEmail(email);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = createSession(admin.email, admin.role);
    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      data: { email: admin.email, name: admin.name, role: admin.role },
    });

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("[Admin Auth] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("rhark_admin_session")?.value;
    if (token) {
      clearSessionCookie(request as unknown as NextResponse);
    }
    const response = NextResponse.json({ success: true, message: "Logged out successfully." });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("[Admin Auth] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
