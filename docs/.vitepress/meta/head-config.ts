import type { HeadConfig } from "vitepress";
import { name, description as packageDescription } from "../../../package.json";

const SITE_URL = "https://pokenode-ts.vercel.app";
const LOGO = "/site-logo.svg";

export const headConfig: HeadConfig[] = [
  ["link", { rel: "icon", href: LOGO, type: "image/svg+xml" }],
  ["link", { rel: "apple-touch-icon", href: LOGO }],
  ["meta", { name: "theme-color", content: "#FF3962" }],
  ["meta", { property: "og:type", content: "website" }],
  ["meta", { property: "og:site_name", content: "Pokenode-ts" }],
  ["meta", { property: "og:locale", content: "en_US" }],
  ["meta", { property: "og:title", content: `${name} | ${packageDescription}` }],
  ["meta", { property: "og:description", content: packageDescription }],
  ["meta", { property: "og:url", content: `${SITE_URL}/` }],
  ["meta", { property: "og:image", content: `${SITE_URL}/cover.jpg` }],
  ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ["meta", { name: "twitter:title", content: `${name} | ${packageDescription}` }],
  ["meta", { name: "twitter:description", content: packageDescription }],
  ["meta", { name: "twitter:image", content: `${SITE_URL}/cover.jpg` }],
];
