import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };

const { author, description, license, version } = pkg;

const isCI = Boolean(process.env.CI);

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
  sourcemap: true,
  minify: isCI,
  publint: true,
  attw: true,
  outputOptions: { banner },
});
