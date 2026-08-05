"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadFeaturedImage } from "@/lib/upload";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Star,
  Film,
} from "lucide-react";

export default function AdminMediaPage() {
  const supabase = createClient();

  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchItems() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setItems(data || []);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function uploadItem() {
    if (!title) {
      setMessage("Title is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let url = "";

      if (mediaType === "image" && file) {
        url = await uploadFeaturedImage(file);
      } else if (mediaType === "video") {
        url = videoUrl;
      }

      const { error: insertError } = await supabase
        .from("gallery")
        .insert({
          image_url: url,
          caption: description || null,
          alt_text: title,
          media_type: mediaType,
          video_url: mediaType === "video" ? videoUrl : null,
          featured: false,
          sort_order: items.length,
        } as any);

      if (insertError) throw insertError;

      setMessage("Item uploaded successfully");
      setTitle("");
      setDescription("");
      setFile(null);
      setVideoUrl("");
      setMediaType("image");

      fetchItems();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string, imageUrl: string) {
    const fileName = imageUrl.split("/").pop() || "";

    await supabase.storage.from("featured-images").remove([fileName]);

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchItems();
    }
  }

  async function toggleFeatured(id: string, currentFeatured: boolean) {
    const { error } = await (supabase.from("gallery") as any)
      .update({ featured: !currentFeatured })
      .eq("id", id);

    if (!error) {
      fetchItems();
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="text-sm text-neutral-500">
          Upload and manage gallery images and videos
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg bg-neutral-100 p-4">
          {message}
        </div>
      )}

      <div className="rounded-xl border bg-white p-6 mb-8">
        <h2 className="font-semibold mb-4">Upload New Item</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700">
            Media Type
          </label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {mediaType === "image" ? (
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1.5 block w-full text-sm text-neutral-700"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-4 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />

        <textarea
          placeholder="Description / Caption"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-3 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />

        <button
          onClick={uploadItem}
          disabled={loading || !title}
          className="mt-4 flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          Upload {mediaType === "image" ? "Image" : "Video"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl overflow-hidden bg-white"
          >
            {item.media_type === "video" ? (
              <div className="h-48 flex items-center justify-center bg-neutral-900">
                <Film size={32} className="text-neutral-400" />
              </div>
            ) : item.image_url ? (
              <img
                src={item.image_url}
                className="w-full h-48 object-cover"
                alt={item.alt_text || item.caption || ""}
              />
            ) : (
              <div className="h-48 flex items-center justify-center bg-neutral-100">
                <ImageIcon size={32} className="text-neutral-400" />
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{item.alt_text || item.caption || "Untitled"}</h3>
                {item.featured && (
                  <Star size={12} className="text-warning-500 fill-warning-500" />
                )}
              </div>
              <p className="text-sm text-neutral-500">{item.caption}</p>
              <span className="mt-1 inline-block text-xs text-neutral-400">
                {item.media_type === "video" ? "Video" : "Image"}
              </span>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => toggleFeatured(item.id, item.featured)}
                  className="text-sm text-neutral-600 hover:text-warning-600"
                >
                  {item.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => deleteItem(item.id, item.image_url)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-neutral-400 col-span-3">
            <ImageIcon size={32} />
            <p className="mt-2">No media uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
}