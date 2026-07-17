import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { queryMpesaPaymentStatus } from "@/services/donation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutRequestId = searchParams.get("checkoutRequestId");
    const donationId = searchParams.get("donationId");

    if (!checkoutRequestId && !donationId) {
      return NextResponse.json(
        { success: false, message: "checkoutRequestId or donationId is required" },
        { status: 400 }
      );
    }

    let donation;
    if (donationId) {
      donation = store.getDonation(donationId);
    } else if (checkoutRequestId) {
      donation = store.getDonationByCheckoutRequestId(checkoutRequestId);
    }

    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 }
      );
    }

    if (donation.status === "successful" || donation.status === "failed" || donation.status === "cancelled") {
      return NextResponse.json({
        success: true,
        data: {
          status: donation.status,
          mpesaReceiptNumber: donation.mpesaReceiptNumber,
          transactionId: donation.transactionId,
        },
      });
    }

    if (checkoutRequestId) {
      const mpesaStatus = await queryMpesaPaymentStatus(checkoutRequestId);
      return NextResponse.json({
        success: true,
        data: {
          status: mpesaStatus.success ? "successful" : "pending",
          mpesaReceiptNumber: mpesaStatus.receiptNumber,
          resultCode: mpesaStatus.resultCode,
          resultDesc: mpesaStatus.resultDesc,
          transactionId: donation.transactionId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: donation.status,
        transactionId: donation.transactionId,
      },
    });
  } catch (error) {
    console.error("[Donate Status] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
