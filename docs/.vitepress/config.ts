import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Pokenode-ts',
  description: 'Just playing around.',
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
  },
  themeConfig: {
    sidebar: [
      {
        text: 'Clients',
        collapsed: true,
        items: [
          {
            text: 'Berry Client',
            link: '/clients/berry-client'
          }
        ]
      }
    ]
  }
});
