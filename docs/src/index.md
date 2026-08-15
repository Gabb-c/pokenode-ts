---
layout: home

hero:
  name: Pokenode-ts
  text: A typed PokéAPI client with zero dependencies
  tagline: Built on native fetch, so it runs in Node, Deno, Bun, browsers, and edge runtimes.
  image:
    src: /site-logo.svg
    alt: Pokenode-ts
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: Migrating from 1.x
      link: /guides/migration
    - theme: alt
      text: View on GitHub
      link: https://github.com/Gabb-c/pokenode-ts

features:
  - icon: 🛠️
    title: Built-in types
    details: Every response is fully typed from the PokéAPI schema, so the shape of your data is checked at compile time rather than discovered at runtime.
  - icon: 🪶
    title: Zero dependencies
    details: Nothing to install but the package itself. Native fetch does the work, and the whole library is a few kilobytes.
  - icon: 📦
    title: Caching that you control
    details: Responses are cached in memory by default. Swap in Redis, a KV namespace, or anything else that implements CacheStore — or turn it off.
  - icon: 🔌
    title: Bring your own transport
    details: Pass a custom fetch to route through a proxy, add retries, attach headers, or impose a timeout.
  - icon: 🌲
    title: Pluggable logging
    details: Point the request lifecycle at the console, at pino, or at a metrics collector. Nothing is logged unless you ask.
  - icon: 🧭
    title: One client or twelve
    details: Reach for a focused client like PokemonClient, or use MainClient to get all of them sharing a single cache.
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
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/gabriel-da-cunha/' }
    ]
  },
  {
    avatar: 'https://github.com/moyzlevi.png',
    name: 'Moysés (moyzlevi)',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/moyzlevi' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/moyses-p-73b88b1a5/' },
      { icon: 'x', link: 'https://twitter.com/moyzlevi1' }
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
      The development of this project is guided by an international
      team, some of whom have chosen to be featured below.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
