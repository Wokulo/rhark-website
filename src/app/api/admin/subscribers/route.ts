import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    let items = store.listSubscribers();

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (s) =>
          s.email.toLowerCase().includes(q) ||
          (s.firstName && s.firstName.toLowerCase().includes(q))
      );
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    return NextResponse.json({ success: true, data: paged, total, page, pageSize });
  } catch (error) {
    console.error("[Admin Subscribers] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
