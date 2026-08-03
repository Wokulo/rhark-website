"use client";

import { useState, useEffect, useCallback } from "react";
import { Send, Search, Users, Loader2, AlertCircle } from "lucide-react";
import { cn, formatDate } from "@/utils";

interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  source?: string;
  subscribedAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState("");

  const [form, setForm] = useState({
    subject: "",
    content: "",
  });

  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    pageSize: 20,
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

  const toggleSubscriber = (id: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map((s) => s.id));
    }
  };

  const handleSend = async () => {
    if (!form.subject || !form.content || selectedSubscribers.length === 0) return;

    setSending(true);
    setSendError("");
    setSendSuccess("");

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: form.subject,
          content: form.content,
          subscriberIds: selectedSubscribers,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send newsletter");
      }

      setSendSuccess(`Newsletter queued for ${selectedSubscribers.length} subscriber(s).`);
      setForm({ subject: "", content: "" });
      setSelectedSubscribers([]);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send newsletter");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          Newsletter
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Compose and send newsletters to subscribers. Total: {total}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Compose */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">
              Compose Newsletter
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Email subject"
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Message
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your newsletter content here..."
                  rows={10}
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div className="text-sm text-neutral-500">
                Selected: {selectedSubscribers.length} subscriber(s)
              </div>

              {sendError && (
                <div className="mb-4 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M11.99 2C6.47 2 2 6.48 2 12.01c0 .62.43 1.15.99 1.28L4 15v5c0 .55.45 1 1 1h6.5c.28 0 .5-.22.5-.5v-1h2v1c0 .28.22.5.5.5H19c.55 0 1-.45 1-1v-5l.01-.01c.55-.13.99-.66.99-1.28C22 6.48 17.52 2 11.99 2zm1 14h-2v-2h2v2zm0-3.5h-2V7h2v5.5z" />
                  </svg>
                  <p>{sendError}</p>
                </div>
              )}

              {sendSuccess && (
                <div className="mb-4 flex items-start gap-3 rounded-xl bg-success-50 p-4 text-sm text-success-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M2.25 12C2.25 6.61 6.61 2.25 12 2.25s9.75 4.36 9.75 9.75S17.39 21.75 12 21.75 2.25 17.39 2.25 12zm9 5.25a1 1 0 001-1V13a1 0 00-1-1h-2a1 0 00-1 1v3.25a1 0 001 1zm0-6.75a1 0 011 1H11v-1a1 0 011-1z" />
                  </svg>
                  <p>{sendSuccess}</p>
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={sending || !form.subject || !form.content || selectedSubscribers.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Send Newsletter
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">
              Recent Subscribers
            </h2>
            <div className="space-y-2">
              {subscribers.slice(0, 5).map((sub) => (
                <div key={sub.id} className="text-sm">
                  <span className="font-medium text-neutral-900">
                    {sub.firstName || "Subscriber"}
                  </span>
                  <span className="text-neutral-500"> — {sub.email}</span>
                  <span className="block text-xs text-neutral-400">
                    {formatDate(sub.subscribedAt, {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              ))}
              {subscribers.length === 0 && (
                <p className="text-sm text-neutral-500">No recent subscribers</p>
              )}
            </div>
          </div>
        </div>

        {/* Subscribers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filters.pageSize}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, pageSize: Number(e.target.value), page: 1 }))
                  }
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users size={40} className="text-neutral-300" aria-hidden="true" />
              <p className="mt-4 text-lg font-medium text-neutral-500">
                No subscribers found
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                Adjust your filters or check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm ring-1 ring-neutral-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="w-10 px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={
                              subscribers.length > 0 &&
                              selectedSubscribers.length === subscribers.length
                            }
                            onChange={selectAll}
                            aria-label="Select all"
                          />
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-neutral-900">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-neutral-900">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-neutral-900">
                          Source
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-neutral-900">
                          Subscribed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub) => (
                        <tr
                          key={sub.id}
                          className={cn(
                            "border-b border-neutral-100 transition-colors",
                            selectedSubscribers.includes(sub.id) && "bg-primary-50"
                          )}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedSubscribers.includes(sub.id)}
                              onChange={() => toggleSubscriber(sub.id)}
                              aria-label={`Select ${sub.email}`}
                            />
                          </td>
                          <td className="px-4 py-3 text-neutral-900">
                            {sub.firstName || "—"}
                          </td>
                          <td className="px-4 py-3 text-neutral-600">
                            {sub.email}
                          </td>
                          <td className="px-4 py-3 text-neutral-500">
                            {sub.source || "website"}
                          </td>
                          <td className="px-4 py-3 text-neutral-500">
                            {formatDate(sub.subscribedAt, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() =>
                  setFilters((f) => ({ ...f, page: f.page - 1 }))
                }
                disabled={filters.page === 1 || loading}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-3 text-sm text-neutral-500">
                Page {filters.page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setFilters((f) => ({ ...f, page: f.page + 1 }))
                }
                disabled={filters.page === totalPages || loading}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
