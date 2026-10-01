<script setup lang="ts">
import { onMounted, ref } from "vue";

// 404.html is served for every missing path, so the URL is only known in the browser
const url = ref("");

onMounted(() => {
  url.value = window.location.href;
});
</script>

<template>
  <div class="nf">
    <pre class="nf-error"><span class="nf-name">PokenodeError</span>: Request to {{ url || "this page" }} failed with status 404
  status: <span class="nf-num">404</span>
  statusText: <span class="nf-str">"Not Found"</span></pre>
    <h1 class="nf-title">This page doesn't exist</h1>
    <p class="nf-lead">
      It may have moved, or the link that brought you here is out of date. Try the search in the
      top bar, or start from one of these:
    </p>
    <div class="nf-actions">
      <a class="nf-link nf-primary" href="/">Go to the home page</a>
      <a class="nf-link" href="/guides/getting-started">Read getting started</a>
    </div>
  </div>
</template>

<style scoped>
.nf {
  max-width: 688px;
  margin: 0 auto;
  padding: 64px 24px 96px;
}

.nf-error {
  margin: 0 0 32px;
  padding: 16px 20px;
  border-left: 3px solid var(--vp-c-danger-1);
  border-radius: 4px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-text-1);
  font-family: "Martian Mono", var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.nf-name {
  color: var(--vp-c-danger-1);
  font-weight: 600;
}

.nf-num {
  color: var(--vp-c-brand-1);
}

.nf-str {
  color: var(--vp-c-green-1);
}

.nf-title {
  margin: 0;
  font-family: "Chakra Petch", var(--vp-font-family-base);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.25;
}

.nf-lead {
  margin: 12px 0 28px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.nf-link {
  padding: 8px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.25s;
}

.nf-link:hover {
  border-color: var(--vp-c-brand-1);
}

.nf-link:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.nf-primary {
  border-color: var(--vp-c-brand-3);
  background: var(--vp-c-brand-3);
  color: var(--vp-c-white);
}

.nf-primary:hover {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-2);
}
</style>
