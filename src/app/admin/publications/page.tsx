"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { uploadFeaturedImage } from "@/lib/upload";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Archive,
  Download,
  Upload,
  Loader2,
  AlertCircle,
  FolderOpen,
  GripVertical,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  "annual-report": "Annual Report",
  research: "Research",
  "policy-brief": "Policy Brief",
  factsheet: "Factsheet",
  newsletter: "Newsletter",
};

const CATEGORIES = [
  "general",
  "reports",
  "policy",
  "research",
  "newsletters",
  "factsheets",
];

export default function AdminPublicationsPage() {
  const supabase = createClient();

  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    type: "research" as string,
    category: "general",
    fileUrl: "",
    fileFile: null as File | null,
    fileSizeKb: 0,
    fileType: "pdf",
    coverImage: "",
    tags: "",
    isArchived: false,
  });

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = (supabase.from("publications") as any)
        .select("*")
        .order("sort_order", { ascending: true });

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPublications((data || []) as any[]);
    } catch (err: any) {
      setError(err.message || "Failed to load publications");
    } finally {
      setLoading(false);
    }
  }, [supabase, typeFilter, categoryFilter, search]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this publication?")) return;

    const { error: deleteError } = await (supabase.from("publications") as any)
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    fetchPublications();
  };

  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    const { error } = await (supabase.from("publications") as any)
      .update({ is_archived: !currentArchived })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchPublications();
  };

  const handleSubmit = async () => {
    if (!form.title || !form.slug) {
      setError("Title and slug are required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let fileUrl = form.fileUrl;
      let fileSizeKb = form.fileSizeKb;
      let fileType = form.fileType;

      if (form.fileFile) {
        const fileName = `publications/${Date.now()}-${form.fileFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("featured-images")
          .upload(fileName, form.fileFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: form.fileFile.type,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("featured-images")
          .getPublicUrl(fileName);

        fileUrl = data.publicUrl;
        fileSizeKb = Math.round(form.fileFile.size / 1024);
        fileType = form.fileFile.type.split("/")[1] || "pdf";
      }

      const { error: insertError } = await (supabase.from("publications") as any)
        .insert({
          title: form.title,
          slug: form.slug,
          description: form.description || null,
          type: form.type,
          file_url: fileUrl,
          file_size_kb: fileSizeKb,
          file_type: fileType,
          cover_image: form.coverImage || null,
          tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
          category: form.category,
          is_archived: form.isArchived,
          sort_order: publications.length,
        });

      if (insertError) throw insertError;

      setShowForm(false);
      setForm({
        title: "",
        slug: "",
        description: "",
        type: "research",
        category: "general",
        fileUrl: "",
        fileFile: null,
        fileSizeKb: 0,
        fileType: "pdf",
        coverImage: "",
        tags: "",
        isArchived: false,
      });
      fetchPublications();
    } catch (err: any) {
      setError(err.message || "Failed to save publication");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplaceFile = async (id: string, currentFileUrl: string) => {
    const file = form.fileFile;
    if (!file) return;

    try {
      const fileName = `publications/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("featured-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("featured-images")
        .getPublicUrl(fileName);

      await (supabase.from("publications") as any)
        .update({
          file_url: data.publicUrl,
          file_size_kb: Math.round(file.size / 1024),
          file_type: file.type.split("/")[1] || "pdf",
        })
        .eq("id", id);

      fetchPublications();
    } catch (err: any) {
      setError(err.message || "Failed to replace file");
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

    const draggedIndex = publications.findIndex((p) => p.id === draggedId);
    const targetIndex = publications.findIndex((p) => p.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPublications = [...publications];
    const [draggedItem] = newPublications.splice(draggedIndex, 1);
    newPublications.splice(targetIndex, 0, draggedItem);

    setPublications(newPublications);
    setDraggedId(null);

    await Promise.all(
      newPublications.map((p, i) =>
        (supabase.from("publications") as any).update({ sort_order: i }).eq("id", p.id)
      )
    );
  };

  const formatFileSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Publications
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage publications, reports, and policy documents
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Publication"}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Add Publication Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-900">Add New Publication</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="publication-slug"
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
                <option value="annual-report">Annual Report</option>
                <option value="research">Research</option>
                <option value="policy-brief">Policy Brief</option>
                <option value="factsheet">Factsheet</option>
                <option value="newsletter">Newsletter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">File</label>
              <div className="mt-1.5 flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                  <Upload size={16} />
                  Upload File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setForm((f) => ({
                          ...f,
                          fileFile: file,
                          fileUrl: "",
                          fileSizeKb: Math.round(file.size / 1024),
                          fileType: file.type.split("/")[1] || "pdf",
                        }));
                      }
                    }}
                  />
                </label>
                {form.fileFile && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <FileText size={14} />
                    <span className="truncate max-w-[200px]">{form.fileFile.name}</span>
                    <span className="text-xs text-neutral-400">({formatFileSize(form.fileSizeKb)})</span>
                    <button type="button" onClick={() => setForm((f) => ({ ...f, fileFile: null, fileUrl: "" }))}>
                      <X size={14} />
                    </button>
                  </div>
                )}
                {!form.fileFile && (
                  <input
                    type="url"
                    value={form.fileUrl}
                    onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                    placeholder="https://example.com/file.pdf"
                    className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.isArchived}
                  onChange={(e) => setForm((f) => ({ ...f, isArchived: e.target.checked }))}
                  className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
                Archived
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.title || !form.slug}
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add Publication
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
            placeholder="Search publications..."
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
          <option value="annual-report">Annual Report</option>
          <option value="research">Research</option>
          <option value="policy-brief">Policy Brief</option>
          <option value="factsheet">Factsheet</option>
          <option value="newsletter">Newsletter</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : publications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No publications found</p>
          <p className="mt-1 text-sm text-neutral-400">
            Add your first publication to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {publications.map((pub, index) => (
            <div
              key={pub.id}
              draggable
              onDragStart={() => handleDragStart(pub.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(pub.id)}
              className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-md ${
                draggedId === pub.id ? "ring-2 ring-primary-400" : ""
              }`}
            >
              <GripVertical size={16} className="text-neutral-300 shrink-0 cursor-grab" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 truncate">{pub.title}</h3>
                  {pub.is_archived && (
                    <span className="shrink-0 rounded-full bg-warning-50 px-2 py-0.5 text-[10px] font-medium text-warning-700">
                      Archived
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span>{TYPE_LABELS[pub.type] || pub.type}</span>
                  <span aria-hidden="true">•</span>
                  <span>{pub.category}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatFileSize(pub.fileSizeKb)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={pub.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  aria-label="Download publication"
                  title="Download"
                >
                  <Download size={14} />
                </a>
                <button
                  onClick={() => handleToggleArchive(pub.id, pub.is_archived)}
                  className={`rounded-lg p-1.5 ${
                    pub.is_archived
                      ? "text-neutral-400 hover:bg-success-50 hover:text-success-600"
                      : "text-neutral-400 hover:bg-warning-50 hover:text-warning-600"
                  }`}
                  aria-label={pub.is_archived ? "Restore publication" : "Archive publication"}
                  title={pub.is_archived ? "Restore" : "Archive"}
                >
                  {pub.is_archived ? <Eye size={14} /> : <Archive size={14} />}
                </button>
                <button
                  onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";
                    fileInput.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        await handleReplaceFile(pub.id, pub.fileUrl);
                        fetchPublications();
                      }
                    };
                    fileInput.click();
                  }}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  aria-label="Replace file"
                  title="Replace file"
                >
                  <Upload size={14} />
                </button>
                <Link
                  href={`/admin/publications/${pub.id}`}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  aria-label="Edit publication"
                >
                  <Edit size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(pub.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-error-50 hover:text-error-600"
                  aria-label="Delete publication"
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