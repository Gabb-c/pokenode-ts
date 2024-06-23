import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  esbuild: { target: "ESNext" },
  test: {
    name: "Pokenode-ts",
    setupFiles: "tests/utils/setup.ts",
    globals: true,
    testTimeout: 10_000,
    retry: 3,
    coverage: {
      provider: "v8",
      exclude: ["src/models/*", "/.*", "docs"],
    },
  },
});
