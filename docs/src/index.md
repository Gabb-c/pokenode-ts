---
layout: home

hero:
  name: Pokenode-ts
  text: Type-Safe, Configurable, Lightweight
  tagline: A powerful Node.js wrapper for the PokéAPI with built-in types.
  image:
    src: /site-logo.svg
    alt: VitePress
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/Gabb-c/pokenode-ts

features:
  - icon: 🛠️
    title: Built-in Types
    details: Pokenode-ts includes up-to-date type definitions based on the PokéAPI documentation, ensuring type safety and improved developer experience.
  - icon: 📦
    title: Request Cache
    details: Leverages Axios auto-cache feature to optimize performance. Store API responses to minimize unnecessary network requests.
  - icon: 🌲
    title: Logging
    details: Provides logging functionality for development and debugging purposes.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme';

 
const members = [
 {
    avatar: 'https://github.com/Gabb-c.png',
    name: 'Gabriel (Gabb-c)',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/Gabb-c' },

    ]
  },
  {
    avatar: 'https://github.com/moyzlevi.png',
    name: 'Moysés (moyzlevi)',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/moyzlevi' },
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>
    <template #lead>
      Composed of a diverse group of people from all over the world through our open source community.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
