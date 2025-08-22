import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Exclude Playwright tests so Vitest does not pick them up
    exclude: [
      // Default Vitest excludes
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      // common Playwright test locations / patterns
      'src/test/playwright/**',
      'src/UrbanAI.Frontend/tests/playwright/**',
      // Playwright e2e directory
      'tests/e2e/**',
      // Some Playwright tests use .spec.ts — exclude spec files used for E2E
      '**/*.spec.ts',
      // Exclude any Playwright-specific test files placed under src/__tests__ (landingPage.test.ts was there)
      'src/__tests__/**',
      // Playwright filename patterns
      '**/*.pw.spec.ts',
      '**/*.pw.spec.js',
      '**/*.playwright.ts',
      '**/*.playwright.js',
      // Playwright config files
      'playwright.config.*',
      // Exclude all node_modules test files specifically
      'node_modules/**/*.test.*',
      'node_modules/**/*.spec.*',
      'node_modules/**/test/**',
      'node_modules/**/tests/**',
      'node_modules/**/__tests__/**'
    ],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'coverage/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
