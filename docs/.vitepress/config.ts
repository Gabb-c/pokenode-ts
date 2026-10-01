import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineConfig, type HeadConfig } from "vitepress";

import { author, license, description as packageDescription } from "../../package.json";
import { headConfig } from "./meta/head-config";
import { OG_IMAGE, type OgCard, ogImagePath, renderOgImage } from "./meta/og-image";
import { navbarItems, sidebarRoutes } from "./meta/routes";
import { isSectionKey, sectionPaths } from "./meta/sections";
import { SITE_TITLE, SITE_URL } from "./meta/site";
import { SOCIAL_LINKS } from "./meta/social-links";

// Resolved against this file, not the cwd, so the build works from any directory.
const ASSETS_DIR = join(import.meta.dirname, "assets");

const readSvg = (fileName: string): string => readFileSync(join(ASSETS_DIR, fileName), "utf-8");

/** `cleanUrls` drops the extension, so `guides/cache.md` is served at `/guides/cache`. */
const canonicalUrl = (relativePath: string): string =>
  `${SITE_URL}/${relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "")}`;

/** Filled by `transformPageData`, rendered to PNGs by `buildEnd`, keyed by image path. */
const ogCards = new Map<string, OgCard>();

export default defineConfig({
  title: SITE_TITLE,
  description: packageDescription,
  lang: "en-US",
  srcDir: "./src",
  lastUpdated: true,
  head: headConfig,
  sitemap: {
    hostname: SITE_URL,
  },
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    image: { lazyLoading: true },
  },
  // Site-wide head tags describe the home page; give every other page its own canonical URL and
  // Open Graph title/description so search results and link previews are not all identical.
  transformPageData(pageData) {
    const url = canonicalUrl(pageData.relativePath);
    // The home page has no title of its own — fall back to the site-wide pairing rather than
    // emitting a dangling " | Pokenode-ts".
    const pageTitle: string = pageData.frontmatter.title || pageData.title;
    const title = pageTitle
      ? `${pageTitle} | ${SITE_TITLE}`
      : `${SITE_TITLE} | ${packageDescription}`;
    const description: string =
      pageData.frontmatter.description || pageData.description || packageDescription;

    const imagePath = ogImagePath(pageData.relativePath);
    const imageUrl = `${SITE_URL}${imagePath}`;
    const section: unknown = pageData.frontmatter.section;
    ogCards.set(imagePath, {
      title: pageTitle || pageData.frontmatter.hero?.text || SITE_TITLE,
      // the home description is the package one, which repeats the hero text used as its title
      description: pageData.frontmatter.hero?.tagline || description,
      label: url === `${SITE_URL}/` ? new URL(SITE_URL).host : new URL(url).pathname,
      paths: isSectionKey(section) ? sectionPaths(section) : [],
    });

    const pageHead: HeadConfig[] = [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:image", content: imageUrl }],
      ["meta", { property: "og:image:width", content: String(OG_IMAGE.width) }],
      ["meta", { property: "og:image:height", content: String(OG_IMAGE.height) }],
      ["meta", { property: "og:image:alt", content: title }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: imageUrl }],
      ["meta", { name: "twitter:image:alt", content: title }],
    ];

    pageData.frontmatter.head = [...(pageData.frontmatter.head ?? []), ...pageHead];
  },
  async buildEnd({ outDir }) {
    // an empty map means transformPageData never ran here, and every og:image would 404
    if (ogCards.size === 0) throw new Error("No Open Graph cards were collected during the build");
    for (const [imagePath, card] of ogCards) {
      const file = join(outDir, imagePath);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, await renderOgImage(card));
    }
  },
  themeConfig: {
    nav: navbarItems,
    sidebar: sidebarRoutes,
    siteTitle: SITE_TITLE,
    outline: { level: [2, 3], label: "On this page" },
    externalLinkIcon: true,
    logo: { src: "/site-logo.svg", width: 24, height: 24 },
    footer: {
      message: [
        `Released under the ${license} License.`,
        'Data from <a href="https://pokeapi.co">PokéAPI</a>.',
        "Not affiliated with or endorsed by Nintendo, Creatures Inc., GAME FREAK inc. or The Pokémon Company.",
        "Pokémon and Pokémon character names are trademarks of Nintendo.",
      ].join("<br/>"),
      copyright: `Copyright © 2021-${new Date().getFullYear()} ${author.name}`,
    },
    socialLinks: [
      { icon: "github", link: SOCIAL_LINKS.GITHUB.link, ariaLabel: "GitHub repository" },
      {
        icon: { svg: readSvg(SOCIAL_LINKS.NPM.icon) },
        link: SOCIAL_LINKS.NPM.link,
        ariaLabel: "npm package",
      },
      {
        icon: { svg: readSvg(SOCIAL_LINKS.JSDELIVR.icon) },
        link: SOCIAL_LINKS.JSDELIVR.link,
        ariaLabel: "jsDelivr CDN",
      },
      {
        icon: { svg: readSvg(SOCIAL_LINKS.BUNDLEPHOBIA.icon) },
        link: SOCIAL_LINKS.BUNDLEPHOBIA.link,
        ariaLabel: "Bundlephobia size report",
      },
      {
        icon: { svg: readSvg(SOCIAL_LINKS.PACKAGEPHOBIA.icon) },
        link: SOCIAL_LINKS.PACKAGEPHOBIA.link,
        ariaLabel: "Packagephobia install size",
      },
    ],
    editLink: {
      pattern: "https://github.com/Gabb-c/pokenode-ts/edit/main/docs/src/:path",
      text: "Suggest changes to this page",
    },
    search: {
      provider: "local",
    },
    docFooter: {
      prev: "Previous",
      next: "Next",
    },
    lastUpdated: {
      text: "Last updated",
      formatOptions: { dateStyle: "medium", forceLocale: true },
    },
  },
  cleanUrls: true,
});
