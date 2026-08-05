import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type ProgrammeRow = Database["public"]["Tables"]["programmes"]["Row"];

export interface Programme {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  imageUrl?: string;
  objectives: string[];
  targetBeneficiaries: string[];
  sortOrder: number;
  isVisible: boolean;
}

function mapRow(row: ProgrammeRow): Programme {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title,
    description: row.description,
    icon: row.icon,
    color: row.color,
    imageUrl: row.image_url ?? undefined,
    objectives: row.objectives ?? [],
    targetBeneficiaries: row.target_beneficiaries ?? [],
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
  };
}

export async function getProgrammes(): Promise<Programme[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getAllProgrammes(): Promise<Programme[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapRow(data);
}

export async function createProgramme(input: {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  objectives?: string[];
  targetBeneficiaries?: string[];
  sortOrder?: number;
}): Promise<Programme> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("programmes")
    .insert({
      slug: input.slug,
      title: input.title,
      short_title: input.shortTitle,
      description: input.description,
      icon: input.icon ?? "Heart",
      color: input.color ?? "primary",
      image_url: input.imageUrl ?? null,
      objectives: input.objectives ?? [],
      target_beneficiaries: input.targetBeneficiaries ?? [],
      sort_order: input.sortOrder ?? 0,
      is_visible: true,
    })
    .select()
    .single();

  if (error || !data) throw error;
  return mapRow(data);
}

export async function updateProgramme(
  slug: string,
  input: Partial<{
    title: string;
    shortTitle: string;
    description: string;
    icon: string;
    color: string;
    imageUrl: string;
    objectives: string[];
    targetBeneficiaries: string[];
    sortOrder: number;
    isVisible: boolean;
  }>
): Promise<Programme> {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.shortTitle !== undefined) updateData.short_title = input.shortTitle;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.icon !== undefined) updateData.icon = input.icon;
  if (input.color !== undefined) updateData.color = input.color;
  if (input.imageUrl !== undefined) updateData.image_url = input.imageUrl;
  if (input.objectives !== undefined) updateData.objectives = input.objectives;
  if (input.targetBeneficiaries !== undefined) updateData.target_beneficiaries = input.targetBeneficiaries;
  if (input.sortOrder !== undefined) updateData.sort_order = input.sortOrder;
  if (input.isVisible !== undefined) updateData.is_visible = input.isVisible;

  const { data, error } = await supabase
    .from("programmes")
    .update(updateData)
    .eq("slug", slug)
    .select()
    .single();

  if (error || !data) throw error;
  return mapRow(data);
}

export async function deleteProgramme(slug: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("programmes")
    .delete()
    .eq("slug", slug);

  if (error) throw error;
}

export async function reorderProgrammes(
  slugs: string[]
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const updates = slugs.map((slug, index) => ({
    slug,
    sort_order: index,
  }));

  const { error } = await supabase.rpc("reorder_programmes", {
    programme_updates: updates,
  });

  if (error) {
    // Fallback: update each programme individually
    for (const { slug, sort_order } of updates) {
      await supabase
        .from("programmes")
        .update({ sort_order })
        .eq("slug", slug);
    }
  }
}