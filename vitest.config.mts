import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    testTimeout: 10_000,
    coverage: {
      provider: "v8",
      exclude: ["src/models/*", "/.*", "docs"],
    },
    logHeapUsage: true,
    name: "Pokenode-ts",
  },
  plugins: [tsconfigPaths()],
});
