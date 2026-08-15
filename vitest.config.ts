import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*"],
      exclude: ["src/models/*"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          globals: true,
          setupFiles: "tests/utils/setup.ts",
          include: ["tests/**/*.spec.ts"],
          exclude: ["tests/live/**"],
        },
      },
      {
        extends: true,
        test: {
          name: "live",
          globals: true,
          include: ["tests/live/**/*.live.spec.ts"],
          retry: 3,
          testTimeout: 30_000,
        },
      },
    ],
  },
});
