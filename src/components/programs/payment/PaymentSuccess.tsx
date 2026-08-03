"use client";

import { CheckCircle2 } from "lucide-react";

interface PaymentSuccessProps {
  message: string;
  transactionId: string;
  receiptNumber?: string;
  amount?: number;
  date?: string;
}

export default function PaymentSuccess({
  message,
  transactionId,
  receiptNumber,
  amount,
  date,
}: PaymentSuccessProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
        <CheckCircle2 size={32} className="text-success-500" aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl font-bold text-neutral-900">
        Donation Received!
      </h2>
      <p className="text-neutral-600">{message}</p>
      <div className="mt-4 w-full rounded-xl bg-neutral-50 p-4 text-left">
        <p className="text-sm font-semibold text-neutral-700">Transaction Reference</p>
        <p className="mt-1 font-mono text-sm text-neutral-900">{transactionId}</p>
        {receiptNumber && (
          <>
            <p className="mt-2 text-sm font-semibold text-neutral-700">M-Pesa Receipt</p>
            <p className="mt-1 font-mono text-sm text-neutral-900">{receiptNumber}</p>
          </>
        )}
        {amount && (
          <>
            <p className="mt-2 text-sm font-semibold text-neutral-700">Amount</p>
            <p className="mt-1 text-sm text-neutral-900">KES {amount.toLocaleString("en-KE")}</p>
          </>
        )}
        {date && (
          <>
            <p className="mt-2 text-sm font-semibold text-neutral-700">Date</p>
            <p className="mt-1 text-sm text-neutral-900">{date}</p>
          </>
        )}
        <p className="mt-3 text-sm text-neutral-500">
          A confirmation email will be sent shortly. Thank you for your generosity!
        </p>
      </div>
    </div>
  );
}
