/**
 * Donation Service — M-Pesa Daraja 2.0 integration stub.
 *
 * This module will house all M-Pesa STK Push, C2B, and B2C logic.
 * The UI donation flow is built against this interface today;
 * the actual Daraja API calls are added here when credentials are available.
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
  message: string;
}

/**
 * Initiates an M-Pesa STK Push payment.
 * Currently a stub — returns a mock success response.
 */
export async function initiateMpesaPayment(
  _payload: DonationPayload
): Promise<DonationResult> {
  // TODO: Implement Daraja 2.0 STK Push
  // 1. Get OAuth token from Daraja
  // 2. Initiate STK Push
  // 3. Store pending transaction in DB
  // 4. Return CheckoutRequestID for polling
  return {
    success: false,
    message: "M-Pesa integration coming soon. Thank you for your interest in supporting RHARK.",
  };
}
