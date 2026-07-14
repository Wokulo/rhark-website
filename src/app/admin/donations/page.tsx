"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, Search, Filter, Download, Eye, X, ChevronDown, ChevronUp, Loader2, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { cn, formatDate } from "@/utils";
import { Button, Input, Select, Alert, Modal, Pagination } from "@/components/ui";
import type { Donation, DonationStatus, PaymentMethod } from "@/types";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "successful", label: "Successful" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "", label: "All Methods" },
  { value: "mpesa", label: "M-Pesa" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
];

const STATUS_ICONS: Record<DonationStatus, React.ReactNode> = {
  pending: <Clock size={16} className="text-warning-500" aria-hidden="true" />,
  successful: <CheckCircle2 size={16} className="text-success-500" aria-hidden="true" />,
  failed: <XCircle size={16} className="text-error-500" aria-hidden="true" />,
  cancelled: <AlertCircle size={16} className="text-neutral-400" aria-hidden="true" />,
};

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    search: "",
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.paymentMethod) params.set("paymentMethod", filters.paymentMethod);
      if (filters.search) params.set("search", filters.search);
      params.set("page", String(filters.page));
      params.set("pageSize", String(filters.pageSize));
      params.set("sortBy", filters.sortBy);
      params.set("sortOrder", filters.sortOrder);

      const res = await fetch(`/api/admin/donations?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load donations");
      }

      setDonations(data.data || []);
      setTotalPages(Math.ceil(data.total / data.pageSize) || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin/donations?export=csv");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rhark-donations-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export CSV");
    }
  };

  const handleStatusUpdate = async (id: string, status: DonationStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch("/api/admin/donations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }

      fetchDonations();
      if (selectedDonation?.id === id) {
        setSelectedDonation(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const openViewModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setViewModalOpen(true);
  };

  const getStatusBadge = (status: DonationStatus) => {
    const styles: Record<DonationStatus, string> = {
      pending: "bg-warning-50 text-warning-700 ring-warning-500",
      successful: "bg-success-50 text-success-700 ring-success-500",
      failed: "bg-error-50 text-error-700 ring-error-500",
      cancelled: "bg-neutral-100 text-neutral-600 ring-neutral-400",
    };
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", styles[status])}>
        {STATUS_ICONS[status]}
        {status}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels: Record<PaymentMethod, string> = {
      "mpesa": "M-Pesa",
      "bank-transfer": "Bank Transfer",
      "card": "Card",
      "other": "Other",
    };
    return labels[method] || method;
  };

  const stats = {
    total: total,
    successful: donations.filter((d) => d.status === "successful").reduce((sum, d) => sum + d.amount, 0),
    pending: donations.filter((d) => d.status === "pending").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Donations</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage and track donations. Total: {total} | Successful Total: KES {stats.successful.toLocaleString("en-KE")}
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button onClick={handleExportCSV} variant="secondary" size="sm">
          <Download size={16} aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-neutral-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-neutral-900">Filters</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Search"
            placeholder="Search donations..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            leftIcon={<Search size={16} className="text-neutral-400" aria-hidden="true" />}
          />
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
          />
          <Select
            label="Payment Method"
            options={PAYMENT_METHOD_OPTIONS}
            value={filters.paymentMethod}
            onChange={(e) => setFilters((f) => ({ ...f, paymentMethod: e.target.value, page: 1 }))}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="error" title="Error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={40} className="text-neutral-300" aria-hidden="true" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No donations found</p>
          <p className="mt-1 text-sm text-neutral-400">Adjust your filters or check back later.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 truncate">{donation.donorName}</h3>
                      {getStatusBadge(donation.status)}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-neutral-600 flex-wrap">
                      <span className="font-medium text-accent-600">KES {donation.amount.toLocaleString("en-KE")}</span>
                      <span className="text-neutral-400">•</span>
                      <span>{getPaymentMethodLabel(donation.paymentMethod)}</span>
                      <span className="text-neutral-400">•</span>
                      <span className="font-mono text-xs text-neutral-500">{donation.transactionId}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-neutral-400">
                      <span>{donation.email}</span>
                      <span aria-hidden="true">•</span>
                      <span>{formatDate(donation.createdAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewModal(donation)}
                      aria-label={`View donation from ${donation.donorName}`}
                    >
                      <Eye size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </div>
        </>
      )}

      {/* View Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Donation Details" size="lg">
        {selectedDonation && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Donor Name</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedDonation.donorName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedDonation.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedDonation.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Amount</p>
                <p className="mt-1 text-sm font-semibold text-accent-600">KES {selectedDonation.amount.toLocaleString("en-KE")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Payment Method</p>
                <p className="mt-1 text-sm text-neutral-900">{getPaymentMethodLabel(selectedDonation.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Transaction ID</p>
                <p className="mt-1 text-sm font-mono text-neutral-900">{selectedDonation.transactionId}</p>
              </div>
              {selectedDonation.mpesaReceiptNumber && (
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">M-Pesa Receipt</p>
                  <p className="mt-1 text-sm font-mono text-neutral-900">{selectedDonation.mpesaReceiptNumber}</p>
                </div>
              )}
              {selectedDonation.mpesaCheckoutRequestId && (
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Checkout Request ID</p>
                  <p className="mt-1 text-sm font-mono text-neutral-900 break-all">{selectedDonation.mpesaCheckoutRequestId}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</p>
                <div className="mt-1">{getStatusBadge(selectedDonation.status)}</div>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Recurring</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedDonation.isRecurring ? "Yes" : "No"}</p>
              </div>
            </div>
            {selectedDonation.message && (
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Message</p>
                <p className="mt-1 text-sm text-neutral-900 whitespace-pre-wrap">{selectedDonation.message}</p>
              </div>
            )}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
              <span className="text-xs text-neutral-400">
                {formatDate(selectedDonation.createdAt)}
              </span>
            </div>

            {/* Status Update */}
            <div className="pt-4 border-t border-neutral-100">
              <p className="text-sm font-semibold text-neutral-900 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {(["pending", "successful", "failed", "cancelled"] as DonationStatus[]).map((status) => (
                  <Button
                    key={status}
                    variant={selectedDonation.status === status ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => handleStatusUpdate(selectedDonation.id, status)}
                    disabled={statusUpdating || selectedDonation.status === status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
