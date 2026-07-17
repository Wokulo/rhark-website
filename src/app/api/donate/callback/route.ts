import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { sendEmail, buildEmailHtml, buildTemplate } from "@/lib/email";

/**
 * M-Pesa STK Push callback handler.
 *
 * Safaricom sends a POST request to this endpoint after a customer
 * completes (or fails) the M-Pesa PIN entry.
 *
 * The callback URL should be set in MPESA_CALLBACK_URL env variable,
 * pointing to: https://yourdomain.com/api/donate/callback
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    console.log("[M-Pesa Callback] Received callback");

    let callbackData;
    try {
      callbackData = JSON.parse(rawBody);
    } catch {
      console.error("[M-Pesa Callback] Invalid JSON");
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid JSON" });
    }

    const stkCallback = callbackData?.Body?.stkCallback;
    if (!stkCallback) {
      console.error("[M-Pesa Callback] Missing stkCallback in body");
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback structure" });
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    console.log(`[M-Pesa Callback] CheckoutRequestID: ${CheckoutRequestID}, ResultCode: ${ResultCode}`);

    // Find the donation by CheckoutRequestID
    const donation = store.getDonationByCheckoutRequestId(CheckoutRequestID);
    if (!donation) {
      console.error(`[M-Pesa Callback] No donation found for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Donation not found" });
    }

    if (ResultCode === 0) {
      // Payment successful — extract metadata
      let mpesaReceiptNumber = "";
      let phoneNumber = "";
      let transactionDate = "";

      if (CallbackMetadata?.Item) {
        for (const item of CallbackMetadata.Item) {
          if (item.Name === "MpesaReceiptNumber") {
            mpesaReceiptNumber = String(item.Value || "");
          } else if (item.Name === "PhoneNumber") {
            phoneNumber = String(item.Value || "");
          } else if (item.Name === "TransactionDate") {
            transactionDate = String(item.Value || "");
          }
        }
      }

      // Update donation to successful
      store.updateDonation(donation.id, {
        status: "successful",
        mpesaReceiptNumber: mpesaReceiptNumber || undefined,
        mpesaCheckoutRequestId: CheckoutRequestID,
      });

      // Send thank-you email
      try {
        const template = buildTemplate("donation-thank-you", {
          donorName: donation.donorName,
          amount: donation.amount,
          transactionId: donation.transactionId,
          paymentMethod: "M-Pesa",
        });

        await sendEmail({
          to: donation.email,
          subject: template.subject,
          html: buildEmailHtml(template.html),
        });

        store.createEmail({
          templateType: "donation-thank-you",
          to: donation.email,
          from: process.env.SMTP_FROM || "noreply@rhark.org",
          subject: template.subject,
          body: template.html,
          status: "sent",
          sentAt: new Date().toISOString(),
          referenceId: donation.id,
          referenceType: "donation",
        });
      } catch (emailErr) {
        console.error("[M-Pesa Callback] Failed to send thank-you email:", emailErr);
      }

      // Send donation receipt
      try {
        const receiptTemplate = buildTemplate("donation-receipt", {
          donorName: donation.donorName,
          amount: donation.amount,
          transactionId: donation.transactionId,
          paymentMethod: "M-Pesa",
          mpesaReceiptNumber: mpesaReceiptNumber || undefined,
        });

        await sendEmail({
          to: donation.email,
          subject: receiptTemplate.subject,
          html: buildEmailHtml(receiptTemplate.html),
        });

        store.createEmail({
          templateType: "donation-receipt",
          to: donation.email,
          from: process.env.SMTP_FROM || "noreply@rhark.org",
          subject: receiptTemplate.subject,
          body: receiptTemplate.html,
          status: "sent",
          sentAt: new Date().toISOString(),
          referenceId: donation.id,
          referenceType: "donation",
        });
      } catch (emailErr) {
        console.error("[M-Pesa Callback] Failed to send receipt email:", emailErr);
      }

      // Send admin notification
      try {
        const adminEmail = process.env.CONTACT_EMAIL || "rharkenya@gmail.com";
        const adminTemplate = buildTemplate("admin-notification", {
          formType: "Successful Donation",
          fields: {
            donorName: donation.donorName,
            email: donation.email,
            phone: donation.phone,
            amount: `KES ${donation.amount.toLocaleString("en-KE")}`,
            paymentMethod: "M-Pesa",
            mpesaReceiptNumber: mpesaReceiptNumber || "N/A",
            transactionId: donation.transactionId,
          },
        });

        await sendEmail({
          to: adminEmail,
          subject: adminTemplate.subject,
          html: buildEmailHtml(adminTemplate.html),
        });
      } catch (emailErr) {
        console.error("[M-Pesa Callback] Failed to send admin notification:", emailErr);
      }

      // Create notification
      store.createNotification({
        type: "donation-success",
        title: "Donation Successful!",
        message: `${donation.donorName} donated KES ${donation.amount.toLocaleString("en-KE")} via M-Pesa`,
        referenceId: donation.id,
        referenceType: "donation",
        isRead: false,
      });

      console.log(`[M-Pesa Callback] Donation ${donation.id} marked as successful`);
    } else {
      // Payment failed
      store.updateDonation(donation.id, {
        status: "failed",
      });

      // Send failed notification to donor
      try {
        const template = buildTemplate("donation-failed", {
          donorName: donation.donorName,
          amount: donation.amount,
          reason: ResultDesc || "Transaction was not completed",
        });

        await sendEmail({
          to: donation.email,
          subject: template.subject,
          html: buildEmailHtml(template.html),
        });

        store.createEmail({
          templateType: "donation-failed",
          to: donation.email,
          from: process.env.SMTP_FROM || "noreply@rhark.org",
          subject: template.subject,
          body: template.html,
          status: "sent",
          sentAt: new Date().toISOString(),
          referenceId: donation.id,
          referenceType: "donation",
        });
      } catch (emailErr) {
        console.error("[M-Pesa Callback] Failed to send failure email:", emailErr);
      }

      // Create notification
      store.createNotification({
        type: "donation-failed",
        title: "Donation Failed",
        message: `${donation.donorName}'s donation of KES ${donation.amount.toLocaleString("en-KE")} failed: ${ResultDesc}`,
        referenceId: donation.id,
        referenceType: "donation",
        isRead: false,
      });

      console.log(`[M-Pesa Callback] Donation ${donation.id} marked as failed: ${ResultDesc}`);
    }

    // Respond to Safaricom with success acknowledgment
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