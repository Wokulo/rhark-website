import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type GalleryRow = Database["public"]["Tables"]["gallery"]["Row"];

export interface GalleryItem {
  id: string;
  albumId: string | null;
  albumTitle: string | null;
  imageUrl: string;
  caption: string | null;
  altText: string | null;
  sortOrder: number;
  featured: boolean;
  mediaType: "image" | "video";
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapGalleryRow(row: GalleryRow, albumTitle?: string | null): GalleryItem {
  return {
    id: row.id,
    albumId: row.album_id ?? null,
    albumTitle: albumTitle ?? null,
    imageUrl: row.image_url,
    caption: row.caption ?? null,
    altText: row.alt_text ?? null,
    sortOrder: row.sort_order,
    featured: row.featured ?? false,
    mediaType: (row.media_type as GalleryItem["mediaType"]) || "image",
    videoUrl: row.video_url ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getGalleryItems(limit?: number): Promise<GalleryItem[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("gallery")
    .select("*, album:albums(title)")
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map((row) =>
    mapGalleryRow(row, (row as unknown as { album: { title: string | null } | null }).album?.title ?? null)
  );
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("gallery")
    .select("*, album:albums(title)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapGalleryRow(data, (data as unknown as { album: { title: string | null } | null }).album?.title ?? null);
}

export async function getFeaturedGalleryItems(limit?: number): Promise<GalleryItem[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("gallery")
    .select("*, album:albums(title)")
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map((row) =>
    mapGalleryRow(row, (row as unknown as { album: { title: string | null } | null }).album?.title ?? null)
  );
}

export async function getGalleryItemsByAlbum(albumId: string): Promise<GalleryItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("gallery")
    .select("*, album:albums(title)")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) =>
    mapGalleryRow(row, (row as unknown as { album: { title: string | null } | null }).album?.title ?? null)
  );
}

export async function createGalleryItem(input: {
  albumId?: string;
  imageUrl: string;
  caption?: string;
  altText?: string;
  sortOrder?: number;
  featured?: boolean;
  mediaType?: "image" | "video";
  videoUrl?: string;
}): Promise<GalleryItem> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("gallery")
    .insert({
      album_id: input.albumId ?? null,
      image_url: input.imageUrl,
      caption: input.caption ?? null,
      alt_text: input.altText ?? null,
      sort_order: input.sortOrder ?? 0,
      featured: input.featured ?? false,
      media_type: input.mediaType ?? "image",
      video_url: input.videoUrl ?? null,
    })
    .select()
    .single();

  if (error || !data) throw error;
  return mapGalleryRow(data);
}

export async function updateGalleryItem(
  id: string,
  input: Partial<{
    albumId: string;
    imageUrl: string;
    caption: string;
    altText: string;
    sortOrder: number;
    featured: boolean;
    mediaType: "image" | "video";
    videoUrl: string;
  }>
): Promise<GalleryItem> {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {};
  if (input.albumId !== undefined) updateData.album_id = input.albumId;
  if (input.imageUrl !== undefined) updateData.image_url = input.imageUrl;
  if (input.caption !== undefined) updateData.caption = input.caption;
  if (input.altText !== undefined) updateData.alt_text = input.altText;
  if (input.sortOrder !== undefined) updateData.sort_order = input.sortOrder;
  if (input.featured !== undefined) updateData.featured = input.featured;
  if (input.mediaType !== undefined) updateData.media_type = input.mediaType;
  if (input.videoUrl !== undefined) updateData.video_url = input.videoUrl;

  const { data, error } = await supabase
    .from("gallery")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw error;
  return mapGalleryRow(data);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleGalleryFeatured(id: string): Promise<GalleryItem> {
  const item = await getGalleryItemById(id);
  if (!item) throw new Error("Gallery item not found");

  return updateGalleryItem(id, { featured: !item.featured });
}

export async function reorderGalleryItems(items: { id: string; sortOrder: number }[]): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const updates = items.map((item) =>
    supabase.from("gallery").update({ sort_order: item.sortOrder }).eq("id", item.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) throw errors[0].error;
}