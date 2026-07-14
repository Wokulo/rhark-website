import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

/**
 * GET /api/admin/emails — List sent emails with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    const result = store.listEmails(page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Admin Emails] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}