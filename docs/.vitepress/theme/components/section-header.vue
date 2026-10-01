<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import { isSectionKey, SECTIONS, sectionDocsUrl, sectionPaths } from "../../meta/sections";

const { frontmatter } = useData();

const section = computed(() => {
  const key: unknown = frontmatter.value.section;
  if (!isSectionKey(key)) return null;
  return { name: SECTIONS[key].name, url: sectionDocsUrl(key), paths: sectionPaths(key) };
});
</script>

<template>
  <aside v-if="section" class="sh" aria-label="PokéAPI endpoints covered">
    <a class="sh-source" :href="section.url" target="_blank" rel="noopener">
      PokéAPI · {{ section.name }} section
    </a>
    <ul class="sh-paths">
      <li v-for="path in section.paths" :key="path">{{ path }}</li>
    </ul>
  </aside>
</template>

<style scoped>
.sh {
  margin-bottom: 20px;
  padding-left: 14px;
  border-left: 3px solid var(--pk-brand);
  font-family: "Martian Mono", var(--vp-font-family-mono);
  font-size: 12px;
}

.sh-source {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.sh-source::after {
  content: " ↗";
}

.sh-source:hover,
.sh-source:focus-visible {
  color: var(--vp-c-brand-1);
}

.sh-paths {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.sh-paths li {
  padding: 2px 8px;
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
</style>
