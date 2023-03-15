import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { clearMocks: true, name: 'pokenode-ts', testTimeout: 50_000 },
});
