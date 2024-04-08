import tsPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsPaths()],
  test: {
    testTimeout: 10_000,
    coverage: {
      provider: "v8",
      exclude: ["src/models/*", "/.*", "docs"],
    },
    name: "Pokenode-ts",
    // setupFiles: "tests/setup.ts",
    include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
