import { defineConfig } from "vitepress";
import { author, license, description as packageDescription, repository } from "../../package.json";
import { headConfig } from "./head-config";
import { navbarItems, sidebarRoutes } from "./routes";
import { SOCIAL_LINKS } from "./social-links";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as dotenv from "dotenv";

dotenv.config();

const readSvg = (fileName: string): string =>
  readFileSync(resolve(`./docs/.vitepress/assets/${fileName}`), "utf-8");

export default defineConfig({
  title: "Pokenode-ts",
  description: packageDescription,
  lang: "en-US",
  srcDir: "./src",
  lastUpdated: true,
  head: headConfig,
  themeConfig: {
    nav: navbarItems,
    sidebar: sidebarRoutes,
    siteTitle: "Pokenode-ts",
    logo: "/siteLogo.svg",
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
      pattern: `${repository.url}/vitepress/edit/main/docs/src/:path`,
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "algolia",
      options: {
        apiKey: process.env.API_KEY as string,
        appId: process.env.APP_ID as string,
        indexName: process.env.INDEX_NAME as string,
      },
    },
  },
  cleanUrls: true,
});
