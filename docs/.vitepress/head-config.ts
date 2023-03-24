import { HeadConfig } from 'vitepress';
import { description as packageDescription, name } from '../../package.json';

export const headConfig: HeadConfig[] = [
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
];
