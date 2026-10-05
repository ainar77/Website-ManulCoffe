import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowDown,
} from "lucide-react";

import heroImage from "@/assets/manulcoffee-hero.jpg";
import seasonalImage from "@/assets/seasonal-selection.jpg";
import storyImage from "@/assets/craft-story.jpg";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/manul/BrandMark";
import { Header } from "@/components/manul/Header";
import { LocationsSection } from "@/components/manul/LocationsSection";
import { MenuSection } from "@/components/manul/MenuSection";
import { ReviewsSection } from "@/components/manul/ReviewsSection";
import { SectionHeading } from "@/components/manul/SectionHeading";

import { favorites, favoritesLv } from "@/data/manulcoffee";
import { getSupabaseClient } from "@/integrations/supabase/client";
import type { Database } from "@/lib/supabase-types";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { useLanguage } from "@/i18n/LanguageContext";
import type { PublicBusinessSettings } from "@/hooks/useBusinessSettings";

type BusinessLocation =
  Database["public"]["Tables"]["business_locations"]["Row"];

type BusinessHour =
  Database["public"]["Tables"]["business_hours"]["Row"];

type LocationWithHours = BusinessLocation & {
  business_hours: BusinessHour[];
};

const siteUrl = "https://website-manulcoffe.pages.dev";
const title = "ManulCoffee — Specialty Coffee in Riga";

const description =
  "ManulCoffee is a modern specialty coffee shop in Riga serving carefully crafted coffee, fresh pastries, and a relaxed city atmosphere.";

const socialImageUrl = new URL(heroImage, siteUrl).href;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      {
        name: "description",
        content: description,
      },
      {
        name: "robots",
        content: "index, follow",
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: `${siteUrl}/`,
      },
      {
        property: "og:site_name",
        content: "ManulCoffee",
      },
      {
        property: "og:locale",
        content: "en_US",
      },
      {
        property: "og:image",
        content: socialImageUrl,
      },
      {
        property: "og:image:alt",
        content: "ManulCoffee specialty coffee shop in Riga",
      },
      {
        property: "og:image:width",
        content: "1920",
      },
      {
        property: "og:image:height",
        content: "1200",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: description,
      },
      {
        name: "twitter:image",
        content: socialImageUrl,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${siteUrl}/`,
      },
    ],
  }),
  component: ManulCoffeePage,
});

function scrollTo(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: "smooth",
    });
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

function formatTime(time: string | null) {
  if (!time) return "";

  return time.slice(0, 5);
}

function formatWeekdayHours(
  hours: BusinessHour[],
  seeOpeningHours: string,
  weekdaysLabel: string
) {
  const weekdays = hours
    .filter(
      (hour) =>
        hour.day_of_week >= 0 &&
        hour.day_of_week <= 4
    )
    .sort(
      (a, b) =>
        a.day_of_week - b.day_of_week
    );

  if (weekdays.length !== 5) {
    return seeOpeningHours;
  }

  if (
    weekdays.some(
      (hour) =>
        hour.is_closed ||
        !hour.open_time ||
        !hour.close_time
    )
  ) {
    return seeOpeningHours;
  }

  const first = weekdays[0];

  const sameHours = weekdays.every(
    (hour) =>
      hour.open_time === first.open_time &&
      hour.close_time === first.close_time &&
      hour.is_closed === first.is_closed
  );

  if (!sameHours) {
    return seeOpeningHours;
  }

  return `${weekdaysLabel} ${formatTime(
    first.open_time
  )}–${formatTime(first.close_time)}`;
}

function Hero({ settings }: { settings: PublicBusinessSettings | null }) {
  const { language, t } = useLanguage();

  const tagline =
    language === "lv"
      ? settings?.tagline_lv?.trim() || settings?.tagline?.trim()
      : settings?.tagline?.trim();

  const description =
    language === "lv"
      ? settings?.description_lv?.trim() || settings?.description?.trim()
      : settings?.description?.trim();

  return (
    <section
      id="top"
      className="relative flex min-h-[88svh] items-end overflow-hidden bg-coffee text-primary-foreground"
    >
      <img
        src={heroImage}
        alt="Barista preparing espresso in the warm ManulCoffee interior"
        width={1920}
        height={1200}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="relative mx-auto w-full max-w-site px-5 pb-12 pt-36 sm:px-8 sm:pb-16 lg:pb-20">
        <p className="mb-5 text-xs font-semibold uppercase tracking-label text-accent">
          {t.hero.eyebrow}
        </p>

        <h1 className="max-w-5xl font-display text-6xl font-semibold leading-[0.88] sm:text-8xl lg:text-[8rem]">
          {settings?.business_name?.trim() || "ManulCoffee"}
        </h1>

        <div className="mt-7 grid gap-8 border-t border-primary-foreground/30 pt-7 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-display text-2xl sm:text-3xl">
              {tagline || "Coffee worth slowing down for."}
            </p>

           <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/70">
              {description ||
              "Carefully sourced beans, thoughtful food, and warm rooms made for the rhythm of Riga."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="xl"
              variant="heroOutline"
              onClick={() =>
                scrollTo("menu")
              }
            >
              {t.hero.viewMenu}
            </Button>

            <Button
              size="xl"
              variant="heroOutline"
              onClick={() =>
                scrollTo("locations")
              }
            >
              {t.hero.findLocation}
            </Button>
          </div>
        </div>

        <a
          href="#favorites"
          aria-label={t.hero.scrollLabel}
          className="absolute bottom-4 right-5 hidden size-11 place-items-center rounded-full border border-primary-foreground/30 transition-colors hover:bg-primary-foreground/10 sm:grid"
        >
          <ArrowDown className="size-4" />
        </a>
      </div>
    </section>
  );
}

function Favorites() {
  const { language, t } = useLanguage();
  const localizedFavorites = language === "lv" ? favoritesLv : favorites;

  return (
    <section
      id="favorites"
      className="bg-surface py-section"
    >
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading
          eyebrow={t.favorites.eyebrow}
          title={t.favorites.title}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {localizedFavorites.map(
            (item, index) => (
              <article
                key={item.name}
                className="group"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={seasonalImage}
                    alt={item.name}
                    width={1408}
                    height={1008}
                    loading="lazy"
                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
                      index === 0
                        ? "object-left"
                        : index === 1
                          ? "object-center"
                          : "object-right"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-coffee/20 pt-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-label text-accent">
                      {item.tag}
                    </p>

                    <h3 className="font-display text-2xl font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {item.price}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function Story({ settings }: { settings: PublicBusinessSettings | null }) {
  const { language, t } = useLanguage();

  const description =
    language === "lv"
      ? settings?.description_lv?.trim() || settings?.description?.trim()
      : settings?.description?.trim();

  return (
    <section className="bg-background py-section">
      <div className="mx-auto grid max-w-site gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-xs font-semibold uppercase tracking-label text-accent">
            {t.story.eyebrow}
          </p>

          <h2 className="font-display text-5xl font-semibold leading-none sm:text-6xl">
            {t.story.title}
          </h2>

          <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground">
            {description ||
              "ManulCoffee is a specialty coffee space built around quality, community, and considered details. Inspired by slow mornings and good conversations, we make each cup with care and keep our doors open to the rhythm of the city."}
          </p>

          <p className="mt-6 text-sm font-semibold">
            {t.story.closing}
          </p>
        </div>

        <div className="order-1 aspect-[4/3] overflow-hidden bg-muted lg:order-2 lg:aspect-[4/5]">
          <img
            src={storyImage}
            alt="Barista carefully pouring latte art at ManulCoffee"
            width={1408}
            height={1008}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Contacts({
  locations,
  settings,
}: {
  locations: LocationWithHours[];
  settings: PublicBusinessSettings | null;
}) {
  const { t } = useLanguage();
  const mainLocation = locations[0];

  const mainAddress = mainLocation
    ? formatAddress(mainLocation)
    : "";

  const directionsUrl =
    mainLocation?.maps_url ||
    (mainAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          mainAddress
        )}`
      : "#");

  const phone = settings?.phone?.trim() || mainLocation?.phone?.trim() || "";
  const email = settings?.contact_email?.trim() || "";
  const instagram = settings?.instagram_url?.trim() || "";
  const website = settings?.website_url?.trim() || "";

  return (
    <section
      id="contacts"
      className="scroll-mt-20 bg-accent py-section text-accent-foreground"
    >
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading
          eyebrow={t.contacts.eyebrow}
          title={t.contacts.title}
        />

        <div className="grid gap-10 border-t border-accent-foreground/25 pt-8 lg:grid-cols-2">
          <p className="max-w-xl font-display text-3xl leading-snug sm:text-4xl">
            {t.contacts.intro}
          </p>

          <div className="grid gap-5 text-sm sm:grid-cols-2">
            {mainAddress && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <MapPin />
                {mainAddress}
              </a>
            )}

            {phone && (
              <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="contact-link">
                <Phone />
                {phone}
              </a>
            )}

            {email && (
              <a href={`mailto:${email}`} className="contact-link">
                <Mail />
                {email}
              </a>
            )}

            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" className="contact-link">
                {t.contacts.website}
              </a>
            )}

            {instagram && (
              <div className="flex gap-2">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-accent-foreground/30 transition-colors hover:bg-accent-foreground hover:text-accent"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        <p className="mt-12 text-xs text-accent-foreground/70">
          {t.footer.demo}
        </p>
      </div>
    </section>
  );
}

function Footer({
  locations,
  settings,
}: {
  locations: LocationWithHours[];
  settings: PublicBusinessSettings | null;
}) {
  const { language, t } = useLanguage();

  const tagline =
    language === "lv"
      ? settings?.tagline_lv?.trim() || settings?.tagline?.trim()
      : settings?.tagline?.trim();

  const footerLinks = [
    { id: "menu", label: t.nav.menu },
    { id: "locations", label: t.nav.locations },
    { id: "reviews", label: t.nav.reviews },
    { id: "contacts", label: t.nav.contacts },
  ];

  return (
    <footer className="bg-coffee py-12 text-primary-foreground">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <div className="grid gap-10 border-b border-primary-foreground/15 pb-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <BrandMark
  name={
    settings?.business_name?.trim() || "ManulCoffee"
  }
/>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/60">
              {tagline ||
                "Specialty coffee and thoughtful food, made for unhurried moments in Riga."}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-col items-start gap-3 text-sm"
          >
            {footerLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="space-y-5 text-sm text-primary-foreground/70">
            {locations.map((location) => {
              const localizedName =
                language === "lv"
                  ? location.name_lv?.trim() || location.name
                  : location.name;

              return (
                <div key={location.id}>
                  <p className="font-semibold text-primary-foreground">
                    {localizedName}
                  </p>

                  <p className="mt-1">
                    {formatAddress(location)}
                  </p>

                  <p>
                    {formatWeekdayHours(
                      location.business_hours,
                      t.common.seeOpeningHours,
                      t.common.weekdays
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-primary-foreground/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings?.business_name?.trim() || "ManulCoffee"}. {t.footer.rights}
          </p>

          <p>
            {t.footer.demo}
          </p>
        </div>
      </div>
    </footer>
  );
}

function ManulCoffeePage() {
  const { settings } = useBusinessSettings();

  const [locations, setLocations] = useState<
    LocationWithHours[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    async function loadLocations() {
      const { data, error } =
        await getSupabaseClient()
          .from("business_locations")
          .select(`
            *,
            business_hours (*)
          `)
          .eq("is_active", true)
          .order("sort_order", {
            ascending: true,
          });

      if (cancelled) return;

      if (error) {
        console.error(
          "Failed to load page locations:",
          error
        );
        return;
      }

      setLocations(
        (data ?? []) as LocationWithHours[]
      );
    }

    void loadLocations();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Header
  businessName={
    settings?.business_name?.trim() || "ManulCoffee"
  }
/>

      <main>
        <Hero settings={settings} />
        <Favorites />
        <MenuSection />
        <LocationsSection />
        <ReviewsSection />
        <Story settings={settings} />

        <Contacts locations={locations} settings={settings} />
      </main>

      <Footer locations={locations} settings={settings} />
    </>
  );
}
