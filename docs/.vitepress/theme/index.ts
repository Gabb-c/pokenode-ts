import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import DexCard from "./components/dex-card.vue";
import NotFound from "./components/not-found.vue";
import SectionHeader from "./components/section-header.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "home-hero-image": () => h(DexCard),
      "not-found": () => h(NotFound),
      "doc-before": () => h(SectionHeader),
    }),
} satisfies Theme;
