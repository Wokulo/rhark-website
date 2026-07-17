"use client";

interface ReceiptCardProps {
  transactionId: string;
  receiptNumber?: string;
  amount: number;
  donorName: string;
  email: string;
  phone: string;
  date: string;
  status: "pending" | "successful" | "failed";
}

export default function ReceiptCard({
  transactionId,
  receiptNumber,
  amount,
  donorName,
  email,
  phone,
  date,
  status,
}: ReceiptCardProps) {
  const statusColors = {
    pending: "bg-warning-50 text-warning-700 ring-warning-500",
    successful: "bg-success-50 text-success-700 ring-success-500",
    failed: "bg-error-50 text-error-700 ring-error-500",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-neutral-900">Donation Receipt</h3>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Transaction ID</span>
          <span className="font-mono text-neutral-900">{transactionId}</span>
        </div>
        {receiptNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">M-Pesa Receipt</span>
            <span className="font-mono text-neutral-900">{receiptNumber}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Donor</span>
          <span className="text-neutral-900">{donorName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Email</span>
          <span className="text-neutral-900">{email}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Phone</span>
          <span className="text-neutral-900">{phone}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Amount</span>
          <span className="font-semibold text-accent-600">KES {amount.toLocaleString("en-KE")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Date</span>
          <span className="text-neutral-900">{date}</span>
        </div>
      </div>
    </div>
  );
}
