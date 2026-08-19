---
layout: home

hero:
  name: Pokenode-ts
  text: A typed PokéAPI client with zero runtime dependencies
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
    title: Typed end to end
    details: Every response is typed straight from the PokéAPI. A weekly job checks those types against the live API and opens an issue the moment one drifts.
  - icon: 🪶
    title: Zero dependencies
    details: Nothing to install but the package. Native fetch does the work, in a few kilobytes.
  - icon: 🔗
    title: Follow any link
    details: PokéAPI answers with links to more links. Hand one back and you get the resource it points at, already typed, without working out which client owns it.
  - icon: 📦
    title: Caching you control
    details: Responses are cached in memory out of the box. Point it at Redis, a KV namespace, or browser storage, or switch it off entirely.
  - icon: 🛡️
    title: Ready for a bad network
    details: Backoff retries, timeouts, and cancellation that respects shared work. None of it runs unless you ask for it.
  - icon: 🔌
    title: Fits your stack
    details: Bring your own fetch and your own logger. Nothing is proxied or logged until you wire it up.
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
