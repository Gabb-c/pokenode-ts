import isCI from 'is-ci';
import { defineConfig } from 'tsup';
import { myBanner } from './banner';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  splitting: true,
  sourcemap: !isCI,
  clean: !isCI,
  dts: true,
  format: ['cjs', 'esm'],
  minify: isCI,
  banner: { js: myBanner },
  name: 'Pokenode-ts',
  async onSuccess() {
    await Promise.resolve(console.log(myBanner));
  },
});
