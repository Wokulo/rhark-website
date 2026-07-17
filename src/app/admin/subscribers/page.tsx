"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Search, Eye, X } from "lucide-react";
import { cn, formatDate } from "@/utils";
import { Button, Input, Alert, Modal, Pagination } from "@/components/ui";
import type { Subscriber } from "@/types";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      params.set("page", String(filters.page));
      params.set("pageSize", String(filters.pageSize));

      const res = await fetch(`/api/admin/subscribers?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load subscribers");
      }

      setSubscribers(data.data || []);
      setTotalPages(Math.ceil(data.total / data.pageSize) || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const openViewModal = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setViewModalOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Newsletter Subscribers</h1>
        <p className="mt-1 text-sm text-neutral-500">
          View and manage newsletter signups. Total: {total}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
        <div className="grid gap-4 sm:grid-cols-1">
          <Input
            label="Search"
            placeholder="Search by email or name..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            leftIcon={<Search size={16} className="text-neutral-400" aria-hidden="true" />}
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
      ) : subscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={40} className="text-neutral-300" aria-hidden="true" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No subscribers found</p>
          <p className="mt-1 text-sm text-neutral-400">Adjust your filters or check back later.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 truncate">
                        {subscriber.firstName || "Subscriber"}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{subscriber.email}</p>
                    <div className="mt-1 flex items-center gap-4 text-xs text-neutral-400">
                      <span>Source: {subscriber.source || "website"}</span>
                      <span aria-hidden="true">•</span>
                      <span>{formatDate(subscriber.subscribedAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewModal(subscriber)}
                      aria-label={`View subscriber ${subscriber.email}`}
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
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Subscriber Details" size="lg">
        {selectedSubscriber && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedSubscriber.firstName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedSubscriber.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Source</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedSubscriber.source || "website"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Subscribed At</p>
                <p className="mt-1 text-sm text-neutral-900">{formatDate(selectedSubscriber.subscribedAt)}</p>
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
