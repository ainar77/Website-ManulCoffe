import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Loader2, LogOut } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import type { Database } from "@/lib/supabase-types";
import { BrandMark } from "@/components/manul/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const title = "Business Settings — ManulCoffee Admin";
type BusinessSettings = Database["public"]["Tables"]["business_settings"]["Row"];
type BusinessSettingsUpdate = Database["public"]["Tables"]["business_settings"]["Update"];

type SettingsForm = {
  business_name: string;
  tagline: string;
  description: string;
  contact_email: string;
  phone: string;
  website_url: string;
  instagram_url: string;
  currency: string;
  timezone: string;
};

const emptyForm: SettingsForm = {
  business_name: "",
  tagline: "",
  description: "",
  contact_email: "",
  phone: "",
  website_url: "",
  instagram_url: "",
  currency: "EUR",
  timezone: "Europe/Riga",
};

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Manage restaurant business settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSettingsPage,
});

function toForm(settings: BusinessSettings): SettingsForm {
  return {
    business_name: settings.business_name ?? "",
    tagline: settings.tagline ?? "",
    description: settings.description ?? "",
    contact_email: settings.contact_email ?? "",
    phone: settings.phone ?? "",
    website_url: settings.website_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    currency: settings.currency ?? "EUR",
    timezone: settings.timezone ?? "Europe/Riga",
  };
}

function optionalText(value: string): string | null {
  return value.trim() || null;
}

function validHttpUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function validate(form: SettingsForm): string | null {
  if (!form.business_name.trim()) return "Business name is required.";
  if (
    form.contact_email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email.trim())
  ) {
    return "Enter a valid contact email address.";
  }
  if (!validHttpUrl(form.website_url)) return "Website URL must start with https:// or http://.";
  if (!validHttpUrl(form.instagram_url)) return "Instagram URL must start with https:// or http://.";
  if (!/^[A-Z]{3}$/.test(form.currency.trim().toUpperCase())) {
    return "Currency must be a three-letter code, for example EUR.";
  }
  if (!form.timezone.trim()) return "Timezone is required.";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: form.timezone.trim() });
  } catch {
    return "Enter a valid timezone, for example Europe/Riga.";
  }
  return null;
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}{required ? " *" : ""}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={false}
        className="bg-background"
      />
    </div>
  );
}

function AdminSettingsPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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
        setLoadError(null);

        const { data, error: dbError } = await client
          .from("business_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (cancelled) return;
        if (dbError) {
          console.error("Failed to load business settings:", dbError);
          setLoadError("Couldn't load business settings. Check admin permissions and try again.");
        } else if (!data) {
          setLoadError("Business settings are unavailable. Check that the settings row exists and your account has admin access.");
        } else {
          setSettings(data);
          setForm(toForm(data));
        }
      } catch (unexpected) {
        if (cancelled) return;
        console.error("Unexpected settings error:", unexpected);
        setReady(true);
        setLoadError("Couldn't connect to the database. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSettings();
    return () => { cancelled = true; };
  }, [navigate]);

  const isDirty = useMemo(() =>
    settings !== null && JSON.stringify(form) !== JSON.stringify(toForm(settings)),
    [form, settings]
  );

  function update<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaveError(null);
    setSaved(false);
  }

  function handleCancel() {
    if (!settings || saving) return;
    setForm(toForm(settings));
    setSaveError(null);
    setSaved(false);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings || saving || !isDirty) return;

    setSaved(false);
    const validationError = validate(form);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    const payload: BusinessSettingsUpdate = {
      business_name: form.business_name.trim(),
      tagline: optionalText(form.tagline),
      description: optionalText(form.description),
      contact_email: optionalText(form.contact_email),
      phone: optionalText(form.phone),
      website_url: optionalText(form.website_url),
      instagram_url: optionalText(form.instagram_url),
      currency: form.currency.trim().toUpperCase(),
      timezone: form.timezone.trim(),
    };

    setSaving(true);
    setSaveError(null);
    try {
      const { data, error } = await getSupabaseClient()
        .from("business_settings")
        .update(payload)
        .eq("id", settings.id)
        .select("*")
        .single();

      if (error || !data) {
        console.error("Failed to save business settings:", error);
        setSaveError("Couldn't save changes. Check admin permissions and try again.");
        return;
      }
      setSettings(data);
      setForm(toForm(data));
      setSaved(true);
    } catch (unexpected) {
      console.error("Unexpected save error:", unexpected);
      setSaveError("Couldn't connect to the database. Please try again.");
    } finally {
      setSaving(false);
    }
  }

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
            Edit restaurant information and save it to Supabase.
          </p>
        </div>

        {!ready || loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-primary-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{!ready ? "Checking your session…" : "Loading business settings…"}</span>
          </div>
        ) : loadError ? (
          <Card>
            <CardContent className="space-y-4 py-8">
              <p role="alert" className="text-sm text-destructive">{loadError}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>Try again</Button>
            </CardContent>
          </Card>
        ) : settings ? (
          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant profile</CardTitle>
                <CardDescription>Main business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field id="business_name" label="Business name" value={form.business_name}
                  onChange={(value) => update("business_name", value)} required />
                <Field id="tagline" label="Tagline" value={form.tagline}
                  onChange={(value) => update("tagline", value)} placeholder="Coffee worth slowing down for" />
                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-sm font-medium text-foreground">Description</label>
                  <textarea id="description" name="description" rows={5} value={form.description}
                    onChange={(event) => update("description", event.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Contact & online presence</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field id="contact_email" label="Contact email" type="email" value={form.contact_email}
                  onChange={(value) => update("contact_email", value)} placeholder="hello@example.com" />
                <Field id="phone" label="Phone" type="tel" value={form.phone}
                  onChange={(value) => update("phone", value)} placeholder="+371 ..." />
                <Field id="website_url" label="Website URL" type="url" value={form.website_url}
                  onChange={(value) => update("website_url", value)} placeholder="https://example.com" />
                <Field id="instagram_url" label="Instagram URL" type="url" value={form.instagram_url}
                  onChange={(value) => update("instagram_url", value)} placeholder="https://instagram.com/..." />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional settings</CardTitle>
                <CardDescription>Use a three-letter currency code and an IANA timezone.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field id="currency" label="Currency" value={form.currency}
                  onChange={(value) => update("currency", value)} placeholder="EUR" required />
                <Field id="timezone" label="Timezone" value={form.timezone}
                  onChange={(value) => update("timezone", value)} placeholder="Europe/Riga" required />
              </CardContent>
            </Card>

            {saveError && <p role="alert" className="rounded-sm bg-destructive/10 p-3 text-sm text-destructive-foreground">{saveError}</p>}
            {saved && <p role="status" className="flex items-center gap-2 rounded-sm bg-primary-foreground/10 p-3 text-sm text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" /> Settings saved successfully.
            </p>}

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={!isDirty || saving}>
                Cancel changes
              </Button>
              <Button type="submit" disabled={!isDirty || saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        ) : null}
      </main>
    </div>
  );
}
