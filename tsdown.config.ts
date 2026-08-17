import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };

const { author, description, homepage, license, name, version } = pkg;

const isCI = Boolean(process.env.CI);

// reproducible builds: honour SOURCE_DATE_EPOCH when set, else today
const buildDate = new Date(
  process.env.SOURCE_DATE_EPOCH ? Number(process.env.SOURCE_DATE_EPOCH) * 1000 : Date.now(),
)
  .toISOString()
  .slice(0, 10);

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
 * Built:   ${buildDate}
 *
 * @license ${license}
 * @preserve
 */`;

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
