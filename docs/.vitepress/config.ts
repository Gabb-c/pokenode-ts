import { defineConfig } from 'vitepress';
import { readFileSync } from 'node:fs';
import {
  author,
  license,
  repository,
  description as packageDescription,
  name,
} from '../../package.json';
import { navbarItems, sidebarRoutes } from './routes';
import { SOCIAL_LINKS } from './social-links';

const readSvg = (path: string): string => readFileSync(require.resolve(path), 'utf-8');

export default defineConfig({
  title: 'Pokenode-ts',
  description: packageDescription,
  lang: 'en-US',
  srcDir: './src',
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/siteLogo.svg', type: 'image/svg+xml' }],
    [
      'link',
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/siteLogo.svg', type: 'image/svg+xml' },
    ],
    [
      'link',
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/siteLogo.svg', type: 'image/svg+xml' },
    ],
    [
      'link',
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/siteLogo.svg', type: 'image/svg+xml' },
    ],
    [
      'link',
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/siteLogo.svg', type: 'image/svg+xml' },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '192x192',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '32x32',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '96x96',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '16x16',
        href: '/siteLogo.svg',
        type: 'image/svg+xml',
      },
    ],
    ['meta', { property: 'og:title', content: name }],
    ['meta', { property: 'og:description', content: packageDescription }],
    ['meta', { property: 'og:image', content: '/cover.jpg' }],
  ],
  themeConfig: {
    nav: navbarItems,
    sidebar: sidebarRoutes,
    siteTitle: 'Pokenode-ts',
    logo: '/siteLogo.svg',
    footer: {
      message: `Made with ❤️<br/>Released under the ${license} License`,
      copyright: `Copyright © 2021-${new Date().getFullYear()} ${author.name}`,
    },
    socialLinks: [
      { icon: 'github', link: SOCIAL_LINKS.GITHUB },
      { icon: { svg: readSvg('../src/public/npm-icon.svg') }, link: SOCIAL_LINKS.NPM },
      { icon: { svg: readSvg('../src/public/jsdelivr-icon.svg') }, link: SOCIAL_LINKS.JSDELIVR },
      {
        icon: { svg: readSvg('../src/public/bundlephobia-icon.svg') },
        link: SOCIAL_LINKS.BUNDLEPHOBIA,
      },
      {
        icon: { svg: readSvg('../src/public/packagephobia-icon.svg') },
        link: SOCIAL_LINKS.PACKAGEPHOBIA,
      },
    ],
    editLink: {
      pattern: `${repository.url}/vitepress/edit/main/docs/src/:path`,
      text: 'Edit this page on GitHub',
    },
  },
  cleanUrls: true,
});
