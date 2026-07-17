"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays, Plus, Edit, Trash2, AlertCircle, Search } from "lucide-react";
import Link from "next/link";

export default function AdminEventsPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEvents();
  }, [supabase, search]);

  async function loadEvents() {
    setLoading(true);
    try {
      let query = supabase.from("events").select("*").order("event_date", { ascending: false });
      if (search) query = query.or(`title.ilike.%${search}%,venue.ilike.%${search}%`);
      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    loadEvents();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Events</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage upcoming and past events</p>
        </div>
        <Link href="/admin/events/new" className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">
          <Plus size={16} /> New Event
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
      </div>

      {error && <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{error}</p></div>}

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarDays size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No events</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-primary-50 px-4 py-2 text-center min-w-[60px]">
                    <span className="text-sm font-bold text-primary-700">{new Date(event.event_date).getDate()}</span>
                    <span className="text-xs text-primary-600">{new Date(event.event_date).toLocaleDateString("en-KE", { month: "short" })}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{event.title}</h3>
                    {event.venue && <p className="text-sm text-neutral-500">{event.venue}</p>}
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                      {event.event_time && <span>{event.event_time}</span>}
                      {event.capacity && <span>Capacity: {event.capacity}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/events/${event.id}`} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100"><Edit size={16} /></Link>
                  <button onClick={() => handleDelete(event.id)} className="rounded-lg p-2 text-neutral-400 hover:bg-error-50 hover:text-error-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}