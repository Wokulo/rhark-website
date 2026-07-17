"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";

interface MpesaButtonProps {
  amount: number;
  phone: string;
  donorName: string;
  email?: string;
  onSuccess: (data: { transactionId: string; checkoutRequestId: string }) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

export default function MpesaButton({
  amount,
  phone,
  donorName,
  email,
  onSuccess,
  onError,
  disabled = false,
}: MpesaButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phone, donorName, email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to initiate M-Pesa payment");
      }

      onSuccess({
        transactionId: data.transactionId || "",
        checkoutRequestId: data.checkoutRequestId || "",
      });
    } catch (err) {
      onError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="lg"
      onClick={handleClick}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          Initiating Payment...
        </>
      ) : (
        <>
          <Heart size={18} aria-hidden="true" />
          Donate Now
        </>
      )}
    </Button>
  );
}
