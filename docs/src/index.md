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
  - icon: 🧩
    title: Typed end to end
    details: Every endpoint, every field, straight from the PokéAPI schema. A weekly job diffs those types against the live API and opens an issue when one drifts.
    link: /guides/getting-started
    linkText: Get started
  - icon: 🔗
    title: Links, followed
    details: PokéAPI answers with <code>{ name, url }</code> refs instead of data. <code>resolve(pokemon.species)</code> hands back the species, typed. <code>resolveAll()</code> takes the whole list, four requests at a time.
    link: /clients/utility-client
    linkText: Following links
  - icon: 📖
    title: Walk a whole section
    details: <code>paginate('listPokemons')</code> iterates all 1,351 of them and keeps track of the offset. Break out of the loop and it stops fetching.
    link: /guides/pagination
    linkText: Pagination
  - icon: 💾
    title: Cached from the first call
    details: The PokéAPI's fair-use policy asks you to cache. This does, in memory, out of the box. Swap in Redis, a KV namespace or localStorage, or switch it off.
    link: /guides/cache
    linkText: Caching
  - icon: 🌐
    title: Runs anywhere
    details: Node, Deno, Bun, browsers, Cloudflare Workers. Native fetch, zero dependencies, ~11 kB gzipped.
    link: /guides/getting-started#requirements
    linkText: Requirements
  - icon: 🛡️
    title: Survives a bad network
    details: Opt-in retries with jittered backoff that honors <code>Retry-After</code>. Timeouts and cancellation through <code>with()</code>, where a shared request lives until its last caller gives up.
    link: /guides/cancellation
    linkText: Cancellation
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
