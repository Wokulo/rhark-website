"use client";

import { AlertCircle } from "lucide-react";

interface PaymentFailedProps {
  message: string;
}

export default function PaymentFailed({ message }: PaymentFailedProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-50">
        <AlertCircle size={32} className="text-error-500" aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl font-bold text-neutral-900">
        Payment Failed
      </h2>
      <p className="text-neutral-600">{message}</p>
      <p className="text-sm text-neutral-500">
        Please try again or call <strong>0733551415</strong> for assistance.
      </p>
    </div>
  );
}
