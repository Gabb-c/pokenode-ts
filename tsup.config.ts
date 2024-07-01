import isCI from "is-ci";
import { defineConfig } from "tsup";
import { author, description, license, peerDependencies, version } from "./package.json";

// Extract peerDependencies from package.json
const EXTERNAL_DEPS = Object.keys(peerDependencies as Record<string, string>);

// Custom banner with improved formatting
const myBanner = `
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
  // Entry file(s) for the bundling process
  entry: ["src/index.ts"],
  // Output directory for the bundled code
  outDir: "lib",
  // Enable code splitting for better performance
  splitting: true,
  // Specify external dependencies to exclude from the bundle
  external: EXTERNAL_DEPS,
  // Generate source maps if not running in a continuous integration environment
  sourcemap: !isCI,
  // Clean the output directory before each build if not in a continuous integration environment
  clean: !isCI,
  // Generate declaration files (.d.ts)
  dts: true,
  // Output formats: CommonJS and ECMAScript modules
  format: ["cjs", "esm"],
  // Minify the code if in a continuous integration environment
  minify: isCI,
  // Add a custom banner to the top of each bundled file
  banner: { js: myBanner },
});
