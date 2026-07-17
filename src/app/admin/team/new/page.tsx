"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NewTeamMemberPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    position: "",
    department_id: "",
    biography: "",
    email: "",
    phone: "",
    linkedin: "",
    facebook: "",
    x: "",
    instagram: "",
    photo_url: "",
    display_order: 0,
  });

  useEffect(() => {
    supabase
      .from("departments")
      .select("*")
      .order("name")
      .then(({ data }) => setDepartments(data || []));
  }, [supabase]);

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const { error: saveError } = await supabase.from("members").insert({
        name: form.name,
        position: form.position,
        department_id: form.department_id || null,
        biography: form.biography || null,
        email: form.email || null,
        phone: form.phone || null,
        linkedin: form.linkedin || null,
        facebook: form.facebook || null,
        x: form.x || null,
        instagram: form.instagram || null,
        photo_url: form.photo_url || null,
        display_order: form.display_order || 0,
        status: "active",
      });

      if (saveError) throw saveError;
      router.push("/admin/team");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/team" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">Add Team Member</h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || !form.name || !form.position}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Position *</label>
                  <input type="text" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Department</label>
                <select value={form.department_id} onChange={(e) => setForm((f) => ({ ...f, department_id: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Biography</label>
                <textarea value={form.biography} onChange={(e) => setForm((f) => ({ ...f, biography: e.target.value }))} rows={4} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">Social Links</h3>
            <div className="space-y-4">
              {["linkedin", "facebook", "x", "instagram"].map((platform) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-neutral-700 capitalize">{platform}</label>
                  <input type="url" value={(form as any)[platform]} onChange={(e) => setForm((f) => ({ ...f, [platform]: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Photo URL</label>
                <input type="url" value={form.photo_url} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Display Order</label>
                <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}