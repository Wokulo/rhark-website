import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type PublicationRow = Database["public"]["Tables"]["publications"]["Row"];

export interface Publication {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: "annual-report" | "research" | "policy-brief" | "factsheet" | "newsletter";
  fileUrl: string;
  fileSizeKb: number;
  fileType: string;
  coverImage: string | null;
  tags: string[];
  category: string;
  isArchived: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function mapPublicationRow(row: PublicationRow): Publication {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? null,
    type: row.type as Publication["type"],
    fileUrl: row.file_url,
    fileSizeKb: row.file_size_kb ?? 0,
    fileType: row.file_type ?? "pdf",
    coverImage: row.cover_image ?? null,
    tags: row.tags ?? [],
    category: row.category ?? "general",
    isArchived: row.is_archived ?? false,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublications(limit?: number): Promise<Publication[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("publications")
    .select("*")
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map(mapPublicationRow);
}

export async function getActivePublications(limit?: number): Promise<Publication[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("publications")
    .select("*")
    .eq("is_archived", false)
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map(mapPublicationRow);
}

export async function getPublicationsByType(type: string): Promise<Publication[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("type", type)
    .eq("is_archived", false)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapPublicationRow);
}

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapPublicationRow(data);
}

export async function getPublicationById(id: string): Promise<Publication | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapPublicationRow(data);
}

export async function createPublication(input: {
  title: string;
  slug: string;
  description?: string;
  type: Publication["type"];
  fileUrl: string;
  fileSizeKb?: number;
  fileType?: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
}): Promise<Publication> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("publications")
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description ?? null,
      type: input.type,
      file_url: input.fileUrl,
      file_size_kb: input.fileSizeKb ?? 0,
      file_type: input.fileType ?? "pdf",
      cover_image: input.coverImage ?? null,
      tags: input.tags ?? [],
      category: input.category ?? "general",
      is_archived: false,
      sort_order: 0,
    })
    .select()
    .single();

  if (error || !data) throw error;
  return mapPublicationRow(data);
}

export async function updatePublication(
  id: string,
  input: Partial<{
    title: string;
    slug: string;
    description: string;
    type: Publication["type"];
    fileUrl: string;
    fileSizeKb: number;
    fileType: string;
    coverImage: string;
    tags: string[];
    category: string;
    isArchived: boolean;
    sortOrder: number;
  }>
): Promise<Publication> {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.type !== undefined) updateData.type = input.type;
  if (input.fileUrl !== undefined) updateData.file_url = input.fileUrl;
  if (input.fileSizeKb !== undefined) updateData.file_size_kb = input.fileSizeKb;
  if (input.fileType !== undefined) updateData.file_type = input.fileType;
  if (input.coverImage !== undefined) updateData.cover_image = input.coverImage;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.isArchived !== undefined) updateData.is_archived = input.isArchived;
  if (input.sortOrder !== undefined) updateData.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from("publications")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw error;
  return mapPublicationRow(data);
}

export async function deletePublication(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("publications")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function archivePublication(id: string): Promise<Publication> {
  return updatePublication(id, { isArchived: true });
}

export async function restorePublication(id: string): Promise<Publication> {
  return updatePublication(id, { isArchived: false });
}

export async function togglePublicationArchive(id: string): Promise<Publication> {
  const publication = await getPublicationById(id);
  if (!publication) throw new Error("Publication not found");

  return updatePublication(id, { isArchived: !publication.isArchived });
}

export async function reorderPublications(items: { id: string; sortOrder: number }[]): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const updates = items.map((item) =>
    supabase.from("publications").update({ sort_order: item.sortOrder }).eq("id", item.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) throw errors[0].error;
}