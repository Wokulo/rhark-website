import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type NewsRow = Database["public"]["Tables"]["news"]["Row"];

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  galleryImages: string[];
  tags: string[];
  authorId: string | null;
  authorName: string | null;
  status: "draft" | "published" | "archived";
  publishDate: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapNewsRow(row: NewsRow, authorName?: string | null): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    content: row.content,
    excerpt: row.excerpt ?? "",
    featuredImage: row.featured_image ?? null,
    galleryImages: row.gallery_images ?? [],
    tags: row.tags ?? [],
    authorId: row.author_id ?? null,
    authorName: authorName ?? null,
    status: row.status as NewsArticle["status"],
    publishDate: row.publish_date ?? null,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("news")
    .select("*, author:users(name)")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map((row) =>
    mapNewsRow(row, (row as unknown as { author: { name: string | null } | null }).author?.name ?? null)
  );
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("news")
    .select("*, author:users(name)")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapNewsRow(data, (data as unknown as { author: { name: string | null } | null }).author?.name ?? null);
}

export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("news")
    .select("*, author:users(name)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapNewsRow(data, (data as unknown as { author: { name: string | null } | null }).author?.name ?? null);
}

export async function createNewsArticle(input: {
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: "draft" | "published";
  publishDate?: string;
  seoTitle?: string;
  seoDescription?: string;
}): Promise<NewsArticle> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("news")
    .insert({
      title: input.title,
      slug: input.slug,
      category: input.category,
      content: input.content,
      excerpt: input.excerpt ?? null,
      featured_image: input.featuredImage ?? null,
      tags: input.tags ?? [],
      status: input.status ?? "draft",
      publish_date: input.publishDate ?? null,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
    })
    .select()
    .single();

  if (error || !data) throw error;
  return mapNewsRow(data);
}

export async function updateNewsArticle(
  id: string,
  input: Partial<{
    title: string;
    slug: string;
    category: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    galleryImages: string[];
    tags: string[];
    status: "draft" | "published" | "archived";
    publishDate: string;
    seoTitle: string;
    seoDescription: string;
  }>
): Promise<NewsArticle> {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
  if (input.featuredImage !== undefined) updateData.featured_image = input.featuredImage;
  if (input.galleryImages !== undefined) updateData.gallery_images = input.galleryImages;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.publishDate !== undefined) updateData.publish_date = input.publishDate;
  if (input.seoTitle !== undefined) updateData.seo_title = input.seoTitle;
  if (input.seoDescription !== undefined) updateData.seo_description = input.seoDescription;

  const { data, error } = await supabase
    .from("news")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw error;
  return mapNewsRow(data);
}

export async function deleteNewsArticle(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleNewsStatus(id: string): Promise<NewsArticle> {
  const article = await getNewsArticleById(id);
  if (!article) throw new Error("Article not found");

  const newStatus =
    article.status === "published" ? "draft" : article.status === "draft" ? "published" : "draft";

  return updateNewsArticle(id, { status: newStatus });
}