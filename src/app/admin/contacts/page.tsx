"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MessageSquare, Search, Filter, Reply, Eye, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn, formatDate } from "@/utils";
import { Button, Input, Select, Alert, Modal, Pagination } from "@/components/ui";
import type { ContactRequest, ContactStatus, InquiryType, CommunicationThread } from "@/types";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
];

const INQUIRY_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "general", label: "General" },
  { value: "information", label: "Information Request" },
  { value: "partnership", label: "Partnership" },
  { value: "program", label: "Program Inquiry" },
];

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    inquiryType: "",
    search: "",
    page: 1,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.inquiryType) params.set("inquiryType", filters.inquiryType);
      if (filters.search) params.set("search", filters.search);
      params.set("page", String(filters.page));
      params.set("pageSize", String(filters.pageSize));

      const res = await fetch(`/api/admin/contacts?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load contacts");
      }

      setContacts(data.data || []);
      setTotalPages(Math.ceil(data.total / data.pageSize) || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return;

    setReplyLoading(true);
    setReplyError("");

    try {
      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selectedContact.id, message: replyMessage.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.errors?.message?.[0] || "Failed to send reply");
      }

      setReplyModalOpen(false);
      setReplyMessage("");
      setSelectedContact(null);
      fetchContacts();
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const openReplyModal = (contact: ContactRequest) => {
    setSelectedContact(contact);
    setReplyMessage("");
    setReplyError("");
    setReplyModalOpen(true);
  };

  const openViewModal = (contact: ContactRequest) => {
    setSelectedContact(contact);
    setViewModalOpen(true);
  };

  const getStatusBadge = (status: ContactStatus) => {
    const styles: Record<ContactStatus, string> = {
      new: "bg-info-50 text-info-600 ring-info-500",
      read: "bg-warning-50 text-warning-600 ring-warning-500",
      replied: "bg-success-50 text-success-600 ring-success-500",
      closed: "bg-neutral-100 text-neutral-600 ring-neutral-400",
    };
    return (
      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", styles[status])}>
        {status}
      </span>
    );
  };

  const getInquiryTypeBadge = (type: InquiryType) => {
    const styles: Record<InquiryType, string> = {
      general: "bg-neutral-100 text-neutral-700",
      information: "bg-primary-50 text-primary-700",
      partnership: "bg-accent-50 text-accent-700",
      program: "bg-info-50 text-info-700",
    };
    return (
      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", styles[type])}>
        {type}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Contact Requests</h1>
        <p className="mt-1 text-sm text-neutral-500">
          View and manage inquiries from the website. Total: {total}
        </p>
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
            placeholder="Search contacts..."
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
            label="Inquiry Type"
            options={INQUIRY_TYPE_OPTIONS}
            value={filters.inquiryType}
            onChange={(e) => setFilters((f) => ({ ...f, inquiryType: e.target.value, page: 1 }))}
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
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare size={40} className="text-neutral-300" aria-hidden="true" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No contact requests found</p>
          <p className="mt-1 text-sm text-neutral-400">Adjust your filters or check back later.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 truncate">{contact.name}</h3>
                      {getStatusBadge(contact.status)}
                      {getInquiryTypeBadge(contact.inquiryType)}
                    </div>
                    <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{contact.subject}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
                      <span>{contact.email}</span>
                      <span aria-hidden="true">•</span>
                      <span>{formatDate(contact.createdAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewModal(contact)}
                      aria-label={`View details for ${contact.name}`}
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openReplyModal(contact)}
                      aria-label={`Reply to ${contact.name}`}
                    >
                      <Reply size={18} />
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
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Contact Details" size="lg">
        {selectedContact && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedContact.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedContact.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Organization</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedContact.organization || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Subject</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedContact.subject}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Program of Interest</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedContact.programOfInterest || "Not specified"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Message</p>
              <p className="mt-1 text-sm text-neutral-900 whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
              {getStatusBadge(selectedContact.status)}
              <span className="text-xs text-neutral-400">
                {formatDate(selectedContact.createdAt)}
              </span>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>
              <Button onClick={() => { setViewModalOpen(false); openReplyModal(selectedContact); }}>
                <Reply size={16} aria-hidden="true" />
                Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal isOpen={replyModalOpen} onClose={() => setReplyModalOpen(false)} title="Reply to Contact" size="lg">
        {selectedContact && (
          <div className="space-y-4">
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-sm font-medium text-neutral-900">To: {selectedContact.name} ({selectedContact.email})</p>
              <p className="text-sm text-neutral-600">Subject: {selectedContact.subject}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reply-message" className="text-sm font-medium text-neutral-700">
                Your Reply <span className="ml-1 text-error-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="reply-message"
                rows={6}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            {replyError && (
              <Alert variant="error" title="Error">
                {replyError}
              </Alert>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setReplyModalOpen(false)} disabled={replyLoading}>Cancel</Button>
              <Button onClick={handleReply} isLoading={replyLoading} disabled={!replyMessage.trim()}>
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
