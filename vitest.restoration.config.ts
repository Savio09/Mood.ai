import { defineConfig } from 'vitest/config';
import path from 'node:path';
export default defineConfig({
  cacheDir: path.resolve(__dirname, '.cache/vitest-restoration'),
  resolve: { alias: { '@': path.resolve(__dirname) } },
  test: { environment: 'node', include: ['tests/restoration.test.ts'] },
});
