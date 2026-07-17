import { NextRequest, NextResponse } from "next/server";
import { parseMpesaCallback } from "@/lib/mpesa";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    const callback = parseMpesaCallback(body);
    if (!callback) {
      console.error("[M-Pesa Callback] Invalid callback structure");
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback" });
    }

    console.log(`[M-Pesa Callback] CheckoutRequestID: ${callback.checkoutRequestId}, ResultCode: ${callback.resultCode}`);

    const donation = store.getDonationByCheckoutRequestId(callback.checkoutRequestId);
    if (!donation) {
      console.error(`[M-Pesa Callback] Donation not found for CheckoutRequestID: ${callback.checkoutRequestId}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Donation not found" });
    }

    if (callback.isSuccessful) {
      store.updateDonation(donation.id, {
        status: "successful",
        mpesaReceiptNumber: callback.receiptNumber,
      });
      console.log(`[M-Pesa Callback] Donation ${donation.id} marked as successful`);
    } else {
      store.updateDonation(donation.id, {
        status: "failed",
      });
      console.log(`[M-Pesa Callback] Donation ${donation.id} marked as failed: ${callback.resultDesc}`);
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Success",
    });
  } catch (error) {
    console.error("[M-Pesa Callback] Error:", error);
    return NextResponse.json({
      ResultCode: 1,
      ResultDesc: "Internal server error",
    });
  }
}
