import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 10_000,
    coverage: {
      provider: "v8",
      exclude: ["src/models/*", "/.*", "docs"],
    },
    name: "Pokenode-ts",
    setupFiles: "tests/utils/setup.ts",
    include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
