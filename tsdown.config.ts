import { readFile } from "node:fs/promises";
import path from "node:path";
import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };

const { author, description, homepage, license, name, version } = pkg;

const banner = `/**
 *  _
 * |_) _  |   _   _   _   _|  _  __  _|_  _
 * |  (_) |< (/_ | | (_) (_| (/_      |_ _>
 *
 * ${name} v${version} — ${description}
 *
 * Docs:    ${homepage}
 * Author:  ${author.name} <${author.url}>
 * License: ${license}
 *
 * @license ${license}
 * @preserve
 */`;

const assertTransportStripped = async (file: string) => {
  const declarations = (await readFile(file, "utf8")).replace(/\/\*[\s\S]*?\*\//g, "");

  if (declarations.includes("Transport")) {
    throw new Error(`${file} leaks the internal Transport type — stripInternal did not apply`);
  }
};

const isIndexFile = (fileName: string): boolean => /^index\.(?:js|cjs)$/.test(fileName);

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "lib",
  format: ["esm", "cjs"],
  platform: "neutral",
  target: ["node22", "baseline-widely-available"],
  dts: true,
  sourcemap: true,
  minify: false,
  publint: true,
  attw: true,
  banner: ({ fileName }) => (isIndexFile(fileName) ? { js: banner } : { dts: banner }),
  hooks: {
    "build:done": async ({ options }) => {
      await assertTransportStripped(
        path.join(options.outDir, options.format === "cjs" ? "index.d.cts" : "index.d.ts"),
      );
    },
  },
});
