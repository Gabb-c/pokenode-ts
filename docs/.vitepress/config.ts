import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Pokenode-ts',
  description: 'Just playing around.',
  buildEnd(siteConfig) {
      console.log(siteConfig)
  },
});
