---
layout: page
title: About
description: "The people behind pokenode-ts, a typed PokéAPI client."
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
      About
    </template>
    <template #lead>
      Pokenode-ts started in 2021 and is maintained by its two creators, with help from
      <a href="https://github.com/Gabb-c/pokenode-ts/graphs/contributors">everyone who has contributed</a>.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="members" />
</VPTeamPage>
