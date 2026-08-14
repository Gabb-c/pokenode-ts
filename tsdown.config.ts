import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };

const { author, description, license, peerDependencies, version } = pkg;

const isCI = Boolean(process.env.CI);

const EXTERNAL_DEPS = Object.keys(peerDependencies as Record<string, string>);

const banner = `
/**
 *  _
 * |_) _  |   _   _   _   _|  _  __  _|_  _
 * |  (_) |< (/_ | | (_) (_| (/_      |_ _>
 *
 * ${description}
 * Author: ${author.name} <${author.url}>
 * Version: ${version} | Build Date: ${new Date().toLocaleDateString("en-us")}
 * Build Environment: Node ${process.version}
 * License: ${license}
 **/
`;

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "lib",
  format: ["esm", "cjs"],
  platform: "neutral",
  dts: true,
  // Both peer dependencies stay external; nothing is bundled into the output.
  deps: { neverBundle: EXTERNAL_DEPS },
  // Published sourcemaps: the previous tsup config disabled these in CI, which
  // meant every released build shipped without them.
  sourcemap: true,
  minify: isCI,
  // `exports: true` is deliberately not used: it rewrites package.json during
  // the build. The map is maintained by hand and verified by publint + attw.
  // Fails the build on packaging mistakes instead of publishing them.
  publint: true,
  attw: true,
  outputOptions: { banner },
});
