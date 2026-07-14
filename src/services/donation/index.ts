/**
 * Donation Service — M-Pesa Daraja 2.0 integration.
 *
 * This module handles M-Pesa STK Push (Lipa na M-Pesa Online) API calls.
 * In development mode without credentials, it simulates the payment flow.
 */

export interface DonationPayload {
  amount: number;
  phone: string; // Format: 254XXXXXXXXX
  donorName: string;
  email?: string;
  campaignId?: string;
  isRecurring?: boolean;
}

export interface DonationResult {
  success: boolean;
  transactionId?: string;
  checkoutRequestId?: string;
  message: string;
  merchantRequestId?: string;
}

export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  callbackUrl: string;
}

/**
 * Get M-Pesa configuration from environment variables.
 */
function getMpesaConfig(): MpesaConfig | null {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (consumerKey && consumerSecret && shortcode && passkey && callbackUrl) {
    return { consumerKey, consumerSecret, shortcode, passkey, callbackUrl };
  }

  return null;
}

/**
 * Generate M-Pesa password for STK Push.
 * Password = Base64(Shortcode + Passkey + Timestamp)
 */
function generateMpesaPassword(shortcode: string, passkey: string, timestamp: string): string {
  const data = shortcode + passkey + timestamp;
  // Use Buffer for Base64 encoding (available in Next.js Edge/Node runtime)
  return Buffer.from(data).toString("base64");
}

/**
 * Get current timestamp in format YYYYMMDDHHmmss.
 */
function getMpesaTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Get M-Pesa OAuth token from Daraja API.
 */
async function getMpesaAccessToken(config: MpesaConfig): Promise<string> {
  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const isProduction = process.env.MPESA_ENVIRONMENT === "production";
  const baseUrl = isProduction
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get M-Pesa access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Initiates an M-Pesa STK Push payment.
 *
 * In development, if M-Pesa credentials are not configured, returns a
 * simulated success response with a mock CheckoutRequestID.
 */
export async function initiateMpesaPayment(
  payload: DonationPayload
): Promise<DonationResult> {
  const config = getMpesaConfig();

  // Development mode: simulate the payment flow
  if (!config) {
    console.log("[M-Pesa] No credentials configured. Simulating STK Push.");
    console.log("[M-Pesa] Payload:", payload);

    const mockCheckoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const mockMerchantRequestId = `${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return {
      success: true,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      checkoutRequestId: mockCheckoutRequestId,
      merchantRequestId: mockMerchantRequestId,
      message: "STK Push sent to your phone. Please enter your M-Pesa PIN to complete payment.",
    };
  }

  // Production mode: real Daraja API call
  try {
    const token = await getMpesaAccessToken(config);
    const timestamp = getMpesaTimestamp();
    const password = generateMpesaPassword(config.shortcode, config.passkey, timestamp);
    const isProduction = process.env.MPESA_ENVIRONMENT === "production";
    const baseUrl = isProduction
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    // Format amount as integer (KES has no decimals)
    const amount = Math.round(payload.amount);

    // Format phone: ensure it starts with 254 and is valid
    const phone = payload.phone.startsWith("0")
      ? "254" + payload.phone.slice(1)
      : payload.phone.startsWith("+")
        ? payload.phone.slice(1)
        : payload.phone;

    const stkPushResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    if (!stkPushResponse.ok) {
      const errorData = await stkPushResponse.text();
      throw new Error(`M-Pesa STK Push failed: ${errorData}`);
    }

    const data = await stkPushResponse.json();

    if (data.ResponseCode === "0") {
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        transactionId: `TXN-${Date.now()}`,
        message: "STK Push sent to your phone. Please enter your M-Pesa PIN to complete payment.",
      };
    } else {
      return {
        success: false,
        message: data.ResponseDescription || "M-Pesa payment could not be initiated.",
      };
    }
  } catch (error) {
    console.error("[M-Pesa] Error initiating payment:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "M-Pesa payment failed.",
    };
  }
}

/**
 * Query the status of an M-Pesa STK Push transaction.
 */
export async function queryMpesaPaymentStatus(
  checkoutRequestId: string
): Promise<{ success: boolean; resultCode?: number; resultDesc?: string; receiptNumber?: string }> {
  const config = getMpesaConfig();

  if (!config) {
    // In development, simulate a successful query after some time
    console.log("[M-Pesa] Simulating payment status query for:", checkoutRequestId);
    return {
      success: true,
      resultCode: 0,
      resultDesc: "The service request is processed successfully.",
      receiptNumber: `MPS${Date.now()}`,
    };
  }

  try {
    const token = await getMpesaAccessToken(config);
    const timestamp = getMpesaTimestamp();
    const password = generateMpesaPassword(config.shortcode, config.passkey, timestamp);
    const isProduction = process.env.MPESA_ENVIRONMENT === "production";
    const baseUrl = isProduction
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Status query failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: data.ResultCode === 0,
      resultCode: data.ResultCode,
      resultDesc: data.ResultDesc,
      receiptNumber: data.CallbackMetadata?.Item?.find(
        (item: { Name: string }) => item.Name === "MpesaReceiptNumber"
      )?.Value,
    };
  } catch (error) {
    console.error("[M-Pesa] Status query error:", error);
    return { success: false, resultCode: -1, resultDesc: "Query failed" };
  }
}