import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/{unit,e2e}/**/*.test.js'], // Includes both unit and e2e tests
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**'],
    },
  },
});