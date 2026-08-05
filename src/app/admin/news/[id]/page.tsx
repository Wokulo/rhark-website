"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/admin-utils";
import { uploadFeaturedImage } from "@/lib/upload";
import { ArrowLeft, Save, Send, Loader2, AlertCircle, ImageIcon, X } from "lucide-react";
import Link from "next/link";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "news",
    content: "",
    excerpt: "",
    featured_image: "",
    featuredImageFile: null as File | null,
    tags: "",
    status: "draft",
    publish_date: "",
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from("news_categories")
        .select("*")
        .order("name");
      setCategories(data || []);
    }
    loadCategories();
  }, [supabase]);

  useEffect(() => {
    async function loadArticle() {
      setFetchLoading(true);
      try {
        const { data, error: fetchError } = await (supabase.from("news") as any)
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Article not found");

        setForm({
          title: data.title || "",
          slug: data.slug || "",
          category: data.category || "news",
          content: data.content || "",
          excerpt: data.excerpt || "",
          featured_image: data.featured_image || "",
          featuredImageFile: null,
          tags: (data.tags || []).join(", "),
          status: data.status || "draft",
          publish_date: data.publish_date
            ? new Date(data.publish_date).toISOString().slice(0, 16)
            : "",
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load article");
      } finally {
        setFetchLoading(false);
      }
    }
    loadArticle();
  }, [supabase, id]);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: slugify(title),
    }));
  };

  const handleSave = async (status: string) => {
    setLoading(true);
    setError("");

    try {
      let featuredImageUrl = form.featured_image || null;

      if (form.featuredImageFile) {
        featuredImageUrl = await uploadFeaturedImage(form.featuredImageFile);
      }

      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { error: saveError } = await (supabase.from("news") as any)
        .update({
          title: form.title,
          slug: form.slug || slugify(form.title),
          category: form.category,
          content: form.content,
          excerpt: form.excerpt,
          featured_image: featuredImageUrl,
          tags,
          status,
          publish_date:
            status === "published" && !form.publish_date
              ? new Date().toISOString()
              : form.publish_date
                ? new Date(form.publish_date).toISOString()
                : null,
          seo_title: form.seo_title || null,
          seo_description: form.seo_description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (saveError) throw saveError;

      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/news"
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">
              Edit Article
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {form.title || "Update your article"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={loading || !form.title}
            className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={loading || !form.title}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Title <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter article title"
              className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="article-url-slug"
              className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <p className="mt-1 text-xs text-neutral-400">
              Auto-generated from title. You can customize it.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={3}
              placeholder="Brief summary of the article..."
              className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Content <span className="text-error-500">*</span>
            </label>
            <div className="mt-1.5">
              <RichTextEditor
                value={form.content}
                onChange={(content) => setForm((f) => ({ ...f, content }))}
                placeholder="Write your article content here..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              Article Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Tags
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  placeholder="tag1, tag2, tag3"
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <p className="mt-1 text-xs text-neutral-400">
                  Comma-separated tags
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Featured Image
                </label>
                <div className="mt-1.5 flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                    <ImageIcon size={16} />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setForm((f) => ({ ...f, featuredImageFile: file }));
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Featured preview"
                        className="h-16 w-24 rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, featured_image: "", featuredImageFile: null }));
                          setImagePreview(null);
                        }}
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-white"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                  {form.featured_image && !imagePreview && (
                    <span className="text-xs text-neutral-400">Current image will be replaced</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={form.publish_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, publish_date: e.target.value }))
                  }
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              SEO Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={form.seo_title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seo_title: e.target.value }))
                  }
                  placeholder="Custom SEO title"
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  SEO Description
                </label>
                <textarea
                  value={form.seo_description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seo_description: e.target.value }))
                  }
                  rows={3}
                  placeholder="Meta description for search engines"
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
