import isCI from 'is-ci';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  splitting: true,
  sourcemap: !isCI,
  clean: !isCI,
  dts: true,
  format: ['cjs', 'esm'],
  minify: isCI,
});
