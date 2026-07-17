/**
 * M-Pesa callback handling and verification.
 *
 * Safaricom sends a callback to our server after the customer completes
 * or fails the STK Push payment.
 */

export interface MpesaCallbackItem {
  Name: string;
  Value: string | number;
}

export interface MpesaStkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: {
    Item: MpesaCallbackItem[];
  };
}

export interface MpesaCallbackBody {
  Body: {
    stkCallback: MpesaStkCallback;
  };
}

export interface ParsedMpesaCallback {
  checkoutRequestId: string;
  merchantRequestId: string;
  resultCode: number;
  resultDesc: string;
  receiptNumber?: string;
  phoneNumber?: string;
  transactionDate?: string;
  isSuccessful: boolean;
}

/**
 * Parse and validate an M-Pesa STK Push callback.
 */
export function parseMpesaCallback(body: MpesaCallbackBody): ParsedMpesaCallback | null {
  try {
    const stkCallback = body.Body.stkCallback;

    if (!stkCallback) {
      return null;
    }

    const result: ParsedMpesaCallback = {
      checkoutRequestId: stkCallback.CheckoutRequestID,
      merchantRequestId: stkCallback.MerchantRequestID,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc,
      isSuccessful: stkCallback.ResultCode === 0,
    };

    if (stkCallback.CallbackMetadata?.Item) {
      for (const item of stkCallback.CallbackMetadata.Item) {
        switch (item.Name) {
          case "MpesaReceiptNumber":
            result.receiptNumber = String(item.Value || "");
            break;
          case "PhoneNumber":
            result.phoneNumber = String(item.Value || "");
            break;
          case "TransactionDate":
            result.transactionDate = String(item.Value || "");
            break;
        }
      }
    }

    return result;
  } catch (error) {
    console.error("[M-Pesa Callback] Parse error:", error);
    return null;
  }
}
