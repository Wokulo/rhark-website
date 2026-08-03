"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditTeamMemberPage() {
  const r = useRouter(),
    pp = useParams(),
    s = createClient();
  const id = pp.id as string;
  const [l, setL] = useState(true);
  const [sv, setSv] = useState(false);
  const [er, setEr] = useState("");
  const [depts, setDepts] = useState<any[]>([]);
  const [fm, setFm] = useState({
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
    status: "active",
    display_order: 0,
  });

  useEffect(() => {
    (async () => {
      const [deptRes, memRes] = await Promise.all([
        s.from("departments").select("*").order("name"),
        s.from("members").select("*").eq("id", id).single() as unknown as { data: any },
      ]);
      setDepts(deptRes.data || []);
      if (memRes.data) {
        const d = memRes.data;
        setFm({
          name: d.name || "",
          position: d.position || "",
          department_id: d.department_id || "",
          biography: d.biography || "",
          email: d.email || "",
          phone: d.phone || "",
          linkedin: d.linkedin || "",
          facebook: d.facebook || "",
          x: d.x || "",
          instagram: d.instagram || "",
          photo_url: d.photo_url || "",
          status: d.status || "active",
          display_order: d.display_order || 0,
        });
      }
      setL(false);
    })();
  }, []);

  const save = async () => {
    setSv(true);
    setEr("");
    try {
        await (s.from("members") as any).update({
            name: fm.name,
            position: fm.position,
            department_id: fm.department_id || null,
            biography: fm.biography || null,
            email: fm.email || null,
            phone: fm.phone || null,
            linkedin: fm.linkedin || null,
            facebook: fm.facebook || null,
            x: fm.x || null,
            instagram: fm.instagram || null,
            photo_url: fm.photo_url || null,
            status: fm.status,
            display_order: fm.display_order,
            updated_at: new Date().toISOString(),
          }).eq("id", id);
      r.push("/admin/team");
      r.refresh();
    } catch (err: any) {
      setEr(err.message || "Failed");
    } finally {
      setSv(false);
    }
  };

  if (l)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/team"
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">
              Edit Member
            </h1>
            <p className="mt-1 text-sm text-neutral-500">{fm.name}</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={sv || !fm.name}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {sv ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}{" "}
          Save
        </button>
      </div>

      {/* Error */}
      {er && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{er}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Info */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              Personal Info
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Name *
                </label>
                <input
                  type="text"
                  value={fm.name}
                  onChange={(e) => setFm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Position *
                </label>
                <input
                  type="text"
                  value={fm.position}
                  onChange={(e) => setFm((p) => ({ ...p, position: e.target.value }))}
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Department
                </label>
                <select
                  value={fm.department_id}
                  onChange={(e) => setFm((p) => ({ ...p, department_id: e.target.value }))}
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
                >
                  <option value="">Select</option>
                  {depts.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Biography
                </label>
                <textarea
                  value={fm.biography}
                  onChange={(e) => setFm((p) => ({ ...p, biography: e.target.value }))}
                  rows={4}
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              Contact
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  type="email"
                  value={fm.email}
                  onChange={(e) => setFm((p) => ({ ...p, email: e.target.value }))}
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={fm.phone}
                  onChange={(e) => setFm((p) => ({ ...p, phone: e.target.value }))}
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              Social Links
            </h3>
            <div className="space-y-4">
              {[
                ["linkedin", "LinkedIn"],
                ["facebook", "Facebook"],
                ["x", "X (Twitter)"],
                ["instagram", "Instagram"],
              ].map(([k, v]) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-neutral-700">
                    {v}
                  </label>
                  <input
                    type="url"
                    value={(fm as any)[k]}
                    onChange={(e) =>
                      setFm((p) => ({ ...p, [k]: e.target.value }))
                    }
                    className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              Status
            </h3>
            <select
              value={fm.status}
              onChange={(e) => setFm((p) => ({ ...p, status: e.target.value }))}
              className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Photo */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              Photo
            </h3>
            <label className="block text-sm font-medium text-neutral-700">
              Photo URL
            </label>
            <input
              type="url"
              value={fm.photo_url}
              onChange={(e) => setFm((p) => ({ ...p, photo_url: e.target.value }))}
              className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
            />
          </div>

          {/* Order */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              Display Order
            </h3>
            <label className="block text-sm font-medium text-neutral-700">
              Order
            </label>
            <input
              type="number"
              value={fm.display_order}
              onChange={(e) =>
                setFm((p) => ({
                  ...p,
                  display_order: parseInt(e.target.value) || 0,
                }))
              }
              className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

