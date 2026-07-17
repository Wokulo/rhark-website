/**
 * Admin utility functions
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
/**
 * Get the current user's profile with role information
 */
export async function getCurrentUserProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*, roles(*)")
    .eq("id", user.id)
    .single();

  return profile;
}

/**
 * Get user's role slug from the server session
 */
export async function getUserRole() {
  const profile = await getCurrentUserProfile();
  return profile?.roles?.slug ?? null;
}

/**
 * Log an activity to the audit trail
 */
export async function logActivity(
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action,
    resource,
    resource_id: resourceId,
    details,
    ip_address: null, // Available in API routes via headers
  });
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Format currency in KES
 */
export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

/**
 * Get file type icon name from extension
 */
export function getFileTypeIcon(fileType: string): string {
  const typeMap: Record<string, string> = {
    "application/pdf": "file-text",
    "application/msword": "file-text",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "file-text",
    "application/vnd.ms-excel": "file-spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "file-spreadsheet",
    "application/vnd.ms-powerpoint": "file-presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "file-presentation",
    "application/zip": "archive",
    "image/jpeg": "image",
    "image/png": "image",
    "image/webp": "image",
    "image/gif": "image",
  };
  return typeMap[fileType] || "file";
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}