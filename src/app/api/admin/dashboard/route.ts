import { NextResponse } from "next/server";
import { store } from "@/lib/store";

/**
 * GET /api/admin/dashboard — Get dashboard statistics and notifications
 */
export async function GET() {
  try {
    const stats = store.getDashboardStats();
    const notifications = store.listNotifications(10);
    const unreadCount = store.getUnreadNotificationCount();

    return NextResponse.json({
      success: true,
      data: {
        stats,
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("[Admin Dashboard] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}