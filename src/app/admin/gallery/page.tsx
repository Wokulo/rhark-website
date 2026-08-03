"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Images, Plus, Trash2, Search } from "lucide-react";
import { formatDate } from "@/lib/admin-utils";

export default function AdminGalleryPage() {
  const supabase = createClient();
  const [images, setImages] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [albumFilter, setAlbumFilter] = useState("all");

  useEffect(() => {
    fetchImages();
    fetchAlbums();
  }, [albumFilter, search, supabase]);

  async function fetchImages() {
    setLoading(true);
    setError("");
    try {
      let query = (supabase.from("gallery") as any)
        .select("*, album:albums(title)")
        .order("created_at", { ascending: false });

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
  }

  async function fetchAlbums() {
    const { data, error: fetchError } = await (supabase.from("albums") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (!fetchError) setAlbums((data || []) as any[]);
  }

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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Photo Gallery</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage gallery images and albums. {images.length} images across {albums.length} albums.
          </p>
        </div>
        <Link
          href="/admin/media"
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <Plus size={16} />
          Upload New
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M11.99 2C6.47 2 2 6.48 2 12.01c0 .62.43 1.15.99 1.28L4 15v5c0 .55.45 1 1 1h6.5c.28 0 .5-.22.5-.5v-1h2v1c0 .28.22.5.5.5H19c.55 0 1-.45 1-1v-5l.01-.01c.55-.13.99-.66.99-1.28C22 6.48 17.52 2 11.99 2zm1 14h-2v-2h2v2zm0-3.5h-2V7h2v5.5z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Images size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No gallery images found</p>
          <p className="mt-1 text-sm text-neutral-400">
            Upload images via the Media Library to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden rounded-t-2xl">
                {img.image_url ? (
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
              </div>
              <div className="p-4">
                <p className="font-medium text-neutral-800">{img.caption || img.alt_text || "Untitled"}</p>
                {img.album && (
                  <p className="text-xs text-neutral-500">{img.album.title}</p>
                )}
                <p className="mt-1 text-xs text-neutral-400">
                  {formatDate(img.created_at, { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 p-1.5 text-xs text-neutral-600 hover:bg-error-50 hover:text-error-600"
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
