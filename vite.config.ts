import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    target: 'es2022',
    // Phaser pesa ~1,3 MB minificado; el aviso por defecto (500 kB) no aporta nada.
    chunkSizeWarningLimit: 2000,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
