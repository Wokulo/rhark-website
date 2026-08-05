import { createClient } from "@/lib/supabase/client";

const BUCKET = "featured-images";

export async function uploadFeaturedImage(file: File): Promise<string> {
  const supabase = createClient();

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteFeaturedImage(url: string): Promise<void> {
  const supabase = createClient();

  const filePath = url.split(`/storage/v1/object/public/${BUCKET}/`)[1];
  if (!filePath) return;

  const { error } = await supabase.storage.from(BUCKET).remove([filePath]);

  if (error) throw error;
}