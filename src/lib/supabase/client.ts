/**
 * Supabase Browser Client
 * Used in client components for real-time subscriptions and user-facing operations.
 *
 * Performance: a single client instance is cached and reused across the SPA.
 * Creating a new client on every render (as done previously) caused:
 *   - a new object identity on each render,
 *   - `useEffect` dependencies on the client to re-fire on every render,
 *   - duplicated session/profile fetches (and in the worst case a re-render loop).
 */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

let cachedClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!cachedClient) {
    cachedClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return cachedClient;
}