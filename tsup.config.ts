import isCI from 'is-ci';
import { defineConfig } from 'tsup';
import { myBanner } from './banner';
import { peerDependencies } from './package.json';

const EXTERNAL_DEPS = Object.keys(peerDependencies as object);

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  splitting: true,
  external: EXTERNAL_DEPS,
  sourcemap: !isCI,
  clean: !isCI,
  dts: true,
  format: ['cjs', 'esm', 'iife'],
  minify: isCI,
  banner: { js: myBanner },
  name: 'Pokenode-ts',
});
