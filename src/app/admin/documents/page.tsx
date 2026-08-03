"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, Search, Download, Trash2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/admin-utils";

const FILE_TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "Word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
  "application/vnd.ms-excel": "Excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "application/vnd.ms-powerpoint": "PowerPoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
  "application/zip": "ZIP",
  "application/x-rar": "RAR",
};

export default function AdminDocumentsPage() {
  const supabase = createClient();
  const [documents, setDocuments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, [categoryFilter, search]);

  async function fetchDocuments() {
    setLoading(true);
    setError("");
    try {
      let query = (supabase.from("documents") as any)
        .select("*, category:document_categories(name)")
        .order("created_at", { ascending: false });

      if (categoryFilter !== "all") {
        query = query.eq("category_id", categoryFilter);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setDocuments((data || []) as any[]);
    } catch (err: any) {
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    const { data, error: fetchError } = await supabase
      .from("document_categories")
      .select("*")
      .order("name");

    if (!fetchError) setCategories((data || []) as any[]);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;

    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    fetchDocuments();
  };

  function getFileTypeLabel(fileType: string): string {
    return FILE_TYPE_LABELS[fileType] || fileType.split("/").pop() || "File";
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Documents</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage downloadable documents and files. {documents.length} documents.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No documents found</p>
          <p className="mt-1 text-sm text-neutral-400">
            Upload documents via the Media Library to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{doc.title}</h3>
                    {doc.category && (
                      <p className="text-xs text-neutral-500">{doc.category.name}</p>
                    )}
                    <div className="mt-1 flex items-center gap-4 text-xs text-neutral-400">
                      <span>{getFileTypeLabel(doc.file_type)}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>
                        {formatDate(doc.created_at, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {doc.description && (
                      <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                    aria-label={`Download ${doc.title}`}
                  >
                    <Download size={18} />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-error-50 hover:text-error-600"
                    aria-label={`Delete ${doc.title}`}
                  >
                    <Trash2 size={18} />
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
