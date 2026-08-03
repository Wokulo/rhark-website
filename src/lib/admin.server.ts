/**
 * Admin server utility functions — server-only.
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
         .single() as unknown as {
         data: {
           id: string;
           email: string;
           name: string;
           avatar_url: string | null;
           role_id: string | null;
           roles: { name: string; slug: string } | null;
         } | null;
       };

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
     ip_address: null,
   } as any);
}
