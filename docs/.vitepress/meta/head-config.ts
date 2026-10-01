import type { HeadConfig } from "vitepress";
import { description as packageDescription } from "../../../package.json";
import { SITE_LOGO, SITE_TITLE, SITE_URL, THEME_COLOR } from "./site";

/**
 * Site-wide defaults. Per-page `og:*` overrides, including each page's generated `og:image`, are
 * pushed in `transformPageData` (config.ts); VitePress dedupes `meta` tags by their first
 * attribute, so the page-level ones win.
 */
export const headConfig: HeadConfig[] = [
  ["link", { rel: "icon", href: "/favicon.ico", sizes: "any" }],
  ["link", { rel: "icon", href: SITE_LOGO, type: "image/svg+xml" }],
  ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
  ["link", { rel: "manifest", href: "/site.webmanifest" }],
  ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
  ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
  [
    "link",
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Martian+Mono:wght@400;600&display=swap",
    },
  ],
  ["meta", { name: "theme-color", content: THEME_COLOR }],
  ["meta", { property: "og:type", content: "website" }],
  ["meta", { property: "og:site_name", content: SITE_TITLE }],
  ["meta", { property: "og:locale", content: "en_US" }],
  ["meta", { property: "og:title", content: `${SITE_TITLE} | ${packageDescription}` }],
  ["meta", { property: "og:description", content: packageDescription }],
  ["meta", { property: "og:url", content: `${SITE_URL}/` }],
  ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ["meta", { name: "twitter:title", content: `${SITE_TITLE} | ${packageDescription}` }],
  ["meta", { name: "twitter:description", content: packageDescription }],
];
