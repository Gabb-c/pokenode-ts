import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  esbuild: { target: "ESNext" },
  test: {
    setupFiles: "tests/utils/setup.ts",
    globals: true,
    testTimeout: 10_000,
    retry: 3,
    coverage: {
      provider: "v8",
      include: ["src/**/*"],
      exclude: ["src/models/*"],
    },
  },
});
