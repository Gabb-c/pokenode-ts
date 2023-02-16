import isCI from 'is-ci';
import { defineConfig } from 'tsup';
import { myBanner } from './banner';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  splitting: true,
  external: ['axios', 'pino', 'pino-pretty', 'axios-cache-interceptor'],
  sourcemap: !isCI,
  clean: !isCI,
  dts: true,
  format: ['cjs', 'esm', 'iife'],
  minify: isCI,
  banner: { js: myBanner },
  name: 'Pokenode-ts',
});
