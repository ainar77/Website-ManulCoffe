import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";

import type { Database } from "@/lib/supabase-types";

type BusinessLocation =
  Database["public"]["Tables"]["business_locations"]["Row"];

type BusinessHour =
  Database["public"]["Tables"]["business_hours"]["Row"];

type LocationWithHours = BusinessLocation & {
  business_hours: BusinessHour[];
};

/**
 * Loads only public business data needed for SSR SEO / JSON-LD.
 *
 * This intentionally uses a separate stateless Supabase client instead of the
 * browser singleton because route loaders can execute during SSR. No service
 * role key or privileged credentials are used here.
 */
export const getPublicBusinessSeoData = createServerFn({ method: "GET" }).handler(
  async () => {
    const url = import.meta.env["VITE_SUPABASE_URL"];
    const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

    if (typeof url !== "string" || !url || typeof key !== "string" || !key) {
      console.error("Missing public Supabase environment variables for SEO data.");
      return null;
    }

    const supabase = createClient<Database>(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const [settingsResult, locationsResult] = await Promise.all([
      supabase
        .from("business_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle(),
      supabase
        .from("business_locations")
        .select(`
          *,
          business_hours (*)
        `)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (settingsResult.error) {
      console.error(
        "Could not load public business settings for SEO:",
        settingsResult.error,
      );
      return null;
    }

    if (locationsResult.error) {
      console.error(
        "Could not load public business locations for SEO:",
        locationsResult.error,
      );
      return null;
    }

    return {
      settings: settingsResult.data,
      locations: (locationsResult.data ?? []) as LocationWithHours[],
    };
  },
);
