import { defineConfig } from 'vitepress';
import { author, license, repository } from '../../package.json';

export default defineConfig({
  title: 'Pokenode-ts',
  description: 'Just playing around.',
  themeConfig: {
    nav: [{ text: 'Clients', items: [{ text: 'Berry', link: '/clients/berry-client' }] }],
    sidebar: [
      {
        text: 'Clients',
        collapsed: true,
        items: [
          {
            text: 'Berry Client',
            link: '/clients/berry-client',
          },
        ],
      },
    ],
    siteTitle: 'Pokenode-ts',
    logo: '/siteLogo.svg',
    footer: {
      message: `Released under the ${license} License.`,
      copyright: `Copyright © 2021-${new Date().getFullYear()} ${author.name}`,
    },
    socialLinks: [{ icon: 'github', link: repository.url }],
    editLink: {
      pattern: `${repository.url}/vitepress/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },
  },
  cleanUrls: true,
});
