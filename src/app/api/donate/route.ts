import { NextRequest, NextResponse } from "next/server";
import { donationFormSchema } from "@/lib/validations";
import { store } from "@/lib/store";
import { sendEmail, buildEmailHtml, buildTemplate } from "@/lib/email";
import { initiateMpesaPayment } from "@/services/donation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = donationFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Honeypot check
    if (parsed.data._honeypot) {
      return NextResponse.json({ success: true });
    }

    const { donorName, email, phone, amount, paymentMethod, isRecurring, message } = parsed.data;

    // 1. Create donation record (pending)
    const transactionId = `RHK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const donation = store.createDonation({
      transactionId,
      donorName,
      email,
      phone,
      amount,
      paymentMethod,
      status: "pending",
      isRecurring,
      message: message || undefined,
    });

    // 2. If M-Pesa, initiate STK Push
    if (paymentMethod === "mpesa") {
      const mpesaResult = await initiateMpesaPayment({
        amount,
        phone: phone.startsWith("0") ? "254" + phone.slice(1) : phone,
        donorName,
        email,
        isRecurring,
      });

      if (mpesaResult.success && mpesaResult.checkoutRequestId) {
        store.updateDonation(donation.id, {
          mpesaCheckoutRequestId: mpesaResult.checkoutRequestId,
          transactionId: mpesaResult.transactionId || transactionId,
        });

        // Create notification
        store.createNotification({
          type: "new-donation",
          title: "New Donation Initiated",
          message: `${donorName} initiated a donation of KES ${amount} via M-Pesa`,
          referenceId: donation.id,
          referenceType: "donation",
          isRead: false,
        });

        return NextResponse.json({
          success: true,
          message: mpesaResult.message,
          data: {
            id: donation.id,
            transactionId: mpesaResult.transactionId || transactionId,
            checkoutRequestId: mpesaResult.checkoutRequestId,
            status: "pending",
          },
        });
      } else {
        // M-Pesa initiation failed
        store.updateDonation(donation.id, { status: "failed" });

        return NextResponse.json({
          success: false,
          message: mpesaResult.message || "M-Pesa payment could not be initiated. Please try again.",
          data: { id: donation.id, status: "failed" },
        }, { status: 400 });
      }
    }

    // 3. For bank transfer, mark as pending and send instructions
    if (paymentMethod === "bank-transfer") {
      store.createNotification({
        type: "new-donation",
        title: "New Bank Transfer Donation",
        message: `${donorName} pledged KES ${amount} via bank transfer`,
        referenceId: donation.id,
        referenceType: "donation",
        isRead: false,
      });

      // Send bank transfer instructions to donor
      const bankDetails = [
        "<p>Thank you for choosing to support RHARK via bank transfer.</p>",
        "<p>Please use the following bank details to complete your donation:</p>",
        '<table class="receipt-table">',
        "  <tr><td>Account Name</td><td>Reproductive Health Action and Rights Kenya</td></tr>",
        "  <tr><td>Bank</td><td>Equity Bank Kenya</td></tr>",
        "  <tr><td>Branch</td><td>Bondo Branch</td></tr>",
        "  <tr><td>Account Number</td><td>Contact us for details</td></tr>",
        "  <tr><td>Reference</td><td>" + transactionId + "</td></tr>",
        "  <tr><td>Amount</td><td>KES " + amount.toLocaleString("en-KE") + "</td></tr>",
        "</table>",
        "<p>Please use the reference number above when making the transfer.</p>",
        "<p>Once the transfer is complete, your donation will be confirmed within 2-3 business days.</p>",
      ].join("\n");

      try {
        await sendEmail({
          to: email,
          subject: "RHARK Bank Transfer Donation Instructions",
          html: buildEmailHtml(bankDetails),
        });
      } catch (emailErr) {
        console.error("[Donate] Failed to send bank transfer instructions:", emailErr);
      }

      return NextResponse.json({
        success: true,
        message: "Thank you! Please complete your bank transfer using the reference number provided.",
        data: {
          id: donation.id,
          transactionId,
          status: "pending",
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: "Invalid payment method.",
    }, { status: 400 });

  } catch (error) {
    console.error("[Donate API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}