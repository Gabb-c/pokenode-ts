import type { HeadConfig } from "vitepress";
import { description as packageDescription } from "../../../package.json";
import { SITE_COVER, SITE_LOGO, SITE_TITLE, SITE_URL } from "./site";

const COVER_URL = `${SITE_URL}${SITE_COVER.path}`;

/**
 * Site-wide defaults. Per-page `og:*` overrides are pushed in `transformPageData` (config.ts);
 * VitePress dedupes `meta` tags by their first attribute, so the page-level ones win.
 */
export const headConfig: HeadConfig[] = [
  ["link", { rel: "icon", href: SITE_LOGO, type: "image/svg+xml" }],
  ["link", { rel: "apple-touch-icon", href: SITE_LOGO }],
  ["meta", { name: "theme-color", content: "#FF3962" }],
  ["meta", { property: "og:type", content: "website" }],
  ["meta", { property: "og:site_name", content: SITE_TITLE }],
  ["meta", { property: "og:locale", content: "en_US" }],
  ["meta", { property: "og:title", content: `${SITE_TITLE} | ${packageDescription}` }],
  ["meta", { property: "og:description", content: packageDescription }],
  ["meta", { property: "og:url", content: `${SITE_URL}/` }],
  ["meta", { property: "og:image", content: COVER_URL }],
  ["meta", { property: "og:image:width", content: String(SITE_COVER.width) }],
  ["meta", { property: "og:image:height", content: String(SITE_COVER.height) }],
  ["meta", { property: "og:image:alt", content: `${SITE_TITLE} — ${packageDescription}` }],
  ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ["meta", { name: "twitter:title", content: `${SITE_TITLE} | ${packageDescription}` }],
  ["meta", { name: "twitter:description", content: packageDescription }],
  ["meta", { name: "twitter:image", content: COVER_URL }],
  ["meta", { name: "twitter:image:alt", content: `${SITE_TITLE} — ${packageDescription}` }],
];
