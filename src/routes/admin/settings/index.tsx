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
  tagline_lv: string;
  description: string;
  description_lv: string;
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
  tagline_lv: "",
  description: "",
  description_lv: "",
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
    tagline_lv: settings.tagline_lv ?? "",
    description: settings.description ?? "",
    description_lv: settings.description_lv ?? "",
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
      tagline_lv: optionalText(form.tagline_lv),
      description: optionalText(form.description),
      description_lv: optionalText(form.description_lv),
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
          <>
          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant profile</CardTitle>
                <CardDescription>Main business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field id="business_name" label="Business name" value={form.business_name}
                  onChange={(value) => update("business_name", value)} required />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="tagline" label="Tagline — English" value={form.tagline}
                    onChange={(value) => update("tagline", value)} placeholder="Coffee worth slowing down for" />
                  <Field id="tagline_lv" label="Tagline — Latviešu" value={form.tagline_lv}
                    onChange={(value) => update("tagline_lv", value)} placeholder="Kafija, kuras dēļ ir vērts apstāties" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="description" className="block text-sm font-medium text-foreground">
                      Description — English
                    </label>
                    <textarea id="description" name="description" rows={6} value={form.description}
                      onChange={(event) => update("description", event.target.value)}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="description_lv" className="block text-sm font-medium text-foreground">
                      Description — Latviešu
                    </label>
                    <textarea id="description_lv" name="description_lv" rows={6} value={form.description_lv}
                      onChange={(event) => update("description_lv", event.target.value)}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
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
          <LocationsManager />
          </>
        ) : null}
      </main>
    </div>
  );
}


type BusinessLocation = Database["public"]["Tables"]["business_locations"]["Row"];
type BusinessLocationInsert = Database["public"]["Tables"]["business_locations"]["Insert"];
type BusinessLocationUpdate = Database["public"]["Tables"]["business_locations"]["Update"];

type LocationForm = {
  name: string;
  name_lv: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  description: string;
  description_lv: string;
  maps_url: string;
  map_embed_url: string;
  sort_order: string;
  is_active: boolean;
};

const emptyLocationForm: LocationForm = {
  name: "",
  name_lv: "",
  address: "",
  city: "Riga",
  postal_code: "",
  phone: "",
  description: "",
  description_lv: "",
  maps_url: "",
  map_embed_url: "",
  sort_order: "0",
  is_active: true,
};

function locationToForm(location: BusinessLocation): LocationForm {
  return {
    name: location.name ?? "",
    name_lv: location.name_lv ?? "",
    address: location.address ?? "",
    city: location.city ?? "",
    postal_code: location.postal_code ?? "",
    phone: location.phone ?? "",
    description: location.description ?? "",
    description_lv: location.description_lv ?? "",
    maps_url: location.maps_url ?? "",
    map_embed_url: location.map_embed_url ?? "",
    sort_order: String(location.sort_order ?? 0),
    is_active: location.is_active,
  };
}

function sortLocations(rows: BusinessLocation[]): BusinessLocation[] {
  return [...rows].sort((a, b) =>
    a.sort_order - b.sort_order || a.name.localeCompare(b.name)
  );
}

function LocationsManager() {
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<BusinessLocation["id"] | null>(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [locationForm, setLocationForm] = useState<LocationForm>(emptyLocationForm);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<BusinessLocation["id"] | null>(null);
  const [hoursLocationId, setHoursLocationId] = useState<BusinessLocation["id"] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadLocations() {
      try {
        const { data, error } = await getSupabaseClient()
          .from("business_locations")
          .select("*")
          .order("sort_order", { ascending: true });
        if (cancelled) return;
        if (error) {
          console.error("Failed to load locations:", error);
          setLocationsError("Couldn't load locations. Check admin access and try again.");
        } else {
          setLocations(sortLocations(data ?? []));
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Unexpected locations load error:", error);
        setLocationsError("Couldn't connect to the database. Please try again.");
      } finally {
        if (!cancelled) setLoadingLocations(false);
      }
    }
    void loadLocations();
    return () => { cancelled = true; };
  }, []);

  function startAdding() {
    if (busy) return;
    setEditingId(null);
    setLocationForm({ ...emptyLocationForm, sort_order: String(locations.length) });
    setLocationsError(null);
    setLocationMessage(null);
    setShowLocationForm(true);
  }

  function startEditing(location: BusinessLocation) {
    if (busy) return;
    setHoursLocationId(null);
    setEditingId(location.id);
    setLocationForm(locationToForm(location));
    setLocationsError(null);
    setLocationMessage(null);
    setShowLocationForm(true);
  }

  function cancelLocationEdit() {
    if (busy) return;
    setEditingId(null);
    setShowLocationForm(false);
    setLocationsError(null);
  }

  function changeLocation<K extends keyof LocationForm>(key: K, value: LocationForm[K]) {
    setLocationForm((current) => ({ ...current, [key]: value }));
    setLocationsError(null);
    setLocationMessage(null);
  }

  async function saveLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const name = locationForm.name.trim();
    const address = locationForm.address.trim();
    const city = locationForm.city.trim();
    const sortOrder = Number(locationForm.sort_order);
    if (!name || !address || !city) {
      setLocationsError("Location name, address and city are required.");
      return;
    }
    if (!/^\d+$/.test(locationForm.sort_order.trim()) || !Number.isSafeInteger(sortOrder)) {
      setLocationsError("Display order must be a non-negative whole number.");
      return;
    }
    if (!validHttpUrl(locationForm.maps_url) || !validHttpUrl(locationForm.map_embed_url)) {
      setLocationsError("Map URLs must begin with https:// or http://.");
      return;
    }
    if (!locationForm.is_active && editingId !== null &&
        locations.filter((location) => location.is_active && location.id !== editingId).length === 0) {
      setLocationsError("Keep at least one active location available for reservations.");
      return;
    }

    // Reuse the parent business ID if this database schema links locations
    // to the singleton business_settings row. Schemas without this column
    // receive no extra property.
    const existingBusiness = locations[0];
    const parentBusinessId = existingBusiness && "business_id" in existingBusiness
      ? existingBusiness.business_id
      : undefined;

    const payload = {
      name,
      name_lv: optionalText(locationForm.name_lv),
      address,
      city,
      postal_code: optionalText(locationForm.postal_code),
      phone: optionalText(locationForm.phone),
      description: optionalText(locationForm.description),
      description_lv: optionalText(locationForm.description_lv),
      maps_url: optionalText(locationForm.maps_url),
      map_embed_url: optionalText(locationForm.map_embed_url),
      sort_order: sortOrder,
      is_active: locationForm.is_active,
      ...(parentBusinessId !== undefined ? { business_id: parentBusinessId } : {}),
    } as BusinessLocationInsert;

    setBusy(true);
    setLocationsError(null);
    setLocationMessage(null);
    try {
      if (editingId === null) {
        const { data, error } = await getSupabaseClient()
          .from("business_locations")
          .insert(payload)
          .select("*")
          .single();
        if (error || !data) throw error ?? new Error("No inserted location returned");
        setLocations((current) => sortLocations([...current, data]));
        setLocationMessage("Location added successfully.");
      } else {
        const changes: BusinessLocationUpdate = payload;
        const { data, error } = await getSupabaseClient()
          .from("business_locations")
          .update(changes)
          .eq("id", editingId)
          .select("*")
          .single();
        if (error || !data) throw error ?? new Error("No updated location returned");
        setLocations((current) => sortLocations(current.map((item) =>
          item.id === editingId ? data : item
        )));
        setLocationMessage("Location updated successfully.");
      }
      setEditingId(null);
      setShowLocationForm(false);
    } catch (error) {
      console.error("Failed to save location:", error);
      setLocationsError("Couldn't save this location. Check the fields and your admin permissions.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleLocation(location: BusinessLocation) {
    if (busy) return;
    if (location.is_active && locations.filter((item) => item.is_active).length <= 1) {
      setLocationsError("You cannot hide the last active location.");
      return;
    }
    setBusy(true);
    setBusyId(location.id);
    setLocationsError(null);
    setLocationMessage(null);
    try {
      const { data, error } = await getSupabaseClient()
        .from("business_locations")
        .update({ is_active: !location.is_active })
        .eq("id", location.id)
        .select("*")
        .single();
      if (error || !data) throw error ?? new Error("No updated location returned");
      setLocations((current) => sortLocations(current.map((item) =>
        item.id === location.id ? data : item
      )));
      setLocationMessage(data.is_active ? "Location is now visible." : "Location hidden from the public site and booking form.");
    } catch (error) {
      console.error("Failed to change location visibility:", error);
      setLocationsError("Couldn't change visibility. Please try again.");
    } finally {
      setBusy(false);
      setBusyId(null);
    }
  }

  async function deleteLocation(location: BusinessLocation) {
    if (busy) return;
    if (location.is_active && locations.filter((item) => item.is_active).length <= 1) {
      setLocationsError("You cannot delete the last active location.");
      return;
    }
    if (!window.confirm(
      `Permanently delete "${location.name}"? This cannot be undone. ` +
      "If it has linked opening hours, the database may reject deletion. " +
      "Hiding a location is safer when you want to preserve its data."
    )) return;
    setBusy(true);
    setBusyId(location.id);
    setLocationsError(null);
    setLocationMessage(null);
    try {
      const { data, error } = await getSupabaseClient()
        .from("business_locations")
        .delete()
        .eq("id", location.id)
        .select("id");
      if (error) {
        if (error.code === "23503") {
          setLocationsError("This location has linked records (such as opening hours). Hide it instead; don't delete linked data.");
          return;
        }
        throw error;
      }
      if (!data || data.length !== 1) {
        setLocationsError("Deletion was not confirmed. Check admin permissions and refresh.");
        return;
      }
      setLocations((current) => current.filter((item) => item.id !== location.id));
      if (hoursLocationId === location.id) setHoursLocationId(null);
      if (editingId === location.id) {
        setShowLocationForm(false);
        setEditingId(null);
      }
      setLocationMessage("Location deleted.");
    } catch (error) {
      console.error("Failed to delete location:", error);
      setLocationsError("Couldn't delete this location. Try hiding it instead.");
    } finally {
      setBusy(false);
      setBusyId(null);
    }
  }

  return (
    <section className="mt-10 space-y-5" aria-labelledby="locations-manager-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="locations-manager-title" className="font-display text-2xl font-semibold text-primary-foreground">
            Locations
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/70">
            Add, edit and hide branches, or configure weekly opening hours for each location.
          </p>
        </div>
        <Button type="button" onClick={startAdding} disabled={loadingLocations || busy}>
          Add location
        </Button>
      </div>

      {locationsError && <p role="alert" className="rounded-sm bg-destructive/10 p-3 text-sm text-primary-foreground">{locationsError}</p>}
      {locationMessage && <p role="status" className="flex items-center gap-2 rounded-sm bg-primary-foreground/10 p-3 text-sm text-primary-foreground"><CheckCircle2 className="h-4 w-4" />{locationMessage}</p>}

      {showLocationForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId === null ? "Add location" : "Edit location"}</CardTitle>
            <CardDescription>Changes are saved to Supabase. Fields marked * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveLocation} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="location-name" label="Location name — English" value={locationForm.name} onChange={(value) => changeLocation("name", value)} required />
                <Field id="location-name-lv" label="Location name — Latviešu" value={locationForm.name_lv} onChange={(value) => changeLocation("name_lv", value)} />
                <Field id="location-address" label="Street address" value={locationForm.address} onChange={(value) => changeLocation("address", value)} required />
                <Field id="location-city" label="City" value={locationForm.city} onChange={(value) => changeLocation("city", value)} required />
                <Field id="location-postal-code" label="Postal code" value={locationForm.postal_code} onChange={(value) => changeLocation("postal_code", value)} />
                <Field id="location-phone" label="Phone" value={locationForm.phone} onChange={(value) => changeLocation("phone", value)} type="tel" />
                <Field id="location-sort-order" label="Display order (0, 1, 2...)" value={locationForm.sort_order} onChange={(value) => changeLocation("sort_order", value)} required />
                <Field id="location-maps-url" label="Google Maps directions URL" value={locationForm.maps_url} onChange={(value) => changeLocation("maps_url", value)} type="url" placeholder="https://maps.google.com/..." />
                <Field id="location-map-embed-url" label="Map embed URL" value={locationForm.map_embed_url} onChange={(value) => changeLocation("map_embed_url", value)} type="url" placeholder="https://www.google.com/maps/embed?..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="location-description" className="block text-sm font-medium text-foreground">Description — English</label>
                  <textarea id="location-description" rows={3} value={locationForm.description}
                    onChange={(event) => changeLocation("description", event.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="location-description-lv" className="block text-sm font-medium text-foreground">Description — Latviešu</label>
                  <textarea id="location-description-lv" rows={3} value={locationForm.description_lv}
                    onChange={(event) => changeLocation("description_lv", event.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={locationForm.is_active} onChange={(event) => changeLocation("is_active", event.target.checked)} />
                Visible on the website and in the booking form
              </label>
              <div className="flex flex-wrap justify-end gap-3">
                <Button type="button" variant="outline" disabled={busy} onClick={cancelLocationEdit}>Cancel</Button>
                <Button type="submit" disabled={busy}>{busy ? "Saving…" : editingId === null ? "Add location" : "Save location"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loadingLocations ? (
        <div className="flex items-center gap-2 text-primary-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading locations…</div>
      ) : (
        <div className="grid gap-4">
          {locations.length === 0 && <Card><CardContent className="py-6 text-sm">No locations yet.</CardContent></Card>}
          {locations.map((location) => (
            <Card key={String(location.id)}>
              <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{location.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${location.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                      {location.is_active ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{[location.address, location.city, location.postal_code].filter(Boolean).join(", ")}</p>
                  {location.phone && <p className="text-sm text-muted-foreground">{location.phone}</p>}
                  <p className="text-xs text-muted-foreground">Display order: {location.sort_order}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => startEditing(location)}>Edit</Button>
                  <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => { setShowLocationForm(false); setHoursLocationId((current) => current === location.id ? null : location.id); }}>
                    {hoursLocationId === location.id ? "Close hours" : "Opening hours"}
                  </Button>
                  <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => toggleLocation(location)}>
                    {busyId === location.id ? "Working…" : location.is_active ? "Hide" : "Show"}
                  </Button>
                  <Button type="button" size="sm" variant="destructive" disabled={busy} onClick={() => deleteLocation(location)}>Delete</Button>
                </div>
              </CardContent>
              {hoursLocationId === location.id && <CardContent className="border-t border-border/60 pt-0"><HoursManager key={String(location.id)} location={location} /></CardContent>}
            </Card>
          ))}
        </div>
      )}
      <p className="text-xs text-primary-foreground/60">
        Hiding a branch removes it from public location and reservation choices, but keeps its data and historical reservations. Configure hours for new branches before making them visible to customers.
      </p>
    </section>
  );
}

// Phase 9H: weekly opening hours for one location at a time.
type BusinessHour = Database["public"]["Tables"]["business_hours"]["Row"];
type BusinessHourInsert = Database["public"]["Tables"]["business_hours"]["Insert"];
type BusinessHourUpdate = Database["public"]["Tables"]["business_hours"]["Update"];

type DayHours = {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
};

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function normalizeTime(time: string | null | undefined, fallback: string): string {
  return time ? time.slice(0, 5) : fallback;
}

function defaultHours(day: number): DayHours {
  return { day_of_week: day, open_time: "09:00", close_time: "18:00", is_closed: true };
}

function toDayHours(day: number, rows: BusinessHour[]): DayHours {
  const row = rows.find((item) => item.day_of_week === day);
  return row ? {
    day_of_week: day,
    open_time: normalizeTime(row.open_time, "09:00"),
    close_time: normalizeTime(row.close_time, "18:00"),
    is_closed: row.is_closed,
  } : defaultHours(day);
}

function HoursManager({ location }: { location: BusinessLocation }) {
  const [originalRows, setOriginalRows] = useState<BusinessHour[]>([]);
  const [days, setDays] = useState<DayHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHours, setSavingHours] = useState(false);
  const [hoursError, setHoursError] = useState<string | null>(null);
  const [hoursMessage, setHoursMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [needsReload, setNeedsReload] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadHours() {
      setLoading(true);
      setHoursError(null);
      setHoursMessage(null);
      try {
        const { data, error } = await getSupabaseClient()
          .from("business_hours")
          .select("*")
          .eq("location_id", location.id)
          .order("day_of_week", { ascending: true });
        if (cancelled) return;
        if (error) throw error;
        const rows = data ?? [];
        const uniqueDays = new Set(rows.map((row) => row.day_of_week));
        if (uniqueDays.size !== rows.length || rows.some((row) => row.day_of_week < 0 || row.day_of_week > 6)) {
          throw new Error("Duplicate or invalid day records in business_hours");
        }
        setOriginalRows(rows);
        setDays(WEEKDAYS.map((_, index) => toDayHours(index, rows)));
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load business hours:", error);
        setHoursError("Couldn't load opening hours. Check database permissions and try again.");
        setDays([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadHours();
    return () => { cancelled = true; };
  }, [location.id, reloadKey]);

  const dirtyDays = useMemo(() => days.filter((day) => {
    const initial = toDayHours(day.day_of_week, originalRows);
    return !originalRows.some((row) => row.day_of_week === day.day_of_week) ||
      day.is_closed !== initial.is_closed ||
      (!day.is_closed && (day.open_time !== initial.open_time || day.close_time !== initial.close_time));
  }), [days, originalRows]);

  function changeDay(dayNumber: number, changes: Partial<DayHours>) {
    if (savingHours || needsReload) return;
    setDays((current) => current.map((day) => day.day_of_week === dayNumber ? { ...day, ...changes } : day));
    setHoursError(null);
    setHoursMessage(null);
  }

  function cancelChanges() {
    if (savingHours) return;
    setDays(WEEKDAYS.map((_, index) => toDayHours(index, originalRows)));
    setHoursError(null);
    setHoursMessage(null);
  }

  async function saveHours(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingHours || needsReload || dirtyDays.length === 0) return;
    for (const day of days) {
      if (!day.is_closed && (!/^\d{2}:\d{2}$/.test(day.open_time) ||
        !/^\d{2}:\d{2}$/.test(day.close_time) || day.open_time >= day.close_time)) {
        setHoursError(`${WEEKDAYS[day.day_of_week]}: closing time must be later than opening time.`);
        return;
      }
    }

    setSavingHours(true);
    setHoursError(null);
    setHoursMessage(null);
    let completed = 0;
    try {
      // Update/insert only changed weekdays. Never delete existing hours.
      for (const day of dirtyDays) {
        const existing = originalRows.find((row) => row.day_of_week === day.day_of_week);
        const fields = {
          open_time: day.open_time,
          close_time: day.close_time,
          is_closed: day.is_closed,
        };
        if (existing) {
          const payload: BusinessHourUpdate = fields;
          const { data, error } = await getSupabaseClient()
            .from("business_hours")
            .update(payload)
            .eq("location_id", location.id)
            .eq("day_of_week", day.day_of_week)
            .select("day_of_week");
          if (error || !data || data.length !== 1) {
            throw error ?? new Error(`Update of ${WEEKDAYS[day.day_of_week]} was not confirmed`);
          }
        } else {
          const payload: BusinessHourInsert = {
            location_id: location.id,
            day_of_week: day.day_of_week,
            ...fields,
          };
          const { data, error } = await getSupabaseClient()
            .from("business_hours")
            .insert(payload)
            .select("day_of_week");
          if (error || !data || data.length !== 1) {
            throw error ?? new Error(`Insert of ${WEEKDAYS[day.day_of_week]} was not confirmed`);
          }
        }
        completed += 1;
      }
      // Re-read from Supabase so the UI reflects exactly what was stored.
      const { data, error } = await getSupabaseClient()
        .from("business_hours")
        .select("*")
        .eq("location_id", location.id)
        .order("day_of_week", { ascending: true });
      if (error) throw error;
      const savedRows = data ?? [];
      setOriginalRows(savedRows);
      setDays(WEEKDAYS.map((_, index) => toDayHours(index, savedRows)));
      setNeedsReload(false);
      setHoursMessage("Opening hours saved successfully.");
    } catch (error) {
      console.error("Failed to save opening hours:", error);
      setHoursError(completed > 0
        ? `Only ${completed} of ${dirtyDays.length} changed days were saved. Reload hours before editing again.`
        : "Couldn't save opening hours. Check admin permissions and try again.");
      // A partial write can occur because this is not a database transaction.
      // Lock edits until the user explicitly reloads current database state.
      setNeedsReload(true);
    } finally {
      setSavingHours(false);
    }
  }

  return (
    <div className="mt-4 rounded-md border border-border bg-background/80 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold">Weekly opening hours</h4>
          <p className="text-xs text-muted-foreground">{location.name} · Times are local to the restaurant.</p>
        </div>
        <Button type="button" size="sm" variant="outline" disabled={loading || savingHours} onClick={() => { setNeedsReload(false); setReloadKey((key) => key + 1); }}>
          Reload hours
        </Button>
      </div>
      {loading ? <p className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />Loading hours…</p> : (
        <form onSubmit={saveHours} className="space-y-4">
          <div className="space-y-3">
            {days.map((day) => (
              <div key={day.day_of_week} className="grid gap-2 rounded-md border border-border/70 p-3 sm:grid-cols-[105px_100px_1fr_1fr] sm:items-center">
                <span className="text-sm font-medium">{WEEKDAYS[day.day_of_week]}</span>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={day.is_closed} disabled={savingHours || needsReload}
                    onChange={(event) => changeDay(day.day_of_week, { is_closed: event.target.checked })} />
                  Closed
                </label>
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  Opens
                  <Input type="time" aria-label={`${WEEKDAYS[day.day_of_week]} opening time`} value={day.open_time}
                    disabled={day.is_closed || savingHours || needsReload} required={!day.is_closed}
                    onChange={(event) => changeDay(day.day_of_week, { open_time: event.target.value })} />
                </label>
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  Closes
                  <Input type="time" aria-label={`${WEEKDAYS[day.day_of_week]} closing time`} value={day.close_time}
                    disabled={day.is_closed || savingHours || needsReload} required={!day.is_closed}
                    onChange={(event) => changeDay(day.day_of_week, { close_time: event.target.value })} />
                </label>
              </div>
            ))}
          </div>
          {hoursError && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{hoursError}</p>}
          {hoursMessage && <p role="status" className="flex items-center gap-2 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" />{hoursMessage}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{dirtyDays.length} unsaved day(s)</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={savingHours || needsReload || dirtyDays.length === 0} onClick={cancelChanges}>Cancel changes</Button>
              <Button type="submit" disabled={savingHours || needsReload || dirtyDays.length === 0}>
                {savingHours && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingHours ? "Saving…" : "Save opening hours"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
