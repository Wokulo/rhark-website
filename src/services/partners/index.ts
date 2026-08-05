import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type PartnerRow = Database["public"]["Tables"]["partners"]["Row"];

export interface Partner {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  website: string | null;
  type: "funder" | "implementing" | "government" | "media" | "academic";
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function mapPartnerRow(row: PartnerRow): Partner {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
    website: row.website ?? null,
    type: row.type as Partner["type"],
    description: row.description ?? null,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPartners(limit?: number): Promise<Partner[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map(mapPartnerRow);
}

export async function getActivePartners(limit?: number): Promise<Partner[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("partners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map(mapPartnerRow);
}

export async function getFeaturedPartners(limit?: number): Promise<Partner[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("partners")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map(mapPartnerRow);
}

export async function getPartnerBySlug(slug: string): Promise<Partner | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapPartnerRow(data);
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapPartnerRow(data);
}

export async function createPartner(input: {
  name: string;
  slug: string;
  logoUrl: string;
  website?: string;
  type?: Partner["type"];
  description?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}): Promise<Partner> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("partners")
    .insert({
      name: input.name,
      slug: input.slug,
      logo_url: input.logoUrl,
      website: input.website ?? null,
      type: input.type ?? "government",
      description: input.description ?? null,
      is_featured: input.isFeatured ?? false,
      sort_order: input.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error || !data) throw error;
  return mapPartnerRow(data);
}

export async function updatePartner(
  id: string,
  input: Partial<{
    name: string;
    slug: string;
    logoUrl: string;
    website: string;
    type: Partner["type"];
    description: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
  }>
): Promise<Partner> {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.logoUrl !== undefined) updateData.logo_url = input.logoUrl;
  if (input.website !== undefined) updateData.website = input.website;
  if (input.type !== undefined) updateData.type = input.type;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.isActive !== undefined) updateData.is_active = input.isActive;
  if (input.isFeatured !== undefined) updateData.is_featured = input.isFeatured;
  if (input.sortOrder !== undefined) updateData.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from("partners")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw error;
  return mapPartnerRow(data);
}

export async function deletePartner(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("partners")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function togglePartnerActive(id: string): Promise<Partner> {
  const partner = await getPartnerById(id);
  if (!partner) throw new Error("Partner not found");

  return updatePartner(id, { isActive: !partner.isActive });
}

export async function togglePartnerFeatured(id: string): Promise<Partner> {
  const partner = await getPartnerById(id);
  if (!partner) throw new Error("Partner not found");

  return updatePartner(id, { isFeatured: !partner.isFeatured });
}

export async function reorderPartners(items: { id: string; sortOrder: number }[]): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const updates = items.map((item) =>
    supabase.from("partners").update({ sort_order: item.sortOrder }).eq("id", item.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) throw errors[0].error;
}