// apps/frontend/vitest.config.ts
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'out'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        '.next',
        'out',
        '**/*.d.ts',
        '**/*.config.*',
        '**/vitest.setup.ts',
      ],
    },
    // Increase timeout for Windows/OneDrive path compatibility
    testTimeout: 30000,
    hookTimeout: 30000,
    // Run test files sequentially to avoid worker timeout on OneDrive paths
    // (parallel workers competing for I/O cause 60s worker startup timeout)
    fileParallelism: false,
    // Use forks isolate for better Windows compatibility (Vitest 4 syntax)
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Reporter options
    reporter: ['verbose'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@lib': path.resolve(__dirname, './lib'),
      '@components': path.resolve(__dirname, './'),
      '@app': path.resolve(__dirname, './app'),
      '@atomic-design': path.resolve(
        __dirname,
        './app/components/AtomicDesign',
      ),
      '@utils': path.resolve(__dirname, './app/components/Utils'),
      '@zustand': path.resolve(__dirname, './zustand'),
      '@ui': path.resolve(__dirname, './app/ui'),
      // Force single React/Next/lucide instance to fix "Invalid hook call" error
      react: path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      'next/link': path.resolve(__dirname, '../../node_modules/next/link'),
      'next/navigation': path.resolve(
        __dirname,
        '../../node_modules/next/navigation',
      ),
      'lucide-react': path.resolve(
        __dirname,
        '../../node_modules/lucide-react',
      ),
      'canvas-confetti': path.resolve(
        __dirname,
        '../../node_modules/canvas-confetti',
      ),
    },
  },
});
