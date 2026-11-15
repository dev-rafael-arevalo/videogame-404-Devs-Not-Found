import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/** Config de `npm run capturas`: corre solo tests/e2e/capturas.spec.ts y guarda las imágenes en docs/capturas/. */
export default defineConfig({
  ...base,
  testIgnore: [],
  testMatch: ['**/capturas.spec.ts'],
  timeout: 300_000,
});
