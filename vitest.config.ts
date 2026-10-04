import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/services/**/*.ts'],
      exclude: ['**/*.test.ts'],
      reporter: ['text', 'html'],
      thresholds: {
        lines: 85,
      },
    },
  },
})