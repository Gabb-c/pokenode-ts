import type { HeadConfig } from "vitepress";
import { name, description as packageDescription } from "../../../package.json";

export const headConfig: HeadConfig[] = [
  ["link", { rel: "icon", href: "/site-logo.svg", type: "image/svg+xml" }],
  [
    "link",
    { rel: "apple-touch-icon", sizes: "57x57", href: "/site-logo.svg", type: "image/svg+xml" },
  ],
  [
    "link",
    { rel: "apple-touch-icon", sizes: "60x60", href: "/site-logo.svg", type: "image/svg+xml" },
  ],
  [
    "link",
    { rel: "apple-touch-icon", sizes: "72x72", href: "/site-logo.svg", type: "image/svg+xml" },
  ],
  [
    "link",
    { rel: "apple-touch-icon", sizes: "76x76", href: "/site-logo.svg", type: "image/svg+xml" },
  ],
  [
    "link",
    {
      rel: "apple-touch-icon",
      sizes: "114x114",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  [
    "link",
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  [
    "link",
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  [
    "link",
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  [
    "link",
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  [
    "link",
    {
      rel: "icon",
      sizes: "192x192",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  [
    "link",
    {
      rel: "icon",
      sizes: "32x32",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  [
    "link",
    {
      rel: "icon",
      sizes: "96x96",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  [
    "link",
    {
      rel: "icon",
      sizes: "16x16",
      href: "/site-logo.svg",
      type: "image/svg+xml",
    },
  ],
  ["meta", { property: "og:type", content: "website" }],
  ["meta", { name: "theme-color", content: "#FF3962" }],
  ["meta", { property: "og:locale", content: "en" }],
  ["meta", { property: "og:title", content: `${name} | ${packageDescription}` }],
  ["meta", { property: "og:url", content: "https://pokenode-ts.vercel.app/" }],
  ["meta", { property: "og:description", content: packageDescription }],
  ["meta", { property: "og:image", content: "/cover.jpg" }],
];
