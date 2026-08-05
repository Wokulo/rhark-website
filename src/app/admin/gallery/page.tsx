"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { uploadFeaturedImage } from "@/lib/upload";
import {
  Images,
  Plus,
  Trash2,
  Search,
  Star,
  GripVertical,
  Upload,
  Loader2,
  AlertCircle,
  Film,
  ImageIcon,
} from "lucide-react";
import { formatDate } from "@/lib/admin-utils";

export default function AdminGalleryPage() {
  const supabase = createClient();

  const [images, setImages] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [albumFilter, setAlbumFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "general",
    file: null as File | null,
    videoUrl: "",
    mediaType: "image" as "image" | "video",
  });
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = (supabase.from("gallery") as any)
        .select("*, album:albums(title)")
        .order("sort_order", { ascending: true });

      if (albumFilter !== "all") {
        query = query.eq("album_id", albumFilter);
      }

      if (search) {
        query = query.or(`caption.ilike.%${search}%,alt_text.ilike.%${search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setImages((data || []) as any[]);
    } catch (err: any) {
      setError(err.message || "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, [supabase, albumFilter, search]);

  const fetchAlbums = useCallback(async () => {
    const { data, error: fetchError } = await (supabase.from("albums") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (!fetchError) setAlbums((data || []) as any[]);
  }, [supabase]);

  useEffect(() => {
    fetchImages();
    fetchAlbums();
  }, [fetchImages, fetchAlbums]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;

    const { error: deleteError } = await (supabase.from("gallery") as any)
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    fetchImages();
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Delete this album? This will also unassign its images.")) return;

    const { error: deleteError } = await (supabase.from("albums") as any)
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    fetchAlbums();
    fetchImages();
  };

  const handleToggleFeatured = async (id: string) => {
    const item = images.find((i) => i.id === id);
    if (!item) return;

    const { error } = await (supabase.from("gallery") as any)
      .update({ featured: !item.featured })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchImages();
  };

  const handleUpload = async () => {
    if (!uploadForm.title) {
      setError("Title is required");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let imageUrl = uploadForm.videoUrl || "";

      if (uploadForm.file && uploadForm.mediaType === "image") {
        imageUrl = await uploadFeaturedImage(uploadForm.file);
      }

      const { error: insertError } = await (supabase.from("gallery") as any)
        .insert({
          album_id: uploadForm.category === "general" ? null : uploadForm.category,
          image_url: imageUrl,
          caption: uploadForm.description || null,
          alt_text: uploadForm.title,
          media_type: uploadForm.mediaType,
          video_url: uploadForm.mediaType === "video" ? uploadForm.videoUrl : null,
          featured: false,
          sort_order: images.length,
        });

      if (insertError) throw insertError;

      setShowUpload(false);
      setUploadForm({
        title: "",
        description: "",
        category: "general",
        file: null,
        videoUrl: "",
        mediaType: "image",
      });
      fetchImages();
    } catch (err: any) {
      setError(err.message || "Failed to upload");
    } finally {
      setUploading(false);
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

    const draggedIndex = images.findIndex((i) => i.id === draggedId);
    const targetIndex = images.findIndex((i) => i.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedItem);

    setImages(newImages);
    setDraggedId(null);

    // Update sort_order for all items
    const updates = newImages.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));

    await Promise.all(
      updates.map((u) =>
        (supabase.from("gallery") as any).update({ sort_order: u.sortOrder }).eq("id", u.id)
      )
    );
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Photo Gallery
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage gallery images and albums. {images.length} images across {albums.length} albums.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            <Plus size={16} />
            {showUpload ? "Cancel" : "Upload New"}
          </button>
          <Link
            href="/admin/media"
            className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <Upload size={16} />
            Media Library
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Upload Form */}
      {showUpload && (
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-900">Upload New Item</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Media Type</label>
              <select
                value={uploadForm.mediaType}
                onChange={(e) =>
                  setUploadForm((f) => ({
                    ...f,
                    mediaType: e.target.value as "image" | "video",
                  }))
                }
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            {uploadForm.mediaType === "image" ? (
              <div>
                <label className="block text-sm font-medium text-neutral-700">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setUploadForm((f) => ({ ...f, file: e.target.files?.[0] || null }))
                  }
                  className="mt-1.5 block w-full text-sm text-neutral-700"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-neutral-700">Video URL</label>
                <input
                  type="url"
                  value={uploadForm.videoUrl}
                  onChange={(e) =>
                    setUploadForm((f) => ({ ...f, videoUrl: e.target.value }))
                  }
                  placeholder="https://youtube.com/..."
                  className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-neutral-700">Title</label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Image title"
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Caption</label>
              <textarea
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                placeholder="Add a caption..."
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Album</label>
              <select
                value={uploadForm.category}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, category: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="general">No Album</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading || !uploadForm.title}
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              Upload
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={albumFilter}
            onChange={(e) => setAlbumFilter(e.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">All Albums</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Albums */}
      {albums.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700">Albums</h2>
          <div className="flex flex-wrap gap-3">
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-2.5"
              >
                <div>
                  <p className="font-semibold text-neutral-900">{album.title}</p>
                  {album.description && (
                    <p className="text-xs text-neutral-500">{album.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteAlbum(album.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-error-50 hover:text-error-600"
                  aria-label={`Delete album ${album.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Images size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No gallery images found</p>
          <p className="mt-1 text-sm text-neutral-400">
            Upload images to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(img.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(img.id)}
              className="group rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
                {img.media_type === "video" ? (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-900">
                    <Film size={32} className="text-neutral-400" />
                  </div>
                ) : img.image_url ? (
                  <img
                    src={img.image_url}
                    alt={img.alt_text || img.caption || ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                    <Images size={32} className="text-neutral-400" />
                  </div>
                )}
                {img.featured && (
                  <span className="absolute left-2 top-2 rounded-full bg-warning-400 px-2 py-0.5 text-xs font-bold text-neutral-900">
                    Featured
                  </span>
                )}
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <span className="rounded-full bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {img.media_type === "video" ? "Video" : "Image"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-neutral-300" />
                  <p className="font-medium text-neutral-800">{img.caption || img.alt_text || "Untitled"}</p>
                </div>
                {img.album && (
                  <p className="text-xs text-neutral-500">{img.album.title}</p>
                )}
                <p className="mt-1 text-xs text-neutral-400">
                  {formatDate(img.created_at, { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(img.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border p-1.5 text-xs ${
                      img.featured
                        ? "border-warning-300 bg-warning-50 text-warning-700"
                        : "border-neutral-200 text-neutral-600 hover:bg-warning-50 hover:text-warning-600"
                    }`}
                    aria-label={img.featured ? "Unfeature image" : "Feature image"}
                    title={img.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    <Star size={14} /> {img.featured ? "Featured" : "Feature"}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 p-1.5 text-xs text-neutral-600 hover:bg-error-50 hover:text-error-600"
                    aria-label="Delete image"
                  >
                    <Trash2 size={14} /> Delete
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