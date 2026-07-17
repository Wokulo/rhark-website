import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutRequestId = searchParams.get("checkoutRequestId");

    if (!checkoutRequestId) {
      return NextResponse.json(
        { success: false, message: "checkoutRequestId is required" },
        { status: 400 }
      );
    }

    const donation = store.getDonationByCheckoutRequestId(checkoutRequestId);
    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        status: donation.status,
        transactionId: donation.transactionId,
        mpesaReceiptNumber: donation.mpesaReceiptNumber,
        checkoutRequestId: donation.mpesaCheckoutRequestId,
      },
    });
  } catch (error) {
    console.error("[M-Pesa Query] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
