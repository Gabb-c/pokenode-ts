import isCI from "is-ci";
import { defineConfig } from "tsup";
import { peerDependencies, author, version, license, description } from "./package.json";

const EXTERNAL_DEPS = Object.keys(peerDependencies as Record<string, string>);

const myBanner = `
/**
 * Version ${version} | ${new Date().toLocaleDateString("en-us")}
 * Build with Node ${process.version}
 * Licensed under the ${license} license
 *  _
 * |_) _  |   _   _   _   _|  _  __  _|_  _
 * |  (_) |< (/_ | | (_) (_| (/_      |_ _>
 *
 * ${description}
 * ${author.name} <${author.url}>
 */
`;

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "lib",
  splitting: true,
  external: EXTERNAL_DEPS,
  sourcemap: !isCI,
  clean: !isCI,
  dts: true,
  format: ["cjs", "esm"],
  minify: isCI,
  banner: { js: myBanner },
});
