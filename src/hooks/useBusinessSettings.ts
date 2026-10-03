import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import type { Database } from "@/lib/supabase-types";

export type PublicBusinessSettings =
  Database["public"]["Tables"]["business_settings"]["Row"];

/**
 * Loads the public restaurant profile from the singleton business_settings row.
 * The Supabase anon SELECT policy must allow this read.
 * No credentials or privileged operations are used here.
 */
export function useBusinessSettings() {
  const [settings, setSettings] = useState<PublicBusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data, error: queryError } = await getSupabaseClient()
          .from("business_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (!active) return;
        if (queryError) {
          console.error("Could not load public business settings:", queryError);
          setError("Business information is temporarily unavailable.");
          setSettings(null);
        } else if (!data) {
          setError("Business information has not been configured.");
          setSettings(null);
        } else {
          setSettings(data);
          setError(null);
        }
      } catch (unexpected) {
        if (!active) return;
        console.error("Unexpected business settings error:", unexpected);
        setError("Business information is temporarily unavailable.");
        setSettings(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => { active = false; };
  }, []);

  return { settings, loading, error };
}
