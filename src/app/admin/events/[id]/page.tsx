"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadFeaturedImage } from "@/lib/upload";
import { ArrowLeft, Save, Loader2, AlertCircle, ImageIcon, X, Archive } from "lucide-react";
import Link from "next/link";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    venue: "",
    description: "",
    event_date: "",
    event_time: "",
    capacity: "",
    status: "upcoming",
    featuredImageFile: null as File | null,
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("events").select("*").eq("id", id).single() as unknown as { data: any };
      if (data) {
        setForm({
          title: data.title || "",
          venue: data.venue || "",
          description: data.description || "",
          event_date: data.event_date || "",
          event_time: data.event_time || "",
          capacity: data.capacity ? String(data.capacity) : "",
          status: data.status || "upcoming",
          featuredImageFile: null,
        });
      }
      setFetchLoading(false);
    })();
  }, [supabase, id]);

  const save = async () => {
    setLoading(true);
    setError("");
    try {
      let featuredImageUrl: string | null = null;
      if (form.featuredImageFile) {
        featuredImageUrl = await uploadFeaturedImage(form.featuredImageFile);
      }
      await (supabase.from("events") as any).update({
        title: form.title,
        venue: form.venue || null,
        description: form.description || null,
        event_date: form.event_date || null,
        event_time: form.event_time || null,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        status: form.status,
        featured_image: featuredImageUrl,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    setError("");
    try {
      await (supabase.from("events") as any).update({ status: "archived" }).eq("id", id);
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">Edit Event</h1>
            <p className="mt-1 text-sm text-neutral-500">{form.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {form.status !== "archived" && (
            <button onClick={handleArchive} disabled={loading} className="flex items-center gap-2 rounded-xl border border-warning-300 bg-warning-50 px-4 py-2.5 text-sm font-semibold text-warning-700 hover:bg-warning-100 disabled:opacity-50">
              <Archive size={16} />
              Archive
            </button>
          )}
          <button onClick={save} disabled={loading || !form.title} className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">Event Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">Settings</h3>
            <div className="space-y-4">
              <div>
                <label>Venue</label>
                <input type="text" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label>Date</label>
                <input type="date" value={form.event_date} onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label>Time</label>
                <input type="time" value={form.event_time} onChange={e => setForm(p => ({ ...p, event_time: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label>Capacity</label>
                <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Featured Image</label>
                <div className="mt-1.5 flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                    <ImageIcon size={16} />
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) { setForm(p => ({ ...p, featuredImageFile: file })); setImagePreview(URL.createObjectURL(file)); } }} />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Featured preview" className="h-16 w-24 rounded-xl object-cover" />
                      <button type="button" onClick={() => { setForm(p => ({ ...p, featuredImageFile: null })); setImagePreview(null); }} className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-white">
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}