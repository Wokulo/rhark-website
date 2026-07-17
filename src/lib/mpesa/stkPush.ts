/**
 * M-Pesa STK Push (Lipa na M-Pesa Online) implementation.
 *
 * Initiates a payment request to the customer's phone.
 */

import { getMpesaConfig } from "./config";
import { getMpesaAccessToken } from "./auth";
import { generateMpesaPassword, getMpesaTimestamp, formatPhoneNumber } from "./utils";

export interface StkPushPayload {
  amount: number;
  phone: string;
  donorName: string;
  email?: string;
}

export interface StkPushResult {
  success: boolean;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  transactionId?: string;
  message: string;
  responseCode?: string;
  responseDescription?: string;
}

/**
 * Initiate an M-Pesa STK Push payment.
 *
 * Sends a payment request to the customer's phone. The customer must
 * enter their M-Pesa PIN to complete the payment.
 */
export async function initiateStkPush(payload: StkPushPayload): Promise<StkPushResult> {
  const config = getMpesaConfig();

  if (!config) {
    return {
      success: false,
      message: "M-Pesa is not configured. Please call 0733551415 for assistance or use bank transfer.",
    };
  }

  try {
    const token = await getMpesaAccessToken();
    const timestamp = getMpesaTimestamp();
    const password = generateMpesaPassword(config.shortcode, config.passkey, timestamp);
    const phone = formatPhoneNumber(payload.phone);
    const amount = Math.round(payload.amount);

    const baseUrl = config.environment === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    const body = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: config.shortcode,
      PhoneNumber: phone,
      CallBackURL: config.callbackUrl,
      AccountReference: `RHARK-${payload.donorName.replace(/\s+/g, "").substring(0, 10)}`,
      TransactionDesc: `Donation to RHARK - KES ${amount}`,
    };

    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[M-Pesa STK Push] API error:", response.status, errorText);
      return {
        success: false,
        message: `M-Pesa service error (${response.status}). Please try again or call 0733551415.`,
      };
    }

    const data = await response.json();

    if (data.ResponseCode === "0") {
      return {
        success: true,
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        transactionId: `TXN-${Date.now()}`,
        message: "STK Push sent to your phone. Please enter your M-Pesa PIN to complete payment.",
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
      };
    }

    console.error("[M-Pesa STK Push] Business error:", data);
    return {
      success: false,
      message: data.ResponseDescription || "M-Pesa payment could not be initiated. Please try again.",
      responseCode: data.ResponseCode,
      responseDescription: data.ResponseDescription,
    };
  } catch (error) {
    console.error("[M-Pesa STK Push] Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "M-Pesa payment failed. Please try again or call 0733551415.",
    };
  }
}
