import { mkdir, writeFile } from "node:fs/promises";

const DEFAULT_SITE_URL = "https://website-manulcoffe.pages.dev";

function normalizeSiteUrl(value) {
  const normalized = value.trim().replace(/\/+$/, "");
  const url = new URL(normalized);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("VITE_PUBLIC_SITE_URL must use http or https");
  }

  return normalized;
}

const siteUrl = normalizeSiteUrl(
  process.env.VITE_PUBLIC_SITE_URL || DEFAULT_SITE_URL
);

const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /login

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <url>
    <loc>${siteUrl}/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="lv" href="${siteUrl}/lv" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>

  <url>
    <loc>${siteUrl}/lv</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="lv" href="${siteUrl}/lv" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>
</urlset>
`;

await mkdir("public", { recursive: true });

await Promise.all([
  writeFile("public/robots.txt", robots, "utf8"),
  writeFile("public/sitemap.xml", sitemap, "utf8"),
]);

console.log(`Generated robots.txt and sitemap.xml for ${siteUrl}`);
