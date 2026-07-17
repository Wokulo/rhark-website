import { NextRequest, NextResponse } from "next/server";
import { getMpesaAccessToken } from "@/lib/mpesa";

export async function GET() {
  try {
    const token = await getMpesaAccessToken();
    return NextResponse.json({ success: true, access_token: token });
  } catch (error) {
    console.error("[M-Pesa Token] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get M-Pesa access token" },
      { status: 500 }
    );
  }
}
