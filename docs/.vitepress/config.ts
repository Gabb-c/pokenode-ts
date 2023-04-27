import { defineConfig } from "vitepress";
import { readFileSync } from "node:fs";
import { author, license, repository, description as packageDescription } from "../../package.json";
import { navbarItems, sidebarRoutes } from "./routes";
import { SOCIAL_LINKS } from "./social-links";
import { headConfig } from "./head-config";

import * as dotenv from "dotenv";
dotenv.config();

const readSvg = (path: string): string => readFileSync(require.resolve(path), "utf-8");

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
      { icon: "github", link: SOCIAL_LINKS.GITHUB },
      { icon: { svg: readSvg("../src/public/npm-icon.svg") }, link: SOCIAL_LINKS.NPM },
      { icon: { svg: readSvg("../src/public/jsdelivr-icon.svg") }, link: SOCIAL_LINKS.JSDELIVR },
      {
        icon: { svg: readSvg("../src/public/bundlephobia-icon.svg") },
        link: SOCIAL_LINKS.BUNDLEPHOBIA,
      },
      {
        icon: { svg: readSvg("../src/public/packagephobia-icon.svg") },
        link: SOCIAL_LINKS.PACKAGEPHOBIA,
      },
    ],
    editLink: {
      pattern: `${repository.url}/vitepress/edit/main/docs/src/:path`,
      text: "Edit this page on GitHub",
    },
    algolia: {
      apiKey: process.env.API_KEY as string,
      appId: process.env.APP_ID as string,
      indexName: process.env.INDEX_NAME as string,
    },
  },
  cleanUrls: true,
});
