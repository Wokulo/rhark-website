"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDate, truncate } from "@/lib/admin-utils";
import {
  Newspaper,
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/utils";

export default function AdminNewsPage() {
  const supabase = createClient();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("news")
        .select("*, author:users(name)")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,excerpt.ilike.%${search}%`
        );
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setArticles(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [supabase, search, statusFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    const { error: deleteError } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("Failed to delete article");
      return;
    }

    fetchArticles();
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const { error: updateError } = await supabase
      .from("news")
      .update({ status: newStatus })
      .eq("id", id);

    if (updateError) {
      alert("Failed to update status");
      return;
    }

    fetchArticles();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-neutral-100 text-neutral-600",
      published: "bg-success-50 text-success-700",
      archived: "bg-warning-50 text-warning-700",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          styles[status] || styles.draft
        )}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            News & Articles
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage news, blog posts, and press releases
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <Plus size={16} />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search articles..."
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
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
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
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Newspaper size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">
            No articles found
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Create your first article to get started.
          </p>
          <Link
            href="/admin/news/new"
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
          >
            <Plus size={16} />
            Create Article
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-neutral-900">
                      {article.title}
                    </h3>
                    {getStatusBadge(article.status)}
                  </div>
                  {article.excerpt && (
                    <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                      {truncate(article.excerpt, 150)}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
                    <span>{article.category}</span>
                    <span aria-hidden="true">•</span>
                    <span>
                      {article.publish_date
                        ? formatDate(article.publish_date)
                        : "Not published"}
                    </span>
                    {article.author && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{article.author.name}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/news/${article.id}`}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                    aria-label="Edit article"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() =>
                      handleToggleStatus(article.id, article.status)
                    }
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                    aria-label={
                      article.status === "published"
                        ? "Unpublish article"
                        : "Publish article"
                    }
                  >
                    {article.status === "published" ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-error-50 hover:text-error-600"
                    aria-label="Delete article"
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