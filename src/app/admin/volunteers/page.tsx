"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Handshake,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { cn, formatDate } from "@/utils";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={16} className="text-warning-500" aria-hidden="true" />,
  approved: <CheckCircle2 size={16} className="text-success-500" aria-hidden="true" />,
  rejected: <XCircle size={16} className="text-error-500" aria-hidden="true" />,
  archived: <XCircle size={16} className="text-neutral-500" aria-hidden="true" />,
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-warning-50 text-warning-700 ring-warning-500",
  approved: "bg-success-50 text-success-700 ring-success-500",
  rejected: "bg-error-50 text-error-700 ring-error-500",
  archived: "bg-neutral-100 text-neutral-600 ring-neutral-400",
};

export default function AdminVolunteersPage() {
  const supabase = createClient();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    pageSize: 20,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = (supabase.from("volunteers") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const startIndex = (filters.page - 1) * filters.pageSize;
      const endIndex = startIndex + filters.pageSize;
      const paged = data?.slice(startIndex, endIndex) || [];

      setVolunteers(paged);
      setTotal(count || 0);
      setTotalPages(Math.ceil((count || 0) / filters.pageSize) || 1);
    } catch (err: any) {
      setError(err.message || "Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!confirm(`Set this volunteer to ${status}?`)) return;

    setStatusUpdating(id);
    try {
      const { error: updateError } = await (supabase.from("volunteers") as any)
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (updateError) throw updateError;

      fetchVolunteers();
      if (selectedVolunteer?.id === id) {
        setSelectedVolunteer({ ...selectedVolunteer, status });
      }
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setStatusUpdating(null);
    }
  };

  const openViewModal = (volunteer: any) => {
    setSelectedVolunteer(volunteer);
    setViewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
          STATUS_STYLES[status] || "bg-neutral-100 text-neutral-600"
        )}
      >
        {STATUS_ICONS[status]}
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Volunteers</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage volunteer applications and status. Total: {total}
        </p>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-neutral-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-neutral-900">Filters</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
              }
              className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))
            }
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex items-end">
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

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M11.99 2C6.47 2 2 6.48 2 12.01c0 .62.43 1.15.99 1.28L4 15v5c0 .55.45 1 1 1h6.5c.28 0 .5-.22.5-.5v-1h2v1c0 .28.22.5.5.5H19c.55 0 1-.45 1-1v-5l.01-.01c.55-.13.99-.66.99-1.28C22 6.48 17.52 2 11.99 2zm1 14h-2v-2h2v2zm0-3.5h-2V7h2v5.5z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : volunteers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Handshake size={40} className="text-neutral-300" aria-hidden="true" />
          <p className="mt-4 text-lg font-medium text-neutral-500">
            No volunteers found
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Adjust your filters or check back later.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-neutral-900 truncate">
                        {volunteer.first_name} {volunteer.last_name}
                      </h3>
                      {getStatusBadge(volunteer.status)}
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">
                      {volunteer.email}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {volunteer.phone}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
                      <span>County: {volunteer.county}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>
                        {formatDate(volunteer.created_at, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {volunteer.skills && (
                      <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                        <span className="font-medium">Skills:</span> {volunteer.skills}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openViewModal(volunteer)}
                      className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                      aria-label={`View ${volunteer.first_name} ${volunteer.last_name}`}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
                {volunteer.status === "pending" && (
                  <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-3">
                    <button
                      onClick={() => handleStatusUpdate(volunteer.id, "approved")}
                      disabled={statusUpdating === volunteer.id}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-success-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-success-600 disabled:opacity-50"
                    >
                      {statusUpdating === volunteer.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(volunteer.id, "rejected")}
                      disabled={statusUpdating === volunteer.id}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-error-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-error-600 disabled:opacity-50"
                    >
                      {statusUpdating === volunteer.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <XCircle size={14} />
                      )}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
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

      {/* View Modal */}
      {viewModalOpen && selectedVolunteer && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={() => setViewModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                Volunteer Details
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100"
                aria-label="Close"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M11.99 2C6.47 2 2 6.48 2 12.01c0 .62.43 1.15.99 1.28L4 15v5c0 .55.45 1 1 1h6.5c.28 0 .5-.22.5-.5v-1h2v1c0 .28.22.5.5.5H19c.55 0 1-.45 1-1v-5l.01-.01c.55-.13.99-.66.99-1.28C22 6.48 17.52 2 11.99 2zm1 14h-2v-2h2v2zm0-3.5h-2V7h2v5.5z" />
                </svg>
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Name
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedVolunteer.first_name} {selectedVolunteer.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedVolunteer.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedVolunteer.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    County
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedVolunteer.county}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedVolunteer.status)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Applied
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {formatDate(selectedVolunteer.created_at)}
                  </p>
                </div>
                {selectedVolunteer.skills && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Skills
                    </p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedVolunteer.skills}
                    </p>
                  </div>
                )}
                {selectedVolunteer.availability && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Availability
                    </p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedVolunteer.availability}
                    </p>
                  </div>
                )}
                {selectedVolunteer.motivation && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Motivation
                    </p>
                    <p className="mt-1 text-sm text-neutral-900 whitespace-pre-wrap">
                      {selectedVolunteer.motivation}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
