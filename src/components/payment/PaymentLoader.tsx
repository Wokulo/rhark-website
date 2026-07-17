"use client";

import { Loader2 } from "lucide-react";

interface PaymentLoaderProps {
  phone?: string;
}

export default function PaymentLoader({ phone }: PaymentLoaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning-50">
        <Loader2 size={32} className="text-warning-500 animate-spin" aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl font-bold text-neutral-900">
        Waiting for M-Pesa Payment
      </h2>
      <p className="text-neutral-600">
        We have sent an M-Pesa STK Push request to your phone.
      </p>
      <div className="mt-4 w-full rounded-xl bg-primary-50 p-6 text-left ring-1 ring-primary-100">
        <p className="text-sm font-semibold text-primary-700">Please check your phone now</p>
        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
          <li>1. You should receive an M-Pesa prompt on your phone ({phone || "your phone"})</li>
          <li>2. Enter your M-Pesa PIN to complete the payment</li>
          <li>3. Wait for the confirmation message from M-Pesa</li>
        </ul>
      </div>
      <p className="text-xs text-neutral-400">
        This page will automatically update once your payment is confirmed.
      </p>
    </div>
  );
}
