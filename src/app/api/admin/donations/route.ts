import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { DonationStatus, PaymentMethod } from "@/types";

/**
 * GET /api/admin/donations — List donations with filtering
 * GET /api/admin/donations?export=csv — Export donations as CSV
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // CSV export
    if (searchParams.get("export") === "csv") {
      const csv = store.exportDonationsCSV();
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="rhark-donations-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    const status = searchParams.get("status") as DonationStatus | undefined;
    const paymentMethod = searchParams.get("paymentMethod") as PaymentMethod | undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const sortBy = (searchParams.get("sortBy") as "createdAt" | "amount" | "status") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const result = store.listDonations({
      status,
      paymentMethod,
      search,
      page,
      pageSize,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Admin Donations] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/donations — Update donation status
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Donation ID and status are required." },
        { status: 400 }
      );
    }

    const validStatuses: DonationStatus[] = ["pending", "successful", "failed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status." },
        { status: 400 }
      );
    }

    const donation = store.updateDonation(id, { status });
    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Donation status updated to ${status}.`,
      data: donation,
    });
  } catch (error) {
    console.error("[Admin Donations] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}