import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vitepress";

import { author, license, description as packageDescription } from "../../package.json";
import { headConfig } from "./meta/head-config";
import { navbarItems, sidebarRoutes } from "./meta/routes";
import { SOCIAL_LINKS } from "./meta/social-links";

const readSvg = (fileName: string): string =>
  readFileSync(resolve(`./docs/.vitepress/assets/${fileName}`), "utf-8");

export default defineConfig({
  title: "Pokenode-ts",
  description: packageDescription,
  lang: "en-US",
  srcDir: "./src",
  lastUpdated: true,
  head: headConfig,
  sitemap: {
    hostname: "https://pokenode-ts.vercel.app",
  },
  themeConfig: {
    nav: navbarItems,
    sidebar: sidebarRoutes,
    siteTitle: "Pokenode-ts",
    logo: { src: "/site-logo.svg", width: 24, height: 24 },
    footer: {
      message: `Made with ❤️<br/>Released under the ${license} License`,
      copyright: `Copyright © 2021-${new Date().getFullYear()} ${author.name}`,
    },
    socialLinks: [
      { icon: "github", link: SOCIAL_LINKS.GITHUB.link },
      { icon: { svg: readSvg(SOCIAL_LINKS.NPM.path) }, link: SOCIAL_LINKS.NPM.link },
      {
        icon: { svg: readSvg(SOCIAL_LINKS.JSDELIVR.path) },
        link: SOCIAL_LINKS.JSDELIVR.link,
      },
      {
        icon: { svg: readSvg(SOCIAL_LINKS.BUNDLEPHOBIA.path) },
        link: SOCIAL_LINKS.BUNDLEPHOBIA.link,
      },
      {
        icon: { svg: readSvg(SOCIAL_LINKS.PACKAGEPHOBIA.path) },
        link: SOCIAL_LINKS.PACKAGEPHOBIA.link,
      },
    ],
    editLink: {
      pattern: "https://github.com/Gabb-c/pokenode-ts/edit/main/docs/src/:path",
      text: "Suggest changes to this page",
    },
    search: {
      provider: "local",
    },
    carbonAds: {
      code: "CEBDT27Y",
      placement: "vuejsorg",
    },
  },
  cleanUrls: true,
});
