import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import type { Database } from "@/lib/supabase-types";
import { BrandMark } from "@/components/manul/BrandMark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const title = "Business Settings — ManulCoffee Admin";
type BusinessSettings = Database["public"]["Tables"]["business_settings"]["Row"];

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Restaurant business settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSettingsPage,
});

function DisplayField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  const hasValue = typeof value === "string" && value.trim().length > 0;

  return (
    <div className="min-w-0 border-b border-border/60 py-4 last:border-b-0">
      <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className={`break-words text-sm ${hasValue ? "text-foreground" : "italic text-muted-foreground"}`}>
        {hasValue ? value : "Not configured"}
      </dd>
    </div>
  );
}

function AdminSettingsPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const client = getSupabaseClient();
        const { data: userData, error: authError } = await client.auth.getUser();
        if (cancelled) return;

        if (authError || !userData.user) {
          navigate({ to: "/admin/login", replace: true });
          return;
        }

        setReady(true);
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await client
          .from("business_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (cancelled) return;

        if (dbError) {
          console.error("Failed to load business settings:", dbError);
          setError("Couldn't load business settings. Check admin permissions and try again.");
        } else if (!data) {
          setError("Business settings are unavailable. Check that the settings row exists and your account has admin access.");
        } else {
          setSettings(data);
        }
      } catch (unexpected) {
        if (cancelled) return;
        console.error("Unexpected settings error:", unexpected);
        setReady(true);
        setError("Couldn't connect to the database. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleSignOut() {
    await getSupabaseClient().auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-svh bg-coffee">
      <header className="border-b border-primary-foreground/10 bg-coffee/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandMark compact />
            <span className="font-display text-lg font-semibold text-primary-foreground">
              ManulCoffee Admin
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Admin navigation">
            <Button variant="dark" size="sm" onClick={() => navigate({ to: "/admin/" })}>
              Reservations
            </Button>
            <Button variant="dark" size="sm" onClick={() => navigate({ to: "/admin/menu" })}>
              Menu
            </Button>
            <Button variant="dark" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
            Business Settings
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/70">
            Restaurant information loaded from Supabase. Editing will be added in the next phase.
          </p>
        </div>

        {!ready || loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-primary-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{!ready ? "Checking your session…" : "Loading business settings…"}</span>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="space-y-4 py-8">
              <p role="alert" className="text-sm text-destructive">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : settings ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant profile</CardTitle>
                <CardDescription>Main business information</CardDescription>
              </CardHeader>
              <CardContent>
                <dl>
                  <DisplayField label="Business name" value={settings.business_name} />
                  <DisplayField label="Tagline" value={settings.tagline} />
                  <DisplayField label="Description" value={settings.description} />
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact & online presence</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <DisplayField label="Contact email" value={settings.contact_email} />
                  <DisplayField label="Phone" value={settings.phone} />
                  <DisplayField label="Website URL" value={settings.website_url} />
                  <DisplayField label="Instagram URL" value={settings.instagram_url} />
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional settings</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <DisplayField label="Currency" value={settings.currency} />
                  <DisplayField label="Timezone" value={settings.timezone} />
                </dl>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  );
}
