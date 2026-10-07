const DEFAULT_SITE_URL = "https://website-manulcoffe.pages.dev";

function normalizeSiteUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

export const SITE_URL = normalizeSiteUrl(
  import.meta.env.VITE_PUBLIC_SITE_URL || DEFAULT_SITE_URL
);
