<script setup lang="ts">
// values copied from GET /pokemon/luxray; types from src/models/pokemon/pokemon.ts
const fields = [
  { key: "id", type: "number", value: "405", kind: "num" },
  { key: "name", type: "string", value: '"luxray"', kind: "str" },
  { key: "height", type: "number", value: "14", kind: "num" },
  { key: "weight", type: "number", value: "420", kind: "num" },
  {
    key: "species",
    type: "NamedAPIResource<PokemonSpecies>",
    value: '{ name: "luxray", url }',
    kind: "obj",
  },
  { key: "types", type: "PokemonType[]", value: '[{ slot: 1, type: "electric" }]', kind: "obj" },
];
</script>

<template>
  <figure class="dex" aria-label="The Pokemon type for Luxray, field by field">
    <header class="dex-head">
      <span class="dex-no">#405</span>
      <span class="dex-name">Luxray</span>
      <span class="dex-badge">electric</span>
    </header>
    <div class="dex-screen">
      <p class="dex-call">
        <span class="dex-kw">await</span> api.pokemon.getPokemonByName("luxray")
      </p>
      <dl class="dex-fields">
        <div v-for="(field, i) in fields" :key="field.key" class="dex-row" :style="{ '--i': i }">
          <dt>
            {{ field.key }}<span class="dex-type">: {{ field.type }}</span>
          </dt>
          <dd :class="`dex-value dex-${field.kind}`">{{ field.value }}</dd>
        </div>
      </dl>
    </div>
  </figure>
</template>

<style scoped>
.dex {
  --dex-shell: var(--pk-brand);
  --dex-screen: #e6efec;
  --dex-ink: #151820;
  --dex-rule: #5a6275;
  --dex-electric: #f7d02c;

  position: relative;
  width: min(100%, 432px);
  margin: 0;
  padding: 14px;
  border-radius: 14px 14px 14px 40px;
  background: var(--dex-shell);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35) inset,
    0 24px 48px -24px rgba(21, 24, 32, 0.45);
  text-align: left;
}

.dark .dex {
  --dex-screen: #1b2422;
  --dex-ink: #e9ecf2;
  --dex-rule: #8e97aa;
}

.dex-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 2px 6px 12px;
  color: #ffffff;
}

.dex-no {
  font-family: "Martian Mono", var(--vp-font-family-mono);
  font-size: 12px;
  opacity: 0.85;
}

.dex-name {
  font-family: "Chakra Petch", var(--vp-font-family-base);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.dex-badge {
  margin-left: auto;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--dex-electric);
  color: #151820;
  font-family: "Martian Mono", var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 600;
}

.dex-screen {
  padding: 14px 16px 16px;
  border-radius: 6px 6px 6px 30px;
  background: var(--dex-screen);
  color: var(--dex-ink);
  font-family: "Martian Mono", var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.6;
}

.dex-call {
  margin: 0 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--dex-rule);
  color: var(--dex-rule);
  overflow-wrap: anywhere;
}

.dex-kw {
  color: var(--vp-c-brand-1);
}

.dex-fields {
  margin: 0;
}

.dex-row {
  display: flex;
  flex-wrap: wrap;
  column-gap: 12px;
  padding: 3px 0;
}

.dex-row dt {
  font-weight: 600;
}

.dex-type {
  color: var(--dex-rule);
  font-weight: 400;
}

.dex-row dd {
  margin: 0 0 0 auto;
}

.dex-num {
  color: var(--vp-c-brand-1);
}

.dex-str {
  color: #2f7a4f;
}

.dark .dex-str {
  color: #7fd3a1;
}

.dex-obj {
  color: var(--dex-rule);
}

@media (prefers-reduced-motion: no-preference) {
  .dex-type {
    animation: dex-arrive 240ms ease-out both;
    animation-delay: calc(var(--i) * 60ms);
  }

  .dex-value {
    animation: dex-arrive 320ms ease-out both;
    animation-delay: calc(700ms + var(--i) * 90ms);
  }
}

@keyframes dex-arrive {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
}
</style>
