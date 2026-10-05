import { createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/manulcoffee-hero.jpg";
import { getPublicBusinessSeoData } from "@/lib/publicBusinessSeo.functions";
import { ManulCoffeePage, formatTime } from "./-home";

const siteUrl = "https://website-manulcoffe.pages.dev";
const title = "ManulCoffee — Specialty Coffee in Riga";

const description =
  "ManulCoffee is a modern specialty coffee shop in Riga serving carefully crafted coffee, fresh pastries, and a relaxed city atmosphere.";

const socialImageUrl = new URL(heroImage, siteUrl).href;

const schemaDays = [
  "https://schema.org/Monday",
  "https://schema.org/Tuesday",
  "https://schema.org/Wednesday",
  "https://schema.org/Thursday",
  "https://schema.org/Friday",
  "https://schema.org/Saturday",
  "https://schema.org/Sunday",
] as const;

type PublicBusinessSeoData = Awaited<
  ReturnType<typeof getPublicBusinessSeoData>
>;

function buildLocalBusinessStructuredData(
  data: PublicBusinessSeoData | undefined,
) {
  if (!data || data.locations.length === 0) return null;

  const businessName = data.settings?.business_name?.trim() || "ManulCoffee";
  const businessDescription =
    data.settings?.description?.trim() || description;
  const businessPhone = data.settings?.phone?.trim() || undefined;
  const businessEmail = data.settings?.contact_email?.trim() || undefined;
  const instagramUrl = data.settings?.instagram_url?.trim() || undefined;

  return {
    "@context": "https://schema.org",
    "@graph": data.locations.map((location) => {
      const openingHoursSpecification = [...location.business_hours]
        .filter(
          (hour) =>
            !hour.is_closed &&
            hour.open_time &&
            hour.close_time &&
            hour.day_of_week >= 0 &&
            hour.day_of_week <= 6,
        )
        .sort((a, b) => a.day_of_week - b.day_of_week)
        .map((hour) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: schemaDays[hour.day_of_week],
          opens: formatTime(hour.open_time),
          closes: formatTime(hour.close_time),
        }));

      return {
        "@type": "CafeOrCoffeeShop",
        "@id": `${siteUrl}/#location-${location.id}`,
        name: location.name?.trim() || businessName,
        description: location.description?.trim() || businessDescription,
        url: `${siteUrl}/#locations`,
        image: socialImageUrl,
        telephone: location.phone?.trim() || businessPhone,
        email: businessEmail,
        address: {
          "@type": "PostalAddress",
          streetAddress: location.address,
          addressLocality: location.city,
          postalCode: location.postal_code || undefined,
          addressCountry: "LV",
        },
        openingHoursSpecification,
        acceptsReservations: true,
        hasMenu: `${siteUrl}/#menu`,
        ...(instagramUrl ? { sameAs: [instagramUrl] } : {}),
      };
    }),
  };
}

export const Route = createFileRoute("/")({
  loader: async () => getPublicBusinessSeoData(),
  head: ({ loaderData }) => {
    const structuredData = buildLocalBusinessStructuredData(loaderData);

    return {
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
    scripts: structuredData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          },
        ]
      : [],
    };
  },
  component: ManulCoffeePage,
});

