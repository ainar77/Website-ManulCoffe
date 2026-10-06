import { useEffect, useState } from "react";
import locationsImage from "@/assets/locations.jpg";
import { Clock, MapPin, Navigation } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Database } from "@/lib/supabase-types";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";

type BusinessLocation =
  Database["public"]["Tables"]["business_locations"]["Row"];

type BusinessHour =
  Database["public"]["Tables"]["business_hours"]["Row"];

type LocationWithHours = BusinessLocation & {
  hours: BusinessHour[];
};

const DAY_NAMES = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

function formatTime(time: string | null) {
  if (!time) return "";
  return time.slice(0, 5);
}

function formatAddress(location: BusinessLocation) {
  return [
    location.address,
    location.city,
    location.postal_code,
  ]
    .filter(Boolean)
    .join(", ");
}

function getRigaTime() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Riga",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const weekday =
    parts.find((part) => part.type === "weekday")?.value ?? "";

  const hour = Number(
    parts.find((part) => part.type === "hour")?.value ?? 0
  );

  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0
  );

  const dayMap: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  return {
    dayOfWeek: dayMap[weekday],
    minutes: hour * 60 + minute,
  };
}

function timeToMinutes(time: string | null) {
  if (!time) return null;

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function isLocationOpen(hours: BusinessHour[]) {
  const { dayOfWeek, minutes } = getRigaTime();

  const today = hours.find(
    (item) => item.day_of_week === dayOfWeek
  );

  if (
    !today ||
    today.is_closed ||
    !today.open_time ||
    !today.close_time
  ) {
    return false;
  }

  const opening = timeToMinutes(today.open_time);
  const closing = timeToMinutes(today.close_time);

  if (opening === null || closing === null) {
    return false;
  }

  return minutes >= opening && minutes < closing;
}

export function LocationsSection() {
  const { t } = useLanguage();
  const [locations, setLocations] = useState<LocationWithHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLocations() {
      setLoading(true);
      setError(null);

      const { data: locationData, error: locationError } =
        await getSupabaseClient()
          .from("business_locations")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (locationError || !locationData) {
        console.error(
          "Failed to load business locations:",
          locationError
        );

        setError(t.locations.loadError);
        setLoading(false);
        return;
      }

      const locationIds = locationData.map(
        (location) => location.id
      );

      if (locationIds.length === 0) {
        setLocations([]);
        setLoading(false);
        return;
      }

      const { data: hoursData, error: hoursError } =
        await getSupabaseClient()
          .from("business_hours")
          .select("*")
          .in("location_id", locationIds)
          .order("day_of_week", { ascending: true });

      if (cancelled) return;

      if (hoursError || !hoursData) {
        console.error(
          "Failed to load business hours:",
          hoursError
        );

        setError(t.locations.hoursError);
        setLoading(false);
        return;
      }

      const combinedLocations: LocationWithHours[] =
        locationData.map((location) => ({
          ...location,
          hours: hoursData.filter(
            (hours) => hours.location_id === location.id
          ),
        }));

      setLocations(combinedLocations);
      setLoading(false);
    }

    loadLocations();

    return () => {
      cancelled = true;
    };
  }, [t.locations.loadError, t.locations.hoursError]);

  return (
    <section
      id="locations"
      className="scroll-mt-20 bg-coffee py-section text-primary-foreground"
    >
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading
          eyebrow={t.locations.eyebrow}
          title={t.locations.title}
          light
        />

        {loading && (
          <p className="text-sm text-primary-foreground/70">
            Loading locations…
          </p>
        )}

        {error && (
          <p className="text-sm text-primary-foreground/70">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {locations.map((location, index) => {
              const open = isLocationOpen(location.hours);

              const sortedHours = [...location.hours].sort(
                (a, b) =>
                  a.day_of_week - b.day_of_week
              );

              return (
                <article key={location.id}>
                  <div className="aspect-[16/10] overflow-hidden bg-coffee-soft">
                    <img
                      src={locationsImage}
                      alt={`${location.name} cafe`}
                      width={1600}
                      height={1008}
                      loading="lazy"
                      className={`h-full w-full object-cover ${
                        index === 0
                          ? "object-left"
                          : "object-right"
                      }`}
                    />
                  </div>

                  <div className="grid gap-7 border-x border-b border-primary-foreground/15 p-6 sm:p-8">
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${
                            open
                              ? "bg-open"
                              : "bg-closed"
                          }`}
                        />

                        <span className="text-xs font-semibold uppercase tracking-label">
                          {open ? t.locations.openNow : t.locations.closed}
                        </span>
                      </div>

                      <h3 className="font-display text-3xl font-semibold sm:text-4xl">
                        {location.name}
                      </h3>

                      {location.description && (
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/70">
                          {location.description}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3 text-sm">
                      <p className="flex items-start gap-3">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />

                        {formatAddress(location)}
                      </p>

                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 size-4 shrink-0 text-accent" />

                        <div>
                          {sortedHours.map((hours) => (
                            <p key={hours.id}>
                              {t.locations.days[hours.day_of_week]}:{" "}
                              {hours.is_closed
                                ? t.locations.closed
                                : `${formatTime(
                                    hours.open_time
                                  )}–${formatTime(
                                    hours.close_time
                                  )}`}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {location.maps_url && (
                      <Button
                        asChild
                        variant="light"
                        className="w-fit"
                      >
                        <a
                          href={location.maps_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Navigation />
                          {t.locations.getDirections}
                        </a>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
