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

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #FF3962 30%, #D3D3D3);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #FF3962 50%, #D3D3D3 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
