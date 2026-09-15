import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let client: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Returns a singleton Supabase browser client configured for this Vite app.
 *
 * Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the
 * environment. These must be provided by your project settings; they are not
 * hardcoded here.
 */
export function getSupabaseClient() {
  if (client) {
    return client;
  }

  const url = import.meta.env["VITE_SUPABASE_URL"];
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (typeof url !== "string" || !url) {
    throw new Error(
      "Missing VITE_SUPABASE_URL. Add it to your environment variables before using the Supabase client."
    );
  }

  if (typeof key !== "string" || !key) {
    throw new Error(
      "Missing VITE_SUPABASE_PUBLISHABLE_KEY. Add it to your environment variables before using the Supabase client."
    );
  }

  client = createClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}
