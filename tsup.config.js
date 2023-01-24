import isCI from 'is-ci';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: isCI ? false : true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  minify: true,
});
