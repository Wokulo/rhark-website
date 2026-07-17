"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Search, Eye, X } from "lucide-react";
import { cn, formatDate } from "@/utils";
import { Button, Input, Select, Alert, Modal, Pagination } from "@/components/ui";
import type { EmailMessage } from "@/types";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "queued", label: "Queued" },
];

const TEMPLATE_TYPE_LABELS: Record<string, string> = {
  welcome: "Welcome",
  "contact-confirmation": "Contact Confirmation",
  "info-request-confirmation": "Info Request Confirmation",
  "donation-thank-you": "Donation Thank You",
  "donation-receipt": "Donation Receipt",
  "donation-failed": "Donation Failed",
  "admin-notification": "Admin Notification",
  "contact-reply": "Contact Reply",
  "password-reset": "Password Reset",
  "account-verification": "Account Verification",
};

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      params.set("page", String(filters.page));
      params.set("pageSize", String(filters.pageSize));

      const res = await fetch(`/api/admin/emails?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load emails");
      }

      setEmails(data.data || []);
      setTotalPages(Math.ceil(data.total / data.pageSize) || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load emails");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const openViewModal = (email: EmailMessage) => {
    setSelectedEmail(email);
    setViewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      sent: "bg-success-50 text-success-600 ring-success-500",
      failed: "bg-error-50 text-error-600 ring-error-500",
      queued: "bg-warning-50 text-warning-600 ring-warning-500",
    };
    return (
      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", styles[status] || "bg-neutral-100 text-neutral-600 ring-neutral-400")}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Email History</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track all sent communications. Total: {total}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Search"
            placeholder="Search by recipient or subject..."
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
      ) : emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mail size={40} className="text-neutral-300" aria-hidden="true" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No emails found</p>
          <p className="mt-1 text-sm text-neutral-400">Adjust your filters or check back later.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 truncate">{email.subject}</h3>
                      {getStatusBadge(email.status)}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-neutral-600 flex-wrap">
                      <span>To: {email.to}</span>
                      <span className="text-neutral-400">•</span>
                      <span>{TEMPLATE_TYPE_LABELS[email.templateType] || email.templateType}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-neutral-400">
                      <span>From: {email.from}</span>
                      <span aria-hidden="true">•</span>
                      <span>{formatDate(email.createdAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewModal(email)}
                      aria-label={`View email to ${email.to}`}
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
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Email Details" size="lg">
        {selectedEmail && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">To</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedEmail.to}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">From</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedEmail.from}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Subject</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedEmail.subject}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Template</p>
                <p className="mt-1 text-sm text-neutral-900">{TEMPLATE_TYPE_LABELS[selectedEmail.templateType] || selectedEmail.templateType}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</p>
                <div className="mt-1">{getStatusBadge(selectedEmail.status)}</div>
              </div>
              {selectedEmail.errorMessage && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Error</p>
                  <p className="mt-1 text-sm text-error-600">{selectedEmail.errorMessage}</p>
                </div>
              )}
              {selectedEmail.referenceId && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Reference</p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedEmail.referenceType}: {selectedEmail.referenceId}
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Body</p>
              <div
                className="mt-1 max-h-64 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-900"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
              />
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
              <span className="text-xs text-neutral-400">
                {formatDate(selectedEmail.createdAt)}
              </span>
              {selectedEmail.sentAt && (
                <>
                  <span className="text-neutral-400">•</span>
                  <span className="text-xs text-neutral-400">
                    Sent: {formatDate(selectedEmail.sentAt)}
                  </span>
                </>
              )}
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
