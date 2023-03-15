import isCI from 'is-ci';
import { defineConfig } from 'tsup';
import { myBanner } from './banner';
import { peerDependencies } from './package.json';

const EXTERNAL_DEPS = Object.keys(peerDependencies as Record<string, string>);

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  splitting: true,
  external: EXTERNAL_DEPS,
  sourcemap: !isCI,
  clean: !isCI,
  dts: true,
  format: ['cjs', 'esm'],
  minify: isCI,
  banner: { js: myBanner },
});
