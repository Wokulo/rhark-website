import { NextRequest, NextResponse } from "next/server";
import { initiateStkPush } from "@/lib/mpesa";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, phone, donorName, email } = body;

    if (!amount || !phone || !donorName) {
      return NextResponse.json(
        { success: false, message: "Amount, phone, and donor name are required" },
        { status: 400 }
      );
    }

    const result = await initiateStkPush({
      amount: Number(amount),
      phone: String(phone),
      donorName: String(donorName),
      email: email ? String(email) : undefined,
    });

    if (result.success && result.checkoutRequestId) {
      const transactionId = `RHARK-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${String(Date.now()).slice(-6)}`;
      
      store.createDonation({
        transactionId: result.transactionId || transactionId,
        donorName,
        email: email || "",
        phone,
        amount: Number(amount),
        paymentMethod: "mpesa",
        status: "pending",
        mpesaCheckoutRequestId: result.checkoutRequestId,
        merchantRequestId: result.merchantRequestId || "",
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[M-Pesa STK Push] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
