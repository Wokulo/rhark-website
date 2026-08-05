"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { uploadFeaturedImage } from "@/lib/upload";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  Star,
} from "lucide-react";
import { cn } from "@/utils";

const TYPE_LABELS: Record<string, string> = {
  funder: "Funder",
  implementing: "Implementing",
  government: "Government",
  media: "Media",
  academic: "Academic",
};

export default function AdminPartnersPage() {
  const supabase = createClient();

  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    logoFile: null as File | null,
    website: "",
    type: "government" as string,
    description: "",
    isFeatured: false,
  });

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = (supabase.from("partners") as any)
        .select("*")
        .order("sort_order", { ascending: true });

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPartners((data || []) as any[]);
    } catch (err: any) {
      setError(err.message || "Failed to load partners");
    } finally {
      setLoading(false);
    }
  }, [supabase, typeFilter, search]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return;

    const { error: deleteError } = await (supabase.from("partners") as any)
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    fetchPartners();
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await (supabase.from("partners") as any)
      .update({ is_active: !currentActive })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchPartners();
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const { error } = await (supabase.from("partners") as any)
      .update({ is_featured: !currentFeatured })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchPartners();
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      setError("Name and slug are required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let logoUrl = form.logoUrl;

      if (form.logoFile) {
        logoUrl = await uploadFeaturedImage(form.logoFile);
      }

      const { error: insertError } = await (supabase.from("partners") as any)
        .insert({
          name: form.name,
          slug: form.slug,
          logo_url: logoUrl,
          website: form.website || null,
          type: form.type,
          description: form.description || null,
          is_featured: form.isFeatured,
          sort_order: partners.length,
        });

      if (insertError) throw insertError;

      setShowForm(false);
      setForm({
        name: "",
        slug: "",
        logoUrl: "",
        logoFile: null,
        website: "",
        type: "government",
        description: "",
        isFeatured: false,
      });
      fetchPartners();
    } catch (err: any) {
      setError(err.message || "Failed to save partner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = partners.findIndex((p) => p.id === draggedId);
    const targetIndex = partners.findIndex((p) => p.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPartners = [...partners];
    const [draggedItem] = newPartners.splice(draggedIndex, 1);
    newPartners.splice(targetIndex, 0, draggedItem);

    setPartners(newPartners);
    setDraggedId(null);

    await Promise.all(
      newPartners.map((p, i) =>
        (supabase.from("partners") as any).update({ sort_order: i }).eq("id", p.id)
      )
    );
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Partners
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage partner organizations and their logos
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Partner"}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Add Partner Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-900">Add New Partner</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="partner-slug"
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="government">Government</option>
                <option value="funder">Funder</option>
                <option value="implementing">Implementing</option>
                <option value="media">Media</option>
                <option value="academic">Academic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://partner.org"
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Logo</label>
              <div className="mt-1.5 flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, logoFile: e.target.files?.[0] || null }))
                    }
                  />
                </label>
                <span className="text-xs text-neutral-400">or</span>
                <input
                  type="url"
                  value={form.logoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
                Featured
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.name || !form.slug}
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add Partner
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="all">All Types</option>
          <option value="government">Government</option>
          <option value="funder">Funder</option>
          <option value="implementing">Implementing</option>
          <option value="media">Media</option>
          <option value="academic">Academic</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : partners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Building2 size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No partners found</p>
          <p className="mt-1 text-sm text-neutral-400">
            Add your first partner to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              draggable
              onDragStart={() => handleDragStart(partner.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(partner.id)}
              className={cn(
                "flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-md",
                draggedId === partner.id && "ring-2 ring-primary-400"
              )}
            >
              <GripVertical size={16} className="text-neutral-300 shrink-0 cursor-grab" />
              {partner.logo_url && (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-10 w-10 rounded-lg object-contain"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 truncate">
                    {partner.name}
                  </h3>
                  {partner.is_featured && (
                    <Star size={12} className="text-warning-500 fill-warning-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span>{TYPE_LABELS[partner.type] || partner.type}</span>
                  {partner.website && (
                    <>
                      <span aria-hidden="true">•</span>
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600"
                      >
                        <LinkIcon size={10} />
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleFeatured(partner.id, partner.is_featured)}
                  className={cn(
                    "rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100",
                    partner.is_featured && "text-warning-500"
                  )}
                  aria-label={partner.is_featured ? "Unfeature partner" : "Feature partner"}
                  title={partner.is_featured ? "Remove from featured" : "Mark as featured"}
                >
                  <Star size={14} />
                </button>
                <button
                  onClick={() => handleToggleActive(partner.id, partner.is_active)}
                  className={cn(
                    "rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100",
                    !partner.is_active && "text-error-500"
                  )}
                  aria-label={partner.is_active ? "Disable partner" : "Enable partner"}
                  title={partner.is_active ? "Disable" : "Enable"}
                >
                  {partner.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <Link
                  href={`/admin/partners/${partner.id}`}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  aria-label="Edit partner"
                >
                  <Edit size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-error-50 hover:text-error-600"
                  aria-label="Delete partner"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}