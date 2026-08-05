"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  Archive,
  AlertCircle,
  Search,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const STATUS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  upcoming: { bg: "bg-primary-50", text: "text-primary-700", label: "Upcoming" },
  ongoing: { bg: "bg-success-50", text: "text-success-700", label: "Ongoing" },
  completed: { bg: "bg-neutral-50", text: "text-neutral-600", label: "Completed" },
  archived: { bg: "bg-warning-50", text: "text-warning-700", label: "Archived" },
};

export default function AdminEventsPage() {
  const supabase = createClient();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadEvents = async () => {
    setLoading(true);
    setError("");

    try {
      let query = (supabase.from("events") as any)
        .select("*")
        .order("event_date", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,venue.ilike.%${search}%`
        );
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;

    const { error } = await (supabase.from("events") as any)
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    loadEvents();
  };

  const handleArchive = async (id: string) => {
    const { error } = await (supabase.from("events") as any)
      .update({ status: "archived" })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    loadEvents();
  };

  const handleComplete = async (id: string) => {
    const { error } = await (supabase.from("events") as any)
      .update({ status: "completed" })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    loadEvents();
  };

  const getStatusBadge = (status: string) => {
    const badge = STATUS_BADGES[status] ?? STATUS_BADGES.upcoming;
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Events
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage upcoming and past events
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          <Plus size={16} />
          New Event
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarDays size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">
            No events
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Create your first event to get started.
          </p>
          <Link
            href="/admin/events/new"
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
          >
            <Plus size={16} />
            Create Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {event.poster_url && (
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="h-20 w-28 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-primary-50 px-4 py-2 text-center min-w-[60px]">
                    <span className="text-sm font-bold text-primary-700">
                      {new Date(event.event_date).getDate()}
                    </span>
                    <span className="text-xs text-primary-600">
                      {new Date(event.event_date).toLocaleDateString(
                        "en-KE",
                        { month: "short" }
                      )}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-neutral-900">
                        {event.title}
                      </h3>
                      {getStatusBadge(event.status)}
                    </div>
                    {event.venue && (
                      <p className="text-sm text-neutral-500">
                        {event.venue}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                      {event.event_time && (
                        <span>{event.event_time}</span>
                      )}
                      {event.capacity && (
                        <span>Capacity: {event.capacity}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100"
                    aria-label="Edit event"
                  >
                    <Edit size={16} />
                  </Link>
                  {event.status !== "archived" && (
                    <button
                      onClick={() => handleArchive(event.id)}
                      className="rounded-lg p-2 text-neutral-400 hover:bg-warning-50 hover:text-warning-600"
                      aria-label="Archive event"
                      title="Archive event"
                    >
                      <Archive size={16} />
                    </button>
                  )}
                  {event.status === "upcoming" && (
                    <button
                      onClick={() => handleComplete(event.id)}
                      className="rounded-lg p-2 text-neutral-400 hover:bg-success-50 hover:text-success-600"
                      aria-label="Mark as completed"
                      title="Mark as completed"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-error-50 hover:text-error-600"
                    aria-label="Delete event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}